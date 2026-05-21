import { afterEach, describe, expect, it } from 'vitest';

import { _resetRateLimitStore, hashSessionKey, rateLimit } from '../../src/lib/gdpr/rate-limit';

afterEach(() => {
  _resetRateLimitStore();
});

describe('rateLimit (in-memory fallback)', () => {
  it('allows the first request and rejects the second within TTL', async () => {
    const key = 'gdpr.export:abc';
    expect(await rateLimit(key, 60, 1_000_000)).toBe(true);
    expect(await rateLimit(key, 60, 1_000_010)).toBe(false);
  });

  it('allows again after TTL expiry', async () => {
    const key = 'gdpr.export:abc';
    expect(await rateLimit(key, 60, 1_000_000)).toBe(true);
    expect(await rateLimit(key, 60, 1_000_000 + 60_000 + 1)).toBe(true);
  });

  it('uses independent buckets per key', async () => {
    expect(await rateLimit('a', 60, 1_000_000)).toBe(true);
    expect(await rateLimit('b', 60, 1_000_000)).toBe(true);
    expect(await rateLimit('a', 60, 1_000_010)).toBe(false);
    expect(await rateLimit('b', 60, 1_000_010)).toBe(false);
  });
});

describe('hashSessionKey', () => {
  it('returns a stable, scoped, truncated hex hash', () => {
    const a = hashSessionKey('gdpr.export', 'session-token-1');
    const b = hashSessionKey('gdpr.export', 'session-token-1');
    expect(a).toBe(b);
    expect(a).toMatch(/^gdpr\.export:[0-9a-f]{16}$/);
  });

  it('separates buckets across scopes', () => {
    const exportKey = hashSessionKey('gdpr.export', 's');
    const deleteKey = hashSessionKey('gdpr.delete', 's');
    expect(exportKey).not.toBe(deleteKey);
    expect(exportKey.startsWith('gdpr.export:')).toBe(true);
    expect(deleteKey.startsWith('gdpr.delete:')).toBe(true);
  });

  it('does not embed the raw session value (no PII)', () => {
    const key = hashSessionKey('gdpr.export', 'super-secret-cookie-value');
    expect(key.includes('super-secret-cookie-value')).toBe(false);
  });
});
