/**
 * PostHog browser client. Lazy-loaded, consent-gated. The init function is
 * a no-op until `analytics` consent is true; once the user grants consent,
 * the lazy import fires exactly once and subsequent calls are cheap.
 *
 * Phase 6 expands the surface with explicit event helpers; Phase 8 wires
 * the Klaro consent bridge that flips the gate. Phase 4 ships the seam.
 */

import type PostHogJsModule from 'posthog-js';

import { clientEnv } from '@/env.client';

type PostHogClient = typeof PostHogJsModule;

let initPromise: Promise<PostHogClient | null> | null = null;

export function ensurePostHog(consentGranted: boolean): Promise<PostHogClient | null> {
  if (typeof window === 'undefined' || !consentGranted) {
    return Promise.resolve(null);
  }

  initPromise ??= (async () => {
    const mod = await import('posthog-js');
    const ph: PostHogClient = mod.default;
    ph.init(clientEnv.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: clientEnv.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      autocapture: false,
      persistence: 'memory',
      person_profiles: 'identified_only',
    });
    return ph;
  })();

  return initPromise;
}

export async function trackPostHogEvent(
  eventName: string,
  consentGranted: boolean,
  props?: Record<string, unknown>,
): Promise<void> {
  const ph = await ensurePostHog(consentGranted);
  ph?.capture(eventName, props);
}
