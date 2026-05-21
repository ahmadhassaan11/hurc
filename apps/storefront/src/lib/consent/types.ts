/**
 * Consent state surfaced to the rest of the app. Keep this minimal: the
 * downstream gates (`<PostHog>`, `<Sentry>`, marketing) only need
 * coarse-grained categories. Per-service granularity stays inside the
 * Klaro manager and the cookie payload.
 */
export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

export const defaultConsent: ConsentState = {
  analytics: false,
  marketing: false,
};

/**
 * Persisted cookie payload. Versioned so a privacy-policy change (bump of
 * `CONSENT_VERSION`) invalidates prior consents and triggers a re-prompt.
 */
export type ConsentCookiePayload = {
  v: string;
  services: {
    plausible: boolean;
    posthog: boolean;
    sentry: boolean;
    klaviyo: boolean;
  };
};
