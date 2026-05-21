import { describe, expect, it } from 'vitest';

import { isIndexable, isLegalSlug, LEGAL_INDEXABLE, LEGAL_SLUGS } from '../../src/lib/legal/slugs';

describe('legal slugs', () => {
  it('exposes the five expected slugs', () => {
    expect([...LEGAL_SLUGS].sort()).toEqual(
      ['cookies', 'imprint', 'privacy', 'terms', 'withdrawal'].sort(),
    );
  });

  it('isLegalSlug rejects unknown values', () => {
    expect(isLegalSlug('imprint')).toBe(true);
    expect(isLegalSlug('IMPRINT')).toBe(false);
    expect(isLegalSlug('something-else')).toBe(false);
    expect(isLegalSlug('')).toBe(false);
  });

  it('isIndexable allows imprint/terms/privacy and excludes cookies/withdrawal', () => {
    expect(isIndexable('imprint')).toBe(true);
    expect(isIndexable('terms')).toBe(true);
    expect(isIndexable('privacy')).toBe(true);
    expect(isIndexable('cookies')).toBe(false);
    expect(isIndexable('withdrawal')).toBe(false);
  });

  it('keeps the indexable subset and slug list in sync (no orphans)', () => {
    for (const slug of LEGAL_INDEXABLE) {
      expect(LEGAL_SLUGS).toContain(slug);
    }
  });
});
