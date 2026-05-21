# ADR 0010 — Phase 9 implementation plan (Testing & quality)

- **Status:** Proposed
- **Date:** 2026-05-03
- **Decision owner:** Lead full-stack engineer
- **Supersedes:** Phase plan item 9 of [ADR-0001](./0001-stack.md), refined into
  seven executable sub-phases.
- **Depends on:**
  - Phase 4 (Sentry init, env validation, structured logger).
  - Phase 5 (`@hurc/ui` test rig with `vitest-axe` 0.1.0 already wired).
  - Phase 6 (commerce flows — checkout step 3 with `<ConsentCheckbox>` lives
    here; account/data exposes the GDPR self-service surface).
  - Phase 7 (Sanity overlay; `/legal/[slug]` dispatcher).
  - Phase 8 (compliance surface — four `tests/e2e/*.spec.ts` scaffolds, the
    `<KlaroBridge>`, the in-memory rate limiter at `lib/gdpr/rate-limit.ts`,
    the seven `COMPANY_*` env keys). Phase 9 activates the e2e scaffolds,
    swaps the rate-limiter store for durable KV, completes the env doc pass
    deferred per ADR-0009 D2, and wires Lighthouse CI.

## Why this plan exists

Phase 9 is the **quality gate** that turns the eight stacked feature phases
from "passes locally on a machine with the right env" into "passes in CI on
a clean checkout, every PR, every push to main." The previous phases have
been internally rigorous — full self-review blocks, gate-green at every
sub-phase boundary, 387+ unit tests across nine packages — but five quality
contracts in [CLAUDE.md §7](../../CLAUDE.md) and the umbrella ADR-0001
remain unproved end-to-end:

1. **Playwright is unbuilt.** Phase 8 shipped four `tests/e2e/*.spec.ts`
   files, marked them out of `tsc` via `tsconfig.json:exclude`, and stamped
   them "activated in Phase 9." The `@playwright/test` runner, the
   `@axe-core/playwright` integration, the config, the fixtures (signed-in
   customer, seeded cart), the browser-install step — all unbuilt.
2. **Visual regression is unbuilt.** CLAUDE.md §7.1 names seven surfaces
   that take Playwright snapshot baselines: home hero, PLP card, PDP, cart
   drawer, checkout step 1, plus Phase 8's consent modal and `/legal/imprint`.
   No baseline images exist.
3. **axe scans run only in `vitest-axe`** for `@hurc/ui` primitives in
   isolation. The route-level axe scan that ADR-0009 §8.5 promised
   ("axe-clean on `/`, `/products/[slug]`, `/checkout/payment`,
   `/legal/imprint`, `/legal/privacy`, `/legal/cookies`,
   `/legal/withdrawal`, `/account/data`") is contingent on Playwright.
4. **Lighthouse CI is undefined.** No `lighthouserc.json`. The LCP ≤ 2.0s /
   INP ≤ 200ms / CLS ≤ 0.05 budgets in CLAUDE.md §7.1 are unmeasured; the
   "consent modal interaction" budget addition that ADR-0009 §8.5 called
   out is undefined.
5. **CI workflow is empty.** `.github/workflows/` is bare bar `CODEOWNERS`
   and a `pull_request_template.md`. No PR workflow runs typecheck, lint,
   unit, integration, e2e, axe, or Lighthouse. Eight phases of feature work
   are protected only by the developer's local discipline.

Three smaller items piggyback on this phase:

6. **`/api/gdpr/*` rate limit is in-memory.** ADR-0009 R9 committed to a
   durable store in Phase 9. Vercel serverless functions reset per cold
   start — the in-memory limiter has been "good enough" through Phase 8 as
   a defence-in-depth measure but does not survive a horizontally scaled
   deployment.
7. **`infra/env.reference.md` Phase 8 keys are undocumented.** ADR-0009 D2
   tracked the seven `COMPANY_*` keys as wired-but-undocumented; Phase 9
   completes the operator handoff.
8. **Vitest coverage thresholds need verification across packages.** The
   storefront, backend, and `@hurc/ui` configs each declare thresholds;
   `@hurc/graphql` has no thresholds; `@hurc/utils` ships zero source.
   Phase 9 audits the matrix and confirms the floors hold.

If Phase 9 is shipped as one bullet ("install Playwright"), we miss six
other contracts. This ADR splits it into seven sub-phases, each independently
shippable, each ending gate-green.

## Decision summary

1. **Sub-phase split:**
   - **9.1 Playwright runner + axe wiring** — install
     `@playwright/test` + `@axe-core/playwright` into the storefront, scaffold
     `playwright.config.ts`, write `tests/e2e/fixtures/` (signed-in customer,
     seeded cart, axe builder), write `tests/e2e/global-setup.ts` (boot the
     Next dev server / use built `next start`), remove `tests/e2e/**` from
     `apps/storefront/tsconfig.json:exclude`, activate the four scaffolds,
     wire `pnpm test:e2e` to `playwright test`, document the local-vs-CI
     run shape in `tests/e2e/README.md`. Browser binaries: chromium-only
     for the default suite (cost); the `visual` label suite uses all three.
   - **9.2 Visual regression baselines** — a sister suite at
     `tests/e2e/visual/` that takes Playwright snapshots of the seven
     surfaces named in CLAUDE.md §7.1 plus ADR-0009's consent modal and
     `/legal/imprint`. **Snapshots run only when a `visual` PR label is
     attached** to keep image-diff CI cost down (decision per open question
     2 — see "Open questions" below). Local baselines are committed; CI
     either matches or fails. The Klaro modal is screenshotted with a
     hard-coded `--allow-pre-rendered-banner` flag so re-prompt animation
     does not poison the diff.
   - **9.3 Lighthouse CI + budgets** — `lighthouserc.json` at repo root,
     budget assertions per CLAUDE.md §7.1 (LCP ≤ 2.0s, INP ≤ 200ms,
     CLS ≤ 0.05), per-route assertion arrays for `/`, `/[locale]`,
     `/[locale]/products/[slug]`, `/[locale]/checkout/payment`,
     `/[locale]/legal/imprint`. The "consent modal interaction" budget
     (ADR-0009 §8.5) is encoded as a `total-byte-weight` cap of `+30 KB
gzip` on `/[locale]` — the LH user-flow API is not stable enough to
     run reliably in CI on every PR. Local target: `pnpm --filter
storefront start` against a fresh `next build`. CI target: a Vercel
     preview deployment URL (when one exists; the workflow degrades to
     local-built `next start` when the preview URL is absent — important
     because the CI environment is not assumed to have a Vercel preview
     bound on the first PR before deployments are linked).
   - **9.4 Vitest coverage thresholds** — audit and harden the existing
     thresholds. Storefront 80/80/70/80 (verified), backend 70/70/60/70
     (verified, decorator AST already excluded), `@hurc/ui` 80/80/70/80
     (verified). `@hurc/graphql` keeps no thresholds (the package is a
     codegen sink — running coverage on generated `.graphql` consumers is
     vacuous). `@hurc/utils` is exempt because the package currently
     ships zero source; the threshold rule is encoded as a
     `vitest.config.ts:thresholds` block that comes online the moment the
     package gains a source file. Add `@vitest/coverage-v8` as a devDep
     where missing (storefront has it via vitest 4.x, backend has it
     explicit, `@hurc/ui` has it transitively). A `pnpm test:coverage`
     script at root runs `turbo run test -- --coverage` for the on-demand
     CI lane.
   - **9.5 Vercel KV-backed rate limit** — swap `lib/gdpr/rate-limit.ts`'s
     `STORE` from a `Map` to a thin Upstash adapter
     (`@upstash/ratelimit@2.0.8` + `@upstash/redis@1.37.0`). Library
     choice is **Upstash, not `@vercel/kv` directly** — ADR-0009 R9
     called out Vercel KV, but the modern Vercel-native KV is Upstash
     under the hood and Upstash exposes a deterministic, serverless-safe
     rate-limit primitive (sliding window). When `KV_REST_API_URL` /
     `KV_REST_API_TOKEN` are unset (dev, CI without secrets), the
     adapter falls back to the existing in-memory `Map` so the unit
     tests continue to pass without provisioning external infra. The
     three exported functions (`rateLimit`, `hashSessionKey`,
     `_resetRateLimitStore`) keep their signatures; one becomes async.
     The `/api/gdpr/{export,delete}/route.ts` callers are updated to
     `await` it.
   - **9.6 env.reference.md doc pass** — section "Phase 8 — Impressum &
     DSGVO" added with all seven `COMPANY_*` keys (purpose, scope,
     example, prod-only requirement). Phase 9's KV pair
     (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) gets a "Phase 9 — Rate
     limit storage" section with the dev-fallback note. Launch
     checklist note added: legal copy must clear lawyer review before
     production.
   - **9.7 CI workflow** — `.github/workflows/ci.yml` runs on every PR
     and push to main. Five jobs in dependency order:
     `setup` (Node 22, pnpm 11, cache `~/.pnpm-store`, `pnpm install
--frozen-lockfile`), `quality` (`pnpm typecheck && pnpm lint`),
     `unit` (`pnpm test` — runs vitest across all 11 packages with
     coverage), `e2e` (boots backend stub via Vendure testing, runs
     `pnpm --filter storefront test:e2e --project=chromium`,
     uploads `playwright-report/` on failure), `lighthouse`
     (only on `lhci` PR label or push to main; runs against `next start`
     via `@lhci/cli@0.15.1`). `visual` job is its own workflow file
     (`visual.yml`) gated on the `visual` label.
     Concurrency group: `${{ github.workflow }}-${{ github.ref }}`,
     cancel-in-progress for non-main branches.

2. **Library choices.**

   | Concern              | Library                                 | Version pinned     |
   | -------------------- | --------------------------------------- | ------------------ |
   | E2E runner           | `@playwright/test`                      | `1.59.1`           |
   | E2E axe scan         | `@axe-core/playwright`                  | `4.11.3`           |
   | Lighthouse CI        | `@lhci/cli`                             | `0.15.1`           |
   | Coverage provider    | `@vitest/coverage-v8`                   | `4.1.5`            |
   | Rate limit (durable) | `@upstash/ratelimit` + `@upstash/redis` | `2.0.8` + `1.37.0` |

   No other deps added. The fixtures, the global-setup, the lighthouserc
   assertion shape, and the CI workflow are repo-local.

3. **Playwright location — `apps/storefront/tests/e2e`, not a new
   `packages/e2e` workspace.** The four scaffolds already live at
   `apps/storefront/tests/e2e/`. The e2e suite is intrinsically coupled
   to the storefront's URL space, locale routing, and seeded fixtures —
   a separate workspace would buy nothing except an extra layer of
   `pnpm-workspace.yaml` plumbing and a duplicated TypeScript config.
   The Playwright runner can target the same storefront workspace
   without ambiguity. (Open question 1 resolved.)

4. **Visual snapshots — label-gated, not every PR.** Image-diff CI is
   the cardinal source of flakiness in modern frontend test suites:
   font loading races, sub-pixel rasterization differences across
   runner generations, animation timing. Running snapshots on every
   PR has a high false-positive rate that erodes trust in the suite.
   Phase 9 adds a separate workflow (`visual.yml`) that runs **only
   when a PR carries the `visual` label**. The default PR experience:
   no snapshot job. Touching a primitive in `@hurc/ui` or a layout
   component triggers the engineer to attach the label; on landing,
   the workflow either matches or generates a comment with the diff
   image artifacts. Baselines live in `apps/storefront/tests/e2e/visual/__snapshots__/`
   and are committed. (Open question 2 resolved.)

5. **Lighthouse target — built-and-served locally, with Vercel preview
   as future-mode.** The local-dev workflow is `pnpm --filter
storefront build && pnpm --filter storefront start -p 3100`,
   then Lighthouse hits `http://localhost:3100`. CI runs the same
   shape inside the runner. When deploys land in Phase 10 and Vercel
   preview URLs exist, the `lighthouse.yml` workflow gains a
   `LHCI_BUILD_TARGET=preview` branch that uses the deployment URL
   instead. We don't depend on a preview being available _now_ —
   the launch sequence puts CI/CD in Phase 10. (Open question 3
   resolved.)

6. **Phase 4 live-smoke routine — out of scope; remains a separate
   ops cadence.** Phase 4's status memory mentioned a 2026-05-10
   live-smoke. That routine is a deploy-time check, not a test rig
   activity. Phase 9 builds the test rig that _would_ run inside the
   smoke; the smoke routine itself stays scheduled as-is. (Open
   question 4 resolved.)

7. **E2E fixture strategy — three modes, escalating cost.** The four
   scaffolded specs vary in their setup cost:
   - **No fixture** (`legal-pages.spec.ts`, `consent-flow.spec.ts`):
     anonymous browsing, just `page.goto`. These run on every PR.
   - **Cart-only fixture** (`checkout-consent.spec.ts`): a non-empty
     cart at `/checkout/payment`. Implemented as a
     `tests/e2e/fixtures/cart.ts` that hits the Vendure `addItemToOrder`
     mutation against the dev backend and returns the cookie payload
     for the test browser context to adopt. Requires the backend
     running.
   - **Signed-in customer** (`gdpr-self-service.spec.ts`): a customer
     created and verified via `tests/e2e/fixtures/customer.ts` that
     calls the Vendure shop-api `registerCustomerAccount` +
     `verifyCustomerAccount` flow. Requires the backend running.
     Skipped in PR-default CI (no live backend); runs in a nightly
     workflow against staging or a `pnpm --filter backend dev` run.

   In Phase 9, the **default CI lane runs only the fixture-free pair**
   plus a runtime-skip annotation on the cart and customer specs (a
   `test.skip(!isBackendReachable(), 'requires live backend')` guard).
   Bringing the cart/customer specs online live in CI is a Phase 10
   concern (deploys, ephemeral envs). The scaffolds themselves remain
   green via the skip guard.

8. **Klaro modal in CI — render guarantee, not race condition.** The
   `consent-flow.spec.ts` scaffold checks `page.locator('.klaro')` is
   visible. Klaro is dynamic-imported and mounts after the React
   hydration tick. Phase 9 adds an explicit
   `await page.waitForSelector('.klaro', { state: 'visible',
timeout: 5000 })` to the entry of every consent-flow test, with a
   custom `expect.poll` for the version-bump cookie write. Without
   that, the test would race the lazy chunk and fail intermittently
   in CI. (R1 mitigation.)

9. **Coverage CI shape — single `pnpm test:coverage`, run on demand.**
   Running `--coverage` on every unit test in PR CI inflates run
   time by ~40% on the storefront (Vitest spawns the V8 reporter even
   on cached runs). Phase 9 wires `pnpm test:coverage` as a separate
   `coverage` job that runs on push-to-main and on a `coverage` PR
   label, not on every PR. The threshold floors live in each
   package's `vitest.config.ts` and fail the local run if
   crossed — the CI lane is a _reporter_, not the _enforcer_.

10. **Backend e2e harness — out of scope for Phase 9; Vendure's own
    `@vendure/testing` suffices for plugin tests.** Phase 8 added
    `gpsr-violation-store.test.ts` as a unit test against the
    `GpsrViolationStore` class without touching Vendure's
    integration runtime. That pattern continues. The full
    `@vendure/testing` integration harness (Postgres-backed,
    boots a sub-process) is deferred to Phase 10's deploy-prep —
    the contracts it would test (admin routes, custom-field
    enforcement) are best validated against a deployed
    environment, not a CI-spun one.

11. **Coverage exclusions — vacuous packages and codegen artifacts.**
    `@hurc/utils` ships no source; coverage is N/A until source
    exists. `@hurc/graphql` keeps no thresholds (it owns generated
    code under `src/admin/generated/**` and `src/shop/generated/**`,
    which are excluded; the only hand-written file `src/scalars.ts`
    is covered by a single targeted test). The storefront's
    `src/lib/sanity/**` is excluded because the queries are
    integration-test territory (live Sanity), not unit. The backend
    excludes `index.ts`, `index-worker.ts`, `vendure-config.ts`,
    `custom-fields.types.ts`, `email-templates/**`, and `seed/**`
    (all bootstrap / type-augmentation / template surfaces).
    Decorator AST inflation in plugin classes justifies the 70%
    floor (vs. 80% packages/\*).

12. **CI runner — `ubuntu-24.04`, Node 22 (per `.nvmrc`), pnpm 11.
    Browsers cached.** Playwright browser installs are slow
    (~90s for chromium on a clean runner). The workflow caches
    `~/.cache/ms-playwright` keyed on the Playwright version pin
    so re-installs only happen on a Playwright bump. The `setup`
    job emits the Playwright version as an output for downstream
    jobs to key the cache.

## Verified version pins (as of 2026-05-03 via `pnpm view`)

```
@playwright/test          1.59.1   (Apache-2.0; published 2026-05-03)
@axe-core/playwright      4.11.3   (MPL-2.0;    published 2026-04-30)
@lhci/cli                 0.15.1   (Apache-2.0; published 2025-06-25 — last LH 0.x release; LH 12 is the current major and 0.15.1 supports it)
@vitest/coverage-v8       4.1.5    (matches vitest pin already in tree)
@upstash/ratelimit        2.0.8    (MIT;        published 2026-05-03)
@upstash/redis            1.37.0   (MIT;        published 2026-05-03)
```

Re-verify with `pnpm view <pkg> version` immediately before
`pnpm install` per CLAUDE.md hard rule #10.

## Risks called out before code

- **R1 — Klaro hydration race in CI.** The Klaro chunk is dynamic-imported;
  on a slow CI runner the modal can paint after the test asserts. Mitigation:
  `page.waitForSelector('.klaro', { state: 'visible', timeout: 5000 })` at
  the top of each consent-flow test; the version-bump test additionally
  uses `expect.poll` on the cookie value rather than a single read.
- **R2 — Browser-binary cost in CI.** Three browsers × ~150 MB each on a
  clean runner is ~7 minutes of install time. Mitigation: cache
  `~/.cache/ms-playwright` keyed on the Playwright version; chromium-only
  for the default lane; the visual lane installs all three. Verified
  cache key shape against Playwright's published cache layout.
- **R3 — Visual snapshot flakiness.** Font subpixel rendering, animation
  timing, prefers-reduced-motion drift. Mitigations stacked: (a)
  `prefers-reduced-motion: reduce` in the test browser context; (b)
  `--threshold=0.02` (2% pixel tolerance) on the snapshot comparator;
  (c) `await page.evaluate(() => document.fonts.ready)` before every
  screenshot; (d) hard-coded viewport at 1280×720; (e) `mask` selectors
  for the date/time and order-number elements that render with
  always-changing content. The visual lane is opt-in (label-gated)
  precisely because flakiness is real and needs human triage.
- **R4 — Lighthouse INP brittleness.** INP is a real-user metric; the
  Lighthouse-emulated INP is `total-blocking-time`-derived and can wobble
  ±50ms on a noisy CI runner. Mitigation: budget set at INP ≤ 200ms
  but the assertion mode is `warn` not `error` in the PR lane; `error`
  on push-to-main only. LCP and CLS stay `error` everywhere because
  they are deterministic.
- **R5 — Coverage on un-tested packages.** `@hurc/utils` has zero
  source; running coverage emits a 0/0 vacuous result. Mitigation:
  no `vitest.config.ts` in `@hurc/utils` (it has no `test` script);
  the coverage job filters out packages that opt out by absence of
  `test` script. `@hurc/graphql` keeps a minimal coverage block
  scoped only to `src/scalars.ts` so the threshold floor is meaningful.
- **R6 — Vercel KV credentials missing in dev.** Mitigation: the
  Upstash adapter inspects `process.env.KV_REST_API_URL`; when undefined
  it returns a no-op `false`-rate-limiter equivalent (every request
  passes — defence-in-depth degrades, but availability does not).
  All seven existing rate-limit unit tests pass against the in-memory
  fallback by virtue of the env var being absent in the test env.
- **R7 — Cart and customer fixtures depend on a live backend.**
  Mitigation: a `tests/e2e/fixtures/backend.ts` exposes
  `isBackendReachable()` (15-second TCP probe to
  `VENDURE_SHOP_API_URL_INTERNAL`); `checkout-consent.spec.ts` and
  `gdpr-self-service.spec.ts` open with `test.skip(!await
isBackendReachable(), 'requires live backend')`. Default-PR CI does
  not run a live backend, so these specs skip cleanly. A nightly
  workflow that targets staging (Phase 10) flips them on.
- **R8 — Browsers not installed on dev machines.** Mitigation: an
  `apps/storefront/tests/e2e/README.md` post-install hook documents
  `pnpm exec playwright install chromium`. The `pnpm test:e2e` script
  exits with a clear message when the binaries are missing, instead
  of crashing inside the runner.
- **R9 — Klaro `.klaro` selector changes upstream.** A Klaro version
  bump could change the wrapper class. Mitigation: the version is
  pinned at `0.7.21` in `apps/storefront/package.json` (Phase 8) and
  the consent-flow specs depend on this contract. A pinned-version
  upgrade is a code review touch-point.
- **R10 — `lhci` against a not-yet-built bundle.** Mitigation: the
  Lighthouse job `needs: build` and the build artifact is downloaded
  before `lhci collect` runs. The local-dev `pnpm lhci:check` script
  builds first, then runs Lighthouse, then tears down.
- **R11 — `@upstash/ratelimit` async signature breaks the in-memory
  unit test.** Mitigation: the new export wraps both paths in an
  async function; the existing tests are updated to `await rateLimit(...)`.
  Six lines of test churn, all in one file.
- **R12 — Coverage thresholds break on CI without `--coverage` on
  every package.** Mitigation: each package's `vitest.config.ts`
  thresholds only fire when `--coverage` is passed. PR CI runs
  `pnpm test` without coverage; the `coverage` lane runs `pnpm
test:coverage` which invokes `--coverage` and trips the floors.
  The thresholds therefore protect the coverage lane but do not
  bottleneck PR CI.
- **R13 — Sentry DSN required in production.** Phase 4 already
  validated this. Phase 9's CI sets `NEXT_PUBLIC_SENTRY_DSN=<dummy>`
  - `LOGTAIL_SOURCE_TOKEN_STOREFRONT=<dummy>` for the e2e build so
    the production-mode env superRefine does not fail in CI; this is
    documented as the canonical CI env in
    `.github/workflows/ci.yml:env`.

## File layout (additions for Phase 9)

```
.github/
└── workflows/
    ├── ci.yml                                   # NEW: typecheck/lint/unit/e2e on every PR
    ├── lighthouse.yml                           # NEW: lhci on push-to-main + label
    └── visual.yml                               # NEW: snapshot suite on `visual` label

apps/storefront/
├── package.json                                 # + @playwright/test, @axe-core/playwright,
│                                                #   @upstash/ratelimit, @upstash/redis;
│                                                #   `test:e2e` becomes real
├── playwright.config.ts                         # NEW
├── tsconfig.json                                # MODIFIED: remove `tests/e2e/**` from exclude
├── tests/
│   └── e2e/
│       ├── README.md                            # MODIFIED: install + run docs
│       ├── fixtures/
│       │   ├── backend.ts                       # NEW: isBackendReachable
│       │   ├── cart.ts                          # NEW: seeded cart fixture
│       │   ├── customer.ts                      # NEW: signed-in customer fixture
│       │   └── reduce-motion.ts                 # NEW: prefers-reduced-motion override
│       ├── global-setup.ts                      # NEW: env probe + chromium binary check
│       ├── consent-flow.spec.ts                 # MODIFIED: Klaro waitForSelector + poll
│       ├── checkout-consent.spec.ts             # MODIFIED: cart fixture skip-guard
│       ├── gdpr-self-service.spec.ts            # MODIFIED: customer fixture skip-guard
│       ├── legal-pages.spec.ts                  # MODIFIED: scoped axe builder
│       └── visual/
│           ├── home-hero.spec.ts                # NEW
│           ├── plp-card.spec.ts                 # NEW
│           ├── pdp.spec.ts                      # NEW
│           ├── cart-drawer.spec.ts              # NEW
│           ├── checkout-step1.spec.ts           # NEW
│           ├── consent-modal.spec.ts            # NEW
│           ├── legal-imprint.spec.ts            # NEW
│           └── __snapshots__/                   # generated baselines, committed
└── src/
    ├── lib/
    │   └── gdpr/
    │       └── rate-limit.ts                    # MODIFIED: Upstash adapter + in-memory fallback
    └── app/
        └── api/
            └── gdpr/
                ├── export/route.ts              # MODIFIED: await rateLimit
                └── delete/route.ts              # MODIFIED: await rateLimit

apps/backend/
└── (no changes)

infra/
└── env.reference.md                             # MODIFIED: + COMPANY_*, + KV_*, +
                                                 #   launch-checklist (lawyer review)

lighthouserc.json                                # NEW (repo root)
package.json                                     # + test:coverage, + lhci:check, + e2e:install

docs/
├── decisions/
│   └── 0010-phase-9-plan.md                     # this file
└── backlog.md                                   # + visual baselines refresh cadence,
                                                 #   + KV provisioning task for Phase 10
```

## Sub-phase acceptance gates

Each sub-phase ends with **all four root gates green** (`pnpm typecheck`,
`pnpm lint`, `pnpm test`, `pnpm build`) plus the sub-phase-specific contract:

- **9.1 Playwright runner** — `pnpm --filter storefront test:e2e` runs the
  four specs; the two anonymous-browse specs pass (consent-flow, legal-pages),
  the two backend-dependent specs `test.skip()` cleanly when the backend
  probe fails. `tsconfig.json` no longer excludes `tests/e2e/**`. CI workflow
  skeleton boots Playwright successfully (PR-mode, chromium-only). The
  legal-pages spec axe scan returns zero violations on /en/legal/imprint
  (the only locale-without-overlay route guaranteed to render at this
  sub-phase boundary; full SLUGS×LOCALES matrix is gated on the live
  backend).
- **9.2 Visual regression baselines** — seven new specs each generate a
  baseline image under `__snapshots__/`; `pnpm --filter storefront
test:e2e -- --grep visual` passes against the committed baselines. The
  visual workflow runs only on `visual`-labeled PRs.
- **9.3 Lighthouse CI** — `pnpm lhci:check` runs locally and produces an
  HTML report; `lighthouserc.json` asserts LCP/INP/CLS budgets. The
  workflow runs `lhci collect && lhci assert` against `next start`. PR
  lane uses `assert.warn`; main lane uses `assert.error` per R4.
- **9.4 Vitest coverage thresholds** — `pnpm test:coverage` runs across
  storefront/backend/`@hurc/ui` with thresholds enforced; the run
  short-circuits any package that drops below the floors. `@hurc/graphql`
  emits a coverage report scoped to `src/scalars.ts` only.
- **9.5 Vercel KV-backed rate limit** — `gdpr-rate-limit.test.ts` passes
  unchanged (with `await` added at three call sites). With `KV_REST_API_URL`
  set, the limiter delegates to Upstash; without it, the limiter falls
  through to the in-memory `Map`. Both `/api/gdpr/{export,delete}` routes
  build and respond correctly.
- **9.6 env.reference.md doc pass** — the seven `COMPANY_*` keys appear
  in the Storefront and Backend tables with notes; the two `KV_REST_API_*`
  keys appear in a new "Rate limit storage" section; the launch-checklist
  pre-production task list mentions lawyer review of `/legal/*` static
  bodies.
- **9.7 CI workflow** — `.github/workflows/ci.yml` exists; pushed to a
  branch on a real GitHub remote it would run successfully (we cannot
  validate this without a remote, but the workflow yaml is `actionlint`-
  clean and the local `pnpm` invocations in each job match the scripts
  on the repo). `.github/workflows/lighthouse.yml` and `visual.yml`
  similarly clean. Concurrency group set; secrets surface only the
  ones required.

## Tagging plan

The user drives the `phase-9-complete` tag commit. Phase 9 stacks on the
still-uncommitted Phases 2+3+4+5+6+7+8 working tree on
`feat/phase-3-graphql-codegen`. Per CLAUDE.md hard rule #9 (no commits to
main) and the established cadence, each sub-phase remains uncommitted
until the user explicitly tags. The four root gates must be green at each
sub-phase boundary even pre-commit.

## Open follow-ups (after Phase 9)

- **Vercel KV provisioning** — the storefront app needs a real KV instance
  bound in Vercel (and `KV_REST_API_URL`/`KV_REST_API_TOKEN` injected via
  Doppler) before the production launch. Tracked in
  [docs/backlog.md](../backlog.md). Phase 10 ops.
- **Backend-live e2e lane** — `checkout-consent.spec.ts` and
  `gdpr-self-service.spec.ts` skip in default-PR CI; Phase 10 wires a
  staging-targeted nightly workflow that flips them on against a live
  Vendure deployment.
- **Lighthouse INP-mode escalation** — once a real-user `web-vitals`
  beacon lands (Phase 10) and we have field INP data, the synthetic
  Lighthouse INP `warn` can drop to `error` everywhere with confidence.
- **`@vendure/testing` integration suite** — deferred per decision 10;
  reconsidered in Phase 10 once the deploy harness exposes a Postgres
  fixture rig.
- **Visual baseline refresh cadence** — propose a quarterly refresh
  ritual (font upgrades, browser updates, Tailwind upgrades).
- **Lawyer review of /legal/\* static bodies** — pre-production blocker;
  unchanged from ADR-0009 follow-ups.
- **Professional translations of /legal/\* into de/fr/nl/es/it** —
  pre-production blocker; unchanged from ADR-0009 follow-ups.

---

_End of ADR-0010._
