import { createHmac } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { verifySanitySignature } from './signature.js';

const SECRET = 'sanity-secret-min-16-chars-xxxxxxx';

function makeHeader(rawBody: Buffer, secret: string, ts: number): string {
  const sig = createHmac('sha256', secret)
    .update(`${ts}.${rawBody.toString('utf8')}`)
    .digest('base64url');
  return `t=${ts},v1=${sig}`;
}

describe('verifySanitySignature', () => {
  it('accepts a valid header within the time window', () => {
    const body = Buffer.from(JSON.stringify({ _type: 'journalPost' }));
    const ts = Date.now();
    const header = makeHeader(body, SECRET, ts);
    expect(verifySanitySignature(header, body, SECRET, ts).ok).toBe(true);
  });

  it('rejects a tampered body', () => {
    const body = Buffer.from(JSON.stringify({ _type: 'journalPost' }));
    const ts = Date.now();
    const header = makeHeader(body, SECRET, ts);
    const tampered = Buffer.from(JSON.stringify({ _type: 'attackerPost' }));
    const result = verifySanitySignature(header, tampered, SECRET, ts);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('bad-signature');
  });

  it('rejects a header signed with a different secret', () => {
    const body = Buffer.from('{}');
    const ts = Date.now();
    const header = makeHeader(body, 'wrong-secret-min-16-chars-yyyyyyy', ts);
    expect(verifySanitySignature(header, body, SECRET, ts).ok).toBe(false);
  });

  it('rejects timestamps outside the 5-minute window', () => {
    const body = Buffer.from('{}');
    const ts = Date.now() - 6 * 60 * 1000;
    const header = makeHeader(body, SECRET, ts);
    const result = verifySanitySignature(header, body, SECRET, Date.now());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('expired');
  });

  it('rejects a missing or malformed header', () => {
    const body = Buffer.from('{}');
    expect(verifySanitySignature(undefined, body, SECRET).ok).toBe(false);
    expect(verifySanitySignature('garbage', body, SECRET).ok).toBe(false);
    expect(verifySanitySignature('t=,v1=', body, SECRET).ok).toBe(false);
  });
});
