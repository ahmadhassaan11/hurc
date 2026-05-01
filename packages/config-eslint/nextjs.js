// @ts-check
import react from './react.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...react,
  {
    name: 'hurc/nextjs',
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Next.js-specific overrides applied here once eslint-plugin-next ships
      // a stable flat-config. Keeping this layer present so apps can extend it.
    },
  },
];
