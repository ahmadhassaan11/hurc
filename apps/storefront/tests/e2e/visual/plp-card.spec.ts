/**
 * Visual regression — PLP product card. Phase 9.2.
 *
 * Skipped when the backend is unreachable; the card is a backend-driven
 * surface so we can't snapshot it without seeded products.
 */
import { expect, test } from '@playwright/test';

import { isBackendReachable } from '../fixtures/backend';

test('PLP product card renders consistently', async ({ page }) => {
  test.skip(!isBackendReachable(), 'requires live backend (seeded products)');
  await page.goto('/en/collection');
  await page.evaluate(() => document.fonts.ready);
  const klaro = page.locator('.klaro');
  if (await klaro.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /accept all|alle akzeptieren/i }).click();
    await expect(klaro).toHaveCount(0);
  }
  const firstCard = page.locator('[data-testid="plp-card"]').first();
  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstCard).toHaveScreenshot('plp-card.png');
});
