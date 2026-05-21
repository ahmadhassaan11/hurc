# Local development

This guide gets the full HURC stack running on your laptop with one command.
For the architecture and the phase plan see [`ARCHITECTURE.md`](./ARCHITECTURE.md)
and [`decisions/0001-stack.md`](./decisions/0001-stack.md). For environment
variables see [`../infra/env.reference.md`](../infra/env.reference.md).

## Prerequisites

| Tool   | Version                              | How                                    |
| ------ | ------------------------------------ | -------------------------------------- |
| Node   | 22.x (matches `.nvmrc`)              | `fnm use` / `nvm use` / `asdf install` |
| pnpm   | 11.0.3 (pinned via `packageManager`) | `corepack enable`                      |
| Docker | any modern version with Compose v2   | Docker Desktop or OrbStack             |

Verify:

```sh
node --version    # v22.x.x
pnpm --version    # 11.0.3
docker --version
```

## One-command start

From the repo root:

```sh
pnpm install
pnpm dev:up
```

That's it. `pnpm dev:up` is idempotent — it can be re-run any time.

What it does, in order ([`infra/scripts/dev-up.sh`](../infra/scripts/dev-up.sh)):

1. Copies `apps/backend/.env` from `.env.example` if missing.
2. Copies `apps/storefront/.env.local` from `.env.example` if missing.
3. Starts the docker data-layer (Postgres 16, Redis 7, Meilisearch 1.42)
   from [`infra/docker/compose.yml`](../infra/docker/compose.yml) and waits
   for healthchecks.
4. Runs Vendure migrations (idempotent).
5. Runs the backend seed (idempotent — re-runs log `unchanged`).
6. `exec`s `pnpm dev` so backend + storefront log to the same terminal.

First boot: ~60–90 s (image pulls + initial migrations + seed). Subsequent
runs: ~5–10 s.

## URLs

| Surface          | URL                             | Notes                                 |
| ---------------- | ------------------------------- | ------------------------------------- |
| **Storefront**   | http://localhost:3000           | redirects to `/en` by default         |
| Storefront (DE)  | http://localhost:3000/de        | also `/fr`, `/nl`, `/es`, `/it`       |
| Vendure Admin UI | http://localhost:3002           | login `superadmin` / `ChangeMe!Local` |
| Shop GraphQL     | http://localhost:3001/shop-api  | Apollo Sandbox in browser             |
| Admin GraphQL    | http://localhost:3001/admin-api |                                       |
| Health           | http://localhost:3001/health    |                                       |
| Meilisearch      | http://localhost:7700           | master key in `apps/backend/.env`     |

> Backend listens on **3001**, storefront on **3000**, admin UI on **3002**.
> Postgres `5432`, Redis `6379`, Meilisearch `7700`.

## Stopping

```sh
# Ctrl-C the dev servers in the terminal running `pnpm dev:up`.

pnpm dev:down       # stops docker; preserves data volumes
pnpm dev:reset      # stops docker AND wipes volumes (full fresh DB)
```

After `pnpm dev:reset`, the next `pnpm dev:up` re-runs migrations + seed
automatically.

## Optional integrations (all degrade gracefully in dev)

The default `.env.example` files leave third-party integrations unset. The
relevant Vendure plugins and storefront modules detect missing keys and
fall back to local-only behaviour:

| Service                  | Fallback when unset                                            | Enable                                                |
| ------------------------ | -------------------------------------------------------------- | ----------------------------------------------------- |
| Bunny.net assets         | local disk under `apps/backend/static/assets/`                 | fill `ASSET_BUNNY_S3_*`                               |
| Sendcloud shipping       | flat-rate calculator                                           | fill `SENDCLOUD_*`                                    |
| Mollie / Stripe payments | no PaymentMethod rows seeded → checkout has no payment options | fill `MOLLIE_API_KEY` / `STRIPE_*`                    |
| Sanity CMS               | editorial routes 404 cleanly                                   | fill `NEXT_PUBLIC_SANITY_*` + `SANITY_API_READ_TOKEN` |
| Sentry                   | client SDK no-ops                                              | fill `NEXT_PUBLIC_SENTRY_DSN`                         |
| Logtail (Better Stack)   | local pino transport                                           | fill `LOGTAIL_SOURCE_TOKEN_*`                         |
| Upstash KV (rate limit)  | in-memory `Map` (dev-safe)                                     | fill `KV_REST_API_*`                                  |
| Resend email             | writes HTML to `apps/backend/static/email/output/`             | fill `RESEND_API_KEY` + verified domain               |

The Phase-8 `COMPANY_*` block stays unset locally; the legal pages render
with placeholder data via [`apps/storefront/src/lib/legal/company.ts`].
Production env validation refuses to boot without them — see
[`../infra/env.reference.md#phase-8--impressum--dsgvo`](../infra/env.reference.md).

## Common follow-up commands

```sh
pnpm typecheck                                    # all 16 packages
pnpm lint
pnpm test                                         # Vitest across 9 packages
pnpm test:coverage                                # with coverage thresholds
pnpm build                                        # full production build
pnpm --filter @hurc/storefront test:e2e:install   # one-time chromium install
pnpm --filter @hurc/storefront test:e2e           # Playwright suite
pnpm --filter @hurc/graphql codegen               # after editing .graphql operations
pnpm --filter @hurc/backend migration:generate -- <name>
pnpm --filter @hurc/backend seed                  # re-run idempotent seed
pnpm lhci:check                                   # local Lighthouse run
```

## Manual setup (if you want to skip the script)

```sh
cp apps/backend/.env.example     apps/backend/.env
cp apps/storefront/.env.example  apps/storefront/.env.local

docker compose -f infra/docker/compose.yml up -d --wait
pnpm --filter @hurc/backend migration:run
pnpm --filter @hurc/backend seed
pnpm dev
```

## Troubleshooting

**`ECONNREFUSED localhost:3001` from the storefront on first request.**
The backend is still booting. Watch Terminal A for `HURC backend (server)
booted`; once you see it, the storefront's next request succeeds. Cold-start
RSC compile in the storefront on first navigation is also slow (Next 15 dev
turbopack); subsequent navigations are fast.

**`port already allocated` on `docker compose up`.** Something else on your
machine is using `5432` / `6379` / `7700`. Either stop the other process
(`brew services stop postgresql`, etc.) or change the host-side port in
`infra/docker/compose.yml`.

**Migrations fail on a populated DB.** Run `pnpm dev:reset` to wipe volumes,
then `pnpm dev:up` to start clean.

**Storefront says `KV_REST_API_URL is not set` warnings.** Expected in dev —
the rate-limiter falls through to the in-memory `Map` ([Phase-9 ADR-0010
decision 5](./decisions/0010-phase-9-plan.md)). Production binds Upstash KV
via Vercel.

**`MEILI_HOST` connection refused.** Healthcheck is on `127.0.0.1` inside
the container — if the local meili container isn't healthy, run
`docker compose -f infra/docker/compose.yml ps` and inspect logs with
`docker compose -f infra/docker/compose.yml logs meilisearch`.

**Seed reports "ResponsiblePerson already exists".** That's the idempotency
guard logging — not an error. Verify with the next message: every fixture
should log `created` (first run) or `unchanged` (subsequent).
