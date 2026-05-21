import * as Sentry from '@sentry/nextjs';

import { env } from '@/env';

if (env.NEXT_PUBLIC_SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    environment: env.APP_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 0,
    sendDefaultPii: false,
    beforeSend(event) {
      // Strip the most common accidental PII surface: query strings on the
      // request URL. Body redaction is handled per-route where it applies.
      if (event.request?.url !== undefined) {
        try {
          const url = new URL(event.request.url);
          url.search = '';
          event.request.url = url.toString();
        } catch {
          // ignore unparseable URLs
        }
      }
      return event;
    },
  });
}
