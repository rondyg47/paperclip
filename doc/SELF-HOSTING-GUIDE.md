# Guia de Self-Hosting do Paperclip

Guia completo para clonar e rodar o Paperclip no seu proprio ambiente.

## O que e o Paperclip?

Paperclip e uma plataforma open-source (licenca MIT) de orquestracao para empresas autonomas de IA. Ele gerencia multiplos agentes de IA trabalhando juntos como uma empresa, com:

- **Org Chart** — hierarquia de agentes com papeis e responsabilidades
- **Sistema de Tickets** — tarefas com rastreamento e auditoria completa
- **Controle de Custos** — orcamento mensal por agente, com pausa automatica
- **Governanca** — aprovacoes, logs imutaveis, pause/terminate a qualquer momento
- **Multi-Company** — isolamento completo de dados entre empresas
- **Bring Your Own Agent** — suporta Claude Code, Codex, Cursor, Gemini, OpenCode, OpenClaw
- **Heartbeats** — agentes acordam em schedules e executam trabalho autonomamente
- **Plugins** — sistema extensivel via SDK

## Pre-requisitos

| Requisito | Versao minima |
|-----------|---------------|
| Node.js   | 20+           |
| pnpm      | 9.15+         |
| Git       | qualquer      |
| OS        | Linux, macOS, ou Windows (via WSL/Docker) |

Para rodar via Docker, apenas Docker e Docker Compose sao necessarios (sem Node.js local).

## Instalacao Local (Modo Rapido)

### 1. Clone o repositorio

```sh
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
```

### 2. Instale as dependencias

```sh
pnpm install
```

### 3. Inicie o servidor

```sh
pnpm dev
```

Pronto! Acesse `http://localhost:3100` no navegador.

O banco de dados PostgreSQL embutido e criado automaticamente — nenhuma configuracao manual e necessaria.

### Alternativa: comando unico

```sh
pnpm paperclipai run
```

Este comando faz onboard automatico (se necessario), roda o doctor para validar o ambiente, e inicia o servidor.

## Instalacao via Docker

### Opcao 1: Docker Compose (recomendado)

```sh
docker compose -f docker-compose.quickstart.yml up --build
```

Acesse `http://localhost:3100`.

Personalize porta e diretorio de dados:

```sh
PAPERCLIP_PORT=3200 PAPERCLIP_DATA_DIR=./data/pc docker compose -f docker-compose.quickstart.yml up --build
```

### Opcao 2: Docker direto

```sh
docker build -t paperclip-local .
docker run --name paperclip \
  -p 3100:3100 \
  -e HOST=0.0.0.0 \
  -e PAPERCLIP_HOME=/paperclip \
  -v "$(pwd)/data/docker-paperclip:/paperclip" \
  paperclip-local
```

A imagem Docker ja inclui os CLIs do Claude Code e Codex pre-instalados.

## Modos de Deployment

O Paperclip suporta dois modos principais:

### local_trusted (padrao)

- Sem login — acesso direto
- Bind apenas em `127.0.0.1` (localhost)
- Ideal para uso pessoal e desenvolvimento
- Zero configuracao extra

### authenticated (producao)

Requer configuracao adicional. Dois sub-modos:

| Exposicao | Uso | Requisitos |
|-----------|-----|------------|
| `private` | Rede privada (Tailscale/VPN/LAN) | `BETTER_AUTH_SECRET`, `PAPERCLIP_PUBLIC_URL` |
| `public`  | Internet (cloud) | `BETTER_AUTH_SECRET`, `PAPERCLIP_PUBLIC_URL`, HTTPS recomendado |

Exemplo de configuracao para modo autenticado:

```sh
export PAPERCLIP_DEPLOYMENT_MODE=authenticated
export PAPERCLIP_DEPLOYMENT_EXPOSURE=private
export PAPERCLIP_PUBLIC_URL=http://192.168.1.100:3100
export BETTER_AUTH_SECRET=sua-chave-secreta-aqui
pnpm dev
```

Ou configure interativamente:

```sh
pnpm paperclipai onboard
```

## Banco de Dados

Tres opcoes disponiveis:

### 1. Embedded PostgreSQL (padrao, zero-config)

Nenhuma acao necessaria. O Paperclip inicia um PostgreSQL embutido automaticamente.

- Dados em: `~/.paperclip/instances/default/db/`
- Backups automaticos a cada 60 minutos
- Retencao de 30 dias

### 2. PostgreSQL externo

Defina a variavel `DATABASE_URL`:

```sh
export DATABASE_URL=postgres://usuario:senha@host:5432/paperclip
pnpm dev
```

### 3. PostgreSQL hospedado (ex: Supabase, Neon)

Use a connection string do provedor como `DATABASE_URL`. Para connection pooling (ex: Supavisor), use a porta 6543.

### Backups

Backups automaticos vem habilitados por padrao. Configure com:

```sh
pnpm paperclipai configure --section database
```

Backup manual:

```sh
pnpm paperclipai db:backup
```

Variaveis de ambiente para customizar:

- `PAPERCLIP_DB_BACKUP_ENABLED=true|false`
- `PAPERCLIP_DB_BACKUP_INTERVAL_MINUTES=60`
- `PAPERCLIP_DB_BACKUP_RETENTION_DAYS=30`

## Integracao com Agentes de IA

O Paperclip suporta multiplos tipos de agentes. Configure as chaves de API conforme necessario:

| Agente | Variavel de ambiente | Descricao |
|--------|---------------------|-----------|
| Claude Code | `ANTHROPIC_API_KEY` | Agentes usando Anthropic Claude |
| Codex | `OPENAI_API_KEY` | Agentes usando OpenAI Codex |
| Cursor | — | Adapter local, sem chave extra |
| Gemini | — | Adapter local |
| OpenCode | — | Adapter local |
| OpenClaw | — | Gateway HTTP/WebSocket |

Via Docker, passe as chaves como variaveis de ambiente:

```sh
docker run --name paperclip \
  -p 3100:3100 \
  -e HOST=0.0.0.0 \
  -e PAPERCLIP_HOME=/paperclip \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e OPENAI_API_KEY=sk-... \
  -v "$(pwd)/data/docker-paperclip:/paperclip" \
  paperclip-local
```

Sem as chaves de API, o app funciona normalmente — os adapters apenas indicarao que os pre-requisitos estao faltando.

## Armazenamento de Arquivos

### Local (padrao)

Arquivos salvos em: `~/.paperclip/instances/default/data/storage`

### AWS S3 (opcional)

```sh
export PAPERCLIP_STORAGE_PROVIDER=s3
export PAPERCLIP_STORAGE_S3_BUCKET=meu-bucket
export PAPERCLIP_STORAGE_S3_REGION=us-east-1
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

Tambem compativel com servicos S3-compatible (MinIO, R2, etc.) via `PAPERCLIP_STORAGE_S3_ENDPOINT`.

## Gerenciamento de Secrets

Por padrao, secrets sao armazenados com criptografia local:

- Chave mestra em: `~/.paperclip/instances/default/secrets/master.key`
- Criada automaticamente no primeiro uso

Para ambientes compartilhados, habilite o modo estrito:

```sh
export PAPERCLIP_SECRETS_STRICT_MODE=true
```

Isso obriga o uso de referencias de secret em vez de valores inline para chaves sensiveis.

Configure via CLI:

```sh
pnpm paperclipai configure --section secrets
```

## Verificacao de Saude

Apos iniciar o servidor, verifique se esta funcionando:

```sh
curl http://localhost:3100/api/health
# Esperado: {"status":"ok"}

curl http://localhost:3100/api/companies
# Esperado: array JSON
```

Ou use o doctor para validacao completa:

```sh
pnpm paperclipai doctor
```

## Referencia Rapida de Variaveis de Ambiente

| Variavel | Padrao | Descricao |
|----------|--------|-----------|
| `HOST` | `127.0.0.1` | Endereco de bind do servidor |
| `PORT` | `3100` | Porta do servidor |
| `DATABASE_URL` | (embedded) | URL de conexao PostgreSQL |
| `PAPERCLIP_HOME` | `~/.paperclip` | Diretorio raiz do Paperclip |
| `PAPERCLIP_INSTANCE_ID` | `default` | ID da instancia |
| `PAPERCLIP_DEPLOYMENT_MODE` | `local_trusted` | Modo: `local_trusted` ou `authenticated` |
| `PAPERCLIP_DEPLOYMENT_EXPOSURE` | `private` | Exposicao: `private` ou `public` |
| `PAPERCLIP_PUBLIC_URL` | — | URL publica (obrigatorio para authenticated) |
| `BETTER_AUTH_SECRET` | — | Segredo de autenticacao (obrigatorio para authenticated) |
| `ANTHROPIC_API_KEY` | — | Chave API Anthropic (para agentes Claude) |
| `OPENAI_API_KEY` | — | Chave API OpenAI (para agentes Codex) |
| `PAPERCLIP_STORAGE_PROVIDER` | `local_disk` | Provedor de storage: `local_disk` ou `s3` |
| `PAPERCLIP_SECRETS_STRICT_MODE` | `false` | Modo estrito de secrets |

## Comandos Uteis do CLI

```sh
pnpm paperclipai onboard          # Setup interativo inicial
pnpm paperclipai run              # Onboard + doctor + iniciar servidor
pnpm paperclipai doctor           # Verificacao de saude do ambiente
pnpm paperclipai configure --section <secao>  # Reconfigurar (server, database, storage, secrets)
pnpm paperclipai issue list       # Listar issues
pnpm paperclipai issue create --title "..."   # Criar issue
pnpm paperclipai dashboard get    # Ver dashboard
pnpm paperclipai db:backup        # Backup manual do banco
pnpm paperclipai context set --api-base http://localhost:3100 --company-id <id>  # Definir contexto padrao
```

## Licenca

Paperclip e distribuido sob a licenca MIT. Voce pode usar, modificar e distribuir livremente.
