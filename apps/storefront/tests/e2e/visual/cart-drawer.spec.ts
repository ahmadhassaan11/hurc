/**
 * Visual regression — cart drawer. Phase 9.2.
 *
 * Skipped when the backend is unreachable; cart drawer requires a seeded
 * cart fixture from the live shop-api.
 */
import { expect, test } from '@playwright/test';

import { isBackendReachable } from '../fixtures/backend';
import { seedCart } from '../fixtures/cart';

test('cart drawer renders consistently', async ({ page, context }) => {
  test.skip(!isBackendReachable(), 'requires live backend (cart fixture)');
  await seedCart(context);
  await page.goto('/en');
  await page.evaluate(() => document.fonts.ready);
  const klaro = page.locator('.klaro');
  if (await klaro.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /accept all|alle akzeptieren/i }).click();
    await expect(klaro).toHaveCount(0);
  }
  await page.getByRole('button', { name: /open cart|warenkorb/i }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveScreenshot('cart-drawer.png', {
    mask: [page.locator('[data-testid="line-item-price"]')],
  });
});
