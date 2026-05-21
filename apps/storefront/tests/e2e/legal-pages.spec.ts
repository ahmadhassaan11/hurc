/**
 * Phase 8.5 e2e — legal pages. Activated in Phase 9.1.
 *
 * The full LOCALES × SLUGS matrix runs only when the live backend is
 * reachable (the Sanity dispatcher hits `loadPage()` which is a Sanity
 * call); the English imprint is guaranteed-static and runs everywhere.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { isBackendReachable } from './fixtures/backend';

const LOCALES = ['en', 'de', 'fr', 'nl', 'es', 'it'] as const;
const SLUGS = ['imprint', 'terms', 'privacy', 'cookies', 'withdrawal'] as const;

test('English imprint renders 200 + h1', async ({ page }) => {
  const res = await page.goto('/en/legal/imprint');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
});

test('axe scan: English imprint has zero violations', async ({ page }) => {
  await page.goto('/en/legal/imprint');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

for (const locale of LOCALES) {
  for (const slug of SLUGS) {
    test(`/${locale}/legal/${slug} renders 200 + h1`, async ({ page }) => {
      test.skip(!isBackendReachable(), 'requires Sanity-backed dispatcher (live infra)');
      const res = await page.goto(`/${locale}/legal/${slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
    });
  }
}

test('cookies and withdrawal pages carry noindex,follow', async ({ page }) => {
  for (const slug of ['cookies', 'withdrawal']) {
    await page.goto(`/en/legal/${slug}`);
    const robots = await page.locator('meta[name="robots"]').first().getAttribute('content');
    expect(robots?.toLowerCase()).toContain('noindex');
  }
});

test('axe scan: every English legal page is violation-free', async ({ page }) => {
  for (const slug of SLUGS) {
    await page.goto(`/en/legal/${slug}`);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations, `axe violations on /en/legal/${slug}`).toEqual([]);
  }
});
