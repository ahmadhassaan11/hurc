import 'server-only';

import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { logger } from '@/lib/logger/server';

export type ServerErrorCode = 'INTERNAL_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND';

const MetadataSchema = z.object({
  name: z.string().min(1),
});

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return MetadataSchema;
  },
  handleServerError(error, utils) {
    logger.error({ err: error, action: utils.metadata?.name }, 'server action failed');
    return 'INTERNAL_ERROR' satisfies ServerErrorCode;
  },
}).use(async ({ next, metadata }) => {
  // Threading additional request context (request-id, channel, locale) onto
  // ctx happens here once those concerns land in Phase 6. The middleware is
  // wired now so the shape is stable for downstream Server Actions.
  return next({ ctx: { actionName: metadata.name } });
});
