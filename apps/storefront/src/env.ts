import 'server-only';

import { z } from 'zod';

const Schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_ENV: z.enum(['dev', 'stg', 'prd']).default('dev'),

    // Vendure shop-api endpoints. The internal URL is what RSC fetches use;
    // the public URL is what the browser uses for the rare client-side fetch.
    NEXT_PUBLIC_VENDURE_SHOP_API_URL: z.string().url(),
    VENDURE_SHOP_API_URL_INTERNAL: z.string().url(),

    NEXT_PUBLIC_SITE_URL: z.string().url(),

    // Plausible loads unconditionally; PostHog only after consent.
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default('https://eu.posthog.com'),

    // Sanity (Phase 7 wires consumers; env is reserved now so .env.example
    // matches the doc-of-record at infra/env.reference.md).
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
    SANITY_API_READ_TOKEN: z.string().optional(),
    SANITY_REVALIDATE_SECRET: z.string().min(16).optional(),

    // Sentry — same DSN is consumed server- and client-side. DSN is not a
    // secret per Sentry docs; the client SDK still does not load until
    // analytics consent is granted.
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

    LOGTAIL_SOURCE_TOKEN_STOREFRONT: z.string().optional(),

    // Phase 6 wires payments; pinned now to keep .env.example honest.
    MOLLIE_PROFILE_ID: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),

    // Phase 8 — Impressum + DSGVO email footer. Required in production
    // (validated below). Dev/staging defaults live in `lib/legal/company.ts`
    // and are explicit placeholders.
    COMPANY_NAME: z.string().optional(),
    COMPANY_ADDRESS: z.string().optional(),
    COMPANY_VAT: z.string().optional(),
    COMPANY_REGISTRY: z.string().optional(),
    COMPANY_DIRECTORS: z.string().optional(),
    COMPANY_SUPPORT_EMAIL: z.string().email().optional(),
    COMPANY_SUPPORT_PHONE: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.NODE_ENV === 'production') {
      if (v.NEXT_PUBLIC_SENTRY_DSN === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['NEXT_PUBLIC_SENTRY_DSN'],
          message: 'NEXT_PUBLIC_SENTRY_DSN is required in production.',
        });
      }
      if (v.LOGTAIL_SOURCE_TOKEN_STOREFRONT === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['LOGTAIL_SOURCE_TOKEN_STOREFRONT'],
          message: 'LOGTAIL_SOURCE_TOKEN_STOREFRONT is required in production.',
        });
      }
      const companyKeys: (keyof typeof v)[] = [
        'COMPANY_NAME',
        'COMPANY_ADDRESS',
        'COMPANY_VAT',
        'COMPANY_REGISTRY',
        'COMPANY_DIRECTORS',
        'COMPANY_SUPPORT_EMAIL',
        'COMPANY_SUPPORT_PHONE',
      ];
      for (const key of companyKeys) {
        if (v[key] === undefined) {
          ctx.addIssue({
            code: 'custom',
            path: [key],
            message: `${key} is required in production (DSGVO Impressum).`,
          });
        }
      }
    }
  });

const parsed = Schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  process.stderr.write(`Storefront environment validation failed:\n${issues}\n`);
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
  throw new Error('Storefront environment validation failed');
}

export const env = parsed.data;
export type Env = typeof env;
