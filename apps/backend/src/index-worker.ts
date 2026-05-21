import { bootstrapWorker } from '@vendure/core';

import { logger } from './logger.js';
import { config } from './vendure-config.js';

async function startWorker(): Promise<void> {
  // bootstrapWorker spins up the Nest app context; startJobQueue is what
  // actually subscribes to BullMQ queues and begins processing. Without it
  // jobs accumulate in the `:wait` set forever.
  const worker = await bootstrapWorker(config);
  await worker.startJobQueue();
  logger.info('HURC backend (worker) booted');
}

startWorker().catch((err: unknown) => {
  logger.fatal({ err }, 'HURC worker failed to boot');
  process.exit(1);
});
