/**
 * Client-side logger. CLAUDE.md hard rule #6 forbids `console.log` in
 * shipped code; this module routes warnings and errors to Sentry breadcrumbs
 * (already loaded via `instrumentation-client.ts`, gated on consent) and
 * silently drops everything else.
 */

import * as Sentry from '@sentry/nextjs';

type LogContext = Record<string, unknown> | undefined;

function record(level: 'warning' | 'error', context: LogContext, message: string): void {
  Sentry.addBreadcrumb({
    level,
    category: 'storefront',
    message,
    ...(context !== undefined ? { data: context } : {}),
  });
  if (level === 'error') {
    Sentry.captureMessage(message, { level, contexts: { storefront: context ?? {} } });
  }
}

export const clientLogger = {
  debug(_context: LogContext, _message: string): void {
    // intentional no-op — debug noise is not shipped to production telemetry
  },
  info(_context: LogContext, _message: string): void {
    // intentional no-op — info noise is not shipped to production telemetry
  },
  warn(context: LogContext, message: string): void {
    record('warning', context, message);
  },
  error(context: LogContext, message: string): void {
    record('error', context, message);
  },
};

/**
 * Audit-style breadcrumb (level=info). Shipped to Sentry without raising
 * an error capture — useful for "the user clicked X" traces that we want
 * threaded into a later exception report.
 */
export function breadcrumb(context: LogContext, message: string): void {
  Sentry.addBreadcrumb({
    level: 'info',
    category: 'storefront',
    message,
    ...(context !== undefined ? { data: context } : {}),
  });
}
