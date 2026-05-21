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
| `EMAIL_FROM`                   | server | full RFC-5322 sender, e.g. `HURC <hello@mail.hurc.com>`                             |
| `EMAIL_REPLY_TO`               | server | optional override; falls back to `EMAIL_FROM`                                       |
| `STOREFRONT_URL`               | server | backend → storefront callbacks (verify, reset, sanity revalidate)                   |
| `BACKEND_PUBLIC_URL`           | server | this backend's externally-reachable URL — used by Mollie for webhook callbacks      |
| `SENTRY_DSN_BACKEND`           | server | optional in dev                                                                     |
| `LOGTAIL_SOURCE_TOKEN_BACKEND` | server | optional in dev                                                                     |
| `SANITY_WEBHOOK_SECRET`        | server | HMAC of webhook bodies                                                              |
| `NEXT_REVALIDATE_SECRET`       | server | bearer for storefront `/api/revalidate`                                             |
| `COMPANY_NAME`                 | server | Phase 8: legal entity for Impressum + DSGVO email footer (e.g. `HURC Apparel GmbH`) |
| `COMPANY_ADDRESS`              | server | Phase 8: full registered address, single line                                       |
| `COMPANY_VAT`                  | server | Phase 8: VAT-ID (`USt-IdNr.`), e.g. `DE999999999`                                   |
| `COMPANY_REGISTRY`             | server | Phase 8: registry entry, e.g. `HRB 999999 B (AG Berlin)`                            |
| `COMPANY_DIRECTORS`            | server | Phase 8: comma-separated `Geschäftsführer` names                                    |
| `COMPANY_SUPPORT_EMAIL`        | server | Phase 8: customer-facing support address (legal: must reach a human)                |
| `COMPANY_SUPPORT_PHONE`        | server | Phase 8: customer-facing support phone (E.164 international format)                 |

## Storefront (`apps/storefront`)

| Var                                | Scope           | Notes                                                                                |
| ---------------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_VENDURE_SHOP_API_URL` | client          | e.g. `https://api.hurc.com/shop-api`                                                 |
| `VENDURE_SHOP_API_URL_INTERNAL`    | server          | for SSR fetches inside the same network                                              |
| `NEXT_PUBLIC_SITE_URL`             | client          | canonical host for SEO + OG                                                          |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`     | client          | analytics domain key                                                                 |
| `NEXT_PUBLIC_POSTHOG_KEY`          | client          | EU instance                                                                          |
| `NEXT_PUBLIC_POSTHOG_HOST`         | client          | `https://eu.posthog.com`                                                             |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`    | client          |                                                                                      |
| `NEXT_PUBLIC_SANITY_DATASET`       | client          | `production` / `preview`                                                             |
| `SANITY_API_READ_TOKEN`            | server          | for draft mode                                                                       |
| `SANITY_REVALIDATE_SECRET`         | server          | matches `NEXT_REVALIDATE_SECRET` on backend                                          |
| `NEXT_PUBLIC_SENTRY_DSN`           | server + client | DSN is not a secret per Sentry docs; client SDK still loads only after consent       |
| `LOGTAIL_SOURCE_TOKEN_STOREFRONT`  | server          | RSC + middleware logging                                                             |
| `MOLLIE_PROFILE_ID`                | client          | for Mollie components                                                                |
| `STRIPE_PUBLISHABLE_KEY`           | client          | for Elements                                                                         |
| `COMPANY_NAME`                     | server          | Phase 8: same value as backend; renders Impressum block on /legal/imprint            |
| `COMPANY_ADDRESS`                  | server          | Phase 8: same value as backend                                                       |
| `COMPANY_VAT`                      | server          | Phase 8: same value as backend                                                       |
| `COMPANY_REGISTRY`                 | server          | Phase 8: same value as backend                                                       |
| `COMPANY_DIRECTORS`                | server          | Phase 8: same value as backend                                                       |
| `COMPANY_SUPPORT_EMAIL`            | server          | Phase 8: same value as backend                                                       |
| `COMPANY_SUPPORT_PHONE`            | server          | Phase 8: same value as backend                                                       |
| `KV_REST_API_URL`                  | server          | Phase 9: Upstash KV REST endpoint (rate limiter); falls back to in-memory when unset |
| `KV_REST_API_TOKEN`                | server          | Phase 9: Upstash KV REST token; must pair with `KV_REST_API_URL`                     |

## Important: secret pairs

Some environment variables come in **paired** form across the two apps and
must hold the same value end-to-end. Keep them aligned in Doppler — the
storefront and backend cannot share a single env file because they deploy
to different hosts.

| Backend var              | Storefront var             | What it gates                                                                                                                                                                        |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_REVALIDATE_SECRET` | `SANITY_REVALIDATE_SECRET` | The `?secret=…` query the backend's `hurc-sanity-bridge` sends to the storefront's `/api/revalidate` and `/api/draft`. **Must match byte-for-byte.**                                 |
| `COMPANY_*` (×7)         | `COMPANY_*` (×7)           | Impressum block and DSGVO email footer. Both apps must read the same legal-entity values; drift would surface a different Impressum on the storefront vs. order-confirmation emails. |

If they drift, Sanity webhook revalidations 401 silently and editors
can't enable draft mode. The `/api/revalidate` route logs a warning on
401 with a hint.

## Phase 8 — Impressum + DSGVO

The seven `COMPANY_*` keys (above) are wired into both apps' `src/env.ts`
schemas as **optional in dev/staging, required in production**. Dev and
staging boot with placeholder values from the `.env.example` files so
the Impressum block renders without crashing while the legal entity is
still pre-incorporation. **Production fails the build if any of the
seven are missing** (see `apps/storefront/src/env.ts:Schema.superRefine`
and `apps/backend/src/env.ts`).

The values flow through to:

- `apps/storefront/src/lib/legal/company.ts` — surfaces them on
  `/legal/imprint`.
- `apps/backend/src/email-templates/_compliance-footer.tsx` — renders
  the Impressum block in every transactional email.

## Phase 9 — Rate limit storage

The `/api/gdpr/{export,delete}` proxies use a sliding-window rate
limiter at `apps/storefront/src/lib/gdpr/rate-limit.ts`. Two backing
stores:

- **Upstash KV** when both `KV_REST_API_URL` and `KV_REST_API_TOKEN` are
  set. The Upstash adapter survives cold starts and horizontal scaling —
  this is the production path. The KV instance can be provisioned via
  Vercel's Marketplace integration; the env vars are auto-injected when
  the integration is bound.
- **In-memory `Map`** fallback when either var is missing. Acceptable
  in dev/CI/test because the limit is defence-in-depth (the backend's
  own controllers carry the hard authorisation checks). Resets on cold
  start; not safe for production.

Production launch checklist (Phase 10): provision a Vercel KV instance,
bind it to the storefront, verify both env vars are injected via Doppler.

## Pre-launch legal checklist

Before the production tag (Phase 10):

1. **Lawyer review** of `/legal/{imprint,terms,privacy,cookies,withdrawal}`
   static body copy (`apps/storefront/src/lib/legal/content/*.tsx`). The
   placeholder copy authored at scaffold time is **not legally adequate**.
2. **Professional translations** of the five legal pages into
   `de`, `fr`, `nl`, `es`, `it`. The `<TranslationNotice>` strip
   visibly disclaims non-English routes today.
3. **Withdrawal-form PDF** — currently inlined at `/legal/withdrawal`
   (ADR-0009 D1). If the legal entity wants a downloadable form, regenerate
   from the same source string.
4. **Vercel KV instance** provisioned and `KV_REST_API_URL`/`KV_REST_API_TOKEN`
   in Doppler `prd` (Phase 9 swap).
5. **`COMPANY_*` × 7** populated with the real legal-entity values in
   Doppler `prd`. Production env validation refuses to boot otherwise.

## Adding a variable

1. Add the key + description here, in the right table.
2. Add a Zod field in the relevant `src/env.ts`.
3. Add a placeholder line in `apps/<app>/.env.example`.
4. Add it to the Doppler project under all three configs.
5. Reference it in code only via `env.X`, never `process.env.X` directly.
