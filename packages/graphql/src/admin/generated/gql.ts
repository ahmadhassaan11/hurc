/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  'fragment AdminAdministratorFields on Administrator {\n  id\n  firstName\n  lastName\n  emailAddress\n}\n\nquery ActiveAdministrator {\n  activeAdministrator {\n    ...AdminAdministratorFields\n  }\n}': typeof types.AdminAdministratorFieldsFragmentDoc;
  'fragment AdminProductCardFields on Product {\n  id\n  name\n  slug\n  enabled\n  featuredAsset {\n    id\n    preview\n  }\n  customFields {\n    activity\n    traceabilityCode\n  }\n}\n\nfragment AdminProductDetailFields on Product {\n  id\n  name\n  slug\n  description\n  enabled\n  featuredAsset {\n    id\n    preview\n    source\n  }\n  variants {\n    id\n    sku\n    name\n    price\n    priceWithTax\n    stockLevels {\n      stockLocationId\n      stockOnHand\n      stockAllocated\n    }\n  }\n  customFields {\n    activity\n    materialComposition\n    careInstructions\n    sustainabilityNotes\n    manufacturerInfo\n    warnings\n    traceabilityCode\n    responsiblePerson {\n      id\n      name\n      email\n      address\n    }\n  }\n}\n\nquery AdminProductList($options: ProductListOptions) {\n  products(options: $options) {\n    items {\n      ...AdminProductCardFields\n    }\n    totalItems\n  }\n}\n\nquery AdminProductBySlug($slug: String!) {\n  product(slug: $slug) {\n    ...AdminProductDetailFields\n  }\n}': typeof types.AdminProductCardFieldsFragmentDoc;
};
const documents: Documents = {
  'fragment AdminAdministratorFields on Administrator {\n  id\n  firstName\n  lastName\n  emailAddress\n}\n\nquery ActiveAdministrator {\n  activeAdministrator {\n    ...AdminAdministratorFields\n  }\n}':
    types.AdminAdministratorFieldsFragmentDoc,
  'fragment AdminProductCardFields on Product {\n  id\n  name\n  slug\n  enabled\n  featuredAsset {\n    id\n    preview\n  }\n  customFields {\n    activity\n    traceabilityCode\n  }\n}\n\nfragment AdminProductDetailFields on Product {\n  id\n  name\n  slug\n  description\n  enabled\n  featuredAsset {\n    id\n    preview\n    source\n  }\n  variants {\n    id\n    sku\n    name\n    price\n    priceWithTax\n    stockLevels {\n      stockLocationId\n      stockOnHand\n      stockAllocated\n    }\n  }\n  customFields {\n    activity\n    materialComposition\n    careInstructions\n    sustainabilityNotes\n    manufacturerInfo\n    warnings\n    traceabilityCode\n    responsiblePerson {\n      id\n      name\n      email\n      address\n    }\n  }\n}\n\nquery AdminProductList($options: ProductListOptions) {\n  products(options: $options) {\n    items {\n      ...AdminProductCardFields\n    }\n    totalItems\n  }\n}\n\nquery AdminProductBySlug($slug: String!) {\n  product(slug: $slug) {\n    ...AdminProductDetailFields\n  }\n}':
    types.AdminProductCardFieldsFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment AdminAdministratorFields on Administrator {\n  id\n  firstName\n  lastName\n  emailAddress\n}\n\nquery ActiveAdministrator {\n  activeAdministrator {\n    ...AdminAdministratorFields\n  }\n}',
): (typeof documents)['fragment AdminAdministratorFields on Administrator {\n  id\n  firstName\n  lastName\n  emailAddress\n}\n\nquery ActiveAdministrator {\n  activeAdministrator {\n    ...AdminAdministratorFields\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment AdminProductCardFields on Product {\n  id\n  name\n  slug\n  enabled\n  featuredAsset {\n    id\n    preview\n  }\n  customFields {\n    activity\n    traceabilityCode\n  }\n}\n\nfragment AdminProductDetailFields on Product {\n  id\n  name\n  slug\n  description\n  enabled\n  featuredAsset {\n    id\n    preview\n    source\n  }\n  variants {\n    id\n    sku\n    name\n    price\n    priceWithTax\n    stockLevels {\n      stockLocationId\n      stockOnHand\n      stockAllocated\n    }\n  }\n  customFields {\n    activity\n    materialComposition\n    careInstructions\n    sustainabilityNotes\n    manufacturerInfo\n    warnings\n    traceabilityCode\n    responsiblePerson {\n      id\n      name\n      email\n      address\n    }\n  }\n}\n\nquery AdminProductList($options: ProductListOptions) {\n  products(options: $options) {\n    items {\n      ...AdminProductCardFields\n    }\n    totalItems\n  }\n}\n\nquery AdminProductBySlug($slug: String!) {\n  product(slug: $slug) {\n    ...AdminProductDetailFields\n  }\n}',
): (typeof documents)['fragment AdminProductCardFields on Product {\n  id\n  name\n  slug\n  enabled\n  featuredAsset {\n    id\n    preview\n  }\n  customFields {\n    activity\n    traceabilityCode\n  }\n}\n\nfragment AdminProductDetailFields on Product {\n  id\n  name\n  slug\n  description\n  enabled\n  featuredAsset {\n    id\n    preview\n    source\n  }\n  variants {\n    id\n    sku\n    name\n    price\n    priceWithTax\n    stockLevels {\n      stockLocationId\n      stockOnHand\n      stockAllocated\n    }\n  }\n  customFields {\n    activity\n    materialComposition\n    careInstructions\n    sustainabilityNotes\n    manufacturerInfo\n    warnings\n    traceabilityCode\n    responsiblePerson {\n      id\n      name\n      email\n      address\n    }\n  }\n}\n\nquery AdminProductList($options: ProductListOptions) {\n  products(options: $options) {\n    items {\n      ...AdminProductCardFields\n    }\n    totalItems\n  }\n}\n\nquery AdminProductBySlug($slug: String!) {\n  product(slug: $slug) {\n    ...AdminProductDetailFields\n  }\n}'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
