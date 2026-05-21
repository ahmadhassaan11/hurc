import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      include: ['src/scalars.ts'],
      exclude: ['src/admin/generated/**', 'src/shop/generated/**'],
    },
  },
});
