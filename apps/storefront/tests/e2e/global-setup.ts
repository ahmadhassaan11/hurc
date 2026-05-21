/**
 * Playwright global setup — runs once before any test.
 *
 * - Verifies the chromium binary exists; emits an actionable error when not.
 * - Probes the configured backend reachability and exposes the result to
 *   tests via the `E2E_BACKEND_REACHABLE` env var. Specs that need a live
 *   backend (`checkout-consent`, `gdpr-self-service`) read this and skip.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const BACKEND_PROBE_TIMEOUT_MS = 15_000;

async function probeBackend(): Promise<boolean> {
  const url =
    process.env.VENDURE_SHOP_API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL;
  if (url === undefined || url === '') return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    return res.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function chromiumInstalled(): boolean {
  // Playwright resolves browsers under `~/.cache/ms-playwright/chromium-*`.
  // We don't know the exact version-suffixed dirname, so we rely on the
  // env var Playwright itself sets when its install ran successfully.
  const cacheDir =
    process.env.PLAYWRIGHT_BROWSERS_PATH ??
    resolve(process.env.HOME ?? '', '.cache', 'ms-playwright');
  return existsSync(cacheDir);
}

export default async function globalSetup(): Promise<void> {
  if (!chromiumInstalled()) {
    process.stderr.write(
      [
        '\n[playwright] chromium browser binary not found.',
        '             Run: pnpm --filter @hurc/storefront exec playwright install chromium',
        '',
      ].join('\n'),
    );
    throw new Error('chromium binary missing');
  }

  const reachable = await probeBackend();
  process.env.E2E_BACKEND_REACHABLE = reachable ? '1' : '0';
  if (!reachable) {
    process.stdout.write(
      '[playwright] backend probe failed — backend-dependent specs will be skipped.\n',
    );
  }
}
