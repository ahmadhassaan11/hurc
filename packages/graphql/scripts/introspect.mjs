#!/usr/bin/env node
/**
 * introspect — fetch live SDL from a running Vendure backend and write it
 * to `src/schema-snapshots/{admin,shop}-api.graphql`.
 *
 * Output is normalized through `printSchema(buildClientSchema(introspection))`
 * so byte-for-byte comparison via `verify-snapshot.mjs` is meaningful.
 *
 * Usage: pnpm --filter @hurc/graphql introspect
 *
 * Requires: backend running at http://localhost:3000.
 */

import { writeFileSync } from 'node:fs';
import { exit } from 'node:process';

import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';

const ENDPOINTS = [
  { name: 'admin-api', url: 'http://localhost:3000/admin-api' },
  { name: 'shop-api', url: 'http://localhost:3000/shop-api' },
];

for (const { name, url } of ENDPOINTS) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });

  if (!response.ok) {
    console.error(`[introspect] ${name}: HTTP ${response.status} from ${url}`);
    exit(2);
  }

  const { data, errors } = await response.json();
  if (errors?.length) {
    console.error(`[introspect] ${name}: introspection errors`, errors);
    exit(2);
  }

  const sdl = `${printSchema(buildClientSchema(data))}\n`;
  const path = new URL(`../src/schema-snapshots/${name}.graphql`, import.meta.url);
  writeFileSync(path, sdl);
  console.warn(`[introspect] ${name}: wrote ${sdl.length} bytes`);
}
