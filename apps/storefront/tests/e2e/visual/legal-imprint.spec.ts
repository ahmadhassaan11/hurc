/**
 * Visual regression — /legal/imprint (English, static body). Phase 9.2.
 *
 * The English imprint is the canonical baseline because it always
 * renders from the static body (no Sanity overlay required); other
 * locales fall through to the same body but with a translation notice
 * strip whose copy varies per locale.
 */
import { expect, test } from '@playwright/test';

test('legal imprint renders consistently', async ({ page }) => {
  await page.goto('/en/legal/imprint');
  await page.evaluate(() => document.fonts.ready);
  const klaro = page.locator('.klaro');
  if (await klaro.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /accept all|alle akzeptieren/i }).click();
    await expect(klaro).toHaveCount(0);
  }
  await expect(page).toHaveScreenshot('legal-imprint.png', { fullPage: true });
});
