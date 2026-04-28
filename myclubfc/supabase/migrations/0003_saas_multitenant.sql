-- ============================================================================
-- MyClubFC — Refactor para Multi-Tenant SaaS
-- Cada clube é um tenant isolado. Usuários podem pertencer a vários clubes
-- com roles diferentes em cada um.
-- ============================================================================

-- ============================================================================
-- TABELA: clubs (tenants)
-- ============================================================================

create table clubs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$'),
  nome text not null,
  descricao text,
  escudo_url text,
  cores jsonb not null default '{"primary":"#1E4FB5","secondary":"#FFC72C","accent":"#E8651F"}',
  fundado_em date,
  cidade text,
  uf text,
  modalidades modalidade[] not null default '{campo}',
  plano text not null default 'free' check (plano in ('free','pro','enterprise')),
  ativo boolean not null default true,
  criado_por uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clubs_slug_idx on clubs(slug);
create index clubs_ativo_idx on clubs(ativo);

create trigger trg_clubs_updated before update on clubs
  for each row execute function set_updated_at();

-- ============================================================================
-- TABELA: club_memberships
-- Liga profile ↔ club com role (substitui role único em profiles).
-- Um user pode ser admin do KFC e torcedor do Flamengo Amador, por exemplo.
-- ============================================================================

create table club_memberships (
  profile_id uuid not null references profiles(id) on delete cascade,
  club_id uuid not null references clubs(id) on delete cascade,
  role role_app not null default 'torcedor',
  joined_at timestamptz not null default now(),
  primary key (profile_id, club_id)
);

create index club_memberships_club_idx on club_memberships(club_id);
create index club_memberships_role_idx on club_memberships(club_id, role);

-- ============================================================================
-- ADICIONAR club_id em todas as tabelas tenant-scoped
-- ============================================================================

alter table categorias add column club_id uuid references clubs(id) on delete cascade;
alter table atletas add column club_id uuid references clubs(id) on delete cascade;
alter table competicoes add column club_id uuid references clubs(id) on delete cascade;
alter table partidas add column club_id uuid references clubs(id) on delete cascade;
alter table eventos add column club_id uuid references clubs(id) on delete cascade;
alter table posts add column club_id uuid references clubs(id) on delete cascade;

-- Atletas, jogadores, partidas etc — slug único por clube em vez de global
alter table categorias drop constraint if exists categorias_slug_key;
alter table categorias add constraint categorias_club_slug_unique unique (club_id, slug);

create index categorias_club_idx on categorias(club_id);
create index atletas_club_idx on atletas(club_id);
create index partidas_club_idx on partidas(club_id);
create index eventos_club_idx on eventos(club_id);
create index posts_club_idx on posts(club_id, audiencia, created_at desc);

-- ============================================================================
-- SEED: KFC como primeiro clube (showcase)
-- ============================================================================

do $$
declare
  v_kfc_id uuid;
begin
  insert into clubs (slug, nome, descricao, fundado_em, cidade, uf, modalidades, cores)
  values (
    'kfc',
    'Karaúbas Futebol Clube',
    'O Karaúbas FC nasceu da paixão pelo futebol e cresceu se tornando referência regional. Hoje somos 8 categorias ativas, em campo e no futsal.',
    '2009-08-29',
    'Morada Nova',
    'CE',
    '{campo,futsal}'::modalidade[],
    '{"primary":"#1E4FB5","secondary":"#FFC72C","accent":"#E8651F"}'::jsonb
  )
  returning id into v_kfc_id;

  -- Migrar categorias existentes pro KFC
  update categorias set club_id = v_kfc_id where club_id is null;
end $$;

-- Após o seed, tornar club_id NOT NULL em categorias
alter table categorias alter column club_id set not null;

-- ============================================================================
-- HELPERS RLS — versões multi-tenant
-- ============================================================================

create or replace function current_club_id()
returns uuid language sql stable as $$
  select club_id from clubs where slug = current_setting('app.tenant_slug', true);
$$;

create or replace function role_in_club(p_club uuid)
returns role_app language sql stable as $$
  select role from club_memberships
  where club_id = p_club and profile_id = auth.uid();
$$;

create or replace function is_member_of(p_club uuid)
returns boolean language sql stable as $$
  select coalesce(role_in_club(p_club) in ('admin','comissao','atleta'), false);
$$;

create or replace function is_staff_of(p_club uuid)
returns boolean language sql stable as $$
  select coalesce(role_in_club(p_club) in ('admin','comissao'), false);
$$;

create or replace function is_admin_of(p_club uuid)
returns boolean language sql stable as $$
  select coalesce(role_in_club(p_club) = 'admin', false);
$$;

-- ============================================================================
-- TRIGGER: criar membership do criador como admin ao criar clube
-- ============================================================================

create or replace function handle_new_club()
returns trigger language plpgsql security definer as $$
begin
  if new.criado_por is not null then
    insert into club_memberships (profile_id, club_id, role)
    values (new.criado_por, new.id, 'admin')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger trg_on_club_created
  after insert on clubs
  for each row execute function handle_new_club();

-- ============================================================================
-- AJUSTE: profiles.role vira "platform_role" opcional
-- (papel global na plataforma — super_admin do MyClubFC; default é 'torcedor')
-- O role real do user em cada clube vem de club_memberships.
-- ============================================================================

comment on column profiles.role is 'Platform role (super_admin para staff do MyClubFC). Para role no clube, ver club_memberships.';

-- Atualizar trigger handle_new_user para não assumir role 'torcedor' como significativo
-- (continua igual, mas é apenas placeholder; o real role vem ao entrar num clube)
