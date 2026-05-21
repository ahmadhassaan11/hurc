import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const VALID_ENV = {
  NODE_ENV: 'test',
  APP_ENV: 'dev',
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: 'http://localhost:3001/shop-api',
  VENDURE_SHOP_API_URL_INTERNAL: 'http://localhost:3001/shop-api',
  NEXT_PUBLIC_SITE_URL: 'https://hurc.test',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'hurc.test',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_dummy',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com',
};
const ORIGINAL = { ...process.env };

beforeAll(() => {
  vi.resetModules();
  Object.assign(process.env, VALID_ENV);
});

afterAll(() => {
  for (const k of Object.keys(VALID_ENV)) delete process.env[k];
  Object.assign(process.env, ORIGINAL);
});

describe('jsonLdString', () => {
  it('escapes </ to prevent script-tag breakout', async () => {
    const { jsonLdString } = await import('../../src/lib/seo/structured-data');
    const out = jsonLdString({ message: 'evil </script>' });
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c/script>');
  });

  it('round-trips a regular object as JSON', async () => {
    const { jsonLdString } = await import('../../src/lib/seo/structured-data');
    const out = jsonLdString({ a: 1, b: 'two' });
    expect(JSON.parse(out)).toEqual({ a: 1, b: 'two' });
  });
});

describe('schemas', () => {
  it('organizationSchema names the brand and uses the configured site URL', async () => {
    const { organizationSchema } = await import('../../src/lib/seo/structured-data');
    const schema = organizationSchema();
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('HURC');
    expect(schema.url).toBe('https://hurc.test');
  });

  it('websiteSchema includes a SearchAction targeting /search', async () => {
    const { websiteSchema } = await import('../../src/lib/seo/structured-data');
    const schema = websiteSchema();
    expect(schema['@type']).toBe('WebSite');
    expect(schema.potentialAction?.target.urlTemplate).toBe(
      'https://hurc.test/search?q={search_term_string}',
    );
  });

  it('breadcrumbSchema produces 1-indexed positions and absolute URLs', async () => {
    const { breadcrumbSchema } = await import('../../src/lib/seo/structured-data');
    const schema = breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Run', href: '/run' },
    ]);
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]?.position).toBe(1);
    expect(schema.itemListElement[1]?.item).toBe('https://hurc.test/run');
  });
});
