/* eslint-disable no-console -- this is a CLI script; stdout is the user-facing channel */
/**
 * Migration CLI for the HURC backend. Wraps Vendure 3.x's `generateMigration`,
 * `runMigrations`, and `revertLastMigration` helpers behind a single entrypoint
 * so package.json can ship the standard `migration:generate` / `migration:run`
 * / `migration:revert` scripts referenced in CLAUDE.md §5.
 *
 * Usage (via package.json):
 *   pnpm --filter @hurc/backend migration:generate -- <name>
 *   pnpm --filter @hurc/backend migration:run
 *   pnpm --filter @hurc/backend migration:revert
 */
// reflect-metadata MUST load before any entity / decorator import below;
// TypeORM's @Column type-inference depends on emitted design:type metadata.
import 'reflect-metadata';

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { generateMigration, revertLastMigration, runMigrations } from '@vendure/core';

import { config } from './vendure-config.js';

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

function usage(): never {
  console.error(
    ['usage:', '  migration:generate <name>', '  migration:run', '  migration:revert'].join('\n'),
  );
  process.exit(1);
}

async function main(): Promise<void> {
  // pnpm forwards `--` as a literal argv entry when scripts use
  // `pnpm <script> -- <args>`; strip it so name parsing is clean.
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const [cmd, ...rest] = args;

  switch (cmd) {
    case 'generate': {
      const name = rest[0];
      if (!name) usage();
      const file = await generateMigration(config, {
        name,
        outputDir: migrationsDir,
      });
      if (file) {
        console.log(`Migration written: ${file}`);
      } else {
        console.log('No schema changes detected — no migration generated.');
      }
      return;
    }
    case 'run': {
      const applied = await runMigrations(config);
      if (applied.length === 0) {
        console.log('No pending migrations.');
        return;
      }
      console.log(`Applied ${applied.length} migration(s):`);
      for (const m of applied) console.log(`  - ${m}`);
      return;
    }
    case 'revert': {
      await revertLastMigration(config);
      console.log('Reverted last migration.');
      return;
    }
    default:
      usage();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
