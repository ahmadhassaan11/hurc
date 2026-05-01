// @ts-check
import base from './base.js';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base,
  {
    name: 'hurc/node',
    files: ['**/*.{js,ts,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
