/**
 * Phase 8.5 e2e — consent flow.
 *
 * Activated in Phase 9.1. The Klaro chunk is dynamic-imported and mounts
 * after the React hydration tick; an explicit `waitForSelector` guards
 * against the lazy-load race per ADR-0010 R1.
 */
import { expect, test } from '@playwright/test';

const KLARO = '.klaro';
const KLARO_TIMEOUT = 5_000;

test.describe('consent flow', () => {
  test('first visit shows the Klaro modal and reject-all keeps PostHog dormant', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForSelector(KLARO, { state: 'visible', timeout: KLARO_TIMEOUT });
    await page.getByRole('button', { name: /reject all|alle ablehnen|tout refuser/i }).click();

    const cookies = await page.context().cookies();
    const consent = cookies.find((c) => c.name === 'hurc-consent');
    expect(consent).toBeTruthy();
    expect(decodeURIComponent(consent!.value)).toContain('"posthog":false');

    const phLoaded = await page.evaluate(
      () => (window as { posthog?: unknown }).posthog !== undefined,
    );
    expect(phLoaded).toBe(false);
  });

  test('accept-all flips PostHog/Sentry and survives a reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector(KLARO, { state: 'visible', timeout: KLARO_TIMEOUT });
    await page.getByRole('button', { name: /accept all|alle akzeptieren|tout accepter/i }).click();

    await expect
      .poll(
        async () => {
          const cookies = await page.context().cookies();
          return cookies.find((c) => c.name === 'hurc-consent')?.value;
        },
        { timeout: KLARO_TIMEOUT },
      )
      .toBeTruthy();

    await page.reload();
    await expect(page.locator(KLARO)).toHaveCount(0);
    const phLoaded = await page.evaluate(() => Boolean((window as { posthog?: unknown }).posthog));
    expect(phLoaded).toBe(true);
  });

  test('manage cookies re-opens the modal', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector(KLARO, { state: 'visible', timeout: KLARO_TIMEOUT });
    await page.getByRole('button', { name: /accept all|alle akzeptieren/i }).click();
    await expect(page.locator(KLARO)).toHaveCount(0);

    await page.getByRole('button', { name: /manage cookies|cookies verwalten/i }).click();
    await expect(page.locator(KLARO)).toBeVisible();
  });

  test('version bump invalidates prior consent', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'hurc-consent',
        value: encodeURIComponent(
          JSON.stringify({
            v: '1900-01-01',
            services: { plausible: true, posthog: true, sentry: true, klaviyo: true },
          }),
        ),
        url: 'http://localhost:3100',
      },
    ]);
    await page.goto('/');
    await page.waitForSelector(KLARO, { state: 'visible', timeout: KLARO_TIMEOUT });
    await expect(page.locator(KLARO)).toBeVisible();
  });
});
