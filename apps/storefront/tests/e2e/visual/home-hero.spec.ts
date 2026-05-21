/**
 * Visual regression — home hero. Phase 9.2.
 *
 * Runs only when `PW_VISUAL=1` (gated via the playwright config's
 * `testIgnore`). Snapshots are committed under
 * `tests/e2e/visual/__snapshots__/`. Refresh after intentional UI
 * changes via `pnpm --filter @hurc/storefront test:e2e:visual:update`.
 */
import { expect, test } from '@playwright/test';

test('home hero renders consistently', async ({ page }) => {
  await page.goto('/en');
  await page.evaluate(() => document.fonts.ready);
  // Dismiss the consent modal if it's intercepting paint — we want the
  // hero, not the banner. The consent modal has its own visual spec.
  const klaro = page.locator('.klaro');
  if (await klaro.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /accept all|alle akzeptieren/i }).click();
    await expect(klaro).toHaveCount(0);
  }
  const hero = page.locator('main').first();
  await expect(hero).toHaveScreenshot('home-hero.png', {
    mask: [page.locator('[data-testid="dynamic-time"]'), page.locator('[data-testid="ticker"]')],
  });
});
