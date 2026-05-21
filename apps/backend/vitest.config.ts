import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    environment: 'node',
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Coverage scope: pure-logic files that have unit tests under
      // test/** or alongside the source. Vendure plugin classes are
      // exercised end-to-end via @vendure/testing in Phase 10's deploy
      // harness; controllers, services with external deps, plugin
      // lifecycle, and TypeORM entities/migrations are excluded here.
      include: [
        'src/channels.ts',
        'src/tax.ts',
        'src/plugins/hurc-gpsr/violation-store.service.ts',
        'src/plugins/hurc-newsletter/token.ts',
        'src/plugins/hurc-sanity-bridge/payload-mapper.ts',
        'src/plugins/hurc-sanity-bridge/signature.ts',
        'src/plugins/hurc-sendcloud/sendcloud.client.ts',
        'src/plugins/hurc-meilisearch/document.types.ts',
      ],
      exclude: ['**/*.test.ts'],
      // Decorators inflate uncovered AST in Vendure plugin classes — the ADR
      // sets a 70% line floor for backend (vs. 80% for packages/*).
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
});
