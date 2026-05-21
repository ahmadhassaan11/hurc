#!/usr/bin/env node
/**
 * verify-snapshot — diff live-introspected SDL against the committed
 * `src/schema-snapshots/{admin,shop}-api.graphql`. Exits non-zero on drift.
 *
 * Usage: pnpm --filter @hurc/graphql verify-snapshot
 *
 * Requires: backend running at http://localhost:3000.
 *
 * This script is the Phase-3 ship-vehicle for the Phase-9 CI gate (ADR-0004
 * §3.1, R2). It is not yet wired to CI.
 */

import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

import {
  buildClientSchema,
  buildSchema,
  getIntrospectionQuery,
  printSchema,
} from 'graphql';

const ENDPOINTS = [
  { name: 'admin-api', url: 'http://localhost:3000/admin-api' },
  { name: 'shop-api', url: 'http://localhost:3000/shop-api' },
];

const drifted = [];

for (const { name, url } of ENDPOINTS) {
  const snapshotPath = new URL(
    `../src/schema-snapshots/${name}.graphql`,
    import.meta.url,
  );
  const committed = readFileSync(snapshotPath, 'utf8');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });

  if (!response.ok) {
    console.error(`[verify-snapshot] ${name}: HTTP ${response.status} from ${url}`);
    exit(2);
  }

  const { data, errors } = await response.json();
  if (errors?.length) {
    console.error(`[verify-snapshot] ${name}: introspection errors`, errors);
    exit(2);
  }

  // Round-trip via printSchema so we compare normalized SDL, not raw text.
  const live = printSchema(buildClientSchema(data));
  const normalizedCommitted = printSchema(buildSchema(committed));

  if (live === normalizedCommitted) {
    console.warn(`[verify-snapshot] ${name}: ok`);
  } else {
    drifted.push(name);
    console.error(`[verify-snapshot] ${name}: drifted from committed snapshot`);
  }
}

if (drifted.length > 0) {
  console.error(
    `\n[verify-snapshot] ${drifted.length} schema(s) out of date. Run 'pnpm introspect && pnpm codegen'.`,
  );
  exit(1);
}
