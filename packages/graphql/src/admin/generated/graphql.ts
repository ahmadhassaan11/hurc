/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
  eq?: boolean | null | undefined;
  isNull?: boolean | null | undefined;
};

/** Operators for filtering on a DateTime field */
export type DateOperators = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  between?: DateRange | null | undefined;
  eq?: string | null | undefined;
  isNull?: boolean | null | undefined;
};

export type DateRange = {
  end: string;
  start: string;
};

/** Operators for filtering on an ID field */
export type IdOperators = {
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
};

export type LogicalOperator = 'AND' | 'OR';

export type ProductFilterParameter = {
  _and?: Array<ProductFilterParameter> | null | undefined;
  _or?: Array<ProductFilterParameter> | null | undefined;
  activity?: StringListOperators | null | undefined;
  careInstructions?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  facetValueId?: IdOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  manufacturerInfo?: StringOperators | null | undefined;
  materialComposition?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  optionGroupId?: IdOperators | null | undefined;
  sku?: StringOperators | null | undefined;
  slug?: StringOperators | null | undefined;
  sustainabilityNotes?: StringOperators | null | undefined;
  traceabilityCode?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  warnings?: StringOperators | null | undefined;
};

export type ProductListOptions = {
  /** Allows the results to be filtered */
  filter?: ProductFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ProductSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ProductSortParameter = {
  careInstructions?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  manufacturerInfo?: SortOrder | null | undefined;
  materialComposition?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  responsiblePerson?: SortOrder | null | undefined;
  slug?: SortOrder | null | undefined;
  sustainabilityNotes?: SortOrder | null | undefined;
  traceabilityCode?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  warnings?: SortOrder | null | undefined;
};

export type SortOrder = 'ASC' | 'DESC';

/** Operators for filtering on a list of String fields */
export type StringListOperators = {
  inList: string;
};

/** Operators for filtering on a String field */
export type StringOperators = {
  contains?: string | null | undefined;
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notContains?: string | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
  regex?: string | null | undefined;
};

export type AdminAdministratorFieldsFragment = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
};

export type ActiveAdministratorQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveAdministratorQuery = {
  activeAdministrator: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
  } | null;
};

export type AdminProductCardFieldsFragment = {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  featuredAsset: { id: string; preview: string } | null;
  customFields: { activity: Array<string> | null; traceabilityCode: string | null } | null;
};

export type AdminProductDetailFieldsFragment = {
  id: string;
  name: string;
  slug: string;
  description: string;
  enabled: boolean;
  featuredAsset: { id: string; preview: string; source: string } | null;
  variants: Array<{
    id: string;
    sku: string;
    name: string;
    price: number;
    priceWithTax: number;
    stockLevels: Array<{ stockLocationId: string; stockOnHand: number; stockAllocated: number }>;
  }>;
  customFields: {
    activity: Array<string> | null;
    materialComposition: string | null;
    careInstructions: string | null;
    sustainabilityNotes: string | null;
    manufacturerInfo: string | null;
    warnings: string | null;
    traceabilityCode: string | null;
    responsiblePerson: { id: string; name: string; email: string; address: string } | null;
  } | null;
};

export type AdminProductListQueryVariables = Exact<{
  options?: ProductListOptions | null | undefined;
}>;

export type AdminProductListQuery = {
  products: {
    totalItems: number;
    items: Array<{
      id: string;
      name: string;
      slug: string;
      enabled: boolean;
      featuredAsset: { id: string; preview: string } | null;
      customFields: { activity: Array<string> | null; traceabilityCode: string | null } | null;
    }>;
  };
};

export type AdminProductBySlugQueryVariables = Exact<{
  slug: string;
}>;

export type AdminProductBySlugQuery = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    enabled: boolean;
    featuredAsset: { id: string; preview: string; source: string } | null;
    variants: Array<{
      id: string;
      sku: string;
      name: string;
      price: number;
      priceWithTax: number;
      stockLevels: Array<{ stockLocationId: string; stockOnHand: number; stockAllocated: number }>;
    }>;
    customFields: {
      activity: Array<string> | null;
      materialComposition: string | null;
      careInstructions: string | null;
      sustainabilityNotes: string | null;
      manufacturerInfo: string | null;
      warnings: string | null;
      traceabilityCode: string | null;
      responsiblePerson: { id: string; name: string; email: string; address: string } | null;
    } | null;
  } | null;
};

export const AdminAdministratorFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AdminAdministratorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Administrator' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdminAdministratorFieldsFragment, unknown>;
export const AdminProductCardFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AdminProductCardFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'activity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'traceabilityCode' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdminProductCardFieldsFragment, unknown>;
export const AdminProductDetailFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AdminProductDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
                { kind: 'Field', name: { kind: 'Name', value: 'source' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'variants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'stockLevels' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'stockLocationId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'stockOnHand' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'stockAllocated' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'activity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'materialComposition' } },
                { kind: 'Field', name: { kind: 'Name', value: 'careInstructions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sustainabilityNotes' } },
                { kind: 'Field', name: { kind: 'Name', value: 'manufacturerInfo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'warnings' } },
                { kind: 'Field', name: { kind: 'Name', value: 'traceabilityCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'responsiblePerson' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdminProductDetailFieldsFragment, unknown>;
export const ActiveAdministratorDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ActiveAdministrator' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'activeAdministrator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'AdminAdministratorFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AdminAdministratorFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Administrator' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'emailAddress' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ActiveAdministratorQuery, ActiveAdministratorQueryVariables>;
export const AdminProductListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'AdminProductList' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductListOptions' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'products' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'AdminProductCardFields' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalItems' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AdminProductCardFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'activity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'traceabilityCode' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdminProductListQuery, AdminProductListQueryVariables>;
export const AdminProductBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'AdminProductBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'product' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'AdminProductDetailFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AdminProductDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Product' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredAsset' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preview' } },
                { kind: 'Field', name: { kind: 'Name', value: 'source' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'variants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceWithTax' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'stockLevels' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'stockLocationId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'stockOnHand' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'stockAllocated' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'activity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'materialComposition' } },
                { kind: 'Field', name: { kind: 'Name', value: 'careInstructions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sustainabilityNotes' } },
                { kind: 'Field', name: { kind: 'Name', value: 'manufacturerInfo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'warnings' } },
                { kind: 'Field', name: { kind: 'Name', value: 'traceabilityCode' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'responsiblePerson' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdminProductBySlugQuery, AdminProductBySlugQueryVariables>;
