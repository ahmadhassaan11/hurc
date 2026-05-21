import type { CodegenConfig } from '@graphql-codegen/cli';

const scalars = {
  DateTime: 'string',
  Money: 'number',
  JSON: 'unknown',
  Upload: 'File',
} as const;

const presetConfig = {
  fragmentMasking: false,
} as const;

const config: CodegenConfig = {
  overwrite: true,
  config: {
    scalars,
    useTypeImports: true,
    enumsAsTypes: true,
    avoidOptionals: { field: true },
    skipTypename: false,
  },
  generates: {
    'src/admin/generated/': {
      schema: 'src/schema-snapshots/admin-api.graphql',
      documents: ['src/admin/operations/**/*.graphql'],
      preset: 'client',
      presetConfig,
    },
    'src/shop/generated/': {
      schema: 'src/schema-snapshots/shop-api.graphql',
      documents: ['src/shop/operations/**/*.graphql'],
      preset: 'client',
      presetConfig,
    },
  },
};

export default config;
