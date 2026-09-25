# Yayasan Daarul Ummahaat Website

Website for Yayasan Daarul Ummahaat, built with Payload CMS embedded in Next.js, backed by PostgreSQL.

- Requirements: [docs/requirements.md](docs/requirements.md)
- Architecture decision: [docs/architecture-decision.md](docs/architecture-decision.md)
- Design language: [docs/design-language.md](docs/design-language.md)
- Content model: [docs/content-model.md](docs/content-model.md)
- Public site: [docs/frontend.md](docs/frontend.md)
- Deployment, backups and operations: [docs/deployment.md](docs/deployment.md)

## Local development

Requires Node 20.9 or newer (24 recommended), Docker, and corepack (bundled with Node).

```bash
cp .env.example .env        # then set PAYLOAD_SECRET: openssl rand -hex 32
docker compose up -d        # local Postgres on 127.0.0.1:5432
corepack pnpm install
corepack pnpm seed          # optional: categories and the initial programs (as drafts)
corepack pnpm dev           # http://localhost:3000, admin at /admin
```

## Checks

```bash
corepack pnpm lint
corepack pnpm exec tsc --noEmit
corepack pnpm test:int      # needs the local Postgres running
corepack pnpm build
```

Pushing to `main` runs the checks and deploys to the VPS (see [docs/deployment.md](docs/deployment.md)). After changing collections or globals, create a migration with `corepack pnpm payload migrate:create <name>` and commit it.
