// Side-effect import: declares module augmentation for custom fields.
import './custom-fields.types.js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin, configureS3AssetStorage } from '@vendure/asset-server-plugin';
import {
  DefaultAssetNamingStrategy,
  DefaultLogger,
  LogLevel,
  type VendureConfig,
} from '@vendure/core';
import { EmailPlugin } from '@vendure/email-plugin';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq/index.js';
import { MolliePlugin } from '@vendure/payments-plugin/package/mollie/index.js';
import { StripePlugin } from '@vendure/payments-plugin/package/stripe/index.js';
import type { RedisOptions } from 'ioredis';

import { hurcEmailHandlers } from './email/handlers.js';
import { PassthroughEmailGenerator } from './email/passthrough-email-generator.js';
import { ReactEmailTemplateLoader } from './email/react-email-template-loader.js';
import { ResendEmailSender } from './email/resend-email-sender.js';
import { env } from './env.js';
import { GdprPlugin } from './plugins/hurc-gdpr/gdpr.plugin.js';
import { GpsrPlugin } from './plugins/hurc-gpsr/gpsr.plugin.js';
import { MeilisearchPlugin } from './plugins/hurc-meilisearch/index.js';
import { NewsletterPlugin } from './plugins/hurc-newsletter/newsletter.plugin.js';
import { SanityBridgePlugin } from './plugins/hurc-sanity-bridge/sanity-bridge.plugin.js';
import { SendcloudPlugin } from './plugins/hurc-sendcloud/sendcloud.plugin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUrl = new URL(env.DATABASE_URL);
const dbSchema = dbUrl.searchParams.get('schema') ?? 'public';

const redisUrl = new URL(env.REDIS_URL);
const redisConnection: RedisOptions = {
  host: redisUrl.hostname,
  port: redisUrl.port ? Number(redisUrl.port) : 6379,
  // BullMQ workers require this; ioredis defaults break long-poll BLPOPs.
  maxRetriesPerRequest: null,
  ...(redisUrl.password ? { password: decodeURIComponent(redisUrl.password) } : {}),
  ...(redisUrl.username && redisUrl.username !== 'default'
    ? { username: decodeURIComponent(redisUrl.username) }
    : {}),
  ...(redisUrl.pathname && redisUrl.pathname.length > 1
    ? { db: Number(redisUrl.pathname.slice(1)) }
    : {}),
};

const vendureLogLevel = env.NODE_ENV === 'development' ? LogLevel.Debug : LogLevel.Info;

export const config: VendureConfig = {
  apiOptions: {
    port: env.PORT,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    adminApiPlayground: env.NODE_ENV !== 'production',
    adminApiDebug: env.NODE_ENV !== 'production',
    shopApiPlayground: env.NODE_ENV !== 'production',
    shopApiDebug: env.NODE_ENV !== 'production',
    // The Meilisearch reindex controller batches at 500; Vendure defaults
    // both list-query limits to 100. Lift to 1000 to give the indexer
    // headroom without removing the upper bound.
    adminListQueryLimit: 1000,
    shopListQueryLimit: 1000,
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: env.SUPERADMIN_USERNAME,
      password: env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: { secret: env.COOKIE_SECRET },
    requireVerification: true,
  },
  dbConnectionOptions: {
    type: 'postgres',
    host: dbUrl.hostname,
    port: dbUrl.port ? Number(dbUrl.port) : 5432,
    username: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ''),
    schema: dbSchema,
    synchronize: false,
    migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
  },
  paymentOptions: { paymentMethodHandlers: [] },
  customFields: {
    // GPSR-related Product fields are added by GpsrPlugin (sub-task 2.7).
    Product: [
      {
        name: 'activity',
        type: 'string',
        list: true,
        options: [{ value: 'RUN' }, { value: 'TRAIN' }, { value: 'LIFT' }, { value: 'REST' }],
        nullable: false,
        // Vendure requires a defaultValue on non-nullable customFields. The
        // validate() below enforces "at least one" — the empty array is the
        // initial-creation default and is rejected at update-time by validate.
        defaultValue: [],
        validate: (value) =>
          Array.isArray(value) && value.length >= 1
            ? undefined
            : 'At least one activity (RUN, TRAIN, LIFT, REST) is required',
      },
      { name: 'materialComposition', type: 'localeString', nullable: true },
      { name: 'careInstructions', type: 'localeText', nullable: true },
      { name: 'sustainabilityNotes', type: 'localeText', nullable: true },
    ],
    Customer: [
      { name: 'marketingOptIn', type: 'boolean', defaultValue: false },
      { name: 'marketingOptInAt', type: 'datetime', nullable: true },
      { name: 'preferredActivity', type: 'string', nullable: true },
    ],
  },
  logger: new DefaultLogger({ level: vendureLogLevel }),
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      namingStrategy: new DefaultAssetNamingStrategy(),
      ...(env.assetStorage.kind === 's3'
        ? {
            assetUrlPrefix: env.assetStorage.urlPrefix,
            storageStrategyFactory: configureS3AssetStorage({
              bucket: env.assetStorage.bucket,
              credentials: {
                accessKeyId: env.assetStorage.accessKeyId,
                secretAccessKey: env.assetStorage.secretAccessKey,
              },
              nativeS3Configuration: {
                endpoint: env.assetStorage.endpoint,
                // Bunny's S3 API is path-style; virtual-host style 404s.
                forcePathStyle: true,
                // Bunny ignores `region` but the AWS SDK requires a value.
                region: 'auto',
                signatureVersion: 'v4',
              },
            }),
          }
        : {}),
    }),
    BullMQJobQueuePlugin.init({
      connection: redisConnection,
      // Retention shape moved from `setRetentions` (the ADR sample) to BullMQ's
      // standard `defaultJobOptions` in @vendure/job-queue-plugin 3.6.x.
      queueOptions: {
        defaultJobOptions: {
          removeOnComplete: { age: 24 * 3600, count: 1000 },
          removeOnFail: { age: 7 * 24 * 3600 },
        },
      },
    }),
    EmailPlugin.init({
      // We render React Email components → HTML in the templateLoader. The
      // generator is a passthrough that only interpolates {{ subject }} vars.
      templateLoader: new ReactEmailTemplateLoader(),
      emailGenerator: new PassthroughEmailGenerator(),
      emailSender: new ResendEmailSender(env.RESEND_API_KEY),
      // transport is required by the type but unused — Resend handles delivery.
      transport: { type: 'none' },
      handlers: hurcEmailHandlers,
      globalTemplateVars: {
        fromAddress: env.EMAIL_FROM,
        storefrontUrl: env.STOREFRONT_URL,
      },
    }),
    GpsrPlugin,
    MeilisearchPlugin,
    GdprPlugin,
    NewsletterPlugin,
    SanityBridgePlugin,
    SendcloudPlugin,
    // Per-channel Mollie API keys + per-method Stripe configuration land at
    // seed time (sub-task 2.9) — the plugins themselves only need the host
    // URLs at boot.
    MolliePlugin.init({ vendureHost: env.BACKEND_PUBLIC_URL }),
    StripePlugin.init({}),
    AdminUiPlugin.init({
      route: 'admin',
      port: env.ADMIN_UI_PORT,
    }),
  ],
};
