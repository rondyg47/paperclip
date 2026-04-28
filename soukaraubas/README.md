# SouKaraubas — App oficial do Karaúbas FC

App multiplataforma do Karaúbas Futebol Clube (KFC). Web (Next.js PWA) primeiro, mobile React Native depois. Backend Supabase.

> Fundado em **29 de agosto de 2009** · 8 categorias ativas · Campo + Futsal

---

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS** com design tokens do KFC (azul/amarelo/laranja)
- **Supabase** (Postgres + Auth + Storage + RLS)
- **lucide-react** (ícones), **date-fns** (datas pt-BR), **zod** (validação)

## Estrutura

```
soukaraubas/
├── app/                       # Rotas Next.js (App Router)
│   ├── page.tsx               # Home pública
│   ├── elenco/                # Lista de categorias e jogadores
│   ├── jogos/                 # Calendário e resultados
│   ├── feed/                  # Feed público + interno
│   ├── login/ signup/         # Auth
│   ├── conta/                 # Perfil do usuário logado
│   ├── sobre/                 # Sobre o clube
│   └── jogador/[id]/          # Perfil individual de atleta
├── components/
│   ├── ui/                    # Button, Card, Badge, Avatar, Escudo
│   ├── layout/                # Header, Footer, BottomNav, PageHeader
│   ├── squad/                 # CategoriaCard, PlayerCard
│   ├── calendar/              # MatchCard, EventCard
│   ├── feed/                  # PostCard, Composer, StoryRing
│   └── match/                 # Lineup, MatchEvents
├── lib/
│   ├── supabase/              # client.ts, server.ts, middleware.ts
│   ├── design/tokens.ts       # Cores, categorias, modalidades, roles
│   ├── utils/cn.ts format.ts  # Helpers
│   └── mock/data.ts           # Mock data de desenvolvimento
├── supabase/
│   └── migrations/
│       ├── 0001_initial_schema.sql
│       └── 0002_rls_policies.sql
├── public/                    # escudo.svg, manifest.json
└── middleware.ts              # Refresh de sessão Supabase
```

## Setup local

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar Supabase
cp .env.example .env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY com os valores do seu projeto.

# 3. Subir o schema no Supabase
# Opção A — Supabase CLI
supabase login
supabase link --project-ref SEU_PROJECT_REF
supabase db push

# Opção B — Cole as migrations manualmente no SQL Editor do Supabase em:
#   supabase/migrations/0001_initial_schema.sql
#   supabase/migrations/0002_rls_policies.sql

# 4. Rodar o app
pnpm dev
# abrir http://localhost:3000
```

## Modelo de dados (resumo)

| Tabela | O que é |
|---|---|
| `profiles` | Usuários do app, ligados a `auth.users`. Roles: `admin`, `comissao`, `atleta`, `torcedor`. |
| `categorias` | Os 8 elencos (Sub-12, Sub-15, Sub-18, Master 35, Principal, Aspirantes, Escolinha, Futsal Adulto). |
| `atletas` + `atleta_categorias` | Atleta pode estar em várias categorias × modalidades. Sub-12/15/18 podem disputar campo E futsal. |
| `competicoes` + `partidas` + `escalacoes` + `partida_eventos` | Calendário, jogos e eventos da partida (gols, cartões, substituições). |
| `eventos` + `presencas` | Convocação estilo Spond — RSVP `sim`/`nao`/`talvez`/`pendente`. |
| `posts` + `curtidas` + `comentarios` | Feed com `audiencia: publico|interno`, suporte a stories (`expira_em`). |
| `estatisticas_atleta` | Stats por atleta × modalidade × temporada (cache para tela de jogador). |

RLS policies (`0002_rls_policies.sql`):
- **Torcedor** vê tudo público.
- **Atleta/Comissão/Admin** veem feed interno e eventos da sua categoria.
- **Staff** (admin + comissão) edita elenco, partidas, eventos.
- **Apenas Admin** edita categorias, competições e roles.

## Roles & permissões

| Role | Vê feed interno | Posta | Edita elenco | Edita jogos | Cria conta de atleta |
|---|---|---|---|---|---|
| Torcedor | ❌ | ❌ | ❌ | ❌ | ❌ |
| Atleta | ✅ | ✅ (interno) | ❌ | ❌ | ❌ |
| Comissão | ✅ | ✅ (público + interno) | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ + categorias |

## Roadmap

**MVP (atual)**
- [x] Schema completo com RLS
- [x] Home pública com hero + próximos jogos + feed
- [x] Lista de categorias + página de cada categoria
- [x] Calendário de jogos com filtro por categoria/modalidade
- [x] Feed público/interno com curtidas e comentários
- [x] Bottom nav mobile + header desktop
- [ ] Auth real funcionando (Supabase Auth + Google)
- [ ] Composer de post no feed
- [ ] Stories (24h)
- [ ] Convocação com RSVP
- [ ] Perfil individual de jogador com stats por modalidade
- [ ] Painel admin (CRUD)

**Pós-MVP**
- Push notifications (PWA + React Native)
- Mensalidade via Pix
- Programa sócio-torcedor com gamificação
- Vídeo feed (drills da comissão)
- Tactical board interativo
- Loja oficial / produtos

## Deploy

- **Vercel** pra a app Next.js (zero config, integra com Supabase).
- **Supabase** hosted (free tier serve pra começar).
- Domínio sugerido: `soukaraubas.com.br` ou `karaubasfc.com.br`.

## Migração para o repo `rondyg47/soukaraubas`

Esse código está no branch `claude/football-team-app-uDHxn` do repo `rondyg47/paperclip`, na pasta `soukaraubas/`. Para mover pro repo dedicado:

```bash
git clone https://github.com/rondyg47/soukaraubas.git
cp -r path/to/paperclip/soukaraubas/* soukaraubas/
cp path/to/paperclip/soukaraubas/.gitignore soukaraubas/
cp path/to/paperclip/soukaraubas/.env.example soukaraubas/
cd soukaraubas
git add .
git commit -m "feat: setup inicial do app SouKaraubas"
git push
```
