import type { IGraphQLConfig } from 'graphql-config';

const config: IGraphQLConfig = {
  projects: {
    admin: {
      schema: 'src/schema-snapshots/admin-api.graphql',
      documents: ['src/admin/operations/**/*.graphql'],
    },
    shop: {
      schema: 'src/schema-snapshots/shop-api.graphql',
      documents: ['src/shop/operations/**/*.graphql'],
    },
  },
};

export default config;
