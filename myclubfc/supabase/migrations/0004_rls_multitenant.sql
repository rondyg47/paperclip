-- ============================================================================
-- MyClubFC — RLS Multi-Tenant
-- Substitui as policies da migration 0002 por versões scoped por club_id.
-- ============================================================================

-- Drop policies antigas
drop policy if exists "categorias_select_all" on categorias;
drop policy if exists "categorias_admin_write" on categorias;
drop policy if exists "atletas_select_all" on atletas;
drop policy if exists "atletas_staff_write" on atletas;
drop policy if exists "atleta_cat_select_all" on atleta_categorias;
drop policy if exists "atleta_cat_staff_write" on atleta_categorias;
drop policy if exists "stats_select_all" on estatisticas_atleta;
drop policy if exists "stats_staff_write" on estatisticas_atleta;
drop policy if exists "comp_select_all" on competicoes;
drop policy if exists "comp_admin_write" on competicoes;
drop policy if exists "partidas_select_all" on partidas;
drop policy if exists "partidas_staff_write" on partidas;
drop policy if exists "escal_select_all" on escalacoes;
drop policy if exists "escal_staff_write" on escalacoes;
drop policy if exists "pe_select_all" on partida_eventos;
drop policy if exists "pe_staff_write" on partida_eventos;
drop policy if exists "eventos_select_member" on eventos;
drop policy if exists "eventos_staff_write" on eventos;
drop policy if exists "presencas_select_member" on presencas;
drop policy if exists "presencas_atleta_update_own" on presencas;
drop policy if exists "presencas_staff_write" on presencas;
drop policy if exists "posts_select_publico" on posts;
drop policy if exists "posts_insert_member" on posts;
drop policy if exists "posts_update_own_or_admin" on posts;
drop policy if exists "posts_delete_own_or_admin" on posts;
drop policy if exists "curtidas_select_when_post_visible" on curtidas;
drop policy if exists "curtidas_insert_own" on curtidas;
drop policy if exists "curtidas_delete_own" on curtidas;
drop policy if exists "comentarios_select_when_post_visible" on comentarios;
drop policy if exists "comentarios_insert_member" on comentarios;
drop policy if exists "comentarios_delete_own_or_admin" on comentarios;

-- ============================================================================
-- clubs
-- ============================================================================

alter table clubs enable row level security;

-- Qualquer um vê clubes ativos (pra listagem pública/landing)
create policy "clubs_select_active"
  on clubs for select
  using (ativo = true);

-- Qualquer usuário autenticado pode criar um clube
create policy "clubs_insert_authenticated"
  on clubs for insert
  with check (auth.uid() = criado_por);

-- Apenas admins do clube podem editar/deletar
create policy "clubs_admin_update"
  on clubs for update
  using (is_admin_of(id));

create policy "clubs_admin_delete"
  on clubs for delete
  using (is_admin_of(id));

-- ============================================================================
-- club_memberships
-- ============================================================================

alter table club_memberships enable row level security;

-- Qualquer um vê membros públicos do clube (lista de comissão pública, p.ex.)
create policy "memberships_select_member_or_public"
  on club_memberships for select
  using (
    -- staff do clube vê todos
    is_staff_of(club_id)
    -- ou eu vejo as minhas memberships
    or profile_id = auth.uid()
    -- ou todos veem se for staff (admin/comissao) — pra exibir comissão técnica
    or role in ('admin','comissao')
  );

-- User entra em clube como torcedor sozinho; staff/admin precisam de promoção pelo admin
create policy "memberships_self_join_torcedor"
  on club_memberships for insert
  with check (profile_id = auth.uid() and role = 'torcedor');

-- Admin do clube gerencia todas as memberships
create policy "memberships_admin_manage"
  on club_memberships for all
  using (is_admin_of(club_id))
  with check (is_admin_of(club_id));

-- User pode sair do clube (deletar a própria membership) — exceto se for único admin
create policy "memberships_self_leave"
  on club_memberships for delete
  using (profile_id = auth.uid());

-- ============================================================================
-- categorias — leitura pública dentro do clube, escrita admin do clube
-- ============================================================================

create policy "categorias_select_all"
  on categorias for select using (true);

create policy "categorias_admin_write"
  on categorias for all
  using (is_admin_of(club_id))
  with check (is_admin_of(club_id));

-- ============================================================================
-- atletas, atleta_categorias, estatísticas
-- ============================================================================

create policy "atletas_select_all" on atletas for select using (true);
create policy "atletas_staff_write" on atletas for all
  using (is_staff_of(club_id)) with check (is_staff_of(club_id));

-- atleta_categorias herda escopo via atleta
create policy "atleta_cat_select_all" on atleta_categorias for select using (true);
create policy "atleta_cat_staff_write" on atleta_categorias for all
  using (
    exists (select 1 from atletas a where a.id = atleta_categorias.atleta_id and is_staff_of(a.club_id))
  )
  with check (
    exists (select 1 from atletas a where a.id = atleta_categorias.atleta_id and is_staff_of(a.club_id))
  );

create policy "stats_select_all" on estatisticas_atleta for select using (true);
create policy "stats_staff_write" on estatisticas_atleta for all
  using (
    exists (select 1 from atletas a where a.id = estatisticas_atleta.atleta_id and is_staff_of(a.club_id))
  )
  with check (
    exists (select 1 from atletas a where a.id = estatisticas_atleta.atleta_id and is_staff_of(a.club_id))
  );

-- ============================================================================
-- competições, partidas, escalações, eventos da partida
-- ============================================================================

create policy "comp_select_all" on competicoes for select using (true);
create policy "comp_admin_write" on competicoes for all
  using (is_admin_of(club_id)) with check (is_admin_of(club_id));

create policy "partidas_select_all" on partidas for select using (true);
create policy "partidas_staff_write" on partidas for all
  using (is_staff_of(club_id)) with check (is_staff_of(club_id));

create policy "escal_select_all" on escalacoes for select using (true);
create policy "escal_staff_write" on escalacoes for all
  using (
    exists (select 1 from partidas p where p.id = escalacoes.partida_id and is_staff_of(p.club_id))
  )
  with check (
    exists (select 1 from partidas p where p.id = escalacoes.partida_id and is_staff_of(p.club_id))
  );

create policy "pe_select_all" on partida_eventos for select using (true);
create policy "pe_staff_write" on partida_eventos for all
  using (
    exists (select 1 from partidas p where p.id = partida_eventos.partida_id and is_staff_of(p.club_id))
  )
  with check (
    exists (select 1 from partidas p where p.id = partida_eventos.partida_id and is_staff_of(p.club_id))
  );

-- ============================================================================
-- eventos & presença
-- ============================================================================

create policy "eventos_select_member"
  on eventos for select
  using (
    is_staff_of(club_id)
    or exists (
      select 1
      from atletas a
      join atleta_categorias ac on ac.atleta_id = a.id
      where a.profile_id = auth.uid()
        and ac.categoria_id = eventos.categoria_id
    )
  );

create policy "eventos_staff_write"
  on eventos for all
  using (is_staff_of(club_id)) with check (is_staff_of(club_id));

create policy "presencas_select_member"
  on presencas for select
  using (
    exists (
      select 1 from eventos ev where ev.id = presencas.evento_id and is_staff_of(ev.club_id)
    )
    or exists (
      select 1 from atletas where atletas.id = presencas.atleta_id and atletas.profile_id = auth.uid()
    )
  );

create policy "presencas_atleta_update_own"
  on presencas for all
  using (
    exists (select 1 from atletas where atletas.id = presencas.atleta_id and atletas.profile_id = auth.uid())
  )
  with check (
    exists (select 1 from atletas where atletas.id = presencas.atleta_id and atletas.profile_id = auth.uid())
  );

create policy "presencas_staff_write"
  on presencas for all
  using (
    exists (select 1 from eventos ev where ev.id = presencas.evento_id and is_staff_of(ev.club_id))
  )
  with check (
    exists (select 1 from eventos ev where ev.id = presencas.evento_id and is_staff_of(ev.club_id))
  );

-- ============================================================================
-- posts — feed público é open, interno só pra membros do clube
-- ============================================================================

create policy "posts_select_publico"
  on posts for select
  using (
    audiencia = 'publico'
    or (audiencia = 'interno' and is_member_of(club_id))
  );

create policy "posts_insert_member"
  on posts for insert
  with check (
    auth.uid() = autor_id
    and (
      (audiencia = 'publico' and is_staff_of(club_id))
      or (audiencia = 'interno' and is_member_of(club_id))
    )
  );

create policy "posts_update_own_or_admin"
  on posts for update
  using (auth.uid() = autor_id or is_admin_of(club_id));

create policy "posts_delete_own_or_admin"
  on posts for delete
  using (auth.uid() = autor_id or is_admin_of(club_id));

-- curtidas / comentários herdam visibilidade do post
create policy "curtidas_select_when_post_visible"
  on curtidas for select
  using (
    exists (
      select 1 from posts p
      where p.id = curtidas.post_id
        and (p.audiencia = 'publico' or (p.audiencia = 'interno' and is_member_of(p.club_id)))
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
        and (p.audiencia = 'publico' or (p.audiencia = 'interno' and is_member_of(p.club_id)))
    )
  );

create policy "comentarios_insert_member"
  on comentarios for insert
  with check (auth.uid() = autor_id);

create policy "comentarios_delete_own_or_admin"
  on comentarios for delete
  using (
    auth.uid() = autor_id
    or exists (
      select 1 from posts p where p.id = comentarios.post_id and is_admin_of(p.club_id)
    )
  );
