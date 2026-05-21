/**
 * Phase 8.5 e2e — checkout consent gate. Activated in Phase 9.1.
 *
 * Requires a non-empty cart; uses the cart fixture against the live
 * shop-api. Skips cleanly when the backend is unreachable.
 */
import { expect, test } from '@playwright/test';

import { isBackendReachable } from './fixtures/backend';
import { seedCart } from './fixtures/cart';

test.describe('checkout consent gate', () => {
  test.beforeEach(async ({ context }) => {
    test.skip(!isBackendReachable(), 'requires live backend for cart fixture');
    await seedCart(context);
  });

  test('place-order button is disabled until consent is checked', async ({ page }) => {
    await page.goto('/en/checkout/payment');
    const button = page.getByRole('button', { name: /continue to payment/i });
    await expect(button).toBeDisabled();
    await page.getByRole('checkbox', { name: /Terms of Service/i }).check();
    await expect(button).toBeEnabled();
  });

  test('14-day withdrawal notice is present and links to /legal/withdrawal', async ({ page }) => {
    await page.goto('/en/checkout/payment');
    const notice = page.getByRole('note').filter({ hasText: /14-day right of withdrawal/i });
    await expect(notice).toBeVisible();
    const link = notice.getByRole('link');
    expect(await link.getAttribute('href')).toContain('/legal/withdrawal');
  });
});
