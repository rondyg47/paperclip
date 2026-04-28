# MyClubFC — O app do seu clube de futebol

**SaaS multi-tenant** para clubes de futebol amador e categorias de base. Cada clube tem seu próprio app, com escudo, cores e URL próprios — gestão de elenco, calendário, convocações, estatísticas e rede social interna.

> 🏆 **Cliente em destaque**: [Karaúbas FC](http://kfc.localhost:3000) — fundado em 29/08/2009, 8 categorias, campo + futsal.

---

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS** com cores dinâmicas por tenant (cada clube com sua paleta)
- **Supabase** (Postgres + Auth + Storage + RLS multi-tenant)
- **lucide-react**, **date-fns**, **zod**

## Arquitetura SaaS

### Multi-tenancy via subdomínio

| URL | Conteúdo |
|---|---|
| `myclubfc.com` | Landing marketing + onboarding |
| `kfc.myclubfc.com` | App do tenant `kfc` (Karaúbas) |
| `<slug>.myclubfc.com` | App de qualquer clube cadastrado |
| `localhost:3000?tenant=kfc` | Override em dev |

O `middleware.ts` resolve o tenant a partir do `Host` da request, reescreve `kfc.myclubfc.com/elenco` → `app/c/kfc/elenco/page.tsx` internamente, e injeta o header `x-tenant-slug` que o `getCurrentClub()` lê.

### Modelo de dados (multi-tenant)

```
clubs (tenants)
  └── club_memberships (profile × club × role)
        ├── categorias        (per-club)
        ├── atletas           (per-club)
        ├── partidas          (per-club)
        ├── eventos           (per-club)
        └── posts             (per-club)
                ├── curtidas
                └── comentarios
```

- Cada usuário pode ter **memberships em vários clubes** com roles diferentes (admin do KFC + torcedor do Flamengo Amador)
- RLS scopa toda query pelo `club_id`
- Helpers SQL: `is_admin_of(club)`, `is_staff_of(club)`, `is_member_of(club)`

### Roles por clube

| Role | Vê interno | Posta interno | Posta público | Edita elenco/jogos | Edita config clube |
|---|---|---|---|---|---|
| Torcedor | ❌ | ❌ | ❌ | ❌ | ❌ |
| Atleta | ✅ | ✅ | ❌ | ❌ | ❌ |
| Comissão | ✅ | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

## Estrutura

```
myclubfc/
├── app/
│   ├── page.tsx                  # Marketing landing (myclubfc.com/)
│   ├── criar-clube/              # Onboarding self-service
│   ├── login, signup, conta      # Auth (global)
│   ├── feed/actions.ts           # Server actions globais
│   ├── convocacao/actions.ts
│   └── c/[slug]/                 # Rotas do tenant (rewrite via middleware)
│       ├── layout.tsx            # Aplica cores do clube + TenantHeader
│       ├── page.tsx              # Home do clube
│       ├── elenco, jogos, feed, jogador, convocacao, admin, sobre
├── components/
│   ├── layout/                   # MarketingHeader, TenantHeader, Footer, BottomNav, ClubThemeStyle
│   ├── auth, onboarding, ui, feed, convocacao, squad, calendar
├── lib/
│   ├── tenant/{resolve,current}.ts  # Multi-tenant helpers
│   ├── auth/session.ts
│   ├── supabase/, design/, mock/
├── supabase/migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0002_rls_policies.sql        (single-tenant — substituída pela 0004)
│   ├── 0003_saas_multitenant.sql    # clubs + memberships + club_id
│   └── 0004_rls_multitenant.sql     # RLS scoped por club
├── middleware.ts                    # Tenant resolution + Supabase session
└── public/
```

## Setup local

```bash
# 1. Instalar deps (use --ignore-workspace dentro do paperclip)
cd myclubfc
pnpm install --ignore-workspace

# 2. Configurar
cp .env.example .env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Migrar Supabase
supabase link --project-ref SEU_REF
supabase db push
# OU cole as 4 migrations no SQL Editor (em ordem: 0001 → 0002 → 0003 → 0004)

# 4. Rodar
pnpm dev
# → http://localhost:3000              (landing marketing)
# → http://kfc.localhost:3000          (app do KFC, suportado por Chrome/Safari)
# → http://localhost:3000?tenant=kfc   (fallback override em dev)
```

### Subdomain em dev

Chrome, Safari e Firefox modernos resolvem `*.localhost` automaticamente pra `127.0.0.1`. Se o seu navegador não fizer isso, use o override `?tenant=kfc`.

## Onboarding (criar novo clube)

1. Usuário cria conta em `/signup`
2. Redirecionado pra `/criar-clube`
3. Preenche: nome, slug (subdomínio), descrição, cidade/UF, fundação, modalidades, **3 cores oficiais**
4. Clube criado + user vira admin automaticamente (trigger SQL)
5. Redirect pra `<slug>.myclubfc.com` — app pronto

## Roadmap

**Fase 1 ✅ (atual)**
- [x] Schema multi-tenant + RLS scoped
- [x] Middleware subdomain → tenant
- [x] Landing marketing + onboarding `/criar-clube`
- [x] Tenant pages com `getCurrentClub()` e cores dinâmicas
- [x] Auth real Supabase + UserMenu

**Fase 2**
- [ ] Página `/conta` mostrando todas as memberships do user
- [ ] Tenant settings (admin edita cores, escudo, descrição)
- [ ] Upload de escudo via Supabase Storage
- [ ] CRUD admin completo (elenco/jogos/eventos)

**Fase 3**
- [ ] Stories de 24h
- [ ] Upload de mídia em posts
- [ ] Comentários funcionando
- [ ] Push notifications PWA

**Fase 4**
- [ ] Mensalidade via Pix por tenant
- [ ] Plano Pro com features avançadas
- [ ] Domínio custom por clube
- [ ] App mobile React Native

## Migração para `rondyg47/myclubfc`

Esse código vive no branch `claude/football-team-app-uDHxn` do repo `rondyg47/paperclip`, na pasta `myclubfc/`. Pra mover pro repo dedicado:

```bash
git clone https://github.com/rondyg47/myclubfc.git
cp -r path/to/paperclip/myclubfc/. myclubfc/
cd myclubfc
git add .
git commit -m "feat: setup inicial do MyClubFC SaaS"
git push origin main
```
