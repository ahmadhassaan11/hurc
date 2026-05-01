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
# 1. Use Node 22 (the .nvmrc target)
nvm use            # or: fnm use, asdf install, etc.

# 2. Enable pnpm. The repo pins it via `packageManager`.
corepack enable    # or: brew install pnpm

# 3. Install everything
pnpm install

# 4. Verify the toolchain
pnpm typecheck
pnpm lint
pnpm test

# 5. Run dev servers (after Phase 2/4 land)
pnpm dev
```

> **Phase 1 status:** monorepo skeleton + shared configs only. Real backend
> and storefront arrive in Phases 2 and 4. See
> [`docs/decisions/0001-stack.md`](./docs/decisions/0001-stack.md) for the full
> phase plan.

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
