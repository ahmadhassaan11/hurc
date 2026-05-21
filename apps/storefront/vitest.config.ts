import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // `server-only` throws synchronously when imported in a non-RSC bundle.
      // Vitest evaluates everything in Node, so we stub it.
      'server-only': resolve(__dirname, 'tests/stubs/server-only.ts'),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Coverage scope is the pure-logic surface unit-tested in tests/unit/.
      // DOM-bound, RSC-bound, and SDK-init surfaces are validated via Playwright
      // e2e (Phase 9.1) and are excluded here so the threshold remains honest:
      //   - analytics/  — third-party SDK init, exercised by consent e2e
      //   - logger/client.ts — Sentry breadcrumb glue, exercised by gdpr e2e
      //   - consent/{client,server}.ts — document.cookie / next/headers
      //   - legal/{company,content/index}.ts — env reader / static re-exports
      //   - vendure/{active-customer,active-order,checkout,checkout-loaders,countries}.ts —
      //     RSC fetch wrappers exercised via Playwright + Sanity-overlay tests
      //   - sanity/** — live-Sanity integration territory
      include: ['src/lib/**/*.ts'],
      exclude: [
        'src/lib/**/*.test.ts',
        'src/lib/sanity/**',
        'src/lib/analytics/**',
        'src/lib/logger/client.ts',
        'src/lib/consent/client.ts',
        'src/lib/consent/server.ts',
        'src/lib/legal/company.ts',
        'src/lib/legal/content/index.ts',
        'src/lib/vendure/active-customer.ts',
        'src/lib/vendure/active-order.ts',
        'src/lib/vendure/checkout.ts',
        'src/lib/vendure/checkout-loaders.ts',
        'src/lib/vendure/countries.ts',
        // Server Actions — exercised via Playwright e2e (checkout-consent,
        // gdpr-self-service). Unit-test backfill is an ADR-0010 follow-up.
        'src/lib/actions/account.ts',
        'src/lib/actions/cart.ts',
        'src/lib/actions/checkout.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
