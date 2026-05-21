import { describe, expect, it } from 'vitest';

import { PACKAGE_NAME } from '../src/index.js';

describe('@hurc/graphql package surface', () => {
  it('exposes the package marker', () => {
    expect(PACKAGE_NAME).toBe('@hurc/graphql');
  });

  it('exposes the admin gql() helper from generated output', async () => {
    const mod = await import('../src/admin/index.js');
    expect(typeof mod.graphql).toBe('function');
  });

  it('exposes the shop gql() helper from generated output', async () => {
    const mod = await import('../src/shop/index.js');
    expect(typeof mod.graphql).toBe('function');
  });

  it('shop graphql() returns the typed document for a known query', async () => {
    const { graphql } = await import('../src/shop/index.js');
    const doc = graphql(/* GraphQL */ `
      query ActiveChannel {
        activeChannel {
          ...ChannelFields
        }
      }
    `);
    expect(doc).toBeDefined();
  });
});
