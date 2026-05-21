# HURC

> Hustle Unleashed, Resilience Crafted.
>
> Premium activewear / sportswear DTC commerce platform. Markets: EU + UK.

## Stack at a glance

| Layer      | Choice                                                            |
| ---------- | ----------------------------------------------------------------- |
| Monorepo   | Turborepo + pnpm                                                  |
| Backend    | Vendure 3.x (NestJS / TypeORM / GraphQL) on Postgres 16 + Redis 7 |
| Search     | Meilisearch v1                                                    |
| Storefront | Next.js 15 App Router (RSC + Server Actions)                      |
| UI         | Tailwind v4 + shadcn/ui primitives + custom HURC design system    |
| CMS        | Sanity.io                                                         |
| Payments   | Mollie (primary) + Stripe (fallback)                              |
| Hosting    | Hetzner CX22 (backend) + Vercel (storefront) + Cloudflare DNS/WAF |

Full architecture lives in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
The build is delivered in 10 phases described in
[`docs/decisions/0001-stack.md`](./docs/decisions/0001-stack.md).

## Quickstart

```sh
# 1. Use Node 22 (the .nvmrc target) and enable pnpm
nvm use && corepack enable

# 2. Install everything
pnpm install

# 3. Boot the full stack (docker data-layer + backend + storefront)
pnpm dev:up
```

`pnpm dev:up` is idempotent: copies `.env` files if missing, starts the
docker data-layer, runs migrations + seed, then streams dev logs.
Storefront on http://localhost:3000, Vendure admin on http://localhost:3002
(login `superadmin` / `ChangeMe!Local`).

Full guide — URLs, optional integrations, troubleshooting —
[`docs/DEV.md`](./docs/DEV.md).

## Layout

```
apps/        backend (Vendure) and storefront (Next.js)
packages/    ui, graphql, utils, analytics, email, testing, shared configs
infra/       docker compose, Caddy, deploy scripts
docs/        ARCHITECTURE, RUNBOOK, CONTRIBUTING, SECURITY, ADRs, backlog
.github/     CI/CD workflows
```

## Contributing

See [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) for branching, commits,
codegen, and the PR checklist.
