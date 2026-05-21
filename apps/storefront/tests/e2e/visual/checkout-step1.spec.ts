/**
 * Visual regression — checkout step 1 (information). Phase 9.2.
 *
 * Skipped when the backend is unreachable; requires a seeded cart.
 */
import { expect, test } from '@playwright/test';

import { isBackendReachable } from '../fixtures/backend';
import { seedCart } from '../fixtures/cart';

test('checkout step 1 renders consistently', async ({ page, context }) => {
  test.skip(!isBackendReachable(), 'requires live backend (cart fixture)');
  await seedCart(context);
  await page.goto('/en/checkout');
  await page.evaluate(() => document.fonts.ready);
  const klaro = page.locator('.klaro');
  if (await klaro.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /accept all|alle akzeptieren/i }).click();
    await expect(klaro).toHaveCount(0);
  }
  const main = page.locator('main').first();
  await expect(main).toHaveScreenshot('checkout-step1.png', {
    mask: [page.locator('[data-testid="cart-summary-total"]')],
  });
});
