import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Sanity webhook signature verification.
 *
 * Header format (per Sanity docs): `sanity-webhook-signature: t=<ts>,v1=<sig>`
 * where `sig` is `HMAC-SHA256("<ts>.<rawBody>", secret)` encoded as base64url.
 *
 * The signature is computed over the **raw HTTP body bytes** — any
 * re-stringification breaks the comparison, which is why the bridge plugin
 * registers an `express.raw()` middleware on this route.
 *
 * `MAX_AGE_MS` defends against replay: even if an attacker captures a valid
 * signed body, they can't re-deliver it more than 5 minutes later.
 */

const MAX_AGE_MS = 5 * 60 * 1000;

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'malformed-header' | 'bad-signature' | 'expired' };

function parseHeader(header: string): { ts: string; sig: string } | null {
  const parts = new Map<string, string>();
  for (const segment of header.split(',')) {
    const [k, v] = segment.split('=');
    if (k && v) parts.set(k.trim(), v.trim());
  }
  const ts = parts.get('t');
  const sig = parts.get('v1');
  return ts && sig ? { ts, sig } : null;
}

export function verifySanitySignature(
  header: string | undefined,
  rawBody: Buffer,
  secret: string,
  now: number = Date.now(),
): VerifyResult {
  if (!header) return { ok: false, reason: 'malformed-header' };
  const parsed = parseHeader(header);
  if (!parsed) return { ok: false, reason: 'malformed-header' };

  const tsMs = Number(parsed.ts);
  if (!Number.isFinite(tsMs)) return { ok: false, reason: 'malformed-header' };
  if (Math.abs(now - tsMs) > MAX_AGE_MS) return { ok: false, reason: 'expired' };

  const expected = createHmac('sha256', secret)
    .update(`${parsed.ts}.${rawBody.toString('utf8')}`)
    .digest('base64url');

  const a = Buffer.from(parsed.sig, 'base64url');
  const b = Buffer.from(expected, 'base64url');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: 'bad-signature' };
  }
  return { ok: true };
}
