# Yayasan Daarul Ummahaat Website

Website for Yayasan Daarul Ummahaat, built with Payload CMS embedded in Next.js, backed by PostgreSQL.

- Requirements: [docs/requirements.md](docs/requirements.md)
- Architecture decision: [docs/architecture-decision.md](docs/architecture-decision.md)
- Design language: [docs/design-language.md](docs/design-language.md)

## Local development

Requires Node 20.9 or newer (24 recommended), Docker, and corepack (bundled with Node).

```bash
cp .env.example .env        # then set PAYLOAD_SECRET: openssl rand -hex 32
docker compose up -d        # local Postgres on 127.0.0.1:5432
corepack pnpm install
corepack pnpm dev           # http://localhost:3000, admin at /admin
```

## Checks

```bash
corepack pnpm lint
corepack pnpm exec tsc --noEmit
corepack pnpm test:int      # needs the local Postgres running
corepack pnpm build
```

Deployment, backup and DNS setup are described in the architecture decision record and are not implemented yet.
