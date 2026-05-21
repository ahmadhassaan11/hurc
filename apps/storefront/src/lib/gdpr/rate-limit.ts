import 'server-only';

import { createHash } from 'node:crypto';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiter for the `/api/gdpr/*` proxy routes. Two backing stores:
 *
 * 1. Upstash (durable, serverless-safe sliding window) when
 *    `KV_REST_API_URL` and `KV_REST_API_TOKEN` are present.
 * 2. In-memory `Map` fallback for dev/test/CI without external infra.
 *
 * The in-memory path is acceptable as defence-in-depth (the backend's
 * own controllers carry the hard authorisation checks) but degrades
 * across cold starts on a horizontally-scaled deployment — production
 * relies on the Upstash path.
 */
type Bucket = {
  expiresAt: number;
};

const STORE = new Map<string, Bucket>();

let upstashLimiter: Ratelimit | null | undefined;

function getUpstashLimiter(): Ratelimit | null {
  if (upstashLimiter !== undefined) return upstashLimiter;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (url === undefined || token === undefined || url === '' || token === '') {
    upstashLimiter = null;
    return null;
  }
  upstashLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(1, '60 s'),
    analytics: false,
    prefix: 'hurc.gdpr',
  });
  return upstashLimiter;
}

/**
 * Returns `true` if a request is allowed and stamps the bucket; returns
 * `false` if the caller is rate-limited. The caller must itself respond
 * with `429`. Callers MUST await — the Upstash path is async; the
 * in-memory path resolves synchronously but the signature is unified.
 */
export async function rateLimit(
  key: string,
  ttlSeconds: number,
  now: number = Date.now(),
): Promise<boolean> {
  const limiter = getUpstashLimiter();
  if (limiter !== null) {
    const result = await limiter.limit(key);
    return result.success;
  }
  // Lazy GC: prune expired keys whenever we touch the map. Cheap because
  // the population is bounded by active sessions.
  for (const [k, v] of STORE) {
    if (v.expiresAt <= now) STORE.delete(k);
  }
  const existing = STORE.get(key);
  if (existing !== undefined && existing.expiresAt > now) {
    return false;
  }
  STORE.set(key, { expiresAt: now + ttlSeconds * 1000 });
  return true;
}

/**
 * Hash a session-cookie value for use as a rate-limit key. Storing the
 * raw cookie in a server-process map would be PII — hashing keeps the
 * limiter functional without retaining session content.
 */
export function hashSessionKey(scope: string, sessionValue: string): string {
  const hash = createHash('sha256').update(`${scope}:${sessionValue}`).digest('hex');
  return `${scope}:${hash.slice(0, 16)}`;
}

/** Test-only — clears the in-memory store and the Upstash adapter cache. */
export function _resetRateLimitStore(): void {
  STORE.clear();
  upstashLimiter = undefined;
}
