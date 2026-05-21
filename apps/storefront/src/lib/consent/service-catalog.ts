import type { KlaroService } from 'klaro';

/**
 * The four services declared in ADR-0009 §4. Each entry is the contract
 * Klaro renders to the visitor: purpose, required-vs-optional, cookies set.
 *
 * Translations live in Klaro's own `translations` map (filled by the
 * bridge); this file declares the shape and the policy (which services
 * are required, which default-on, what cookies they set).
 */
export const KLARO_SERVICE_NAMES = {
  functional: 'functional',
  plausible: 'plausible',
  posthog: 'posthog',
  sentry: 'sentry',
  klaviyo: 'klaviyo',
} as const;

export const klaroServiceCatalog: KlaroService[] = [
  {
    name: KLARO_SERVICE_NAMES.functional,
    purposes: ['functional'],
    required: true,
    cookies: ['session', 'NEXT_LOCALE', 'hurc-consent'],
  },
  {
    name: KLARO_SERVICE_NAMES.plausible,
    purposes: ['analytics'],
    required: true,
    default: true,
    cookies: [],
  },
  {
    name: KLARO_SERVICE_NAMES.posthog,
    purposes: ['analytics'],
    required: false,
    default: false,
    cookies: [[/^ph_/, '/', '']],
  },
  {
    name: KLARO_SERVICE_NAMES.sentry,
    purposes: ['analytics'],
    required: false,
    default: false,
    cookies: [[/^_sentry/, '/', '']],
  },
  {
    name: KLARO_SERVICE_NAMES.klaviyo,
    purposes: ['marketing'],
    required: false,
    default: false,
    cookies: [
      [/^__kla_/, '/', ''],
      [/^_kla_/, '/', ''],
    ],
  },
];

/**
 * Service names that flip the coarse `analytics` / `marketing` flags read
 * by the rest of the app. Kept in sync with `payloadToState` (and tested).
 */
export const ANALYTICS_SERVICES = [
  KLARO_SERVICE_NAMES.posthog,
  KLARO_SERVICE_NAMES.sentry,
] as const;

export const MARKETING_SERVICES = [KLARO_SERVICE_NAMES.klaviyo] as const;
