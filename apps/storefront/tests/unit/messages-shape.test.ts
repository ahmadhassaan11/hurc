import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { routing } from '../../src/i18n/routing';

const MESSAGES_DIR = resolve(__dirname, '../../messages');

async function loadLocale(locale: string): Promise<unknown> {
  const raw = await readFile(resolve(MESSAGES_DIR, `${locale}.json`), 'utf8');
  return JSON.parse(raw);
}

function collectKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return prefix === '' ? [] : [prefix];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    collectKeys(child, prefix === '' ? key : `${prefix}.${key}`),
  );
}

describe('locale messages', () => {
  it('exposes a non-empty key set in the canonical locale', async () => {
    const en = await loadLocale(routing.defaultLocale);
    const keys = collectKeys(en);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('every locale matches the canonical key set', async () => {
    const enKeys = collectKeys(await loadLocale(routing.defaultLocale)).sort();
    for (const locale of routing.locales) {
      if (locale === routing.defaultLocale) continue;
      const keys = collectKeys(await loadLocale(locale)).sort();
      expect(keys, `locale ${locale} key set mismatch`).toEqual(enKeys);
    }
  });
});
