import { bootstrap, runMigrations } from '@vendure/core';

import { env } from './env.js';
import { logger } from './logger.js';
import { config } from './vendure-config.js';

async function start(): Promise<void> {
  if (env.RUN_MIGRATIONS_ON_BOOT) {
    logger.info('Running pending DB migrations');
    await runMigrations(config);
  }
  await bootstrap(config);
  logger.info({ port: env.PORT, env: env.APP_ENV }, 'HURC backend (server) booted');
}

start().catch((err: unknown) => {
  logger.fatal({ err }, 'HURC backend failed to boot');
  process.exit(1);
});
