import { describe, expect, it } from 'vitest';

import { ALLOWED_TAG_PREFIXES, isAllowedTag } from '../../src/lib/sanity/revalidate-allowlist';

describe('isAllowedTag', () => {
  it('accepts every bare prefix', () => {
    for (const prefix of ALLOWED_TAG_PREFIXES) {
      expect(isAllowedTag(prefix)).toBe(true);
    }
  });

  it('accepts namespaced shapes for prefixes that carry slugs', () => {
    expect(isAllowedTag('journal:training-week-1')).toBe(true);
    expect(isAllowedTag('product:meridian-jacket')).toBe(true);
    expect(isAllowedTag('page:story')).toBe(true);
    expect(isAllowedTag('activity:run')).toBe(true);
  });

  it('rejects empty namespaced shapes', () => {
    expect(isAllowedTag('journal:')).toBe(false);
    expect(isAllowedTag('product:')).toBe(false);
  });

  it('rejects unknown prefixes that the bridge could fall back to', () => {
    // bridge default branch emits [<type>] — these must NOT trigger revalidation
    expect(isAllowedTag('siteSettings')).toBe(false);
    expect(isAllowedTag('navigation')).toBe(false);
    expect(isAllowedTag('cart:abc')).toBe(false);
    expect(isAllowedTag('customer:42')).toBe(false);
  });

  it('rejects subtle prefix-collision attempts', () => {
    expect(isAllowedTag('journalist')).toBe(false);
    expect(isAllowedTag('productive')).toBe(false);
    expect(isAllowedTag('pages:story')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isAllowedTag('')).toBe(false);
  });
});
