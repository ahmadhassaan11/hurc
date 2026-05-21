/**
 * Playwright config — Phase 9.1.
 *
 * Default suite is chromium-only against a locally-built `next start`.
 * The visual lane (`tests/e2e/visual/**`) and the multi-browser matrix
 * are gated on `PW_VISUAL=1` to keep PR-CI cost bounded — see ADR-0010
 * decision 4.
 */
import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT_E2E ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const IS_CI = process.env.CI === 'true';
const RUN_VISUAL = process.env.PW_VISUAL === '1';
const ENABLE_WEBSERVER = process.env.E2E_NO_WEBSERVER !== '1';

const projects = RUN_VISUAL
  ? [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ]
  : [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }];

const webServer = ENABLE_WEBSERVER
  ? {
      command: `pnpm exec next start -p ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: !IS_CI,
      timeout: 120_000,
      stdout: 'pipe' as const,
      stderr: 'pipe' as const,
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_VENDURE_SHOP_API_URL:
          process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL ?? 'http://localhost:3001/shop-api',
        VENDURE_SHOP_API_URL_INTERNAL:
          process.env.VENDURE_SHOP_API_URL_INTERNAL ?? 'http://localhost:3001/shop-api',
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? BASE_URL,
        NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'hurc.test',
        NEXT_PUBLIC_POSTHOG_KEY: 'phc_e2e',
        NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com',
      },
    }
  : undefined;

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: RUN_VISUAL ? [] : ['**/visual/**'],
  outputDir: './tests/e2e/.output',
  snapshotPathTemplate: '{testDir}/visual/__snapshots__/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  ...(IS_CI ? { workers: 2 } : {}),
  reporter: IS_CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  globalSetup: './tests/e2e/global-setup.ts',
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'en-US',
    timezoneId: 'Europe/Berlin',
    colorScheme: 'dark',
    viewport: { width: 1280, height: 720 },
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
  projects,
  ...(webServer === undefined ? {} : { webServer }),
});
