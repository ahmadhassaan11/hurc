/**
 * Visual regression — Klaro consent modal. Phase 9.2.
 *
 * The Klaro chunk dynamic-imports; the explicit `waitForSelector`
 * stabilises the screenshot.
 */
import { expect, test } from '@playwright/test';

test('consent modal renders consistently', async ({ page }) => {
  await page.goto('/en');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('.klaro', { state: 'visible', timeout: 5_000 });
  // Settle the slide-in animation before we shoot.
  await page.waitForTimeout(300);
  const modal = page.locator('.klaro');
  await expect(modal).toHaveScreenshot('consent-modal.png');
});
