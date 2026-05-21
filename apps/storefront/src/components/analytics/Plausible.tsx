'use client';

import Script from 'next/script';

import { clientEnv } from '@/env.client';

/**
 * Plausible's standard script. Loaded unconditionally — Plausible is
 * privacy-first by design and does not require explicit consent in the EU
 * (no cookies, no fingerprinting).
 *
 * `next-plausible@4` dropped the legacy `domain` prop in favour of a
 * per-site script URL we don't have in env. Using Next's `<Script>` keeps
 * the standard `data-domain` flow working and exposes `window.plausible(...)`
 * for `lib/analytics/plausible.ts` to call into.
 */
export function Plausible() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  return (
    <Script
      defer
      strategy="afterInteractive"
      data-domain={clientEnv.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.tagged-events.outbound-links.js"
    />
  );
}
