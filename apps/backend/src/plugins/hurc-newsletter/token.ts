import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Newsletter double-opt-in token.
 *
 * Format: `<emailB64>.<tsB64>.<sigB64>` where every part is `base64url`.
 *
 * - `emailB64`: the subscriber's email, encoded so the token survives a URL.
 * - `tsB64`: issued-at timestamp (ms since epoch), used to enforce TTL.
 * - `sigB64`: HMAC-SHA256(`<emailB64>.<tsB64>`, secret).
 *
 * The secret is COOKIE_SECRET (≥32 bytes, already required by env). Tokens
 * are tamper-evident, single-issuer, and expire after `MAX_AGE_MS`.
 */

const SEPARATOR = '.';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function b64encode(data: string): string {
  return Buffer.from(data, 'utf8').toString('base64url');
}

function b64decode(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf8');
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function issueToken(email: string, secret: string): string {
  const emailB64 = b64encode(email);
  const tsB64 = b64encode(String(Date.now()));
  const payload = `${emailB64}${SEPARATOR}${tsB64}`;
  const sig = sign(payload, secret);
  return `${payload}${SEPARATOR}${sig}`;
}

export type VerifyResult =
  | { ok: true; email: string; issuedAt: number }
  | { ok: false; reason: 'malformed' | 'bad-signature' | 'expired' };

export function verifyToken(token: string, secret: string): VerifyResult {
  const parts = token.split(SEPARATOR);
  if (parts.length !== 3) return { ok: false, reason: 'malformed' };
  const [emailB64, tsB64, providedSig] = parts;
  if (!emailB64 || !tsB64 || !providedSig) {
    return { ok: false, reason: 'malformed' };
  }
  const expectedSig = sign(`${emailB64}${SEPARATOR}${tsB64}`, secret);
  const a = Buffer.from(providedSig, 'base64url');
  const b = Buffer.from(expectedSig, 'base64url');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: 'bad-signature' };
  }
  const issuedAt = Number(b64decode(tsB64));
  if (!Number.isFinite(issuedAt)) return { ok: false, reason: 'malformed' };
  if (Date.now() - issuedAt > MAX_AGE_MS) {
    return { ok: false, reason: 'expired' };
  }
  return { ok: true, email: b64decode(emailB64), issuedAt };
}
