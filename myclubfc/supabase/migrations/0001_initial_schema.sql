-- ============================================================================
-- KFC / SouKaraubas — Schema inicial
-- Karaúbas Futebol Clube — fundado em 29 de agosto de 2009
-- ============================================================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

create type role_app as enum ('admin', 'comissao', 'atleta', 'torcedor');
create type modalidade as enum ('campo', 'futsal');
create type pe_dominante as enum ('destro', 'canhoto', 'ambidestro');
create type rsvp_status as enum ('sim', 'nao', 'talvez', 'pendente');
create type evento_tipo as enum ('treino', 'jogo', 'reuniao', 'outro');
create type partida_status as enum ('agendada', 'em_andamento', 'finalizada', 'adiada', 'cancelada');
create type partida_resultado as enum ('vitoria', 'empate', 'derrota');
create type post_audiencia as enum ('publico', 'interno');
create type post_tipo as enum ('texto', 'foto', 'video', 'story');

-- ============================================================================
-- PROFILES — espelho de auth.users
-- ============================================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  apelido text,
  role role_app not null default 'torcedor',
  email text unique,
  telefone text,
  avatar_url text,
  bio text,
  data_nascimento date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on profiles(role);

-- ============================================================================
-- CATEGORIAS — os 8 elencos do KFC
-- ============================================================================

create table categorias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nome text not null,
  descricao text,
  modalidades modalidade[] not null default '{campo}',
  faixa_etaria text,
  ordem int not null default 0,
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

insert into categorias (slug, nome, modalidades, faixa_etaria, ordem) values
  ('sub-12',         'Sub-12',         '{campo,futsal}', 'Até 12 anos',  1),
  ('sub-15',         'Sub-15',         '{campo,futsal}', '13–15 anos',   2),
  ('sub-18',         'Sub-18',         '{campo,futsal}', '16–18 anos',   3),
  ('escolinha',      'Escolinha',      '{campo}',        'Iniciação',    4),
  ('aspirantes',     'Aspirantes',     '{campo}',        'Adulto',       5),
  ('principal',      'Principal',      '{campo}',        'Adulto',       6),
  ('master-35',      'Master 35',      '{campo}',        '35+ anos',     7),
  ('futsal-adulto',  'Futsal Adulto',  '{futsal}',       'Adulto',       8);

-- ============================================================================
-- ATLETAS — vínculo entre profile e categorias
-- ============================================================================

create table atletas (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  -- atletas podem existir antes de criar conta (cadastrados pela diretoria)
  nome_completo text not null,
  apelido text,
  data_nascimento date,
  pe_dominante pe_dominante,
  altura_cm int,
  posicao_principal text,
  posicoes_secundarias text[],
  numero_camisa int,
  rg text,
  cpf text,
  contato_emergencia text,
  foto_url text,
  ativo boolean not null default true,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index atletas_profile_idx on atletas(profile_id);
create index atletas_ativo_idx on atletas(ativo);

-- N:N atleta ↔ categoria (um sub-15 pode jogar campo E futsal por exemplo)
create table atleta_categorias (
  atleta_id uuid references atletas(id) on delete cascade,
  categoria_id uuid references categorias(id) on delete cascade,
  modalidade modalidade not null,
  data_inicio date not null default current_date,
  data_fim date,
  primary key (atleta_id, categoria_id, modalidade)
);

create index atleta_categorias_categoria_idx on atleta_categorias(categoria_id);

-- ============================================================================
-- COMPETIÇÕES & PARTIDAS
-- ============================================================================

create table competicoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  modalidade modalidade not null,
  temporada int not null,
  organizador text,
  formato text,
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

create table partidas (
  id uuid primary key default gen_random_uuid(),
  competicao_id uuid references competicoes(id) on delete set null,
  categoria_id uuid not null references categorias(id) on delete restrict,
  modalidade modalidade not null,
  rodada int,
  data_hora timestamptz not null,
  local text,
  mandante boolean not null default true,
  adversario text not null,
  adversario_escudo_url text,
  status partida_status not null default 'agendada',
  resultado partida_resultado,
  gols_kfc int default 0,
  gols_adversario int default 0,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partidas_categoria_data_idx on partidas(categoria_id, data_hora desc);
create index partidas_status_idx on partidas(status);

-- Escalação por partida
create table escalacoes (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references partidas(id) on delete cascade,
  atleta_id uuid not null references atletas(id) on delete cascade,
  titular boolean not null default true,
  numero int,
  posicao text,
  capitao boolean not null default false,
  unique (partida_id, atleta_id)
);

-- Eventos da partida (gols, cartões, substituições)
create table partida_eventos (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references partidas(id) on delete cascade,
  atleta_id uuid references atletas(id) on delete set null,
  minuto int,
  tipo text not null,                                -- gol, assistencia, amarelo, vermelho, sub_in, sub_out
  detalhe text,
  created_at timestamptz not null default now()
);

create index partida_eventos_partida_idx on partida_eventos(partida_id);

-- ============================================================================
-- ESTATÍSTICAS POR ATLETA × MODALIDADE × TEMPORADA (view materializada futura)
-- Por ora calculadas via query, deixamos tabela de cache opcional.
-- ============================================================================

create table estatisticas_atleta (
  id uuid primary key default gen_random_uuid(),
  atleta_id uuid not null references atletas(id) on delete cascade,
  modalidade modalidade not null,
  temporada int not null,
  jogos int not null default 0,
  gols int not null default 0,
  assistencias int not null default 0,
  amarelos int not null default 0,
  vermelhos int not null default 0,
  mvp_count int not null default 0,
  unique (atleta_id, modalidade, temporada)
);

-- ============================================================================
-- CONVOCAÇÕES & PRESENÇA (estilo Spond)
-- ============================================================================

create table eventos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias(id) on delete cascade,
  modalidade modalidade,
  partida_id uuid references partidas(id) on delete set null,
  tipo evento_tipo not null,
  titulo text not null,
  descricao text,
  inicio timestamptz not null,
  fim timestamptz,
  local text,
  rsvp_deadline timestamptz,
  criado_por uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index eventos_categoria_inicio_idx on eventos(categoria_id, inicio desc);

create table presencas (
  evento_id uuid references eventos(id) on delete cascade,
  atleta_id uuid references atletas(id) on delete cascade,
  status rsvp_status not null default 'pendente',
  justificativa text,
  presente_real boolean,
  respondido_em timestamptz,
  primary key (evento_id, atleta_id)
);

-- ============================================================================
-- FEED — posts, stories, curtidas, comentários
-- ============================================================================

create table posts (
  id uuid primary key default gen_random_uuid(),
  autor_id uuid not null references profiles(id) on delete cascade,
  audiencia post_audiencia not null default 'publico',
  tipo post_tipo not null default 'texto',
  conteudo text,
  midia_url text,
  thumbnail_url text,
  categoria_id uuid references categorias(id) on delete set null, -- post associado a uma categoria
  partida_id uuid references partidas(id) on delete set null,     -- post associado a um jogo
  expira_em timestamptz,                                          -- usado para stories (24h)
  pinned boolean not null default false,
  curtidas_count int not null default 0,
  comentarios_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_audiencia_created_idx on posts(audiencia, created_at desc);
create index posts_autor_idx on posts(autor_id);
create index posts_stories_idx on posts(expira_em) where tipo = 'story';

create table curtidas (
  post_id uuid references posts(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id)
);

create table comentarios (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  autor_id uuid not null references profiles(id) on delete cascade,
  conteudo text not null,
  created_at timestamptz not null default now()
);

create index comentarios_post_idx on comentarios(post_id, created_at);

-- ============================================================================
-- TRIGGERS de manutenção
-- ============================================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();
create trigger trg_atletas_updated before update on atletas
  for each row execute function set_updated_at();
create trigger trg_partidas_updated before update on partidas
  for each row execute function set_updated_at();
create trigger trg_posts_updated before update on posts
  for each row execute function set_updated_at();

-- Manter contador de curtidas/comentários sincronizado
create or replace function bump_post_counters()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' and tg_table_name = 'curtidas' then
    update posts set curtidas_count = curtidas_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' and tg_table_name = 'curtidas' then
    update posts set curtidas_count = greatest(0, curtidas_count - 1) where id = old.post_id;
  elsif tg_op = 'INSERT' and tg_table_name = 'comentarios' then
    update posts set comentarios_count = comentarios_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' and tg_table_name = 'comentarios' then
    update posts set comentarios_count = greatest(0, comentarios_count - 1) where id = old.post_id;
  end if;
  return null;
end;
$$;

create trigger trg_curtidas_count after insert or delete on curtidas
  for each row execute function bump_post_counters();
create trigger trg_comentarios_count after insert or delete on comentarios
  for each row execute function bump_post_counters();

-- Auto-criar profile quando usuário se registra
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, nome, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email,
    'torcedor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
