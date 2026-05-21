import node from '@hurc/config-eslint/node';

export default [
  ...node,
  {
    // TypeORM-generated migrations — verbatim output from
    // `vendure-core/generateMigration`. Lint rules here would surface as
    // false positives every time a new migration lands.
    ignores: ['**/src/migrations/**'],
  },
];
