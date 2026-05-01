// Root flat config. Each workspace package has its own `eslint.config.js`
// extending `@hurc/config-eslint/*`; this root file only catches stray
// files at the repo root and provides a shared ignore list.
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/generated.ts',
      '**/*.generated.ts',
      'pnpm-lock.yaml',
    ],
  },
];
