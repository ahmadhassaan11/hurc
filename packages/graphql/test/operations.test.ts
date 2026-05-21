import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSchema, parse, validate } from 'graphql';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

type Project = { name: 'admin' | 'shop'; schemaPath: string; documentsDir: string };
const projects: Project[] = [
  {
    name: 'admin',
    schemaPath: 'src/schema-snapshots/admin-api.graphql',
    documentsDir: 'src/admin/operations',
  },
  {
    name: 'shop',
    schemaPath: 'src/schema-snapshots/shop-api.graphql',
    documentsDir: 'src/shop/operations',
  },
];

describe.each(projects)('$name-api operations', ({ schemaPath, documentsDir }) => {
  const schema = buildSchema(readFileSync(resolve(ROOT, schemaPath), 'utf8'));
  const documentFiles = readdirSync(resolve(ROOT, documentsDir))
    .filter((f) => f.endsWith('.graphql'))
    .map((f) => resolve(ROOT, documentsDir, f));

  it('the schema-snapshot defines a Query type', () => {
    expect(schema.getQueryType()).toBeDefined();
  });

  it('at least one operation file exists', () => {
    expect(documentFiles.length).toBeGreaterThan(0);
  });

  it.each(documentFiles)('%s parses cleanly', (file) => {
    const source = readFileSync(file, 'utf8');
    expect(() => parse(source)).not.toThrow();
  });

  it('the combined operation document validates against the schema', () => {
    const combined = documentFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
    const document = parse(combined);
    const errors = validate(schema, document);
    expect(errors).toEqual([]);
  });
});
