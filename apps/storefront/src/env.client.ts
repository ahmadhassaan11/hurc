/**
 * Client-side env. Only `NEXT_PUBLIC_*` keys are inlined by Next.js at build
 * time; reading any other key here at runtime returns `undefined`. Server
 * code must import from `./env` instead.
 */

import { z } from 'zod';

const Schema = z.object({
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

// Reference each key as a literal so Next.js inlines it at build time. A
// dynamic `process.env[key]` lookup would resolve to undefined on the client.
const raw = {
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

const parsed = Schema.safeParse(raw);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  throw new Error(`Client env validation failed:\n${issues}`);
}

export const clientEnv = parsed.data;
export type ClientEnv = typeof clientEnv;
