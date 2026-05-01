# Environment variable reference

> Phase 1 stub. Phase 2 expands the **Backend** section as variables are
> added; Phase 4 fills in **Storefront**. The values below match §6 of the
> spec verbatim — keep this doc in sync.

## How env is read

- **Local dev:** each app has a gitignored `.env` (see `.env.example` in
  the same directory). Loaded via `dotenv` (Vendure) or Next.js's built-in
  `.env.local`.
- **CI / staging / production:** [Doppler](https://doppler.com) project
  `hurc`, configs `dev`, `stg`, `prd`. CI pulls via `dopplerhq/cli-action`;
  prod containers receive env via `docker compose --env-file <(doppler run -- env)`.
- **Validation:** every app loads env through a Zod schema in `src/env.ts`
  that throws on boot if anything required is missing. No defaults for
  secrets.

## Backend (`apps/backend`)

| Var                            | Scope  | Notes                                                                               |
| ------------------------------ | ------ | ----------------------------------------------------------------------------------- |
| `DATABASE_URL`                 | server | `postgres://user:pass@host:5432/hurc`                                               |
| `REDIS_URL`                    | server | `redis://:password@host:6379`                                                       |
| `COOKIE_SECRET`                | server | ≥32 bytes; rotate via Doppler                                                       |
| `SUPERADMIN_USERNAME`          | server | seeded once; never logged                                                           |
| `SUPERADMIN_PASSWORD`          | server | bcrypt'd at first boot                                                              |
| `ASSET_BUNNY_S3_ACCESS_KEY`    | server | Bunny **Storage Zone** "FTP & API password username"                                |
| `ASSET_BUNNY_S3_SECRET_KEY`    | server | the password from the same screen — **not** the account API key                     |
| `ASSET_BUNNY_S3_BUCKET`        | server | Storage Zone name                                                                   |
| `ASSET_BUNNY_S3_ENDPOINT`      | server | e.g. `https://storage.bunnycdn.com` (or regional `https://de.storage.bunnycdn.com`) |
| `ASSET_PUBLIC_URL_PREFIX`      | server | Pull Zone host, e.g. `https://assets.hurc.com`                                      |
| `MEILI_HOST`                   | server | e.g. `http://meilisearch:7700` (compose)                                            |
| `MEILI_MASTER_KEY`             | server | ≥16 chars                                                                           |
| `MOLLIE_API_KEY`               | server | per-channel; the EU profile uses one, UK uses another (TBD in 2.8)                  |
| `STRIPE_SECRET_KEY`            | server | fallback handler                                                                    |
| `STRIPE_WEBHOOK_SECRET`        | server | for `/payments/stripe/webhook`                                                      |
| `SENDCLOUD_PUBLIC_KEY`         | server | merchant integration                                                                |
| `SENDCLOUD_SECRET_KEY`         | server | basic-auth pair                                                                     |
| `RESEND_API_KEY`               | server | sender domain `mail.hurc.com`                                                       |
| `SENTRY_DSN_BACKEND`           | server | optional in dev                                                                     |
| `LOGTAIL_SOURCE_TOKEN_BACKEND` | server | optional in dev                                                                     |
| `SANITY_WEBHOOK_SECRET`        | server | HMAC of webhook bodies                                                              |
| `NEXT_REVALIDATE_SECRET`       | server | bearer for storefront `/api/revalidate`                                             |

## Storefront (`apps/storefront`)

| Var                                | Scope           | Notes                                       |
| ---------------------------------- | --------------- | ------------------------------------------- |
| `NEXT_PUBLIC_VENDURE_SHOP_API_URL` | client          | e.g. `https://api.hurc.com/shop-api`        |
| `VENDURE_SHOP_API_URL_INTERNAL`    | server          | for SSR fetches inside the same network     |
| `NEXT_PUBLIC_SITE_URL`             | client          | canonical host for SEO + OG                 |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`     | client          | analytics domain key                        |
| `NEXT_PUBLIC_POSTHOG_KEY`          | client          | EU instance                                 |
| `NEXT_PUBLIC_POSTHOG_HOST`         | client          | `https://eu.posthog.com`                    |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`    | client          |                                             |
| `NEXT_PUBLIC_SANITY_DATASET`       | client          | `production` / `preview`                    |
| `SANITY_API_READ_TOKEN`            | server          | for draft mode                              |
| `SANITY_REVALIDATE_SECRET`         | server          | matches `NEXT_REVALIDATE_SECRET` on backend |
| `SENTRY_DSN_STOREFRONT`            | server + client | client only loads after consent             |
| `LOGTAIL_SOURCE_TOKEN_STOREFRONT`  | server          | RSC + middleware logging                    |
| `MOLLIE_PROFILE_ID`                | client          | for Mollie components                       |
| `STRIPE_PUBLISHABLE_KEY`           | client          | for Elements                                |

## Adding a variable

1. Add the key + description here, in the right table.
2. Add a Zod field in the relevant `src/env.ts`.
3. Add a placeholder line in `apps/<app>/.env.example`.
4. Add it to the Doppler project under all three configs.
5. Reference it in code only via `env.X`, never `process.env.X` directly.
