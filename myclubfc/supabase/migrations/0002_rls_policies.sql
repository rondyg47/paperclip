-- ============================================================================
-- Row Level Security — KFC / SouKaraubas
-- Política: torcedor vê conteúdo público; atleta/comissão/admin veem mais.
-- ============================================================================

-- Helper para checar role do usuário atual
create or replace function auth_role()
returns role_app language sql stable as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_staff()
returns boolean language sql stable as $$
  select coalesce(auth_role() in ('admin', 'comissao'), false);
$$;

create or replace function is_admin()
returns boolean language sql stable as $$
  select coalesce(auth_role() = 'admin', false);
$$;

create or replace function is_member()
returns boolean language sql stable as $$
  select coalesce(auth_role() in ('admin', 'comissao', 'atleta'), false);
$$;

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
alter table profiles enable row level security;

create policy "profiles_select_all"
  on profiles for select
  using (true);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

create policy "profiles_admin_all"
  on profiles for all
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- categorias — leitura pública, escrita admin
-- ----------------------------------------------------------------------------
alter table categorias enable row level security;

create policy "categorias_select_all" on categorias for select using (true);
create policy "categorias_admin_write" on categorias for all
  using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- atletas, atleta_categorias, estatísticas — leitura pública, escrita staff
-- ----------------------------------------------------------------------------
alter table atletas enable row level security;
alter table atleta_categorias enable row level security;
alter table estatisticas_atleta enable row level security;

create policy "atletas_select_all" on atletas for select using (true);
create policy "atletas_staff_write" on atletas for all
  using (is_staff()) with check (is_staff());

create policy "atleta_cat_select_all" on atleta_categorias for select using (true);
create policy "atleta_cat_staff_write" on atleta_categorias for all
  using (is_staff()) with check (is_staff());

create policy "stats_select_all" on estatisticas_atleta for select using (true);
create policy "stats_staff_write" on estatisticas_atleta for all
  using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- competições, partidas, escalação, eventos da partida
-- ----------------------------------------------------------------------------
alter table competicoes enable row level security;
alter table partidas enable row level security;
alter table escalacoes enable row level security;
alter table partida_eventos enable row level security;

create policy "comp_select_all" on competicoes for select using (true);
create policy "comp_admin_write" on competicoes for all
  using (is_admin()) with check (is_admin());

create policy "partidas_select_all" on partidas for select using (true);
create policy "partidas_staff_write" on partidas for all
  using (is_staff()) with check (is_staff());

create policy "escal_select_all" on escalacoes for select using (true);
create policy "escal_staff_write" on escalacoes for all
  using (is_staff()) with check (is_staff());

create policy "pe_select_all" on partida_eventos for select using (true);
create policy "pe_staff_write" on partida_eventos for all
  using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- eventos & presença (Spond style)
-- Eventos: visível para staff + atletas da categoria.
-- Presença: atleta gerencia a sua, staff gerencia tudo.
-- ----------------------------------------------------------------------------
alter table eventos enable row level security;
alter table presencas enable row level security;

create policy "eventos_select_member"
  on eventos for select
  using (
    is_staff()
    or exists (
      select 1
      from atletas a
      join atleta_categorias ac on ac.atleta_id = a.id
      where a.profile_id = auth.uid()
        and ac.categoria_id = eventos.categoria_id
    )
  );

create policy "eventos_staff_write" on eventos for all
  using (is_staff()) with check (is_staff());

create policy "presencas_select_member"
  on presencas for select
  using (
    is_staff()
    or exists (
      select 1 from atletas where atletas.id = presencas.atleta_id and atletas.profile_id = auth.uid()
    )
  );

create policy "presencas_atleta_update_own"
  on presencas for update
  using (
    exists (select 1 from atletas where atletas.id = presencas.atleta_id and atletas.profile_id = auth.uid())
  );

create policy "presencas_staff_write" on presencas for all
  using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- feed — público é livre, interno só pra membros
-- ----------------------------------------------------------------------------
alter table posts enable row level security;
alter table curtidas enable row level security;
alter table comentarios enable row level security;

create policy "posts_select_publico"
  on posts for select
  using (
    audiencia = 'publico'
    or (audiencia = 'interno' and is_member())
  );

create policy "posts_insert_member"
  on posts for insert
  with check (
    -- todo membro pode postar; atleta só posta no feed interno; torcedor não posta
    auth.uid() = autor_id and (
      (audiencia = 'publico' and is_staff())  -- só staff posta no público
      or (audiencia = 'interno' and is_member())
    )
  );

create policy "posts_update_own_or_admin"
  on posts for update
  using (auth.uid() = autor_id or is_admin());

create policy "posts_delete_own_or_admin"
  on posts for delete
  using (auth.uid() = autor_id or is_admin());

create policy "curtidas_select_when_post_visible"
  on curtidas for select
  using (
    exists (
      select 1 from posts p
      where p.id = curtidas.post_id
        and (p.audiencia = 'publico' or (p.audiencia = 'interno' and is_member()))
    )
  );

create policy "curtidas_insert_own"
  on curtidas for insert
  with check (auth.uid() = profile_id);

create policy "curtidas_delete_own"
  on curtidas for delete
  using (auth.uid() = profile_id);

create policy "comentarios_select_when_post_visible"
  on comentarios for select
  using (
    exists (
      select 1 from posts p
      where p.id = comentarios.post_id
        and (p.audiencia = 'publico' or (p.audiencia = 'interno' and is_member()))
    )
  );

create policy "comentarios_insert_member"
  on comentarios for insert
  with check (auth.uid() = autor_id);

create policy "comentarios_delete_own_or_admin"
  on comentarios for delete
  using (auth.uid() = autor_id or is_admin());
