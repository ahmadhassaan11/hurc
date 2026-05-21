# Storefront e2e suite (Playwright)

Phase 9.1 wired the runner. The suite covers compliance flows scaffolded
in Phase 8 plus the visual-regression lane added in Phase 9.2. Per
ADR-0010, default-PR CI runs only the chromium-only, fixture-free
specs; backend-dependent specs `test.skip()` cleanly without a live
backend, and the visual lane is gated behind the `visual` PR label.

## Local install

```bash
pnpm --filter @hurc/storefront test:e2e:install
```

This installs the chromium browser binary plus its OS deps. The visual
lane needs all three browsers — run `pnpm exec playwright install
chromium firefox webkit` from inside `apps/storefront/`.

## Run shape

```bash
# default — chromium-only, fixture-free + skip-guarded
pnpm --filter @hurc/storefront test:e2e

# visual lane — multi-browser, snapshots
pnpm --filter @hurc/storefront test:e2e:visual

# refresh visual baselines after an intentional UI change
pnpm --filter @hurc/storefront test:e2e:visual:update
```

The runner boots its own `next start` against `:3100` (configurable via
`PORT_E2E`). For an externally-running server (e.g. Vercel preview) set
`E2E_BASE_URL` and `E2E_NO_WEBSERVER=1`.

## Backend-dependent specs

`checkout-consent.spec.ts` and `gdpr-self-service.spec.ts` need a live
Vendure shop-api seeded with a product. The `global-setup` probes
`VENDURE_SHOP_API_URL_INTERNAL` and exposes the result via
`E2E_BACKEND_REACHABLE`; specs read it through
`fixtures/backend.ts:isBackendReachable()` and skip when unreachable.

To run them locally, start the backend in another terminal and run
the seed:

```bash
pnpm --filter @hurc/backend dev      # in shell #1
pnpm --filter @hurc/backend seed     # in shell #2 (one-shot)
pnpm --filter @hurc/storefront test:e2e
```

## Coverage

| Spec                        | Fixture                     | Run lane                                                 |
| --------------------------- | --------------------------- | -------------------------------------------------------- |
| `consent-flow.spec.ts`      | none                        | every PR                                                 |
| `legal-pages.spec.ts`       | none (en) / Sanity (others) | every PR (English subset); full matrix only with backend |
| `checkout-consent.spec.ts`  | seeded cart                 | nightly + label                                          |
| `gdpr-self-service.spec.ts` | signed-in customer          | nightly + label                                          |
| `visual/*.spec.ts`          | none                        | `visual` label                                           |

## Authoring rules

- Use `page.waitForSelector('.klaro', { state: 'visible', timeout: 5000 })`
  before any assertion that depends on the consent modal — the chunk
  is dynamic-imported and loses to React hydration on slow runners.
- `expect.poll` for cookie writes (Klaro mirrors decisions
  asynchronously into `hurc-consent`).
- Reduced-motion is forced on every browser context (see
  `playwright.config.ts:use.contextOptions.reducedMotion`); animation
  assertions belong in component-level Vitest, not e2e.
- The `mask` option of `toHaveScreenshot` should hide non-deterministic
  surfaces (timestamps, order numbers, generated SKUs) — see the
  visual specs for examples.
