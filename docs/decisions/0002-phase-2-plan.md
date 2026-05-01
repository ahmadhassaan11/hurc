# ADR 0002 — Phase 2 implementation plan (Vendure backend)

- **Status:** Accepted (planning only — no code yet)
- **Date:** 2026-05-01
- **Decision owner:** Lead full-stack engineer
- **Supersedes:** Section "Phase 2 — Vendure backend" of the build spec, which
  this document refines into executable sub-tasks.

## Why this plan exists

Phase 2 in the spec is one bullet list. In practice it is a 3–5 day workload
spanning Vendure scaffolding, six plugins (one stock + five custom), three
sales channels with full EU VAT zones, payments + shipping integrations,
seeds, and Vitest integration tests for every plugin. A flat list invites
rework. This ADR pins versions, fixes the file layout, lists every test, and
calls out two real risks (Sendcloud package absence; `@vendure/payments-plugin`
version skew).

## Verified version pins (as of 2026-05-01)

```
@vendure/core                  3.6.2
@vendure/admin-ui-plugin       3.6.2
@vendure/asset-server-plugin   3.6.2
@vendure/email-plugin          3.6.2
@vendure/job-queue-plugin      3.6.2
@vendure/payments-plugin       3.5.6   ← one minor behind core; see Risk R1
@vendure/testing               3.6.2
@vendure/create                3.6.2

bullmq                         5.76.4
ioredis                        5.10.1   (peer of @vendure/core)
meilisearch                    0.58.0   (JS client; server runs v1.x)
resend                         6.12.2
@react-email/components        1.0.12
@react-email/render            2.0.8
pg                             8.20.0
typeorm                        0.3.28
graphql                        16.13.2
zod                            4.4.1
pino                          10.3.1
pino-pretty                   13.1.3
@mollie/api-client             4.5.0
stripe                        22.1.0

@graphql-codegen/cli                  7.0.0  (used in Phase 3, but install now to keep lockfile stable)
@graphql-codegen/client-preset        6.0.0
```

All pins are the **floor**. CI's lockfile is the contract; any bump is an ADR.
Re-verify with `pnpm view <pkg> version` before installing — the spec is a
hard rule.

## Risks called out before code

- **R1 — `@vendure/payments-plugin` is at 3.5.6 while core is 3.6.2.** Vendure
  publishes `core` and the satellite plugins independently; minor skew is
  normal. Action: lock both via `pnpm install` and run the integration tests
  for the Mollie / Stripe handlers before committing. If the plugin throws on
  a `core` symbol drift, pin core to 3.5.x temporarily and open an upstream
  issue in `vendure-ecommerce/vendure`.
- **R2 — No official `@sendcloud/api` npm package.** Sendcloud's JS SDK is
  unmaintained / not published. We integrate via direct REST against
  `https://panel.sendcloud.sc/api/v2/` from a custom Vendure
  `ShippingCalculator` + `ShippingEligibilityChecker`. Credentials live in
  `SENDCLOUD_PUBLIC_KEY` / `SENDCLOUD_SECRET_KEY` env vars (already named in
  the spec). The plan below includes this as a sixth custom plugin
  (`hurc-sendcloud`) — the spec did not enumerate it explicitly; this is a
  documented deviation.
- **R3 — Mollie's Klarna availability is country-specific.** PDP "or 3
  payments of €X" line must check `eligiblePaymentMethods` per-country before
  rendering; cannot be a static template.
- **R4 — Bunny.net Storage Zone S3 endpoint format.** Endpoint is
  `https://<region>.storage.bunnycdn.com` (region key like `storage`, `de`,
  `ny`, `la`, `sg`, `syd`). The S3 access key is a separate "FTP & API
  password" inside the Storage Zone settings, **not** the account API key.
  Surface this in `infra/env.reference.md` so future ops do not confuse them.

## File layout (final, after Phase 2)

```
apps/backend/
├── src/
│   ├── vendure-config.ts           # Single source of truth — exports VendureConfig
│   ├── index.ts                    # bootstrap('server')
│   ├── index-worker.ts             # bootstrapWorker()
│   ├── env.ts                      # zod-validated process.env loader
│   ├── logger.ts                   # pino → Better Stack transport
│   ├── channels.ts                 # Channel + Zone seed data
│   ├── tax.ts                      # EU + UK VAT rate table
│   ├── plugins/
│   │   ├── hurc-meilisearch/
│   │   │   ├── index.ts
│   │   │   ├── meilisearch.plugin.ts
│   │   │   ├── meilisearch.service.ts
│   │   │   ├── indexer.handler.ts          # BullMQ job handler
│   │   │   ├── reindex-button.controller.ts
│   │   │   ├── document.types.ts           # MeiliProductDoc shape
│   │   │   └── meilisearch.plugin.test.ts
│   │   ├── hurc-gpsr/
│   │   │   ├── gpsr.plugin.ts              # CustomFields registration + admin validation
│   │   │   ├── responsible-person.entity.ts
│   │   │   └── gpsr.plugin.test.ts
│   │   ├── hurc-gdpr/
│   │   │   ├── gdpr.plugin.ts
│   │   │   ├── gdpr.controller.ts          # POST /gdpr/export, POST /gdpr/delete
│   │   │   ├── export.service.ts
│   │   │   ├── delete.service.ts
│   │   │   └── gdpr.plugin.test.ts
│   │   ├── hurc-newsletter/
│   │   │   ├── newsletter.plugin.ts
│   │   │   ├── newsletter.service.ts       # Resend audiences + double-opt-in
│   │   │   ├── newsletter.controller.ts    # confirmation token endpoint
│   │   │   └── newsletter.plugin.test.ts
│   │   ├── hurc-sanity-bridge/
│   │   │   ├── sanity-bridge.plugin.ts
│   │   │   ├── webhook.controller.ts       # HMAC-verified Sanity webhook receiver
│   │   │   ├── revalidate.service.ts       # signed call to Next.js /api/revalidate
│   │   │   └── sanity-bridge.plugin.test.ts
│   │   └── hurc-sendcloud/                 # ← deviation (R2)
│   │       ├── sendcloud.plugin.ts
│   │       ├── sendcloud.client.ts
│   │       ├── shipping-calculator.ts
│   │       ├── eligibility-checker.ts
│   │       └── sendcloud.plugin.test.ts
│   ├── email-templates/
│   │   ├── order-confirmation.tsx
│   │   ├── order-shipped.tsx
│   │   ├── password-reset.tsx
│   │   ├── welcome.tsx
│   │   ├── newsletter-confirm.tsx
│   │   └── render.ts               # react-email → HTML for Resend EmailSender
│   ├── migrations/
│   │   └── 1714560000000-initial.ts
│   └── seed/
│       ├── seed.ts                 # Entrypoint: pnpm seed
│       ├── products.ts
│       ├── collections.ts
│       └── fixtures/
│           └── hurc-products.json
├── static/
│   ├── email/                      # static partials (logo, CSS)
│   └── admin-ui/                   # branded admin assets
├── test/
│   ├── env.test.ts
│   ├── tax.test.ts
│   └── helpers.ts                  # Vendure @vendure/testing harness
├── Dockerfile                      # multi-stage; node:22-bookworm-slim base
├── tsconfig.json
└── package.json
```

## Sub-task plan

### 2.1 Scaffold + boot

1. `cd apps/backend && pnpm create vendure@3.6.2 . --skip-install --use-npm-init=false` —
   then **port** the generated files into the existing tsconfig + package.json
   shape (do **not** let the generator overwrite them).
2. Replace generated `index.ts` and `vendure-config.ts` with the HURC versions
   from this plan. Keep `index-worker.ts` as generated (it's standard).
3. Wire `apps/backend/src/env.ts` with Zod, throwing on boot if any required
   key is missing. Required keys are listed in §6 of the spec.
4. Logger: pino with redaction of `cookie`, `authorization`, `email` by
   default. In dev, pipe through `pino-pretty`. In prod, ship to Better Stack
   via the HTTP transport.

**Boot gate:** `pnpm --filter @hurc/backend dev` starts both the server (port 3000) and worker, admin UI loads at `/admin`, GraphQL playground responds at
`/shop-api`.

### 2.2 Job queue (BullMQ via Redis)

Replace `DefaultJobQueuePlugin` with `BullMQJobQueuePlugin`:

```ts
BullMQJobQueuePlugin.init({
  connection: { host: env.REDIS_HOST, port: env.REDIS_PORT, password: env.REDIS_PASSWORD },
  setRetentions: (queueName) => ({
    completed: { age: 24 * 3600, count: 1000 },
    failed: { age: 7 * 24 * 3600 },
  }),
});
```

Smoke test: enqueue a no-op job in the plugin test, assert it runs, assert
the failed-job handler can replay it via `pnpm replay <queue> <jobId>`.

### 2.3 Asset storage (Bunny.net via S3)

`AssetServerPlugin.init({ storageStrategyFactory: configureS3AssetStorage(...) })`
with:

- `endpoint: env.ASSET_BUNNY_S3_ENDPOINT` (region host, see R4)
- `forcePathStyle: true`
- `region: 'auto'` (Bunny ignores it)
- public-read bucket
- `assetUrlPrefix: env.ASSET_PUBLIC_URL_PREFIX` (Pull Zone host)

Test: upload a 1×1 PNG via the asset endpoint, fetch the resulting public
URL through the Pull Zone, assert HTTP 200 + correct `content-type`.

### 2.4 Email (Resend + react-email)

Custom `EmailSender` implementing the `@vendure/email-plugin` interface:

- Compile each template under `email-templates/` to HTML at boot using
  `@react-email/render`'s `render(<Template {...props} />)`.
- Send via `new Resend(env.RESEND_API_KEY).emails.send({ ... })`.
- Fail loud (throw) on Resend errors so BullMQ retries the job.

Templates (all bilingual EN/DE for Phase 2; FR/NL/ES/IT placeholder copy):

- order-confirmation
- order-shipped
- password-reset
- welcome (post-account-creation)
- newsletter-confirm (double-opt-in link)

### 2.5 Channels, zones, tax

Channels: `default` (admin-only, EUR), `eu` (EUR), `uk` (GBP).

Zones (EU channel) — VAT rates, **standard rate** (locked into
`apps/backend/src/tax.ts`):

| Country     | ISO | Rate  |
| ----------- | --- | ----- |
| Germany     | DE  | 19%   |
| France      | FR  | 20%   |
| Netherlands | NL  | 21%   |
| Belgium     | BE  | 21%   |
| Spain       | ES  | 21%   |
| Italy       | IT  | 22%   |
| Austria     | AT  | 20%   |
| Ireland     | IE  | 23%   |
| Portugal    | PT  | 23%   |
| Finland     | FI  | 25.5% |
| Denmark     | DK  | 25%   |
| Sweden      | SE  | 25%   |
| Poland      | PL  | 23%   |
| Czechia     | CZ  | 21%   |
| Greece      | GR  | 24%   |
| Hungary     | HU  | 27%   |
| Slovakia    | SK  | 23%   |
| Slovenia    | SI  | 22%   |
| Estonia     | EE  | 24%   |
| Latvia      | LV  | 21%   |
| Lithuania   | LT  | 21%   |
| Luxembourg  | LU  | 17%   |
| Bulgaria    | BG  | 20%   |
| Romania     | RO  | 21%   |
| Croatia     | HR  | 25%   |
| Cyprus      | CY  | 19%   |
| Malta       | MT  | 18%   |

UK channel: VAT 20% (single zone).

> Source: EU Commission VAT rates table, retrieved 2026-05-01. The values
> above are the **standard** rates; reduced rates (groceries, books) are
> not relevant to activewear and are intentionally not modeled. Re-verify
> against the Commission table at the start of every fiscal year.

### 2.6 Custom fields (HURC-specific)

On `Product`:

- `activity`: `string` array — values `RUN`, `TRAIN`, `LIFT`, `REST`. Min 1.
- `materialComposition`: `localeString`.
- `careInstructions`: `localeText`.
- `sustainabilityNotes`: `localeText`.

On `Customer`:

- `marketingOptIn`: `boolean`, default false.
- `marketingOptInAt`: `datetime`, nullable.
- `preferredActivity`: `string`, nullable.

`hurc-gpsr` adds (also on `Product`):

- `responsiblePerson`: relation to `ResponsiblePerson` entity (name,
  address, email).
- `manufacturerInfo`: `localeText`.
- `warnings`: `localeText`.
- `traceabilityCode`: `string`.

### 2.7 Plugins — concrete API + tests

#### `hurc-meilisearch`

Subscribes to `ProductEvent`, `ProductVariantEvent`, `StockMovementEvent`. On
each event, enqueues a BullMQ job onto the `hurc-meili-index` queue. Job
handler upserts/deletes from a Meilisearch index named `products`.

Document shape (`MeiliProductDoc`):

```ts
{ id: string; sku: string; name: string; slug: string; description: string;
  price: number /* minor units */; currency: string;
  activity: ('RUN'|'TRAIN'|'LIFT'|'REST')[]; collections: string[];
  facets: Record<string, string | string[]>; inStock: boolean }
```

Admin UI: a "Reindex all" button (Vendure custom UI extension) posting to
`POST /admin-api/hurc/meili/reindex`. Reindex job iterates all products in
batches of 200.

Tests (`@vendure/testing`):

- creating a product → index doc upsert observed.
- updating variant price → reindexed price.
- soft-deleting a product → doc removed.
- `reindex` admin call enqueues N jobs where N = `ceil(products / 200)`.

#### `hurc-gpsr`

Custom fields (above) + admin UI validation: a product cannot transition to
"published" if `responsiblePerson`, `manufacturerInfo`, or `traceabilityCode`
are missing. Implemented via a Vendure `CustomFieldUiInput` validation
function and a server-side guard in a `ProductEvent` listener.

Tests:

- attempting to publish without GPSR data → `IllegalOperationError`.
- providing all GPSR fields → publish succeeds.
- traceability code uniqueness across all products (warn-only).

#### `hurc-gdpr`

REST controllers (mounted on the admin-api router for authenticated customer
self-service):

- `POST /gdpr/export` → returns a ZIP of `customer.json`, `orders.json`,
  `addresses.json`. Uses `archiver` to stream.
- `POST /gdpr/delete` → soft-delete: PII (email, name, addresses, phone)
  scrubbed; orders retained for the legally mandated retention window
  (Germany: 10 years for tax records). Sends a confirmation email.

Both endpoints require an authenticated session (the customer's own data
only).

Tests:

- export ZIP contains all three files, well-formed JSON.
- delete scrubs PII but keeps order audit row.
- unauthenticated call → 401.
- attempting to act on another customer's data → 403.

#### `hurc-newsletter`

Service wrapping Resend Audiences:

- `subscribe(email, locale)` — creates an unverified contact, sends a
  confirmation email with HMAC-signed token.
- `confirm(token)` — verifies signature, promotes the contact to verified,
  sets `marketingOptInAt` on the matching `Customer` if one exists.
- `unsubscribe(email)` — removes the contact.

Tests:

- subscribe enqueues a confirmation email job and stores a pending row.
- confirm with valid token marks the contact verified.
- confirm with tampered token → 400.
- unsubscribe removes both pending and verified contacts.

#### `hurc-sanity-bridge`

`POST /webhooks/sanity` — verifies the `sanity-webhook-signature` header
(HMAC-SHA256 over the raw body using `SANITY_WEBHOOK_SECRET`), then maps the
event payload to one or more revalidation tags, and calls
`POST {STOREFRONT_URL}/api/revalidate?secret=...` with the tag list.

Tests:

- signature verification: tampered body → 401.
- mapping: a `journalPost` mutation triggers tag `journal:{slug}`.
- revalidate call retries on 5xx with exponential backoff (max 3).

#### `hurc-sendcloud` (deviation R2)

- `sendcloud.client.ts` — typed wrapper around the v2 REST API
  (`/shipping_methods`, `/parcels`, `/labels`).
- `shipping-calculator.ts` — returns rates for an order's destination using
  the merchant account's enabled methods.
- `eligibility-checker.ts` — filters methods per zone (EU vs UK).

Tests (mocked HTTP via MSW):

- rate calculation for DE order returns expected DHL methods.
- UK order returns Royal Mail / DHL Express.
- 5xx Sendcloud → `Result.err('SHIPPING_PROVIDER_UNAVAILABLE')` with retry
  metadata; never throws to the customer.

### 2.8 Payments

- `MolliePlugin` from `@vendure/payments-plugin`, configured per-channel:
  `eu` channel uses EUR-denominated profile; `uk` uses GBP profile.
- `StripePlugin` as fallback for both channels (cards only).
- Webhook receivers wired to BullMQ for state-machine transitions; do not
  block the HTTP response on long-running work.

Tests:

- placing an order through the test Mollie API → `PaymentSettled` after
  webhook → order moves to `PaymentSettled`.
- Stripe Elements payment intent flow → same outcome.
- webhook retried twice, second call should be idempotent.

### 2.9 Seeds

`pnpm --filter @hurc/backend seed` — idempotent. Creates:

- 1 admin user from env (`SUPERADMIN_USERNAME` / `SUPERADMIN_PASSWORD`).
- 1 test customer `tester@hurc.com` / `Hurc!Test123`.
- Channels and zones from §2.5.
- 12 collections: 3 per activity (RUN, TRAIN, LIFT, REST) — e.g.
  "Run / Tops", "Run / Bottoms", "Run / Outerwear".
- 8 products, each with 5 sizes (XS, S, M, L, XL, XXL — that's six, ship
  six) × 2 colors. Real photography placeholder via Bunny pull from
  `https://picsum.photos` proxied at seed time and uploaded to the
  Storage Zone.
- Shipping methods: standard (Sendcloud DHL) + express, in EU and UK zones.
- Payment methods: Mollie (EU + UK) + Stripe (both channels, fallback).

Re-running `pnpm seed` must be a no-op (uses upsert by sku/slug).

### 2.10 Tests

- Vitest workspace at `apps/backend/vitest.config.ts`.
- Each plugin file `*.plugin.test.ts` uses `@vendure/testing`'s
  `createTestEnvironment()` against an in-memory SQLite DB.
- Mocked external services: Resend (MSW), Mollie (MSW), Sendcloud (MSW),
  Sanity (MSW signed-webhook fixture).
- Coverage target for `apps/backend/src`: 70% lines (lower than `packages/*`
  because Vendure decorators inflate uncovered AST). Coverage gate enforced
  in Phase 9.

### 2.11 Phase 2 gate

- [ ] `pnpm --filter @hurc/backend dev` boots clean.
- [ ] Admin UI loads, login with seeded superadmin succeeds.
- [ ] GraphQL playground responds at `/shop-api`; `query { products { items { id } } }`
      returns seeded products.
- [ ] `pnpm --filter @hurc/backend seed` is idempotent (run twice, second
      run is a no-op).
- [ ] BullMQ reindex job succeeds; `products` Meilisearch index has all
      seeded products.
- [ ] `pnpm test --filter @hurc/backend` green for all six plugins.
- [ ] `pnpm typecheck` and `pnpm lint` green at root.
- [ ] Tag commit `phase-2-complete`.

## Order of operations (one PR each, in this order)

1. `feat(backend): scaffold vendure 3.6 with env + logger`
2. `feat(backend): channels, zones, tax tables`
3. `feat(backend): bullmq job queue + asset server (bunny s3)`
4. `feat(backend): resend email sender + react-email templates`
5. `feat(backend): hurc-gpsr plugin`
6. `feat(backend): hurc-meilisearch plugin`
7. `feat(backend): hurc-gdpr plugin`
8. `feat(backend): hurc-newsletter plugin`
9. `feat(backend): hurc-sanity-bridge plugin`
10. `feat(backend): hurc-sendcloud shipping plugin`
11. `feat(backend): mollie + stripe payment plugins`
12. `feat(backend): seed script + fixtures`
13. `feat(backend): vitest harness + plugin tests`
14. `chore(backend): phase-2-complete tag`

Each PR is small enough for a focused review and small enough to be reverted
without unwinding plugin state.

## Open follow-ups (after Phase 2)

- `infra/env.reference.md` — assemble once Phase 2 has settled the final
  env-var list (it will surface a few we did not anticipate, e.g. Mollie
  `profileId` per-channel).
- Vendure Admin UI branding (logo, favicon, primary color) — deferred to
  the design-system phase; until then ship the default Vendure UI.
- Replay tooling: `pnpm replay <queue> <jobId>` script — listed in the
  Runbook but actual code lands alongside Phase 10 (CI/CD).
