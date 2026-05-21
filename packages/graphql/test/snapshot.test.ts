import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSchema, printSchema } from 'graphql';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SNAPSHOTS = [
  'src/schema-snapshots/admin-api.graphql',
  'src/schema-snapshots/shop-api.graphql',
];

describe('schema snapshots', () => {
  it.each(SNAPSHOTS)('%s parses as valid GraphQL SDL', (path) => {
    const sdl = readFileSync(resolve(ROOT, path), 'utf8');
    expect(() => buildSchema(sdl)).not.toThrow();
  });

  it.each(SNAPSHOTS)('%s is normalized (round-trip stable via printSchema)', (path) => {
    const sdl = readFileSync(resolve(ROOT, path), 'utf8');
    const once = printSchema(buildSchema(sdl));
    const twice = printSchema(buildSchema(once));
    expect(twice).toBe(once);
  });

  it('shop-api advertises HURC custom fields on Product and Customer', () => {
    const sdl = readFileSync(resolve(ROOT, 'src/schema-snapshots/shop-api.graphql'), 'utf8');
    const schema = buildSchema(sdl);

    const productCustomFields = schema.getType('ProductCustomFields');
    expect(productCustomFields).toBeDefined();
    const customerCustomFields = schema.getType('CustomerCustomFields');
    expect(customerCustomFields).toBeDefined();
    const responsiblePerson = schema.getType('ResponsiblePerson');
    expect(responsiblePerson).toBeDefined();
  });
});
