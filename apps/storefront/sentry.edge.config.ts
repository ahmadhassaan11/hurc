import * as Sentry from '@sentry/nextjs';

import { env } from '@/env';

if (env.NEXT_PUBLIC_SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    environment: env.APP_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 0,
    sendDefaultPii: false,
  });
}
