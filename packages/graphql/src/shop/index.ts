export * from './generated/index.js';
// Re-export the typed `*Document` constants and operation types so
// consumers can `import { ProductBySlugDocument } from '@hurc/graphql/shop'`
// without reaching into `generated/`. Phase 4 storefront only used the
// `graphql()` template; Phase 6 commerce surfaces import documents
// directly to keep server-component types narrow.
export * from './generated/graphql.js';
