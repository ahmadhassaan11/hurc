/**
 * Phase 8.5 e2e — GDPR self-service. Activated in Phase 9.1.
 *
 * Requires a signed-in customer; uses the customer fixture against the
 * live shop-api. Skips cleanly when the backend is unreachable.
 */
import { expect, test } from '@playwright/test';

import { isBackendReachable } from './fixtures/backend';
import { seedCustomer } from './fixtures/customer';

test.describe('GDPR self-service', () => {
  test.beforeEach(async ({ context }) => {
    test.skip(!isBackendReachable(), 'requires live backend for customer fixture');
    await seedCustomer(context);
  });

  test('export modal triggers a ZIP download', async ({ page }) => {
    await page.goto('/en/account/data');
    await page.getByRole('button', { name: /Download ZIP/i }).click();
    await expect(page.getByText(/Export your data\?/i)).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Start export/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });

  test('delete dialog requires the challenge phrase', async ({ page }) => {
    await page.goto('/en/account/data');
    await page.getByRole('button', { name: /Delete account/i }).click();
    const confirm = page.getByRole('button', { name: /Yes, delete/i });
    await expect(confirm).toBeDisabled();
    await page.getByLabel(/Type DELETE MY ACCOUNT/i).fill('not-the-phrase');
    await expect(confirm).toBeDisabled();
    await page.getByLabel(/Type DELETE MY ACCOUNT/i).fill('DELETE MY ACCOUNT');
    await expect(confirm).toBeEnabled();
  });
});
