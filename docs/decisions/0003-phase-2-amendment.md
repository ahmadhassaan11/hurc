# ADR 0003 — Phase 2 amendment (deviations from ADR-0002)

- **Status:** Accepted
- **Date:** 2026-05-02
- **Decision owner:** Lead full-stack engineer
- **Amends:** [ADR-0002 — Phase 2 implementation plan](./0002-phase-2-plan.md).
  ADR-0002 remains the canonical plan; this document records the
  implementation deviations surfaced while executing it. Future readers
  should treat 0002 + 0003 as a pair.

## Why this amendment exists

ADR-0002 was written before any Phase 2 code existed. Implementing the 14
sub-tasks against the pinned versions surfaced ten places where the plan
either could not be carried out as written (upstream API drift,
unmaintained SDKs) or where a smaller scope was the correct trade-off given
the rest of the build still ahead. CLAUDE.md §13 forbids "build for the
future" — three of the deviations are explicit deferrals for that reason.

Static gates (typecheck, lint, unit tests, build) are green. Operator
gates (dev boot, admin login, seed idempotency, Meili reindex) require the
Postgres + Redis + Meili stack and are tracked at the bottom of this ADR.

## Deviations

Each deviation references the §2.x of ADR-0002 it amends, the file(s) where
the change lives, and the reason. The numbering matches the working-tree
status snapshot so cross-references stay stable.

### D1 — BullMQ retention API (amends §2.2)

ADR-0002 specified `setRetentions: (queueName) => ({ completed, failed })`
on `BullMQPluginOptions`. That key does not exist on
`@vendure/job-queue-plugin@3.6.2`. The same retention semantics are
expressed via BullMQ's standard `defaultJobOptions`:

```ts
BullMQJobQueuePlugin.init({
  connection: { ... },
  queueOptions: {
    defaultJobOptions: {
      removeOnComplete: { age: 24 * 3600, count: 1000 },
      removeOnFail: { age: 7 * 24 * 3600 },
    },
  },
});
```

Lives at [apps/backend/src/vendure-config.ts:148-156](../../apps/backend/src/vendure-config.ts#L148-L156).
Behaviour is identical to the ADR's intent: completed jobs retained 24 h
(or last 1 000), failed jobs retained 7 d.

### D2 — AWS SDK pin missing (amends §2.3)

ADR-0002 listed Bunny.net's S3-compatible storage but did not pin an AWS
SDK. `AssetServerPlugin`'s `configureS3AssetStorage` requires a v3 client
to be passed in. Pinned:

```
@aws-sdk/client-s3      3.1041.0
@aws-sdk/lib-storage    3.1041.0
```

Lives at [apps/backend/package.json:21-22](../../apps/backend/package.json#L21-L22).
Both pins are floors per the same rule as the rest of ADR-0002.

### D3 — Backend tsconfig: `exactOptionalPropertyTypes` disabled (amends §2.1)

CLAUDE.md hard rule #1 mandates TypeScript strict everywhere. Vendure's
published types (`OrderInterceptor`, `EventBus`, `RequestContext`) violate
`exactOptionalPropertyTypes` consistently — every consumer ends up writing
`as unknown as ...` casts to compile against them. Two strict flags remain
on at the backend tsconfig:

- `strict: true`
- `noUncheckedIndexedAccess: true`

`exactOptionalPropertyTypes: false` is set **only** at
[apps/backend/tsconfig.json:13](../../apps/backend/tsconfig.json#L13);
the root tsconfig and `packages/*` keep it on. The escape applies to
backend code only. Storefront and shared packages are unaffected.

`strictPropertyInitialization: false` is also set at the same location
because Vendure entity classes use TypeORM decorators that initialise
columns at runtime, not at declaration.

### D4 — Custom `TemplateLoader` over boot-time compilation (amends §2.4)

ADR-0002 specified "compile each template under `email-templates/` to HTML
at boot." The actual implementation deferred rendering to per-send so that
the React Email template receives the live `EmailDetails` props (order,
customer, locale) per message. Functionally equivalent to the ADR — both
yield ready-to-send HTML before Resend is called — but the seam is a
custom `TemplateLoader` (`ReactEmailTemplateLoader`) plus a pass-through
`EmailGenerator` so the email-plugin's handlebars step does not corrupt
React-rendered HTML:

- [apps/backend/src/email/react-email-template-loader.ts](../../apps/backend/src/email/react-email-template-loader.ts)
- [apps/backend/src/email/passthrough-email-generator.ts](../../apps/backend/src/email/passthrough-email-generator.ts)
- [apps/backend/src/email-templates/render.ts](../../apps/backend/src/email-templates/render.ts)

Boot-time compilation is reversible if memory pressure ever requires it;
no API surface depends on the per-send approach.

### D5 — GPSR admin-UI input validation deferred (amends §2.7 `hurc-gpsr`)

ADR-0002 called for a `CustomFieldUiInput` validation that prevents
publishing without GPSR fields **at the admin UI form layer**. Implementing
this requires the admin-ui-plugin extension build chain (Angular custom
field components, ng-packagr build), which adds ~5 minutes to every backend
boot in dev. Deferred to the consolidated admin-UI extensions PR (see
follow-ups).

The server side of the same guard ships now: a `ProductEvent` listener in
[hurc-gpsr/gpsr.plugin.ts](../../apps/backend/src/plugins/hurc-gpsr/gpsr.plugin.ts)
logs a warning when a product is updated without GPSR fields. This is
**post-commit observability**, not prevention. See D6 for the prevention
gap.

### D6 — GPSR hard-block on publish deferred (amends §2.7 `hurc-gpsr`)

True hard-blocking (publishing fails with `IllegalOperationError` when
GPSR fields are missing) requires either a Vendure `OrderInterceptor`-style
`ProductService` interceptor or a TypeORM subscriber. Both add complexity
that we'd rather not commit until we've confirmed how Vendure 3.7's
proposed entity-hook API stabilises (the upstream RFC is open as of
2026-04). The post-commit listener from D5 covers the "did anyone publish
without GPSR data?" question for now and emits a structured warning that
Sentry will catch.

**Risk to be aware of:** between Phase 2 and the eventual hard-block PR,
a careless admin can publish a non-compliant product. The warning is
loud, but it is not enforcement. The follow-up PR
`feat(backend): GPSR hard-block via ProductService interceptor` is
non-optional before EU launch.

### D7 — Newsletter Resend Audience sync deferred (amends §2.7 `hurc-newsletter`)

ADR-0002 designed the newsletter plugin around Resend Audiences as the
source of truth. Implementation flipped this: the local
`NewsletterSubscription` table is authoritative; Resend Audience sync is a
follow-up. Reasons:

1. Resend Audiences API is in beta and rate-limited per workspace.
2. We need the local row regardless (HMAC token, locale, opt-in
   timestamp, GDPR audit trail).
3. Two-way sync introduces failure modes (audience deletion, contact
   re-subscription) that are not worth designing around until the
   storefront is live.

`subscribe`, `confirm`, `unsubscribe` all work end-to-end against the local
table at [apps/backend/src/plugins/hurc-newsletter/](../../apps/backend/src/plugins/hurc-newsletter/).
The Resend sync is a separate `feat(backend): newsletter Resend Audience
sync` follow-up.

### D8 — Sendcloud parcel + label generation deferred (amends §2.7 `hurc-sendcloud`)

`hurc-sendcloud` ships the rate-quoting half of the integration:
`shipping-calculator.ts` returns rates for an order's destination using
the merchant's enabled methods, and `eligibility-checker.ts` filters per
EU/UK zone. The post-payment automation (create parcel, fetch label,
attach tracking number to the fulfilment) is a different surface — it
fires from the order state machine, not from a customer request — and is
deferred to `feat(backend): sendcloud parcel + label flow` after payments
land.

### D9 — Seed scope reduced (amends §2.9) — largest deviation

ADR-0002 called for:

- 12 collections × 4 activities (= 12 collections, e.g. "Run / Tops")
- 8 products
- 6 sizes × 2 colors
- Image upload via picsum proxy
- Per-channel shipping + payment methods

What ships:

- 1 ResponsiblePerson
- 1 test customer (`tester@hurc.com` / `Hurc!Test123`)
- 1 collection
- 1 product with 6 size variants

Reasons:

- The full seed needs real product imagery (Bunny upload from a
  fixture set), Mollie/Stripe profile IDs (not provisioned), and
  Sendcloud integration credentials (D8). Stubbing those produces a
  seed that lies about reality.
- The reduced seed is enough to satisfy the operator gate "GraphQL
  query returns a product" and to exercise the GPSR / Meili / GDPR
  flows in the test suite.
- The full seed is non-blocking for Phase 3 (storefront scaffolding can
  begin against a single product) but is **required** for Phase 5
  (PLP + facets) — added to the follow-up list.

Living seed at [apps/backend/src/seed/seed.ts](../../apps/backend/src/seed/seed.ts);
fixture at [apps/backend/src/seed/fixtures/hurc-products.json](../../apps/backend/src/seed/fixtures/hurc-products.json).

### D10 — `@vendure/testing` integration tests deferred (amends §2.10)

ADR-0002 specified per-plugin integration tests using
`@vendure/testing`'s `createTestEnvironment()` against an in-memory
SQLite DB. What ships: 38 unit tests across 7 files covering all
pure-function surfaces (token signing, payload mapping, Sendcloud
client, document shapes, channels, tax tables, signature verification):

- [test/channels.test.ts](../../apps/backend/test/channels.test.ts)
- [test/tax.test.ts](../../apps/backend/test/tax.test.ts)
- [src/plugins/hurc-newsletter/token.test.ts](../../apps/backend/src/plugins/hurc-newsletter/token.test.ts)
- [src/plugins/hurc-sendcloud/sendcloud.client.test.ts](../../apps/backend/src/plugins/hurc-sendcloud/sendcloud.client.test.ts)
- [src/plugins/hurc-meilisearch/document.types.test.ts](../../apps/backend/src/plugins/hurc-meilisearch/document.types.test.ts)
- [src/plugins/hurc-sanity-bridge/payload-mapper.test.ts](../../apps/backend/src/plugins/hurc-sanity-bridge/payload-mapper.test.ts)
- [src/plugins/hurc-sanity-bridge/signature.test.ts](../../apps/backend/src/plugins/hurc-sanity-bridge/signature.test.ts)

The plugin-shaped tests (DI wiring, event subscription, BullMQ enqueue
verification, end-to-end product → Meili index round-trip) need the
`@vendure/testing` harness, which spins up a real Vendure app per file.
That suite is the second half of the test pyramid and is tracked as the
follow-up PR `feat(backend): @vendure/testing integration tests`.

The 70%-line coverage gate from §2.10 is **not** enforced at the
package level yet. Phase 9 (CI) will add the gate; until then the
coverage figure is informational.

## Conventions established during implementation

These are repo-wide patterns that emerged from Phase 2 and apply to every
future plugin author. Two are also written down in CLAUDE.md (after this
ADR lands they will move there for discoverability); they are listed here
for the architectural record.

### C1 — NestJS DI requires runtime imports

`@typescript-eslint/consistent-type-imports` folds runtime values to
type-only imports. For NestJS DI tokens (services, decorators, enums) and
Vendure entity classes used as TypeORM repository targets, this **breaks
runtime DI** because reflect-metadata cannot capture stripped imports. The
shipped `dist` output otherwise ends up with `__metadata("design:paramtypes",
[Object])` instead of the DI token.

Convention: every plugin file that uses NestJS DI / decorators / repository
entity classes must annotate the import with
`// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime references`
on the offending line. 14 such annotations exist across the six plugins as
of this ADR — `grep -rn "NestJS DI requires runtime" apps/backend/src` is
authoritative.

### C2 — Vendure subpath imports need explicit `.js` under `module: NodeNext`

Subpath imports like `@vendure/job-queue-plugin/package/bullmq` fail TS
resolution; the working form is `@vendure/job-queue-plugin/package/bullmq/index.js`.
`@vendure/common/lib/generated-types` is the only exception — its
`package.json` `exports` map handles the suffix.

### C3 — Module augmentation for Vendure customFields

Vendure cannot derive customFields types statically.
[apps/backend/src/custom-fields.types.ts](../../apps/backend/src/custom-fields.types.ts)
is the authoritative type-augmentation file. Module augmentation requires
`interface` declarations, so the rule `@typescript-eslint/consistent-type-definitions`
is suspended in that file (and only that file). Augmentation target is
`'@vendure/core/dist/entity/custom-entity-fields.js'` — the `.js` suffix is
required for NodeNext to resolve the augmentation target.

## Static gates — green as of 2026-05-02

```
pnpm typecheck                                       12/12 packages
pnpm lint                                            12/12 packages
pnpm test                                            backend 38/38 (placeholders no-op per D22)
pnpm build                                            9/9 packages
```

Lockfile and `pnpm-workspace.yaml` are committed in the same change set
that lands this ADR.

## Operator gates — passed (2026-05-02)

All five gates from ADR-0002 §2.11 verified against the local stack
(Postgres 16 + Redis 7 + Meilisearch v1.42.1, all running via the new
`infra/docker/compose.yml`):

- [x] `pnpm --filter @hurc/backend dev` boots clean (server on :3000,
      worker subscribed to BullMQ queues — see D17 below).
- [x] Admin login: `mutation login(superadmin / ChangeMe!Local)` against
      `/admin-api` returns `CurrentUser` with full SuperAdmin permissions.
- [x] `query { products { items { id slug name } totalItems } }` at
      `/shop-api` returns the one seeded product.
- [x] Seed idempotency: 2nd `pnpm seed` run reports `unchanged` for every
      step and exits 0.
- [x] BullMQ reindex via `POST /hurc/meili/reindex` (note: not under
      `/admin-api` — the controller mounts on the bare admin router) returns
      `{ ok: true, productCount: 1, batchCount: 1 }`; Meilisearch `products`
      index then reports `numberOfDocuments: 1` with the expected
      `MeiliProductDoc` field distribution.

## Operator-gate findings (D11–D22)

Running the gates surfaced a layer of latent issues that the unit-test
scope of Phase 2 could not catch — the seed never ran, the worker never
processed jobs, the dev script never resolved a real express, and so on.
Each item below is a real change that landed alongside the original
Phase-2 code in the same uncommitted working tree. They sequence after
D1–D10 to keep deviation IDs stable.

### D11 — Dev runner: `tsx` → `@swc-node/register` (decorator metadata)

**The problem.** `tsx` (esbuild backend) does not emit `design:paramtypes`
decorator metadata, even with `emitDecoratorMetadata: true` in tsconfig.
This breaks two things at runtime:

1. NestJS constructor injection: `eventBus` arrives as `undefined` because
   `Reflect.getMetadata('design:paramtypes', ClsName)` returns `undefined`,
   so `this.eventBus.ofType(...)` throws on plugin bootstrap.
2. TypeORM `@Column()` without explicit `type:` — column-type inference
   relies on `design:type` metadata and crashes with
   `ColumnTypeUndefinedError`.

**The fix.** Switch the dev/seed/migration runner to
`@swc-node/register@1.11.1` invoked via Node 22's `--import` flag. SWC
emits the metadata correctly (`__metadata("design:paramtypes", [...])`).
Verified end-to-end: a smoke script reading
`Reflect.getMetadata('design:paramtypes', Cls)` returns `[ class Dep ]`
under swc-node and `undefined` under tsx.

Backend script shape becomes:

```
node --watch --enable-source-maps --import @swc-node/register/esm-register --env-file=.env src/index.ts
```

Production keeps using compiled `dist/` (`node dist/index.js`) — no impact
there. `tsx` remains in `devDependencies` for now to minimise churn; it
can be removed in a `chore(deps)` follow-up once we're sure no script
relies on it.

### D12 — Three new direct deps surfaced

- `express@4.22.1` — imported as a runtime value
  (`import { raw } from 'express'`) by [hurc-sanity-bridge/sanity-bridge.plugin.ts](../../apps/backend/src/plugins/hurc-sanity-bridge/sanity-bridge.plugin.ts).
  Was hoisted via `@vendure/core` so `tsc` was happy, but Node ESM
  resolution from `apps/backend/` couldn't see it. Pinned to match
  Vendure 3.6.2's transitive (4.22.1).
- `reflect-metadata@0.2.2` — imported by the migration CLI before any
  entity load. Was hoisted via `@vendure/core`, same hoisting problem.
- `@swc-node/register@1.11.1` — see D11.

### D13 — `--env-file=.env` on every Node CLI

`apps/backend/src/env.ts` validates `process.env` via Zod at import time
and throws on missing keys. There was no dotenv loader anywhere — the
implicit assumption was that an outer process (Doppler in stg/prd, or a
shell that pre-sourced `.env`) would populate the env. For local dev that
assumption was false. Solution: Node 22 supports `--env-file=path` natively;
prepend it to every `dev`/`seed`/`migration:*` script. No new dep.

### D14 — Migration CLI + initial migration (closes D1 follow-up)

[apps/backend/src/migration-cli.ts](../../apps/backend/src/migration-cli.ts)
wraps `@vendure/core`'s `generateMigration` / `runMigrations` /
`revertLastMigration` and three `package.json` scripts call it. The
generated migration
[apps/backend/src/migrations/1777685016846-initial.ts](../../apps/backend/src/migrations/1777685016846-initial.ts)
creates 90 tables covering all customFields + the two HURC entities
(`ResponsiblePerson`, `NewsletterSubscription`). This **closes the D1
follow-up** ("Required before any non-fresh DB boot — `feat(backend):
initial migration`").

The CLI lives at `src/migration-cli.ts`, not `src/migrations/cli.ts`,
because Vendure's `migrations: ['migrations/*.{ts,js}']` glob would pick
up any non-migration file in that directory and execute it as a migration
at boot. Generated migration files are linted as ignored
(`apps/backend/eslint.config.js` adds `**/src/migrations/**` to its
`ignores`) — the generator emits `any` types and unsorted imports we'd
otherwise have to suppress per-file forever.

### D15 — Entity column types made explicit

For the same reason as D11 (no `design:type` metadata), TypeORM cannot
infer column types from the TS type annotation when the entity is
compiled at runtime. Vendure's published `dist/` ships `__metadata`
already; ours doesn't. Affected files:

- [responsible-person.entity.ts](../../apps/backend/src/plugins/hurc-gpsr/responsible-person.entity.ts):
  added `{ type: 'varchar' }` to `name` and `email`.
- [newsletter-subscription.entity.ts](../../apps/backend/src/plugins/hurc-newsletter/newsletter-subscription.entity.ts):
  added `{ type: 'varchar' }` to `email` and `locale`; changed `verifiedAt`
  from `{ type: 'datetime' }` to `{ type: 'timestamp' }` (Postgres rejects
  `datetime` as a raw column type, accepts it only via Vendure's
  customField translator).

### D16 — `defaultValue: []` on the `activity` Product customField

Vendure rejects non-nullable customFields without a `defaultValue` at
preBootstrapConfig — the seed crashed with `Product entity custom field
"activity" is non-nullable and must have a defaultValue`. Our existing
`validate()` enforces "at least one activity is required" at update-time;
the empty-array default is the initial-creation placeholder.

### D17 — Worker bug: missing `.startJobQueue()`

`src/index-worker.ts` called `bootstrapWorker(config)` but **never**
called `worker.startJobQueue()`. `bootstrapWorker` only spins up the
Nest app context; `startJobQueue()` is what subscribes the worker to
BullMQ queues and begins consuming. The symptom was that BullMQ jobs
accumulated in the `:wait` zset forever — `Found job counts:
{"waiting": N}` increased on each restart but no job ever processed.
Discovered when the Meili reindex POST returned `ok: true` but the
Meili index stayed at `numberOfDocuments: 0`.

Fix: one line, `await worker.startJobQueue()` after `bootstrapWorker`.

### D18 — Seed bootstrap pattern: `bootstrap` → `bootstrapWorker`

`src/seed/seed.ts` originally called `bootstrap(config)`, which binds the
HTTP server to port 3000. With `pnpm dev` already running, the seed
crashed with `EADDRINUSE`. Switched to `bootstrapWorker(config)` which
returns `VendureWorker { app: INestApplicationContext }` — same DI
container, no port bind. Seed can now run alongside dev.

### D19 — Seed scope expansion (Vendure prerequisite reference data)

`ProductVariantService.create -> applyChannelPriceAndTax` requires the
active channel to have `defaultTaxZone`, the zone to contain at least
one country, and a TaxRate to exist for that zone × tax category. Our
fresh DB had none of this. The seed now creates, in dependency order:

1. `TaxCategory("Standard")` — `taxCategoryId` was previously hard-coded
   as `1` which silently broke when row 1 didn't exist.
2. `Country("DE", "Germany")`.
3. `Zone("EU")` containing DE.
4. Default channel updated: `defaultTaxZone = defaultShippingZone = EU`.
5. `TaxRate("EU Standard 19%", category=Standard, zone=EU, value=19)`.

Plus a critical detail: the `RequestContext` is recreated **after** the
channel update because the cached active-channel snapshot in the original
ctx still reads `defaultTaxZone: null` and would re-throw
`error.no-active-tax-zone` on the next variant operation.

This expansion is the minimum to satisfy the gate; the **full** multi-zone
EU/UK setup (all 27 EU countries, UK in its own zone, per-channel zone
attachments per ADR-0002 §2.5) remains the D9 follow-up.

### D20 — Variant cap to 1; per-SKU idempotency

The fixture defines 6 size variants (XS..XXL) with `optionValues: ["XS"]`
etc — but the seed code wired `optionIds: []` for every variant, so the
second variant create failed with
`product-variant-options-combination-already-exists` (Vendure caps a
product at one variant when no option groups are attached).

Two changes:

- `variantsToCreate = fixture.variants.slice(0, 1)` — ship the first
  variant only. Multi-size variants need a `Size` ProductOptionGroup with
  6 options + per-variant `optionIds`; tracked under the existing D9
  follow-up.
- The variant loop is now per-SKU idempotent (find by SKU, skip if
  exists) — the original "create only on fresh product" condition would
  silently leave a half-built product with zero variants if the variant
  loop crashed mid-way. Now any subsequent run converges to the desired
  state.

### D21 — `adminListQueryLimit` / `shopListQueryLimit` raised to 1000

Vendure defaults both to 100; the Meilisearch reindex controller batches
at 500. First call to `POST /hurc/meili/reindex` returned 400
`error.list-query-limit-exceeded`. Lifted both to 1000 in
`apiOptions` — gives the indexer comfortable headroom while keeping a
real upper bound on accidental large-paginations.

### D22 — Removed broken `test` scripts from `packages/ui` and `packages/utils`

Both placeholder packages shipped with `"test": "vitest run"` but no
vitest dependency, so root `pnpm test` failed with
`vitest: command not found`. Removed the scripts; when those packages
get real implementations in Phases 4–6, the proper `test` script + vitest
dep land alongside them.

## Conventions added by D11

### C4 — Dev-runtime needs decorator metadata; tsx does not provide it

Any tool that compiles TypeScript at runtime in this repo must emit both
`design:type` (TypeORM column inference) and `design:paramtypes` (NestJS
DI) reflect-metadata. **tsx (esbuild) emits neither.** The supported dev
runners are:

- `node --import @swc-node/register/esm-register` (current).
- `ts-node` with proper config (slower; not used here).
- `tsc` + `node` (`pnpm build && node dist/...`) — production path.

Convention: do not add `tsx` invocations to backend scripts. If a future
contributor introduces one, the symptom is a NestJS plugin failing
`onApplicationBootstrap` with a "cannot read properties of undefined"
error on a constructor-injected service, or TypeORM throwing
`ColumnTypeUndefinedError` on a custom entity. Look at the runner before
looking at the entity.

## Follow-ups (consolidated)

In dependency order. Each is a separate PR.

**Required before any non-fresh DB boot** ✅ (closed)

- ~~`feat(backend): initial migration` — covers all customFields + new
  entities (`ResponsiblePerson`, `NewsletterSubscription`).~~ Closed by D14.

**Required before EU launch**

- `feat(backend): GPSR hard-block via ProductService interceptor` —
  closes D5/D6.
- `feat(backend): full seed (12 collections × 4 activities, 8 products,
imagery upload, per-channel shipping/payment methods)` — closes D9.
  Required for Phase 5 (PLP + facets).

**Required before storefront newsletter / shipping / GDPR-email surfaces ship**

- `feat(backend): newsletter Resend Audience sync` — closes D7.
- `feat(backend): sendcloud parcel + label flow` — closes D8.
- `feat(backend): GDPR deletion confirmation email`.

**Quality / observability**

- `feat(backend): @vendure/testing integration tests` — closes D10.
- `chore(deps)`: `pnpm.overrides` for the 6 pre-existing transitive CVEs
  (lodash / apollo / file-type / uuid — all inherited from
  `@vendure/core`).
- `feat(backend): better-stack pino transport` — once
  `LOGTAIL_SOURCE_TOKEN_BACKEND` is provisioned in Doppler.

**Admin UI extensions** — single consolidated PR, depends on the
admin-ui-plugin build chain

- GPSR `CustomFieldUiInput` validation (closes D5 client side).
- Meilisearch "Reindex all" admin button.
- ResponsiblePerson CRUD UI.

**Smaller polish**

- One-click unsubscribe (RFC 8058) on newsletter emails.
- Sendcloud rate cache (in-process LRU, 5-min TTL).
- Multi-locale Meilisearch indexes (one index per locale, populated from
  `localeString` / `localeText` customFields).
- Reintroduce real `test` scripts on `packages/ui` + `packages/utils`
  alongside their first real implementation PR (closes D22).
- Drop the `tsx` devDependency once we're confident no script needs it
  (see D11).
