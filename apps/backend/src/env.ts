import { z } from 'zod';

const Schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_ENV: z.enum(['dev', 'stg', 'prd']).default('dev'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    ADMIN_UI_PORT: z.coerce.number().int().min(1).max(65535).default(3002),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    RUN_MIGRATIONS_ON_BOOT: z
      .union([z.boolean(), z.enum(['true', 'false', '1', '0'])])
      .transform((v) => v === true || v === 'true' || v === '1')
      .default(false),

    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET must be ≥32 bytes'),
    SUPERADMIN_USERNAME: z.string().min(1),
    SUPERADMIN_PASSWORD: z.string().min(1),
    STOREFRONT_URL: z.string().url(),
    BACKEND_PUBLIC_URL: z.string().url(),

    // Bunny.net S3-compatible asset storage. Optional in dev (falls back to
    // local disk); mandatory in stg/prd. The four keys are all-or-none.
    ASSET_BUNNY_S3_ACCESS_KEY: z.string().min(1).optional(),
    ASSET_BUNNY_S3_SECRET_KEY: z.string().min(1).optional(),
    ASSET_BUNNY_S3_BUCKET: z.string().min(1).optional(),
    ASSET_BUNNY_S3_ENDPOINT: z.string().url().optional(),
    ASSET_PUBLIC_URL_PREFIX: z.string().url().optional(),

    // Meilisearch. Optional in dev (plugin no-ops without breaking events);
    // required in production.
    MEILI_HOST: z.string().url().optional(),
    MEILI_MASTER_KEY: z.string().min(16).optional(),

    // Resend transactional email.
    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required (e.g. "HURC <hello@mail.hurc.com>")'),
    EMAIL_REPLY_TO: z.string().min(1).optional(),

    // Sanity → storefront ISR bridge.
    SANITY_WEBHOOK_SECRET: z.string().min(16),
    NEXT_REVALIDATE_SECRET: z.string().min(16),

    // Sendcloud REST integration. Optional in dev (calculator falls back to a
    // flat rate so checkout still works); required in production.
    SENDCLOUD_PUBLIC_KEY: z.string().min(1).optional(),
    SENDCLOUD_SECRET_KEY: z.string().min(1).optional(),

    // Payments. Mollie API key per-channel (per-PaymentMethod handler args
    // in seed); Stripe pair (secret + webhook). All optional in dev so the
    // backend boots without payment accounts; production tightened below.
    MOLLIE_API_KEY: z.string().min(1).optional(),
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

    LOGTAIL_SOURCE_TOKEN_BACKEND: z.string().optional(),
    SENTRY_DSN_BACKEND: z.string().url().optional(),

    // Phase 8 — Impressum / DSGVO email footer. Required in production
    // (validated below); placeholders fill in dev/staging via the
    // backend's `lib/legal/company.ts` (mirror of the storefront's view).
    COMPANY_NAME: z.string().optional(),
    COMPANY_ADDRESS: z.string().optional(),
    COMPANY_VAT: z.string().optional(),
    COMPANY_REGISTRY: z.string().optional(),
    COMPANY_DIRECTORS: z.string().optional(),
    COMPANY_SUPPORT_EMAIL: z.string().email().optional(),
    COMPANY_SUPPORT_PHONE: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    const s3Keys = [
      'ASSET_BUNNY_S3_ACCESS_KEY',
      'ASSET_BUNNY_S3_SECRET_KEY',
      'ASSET_BUNNY_S3_BUCKET',
      'ASSET_BUNNY_S3_ENDPOINT',
    ] as const;
    const set = s3Keys.filter((k) => v[k] !== undefined);
    if (set.length > 0 && set.length < s3Keys.length) {
      const missing = s3Keys.filter((k) => v[k] === undefined);
      for (const k of missing) {
        ctx.addIssue({
          code: 'custom',
          path: [k],
          message: `Bunny S3 storage is partially configured; ${k} is also required.`,
        });
      }
    }
    if (set.length === s3Keys.length && v.ASSET_PUBLIC_URL_PREFIX === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['ASSET_PUBLIC_URL_PREFIX'],
        message:
          'ASSET_PUBLIC_URL_PREFIX is required when Bunny S3 storage is configured (Pull Zone host).',
      });
    }
    if (v.NODE_ENV === 'production' && set.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['ASSET_BUNNY_S3_BUCKET'],
        message: 'Bunny S3 storage must be fully configured in production.',
      });
    }
    const meiliKeys = ['MEILI_HOST', 'MEILI_MASTER_KEY'] as const;
    const meiliSet = meiliKeys.filter((k) => v[k] !== undefined);
    if (meiliSet.length > 0 && meiliSet.length < meiliKeys.length) {
      const missing = meiliKeys.filter((k) => v[k] === undefined);
      for (const k of missing) {
        ctx.addIssue({
          code: 'custom',
          path: [k],
          message: `Meilisearch is partially configured; ${k} is also required.`,
        });
      }
    }
    if (v.NODE_ENV === 'production' && meiliSet.length < meiliKeys.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['MEILI_HOST'],
        message: 'Meilisearch must be fully configured in production.',
      });
    }
    const sendcloudKeys = ['SENDCLOUD_PUBLIC_KEY', 'SENDCLOUD_SECRET_KEY'] as const;
    const sendcloudSet = sendcloudKeys.filter((k) => v[k] !== undefined);
    if (sendcloudSet.length > 0 && sendcloudSet.length < sendcloudKeys.length) {
      const missing = sendcloudKeys.filter((k) => v[k] === undefined);
      for (const k of missing) {
        ctx.addIssue({
          code: 'custom',
          path: [k],
          message: `Sendcloud is partially configured; ${k} is also required.`,
        });
      }
    }
    if (v.NODE_ENV === 'production' && sendcloudSet.length < sendcloudKeys.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['SENDCLOUD_PUBLIC_KEY'],
        message: 'Sendcloud must be fully configured in production.',
      });
    }
    const stripeKeys = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] as const;
    const stripeSet = stripeKeys.filter((k) => v[k] !== undefined);
    if (stripeSet.length > 0 && stripeSet.length < stripeKeys.length) {
      const missing = stripeKeys.filter((k) => v[k] === undefined);
      for (const k of missing) {
        ctx.addIssue({
          code: 'custom',
          path: [k],
          message: `Stripe is partially configured; ${k} is also required.`,
        });
      }
    }
    if (v.NODE_ENV === 'production') {
      if (v.MOLLIE_API_KEY === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['MOLLIE_API_KEY'],
          message: 'MOLLIE_API_KEY is required in production.',
        });
      }
      if (stripeSet.length < stripeKeys.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['STRIPE_SECRET_KEY'],
          message: 'Stripe must be fully configured in production.',
        });
      }
      const companyKeys = [
        'COMPANY_NAME',
        'COMPANY_ADDRESS',
        'COMPANY_VAT',
        'COMPANY_REGISTRY',
        'COMPANY_DIRECTORS',
        'COMPANY_SUPPORT_EMAIL',
        'COMPANY_SUPPORT_PHONE',
      ] as const;
      for (const key of companyKeys) {
        if (v[key] === undefined) {
          ctx.addIssue({
            code: 'custom',
            path: [key],
            message: `${key} is required in production (DSGVO Impressum block in transactional emails).`,
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
  // Cannot use logger here — env must resolve before the logger is constructed.
  process.stderr.write(`Environment validation failed:\n${issues}\n`);
  process.exit(1);
}

const raw = parsed.data;

export type AssetStorageConfig =
  | { kind: 'local' }
  | {
      kind: 's3';
      accessKeyId: string;
      secretAccessKey: string;
      bucket: string;
      endpoint: string;
      urlPrefix: string;
    };

const assetStorage: AssetStorageConfig =
  raw.ASSET_BUNNY_S3_ACCESS_KEY !== undefined &&
  raw.ASSET_BUNNY_S3_SECRET_KEY !== undefined &&
  raw.ASSET_BUNNY_S3_BUCKET !== undefined &&
  raw.ASSET_BUNNY_S3_ENDPOINT !== undefined &&
  raw.ASSET_PUBLIC_URL_PREFIX !== undefined
    ? {
        kind: 's3',
        accessKeyId: raw.ASSET_BUNNY_S3_ACCESS_KEY,
        secretAccessKey: raw.ASSET_BUNNY_S3_SECRET_KEY,
        bucket: raw.ASSET_BUNNY_S3_BUCKET,
        endpoint: raw.ASSET_BUNNY_S3_ENDPOINT,
        urlPrefix: raw.ASSET_PUBLIC_URL_PREFIX,
      }
    : { kind: 'local' };

export type SearchConfig = { kind: 'enabled'; host: string; apiKey: string } | { kind: 'disabled' };

const search: SearchConfig =
  raw.MEILI_HOST !== undefined && raw.MEILI_MASTER_KEY !== undefined
    ? { kind: 'enabled', host: raw.MEILI_HOST, apiKey: raw.MEILI_MASTER_KEY }
    : { kind: 'disabled' };

export type ShippingConfig =
  | { kind: 'enabled'; publicKey: string; secretKey: string }
  | { kind: 'disabled' };

const shipping: ShippingConfig =
  raw.SENDCLOUD_PUBLIC_KEY !== undefined && raw.SENDCLOUD_SECRET_KEY !== undefined
    ? {
        kind: 'enabled',
        publicKey: raw.SENDCLOUD_PUBLIC_KEY,
        secretKey: raw.SENDCLOUD_SECRET_KEY,
      }
    : { kind: 'disabled' };

export const env = { ...raw, assetStorage, search, shipping };
export type Env = typeof env;
