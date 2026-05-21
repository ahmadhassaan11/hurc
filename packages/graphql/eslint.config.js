import base from '@hurc/config-eslint/base';

export default [
  ...base,
  {
    ignores: ['src/admin/generated/**', 'src/shop/generated/**'],
  },
];
