import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['test/**/*.test.{ts,tsx}'],
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/primitives/**/*.tsx', 'src/lib/**/*.ts'],
      exclude: ['src/icons/**', 'src/index.ts', 'src/tokens/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
