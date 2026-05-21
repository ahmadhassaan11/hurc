/**
 * HURC backend seed entrypoint — `pnpm --filter @hurc/backend seed`.
 *
 * The seed is **idempotent**: every entity is looked up by a unique key
 * (email / slug / code) before creation. Re-running on a populated DB is a
 * no-op (the second run logs `unchanged` for every step).
 *
 * Phase-2 minimum: 1 ResponsiblePerson, 1 test customer, 1 collection, 1
 * product with 6 size variants. Wider seed (12 collections × 4 activities, 8
 * full products with photo upload, multi-channel shipping/payment methods)
 * is tracked as a post-Phase-2 follow-up — this seed is sufficient for the
 * Phase 2 gate's "GraphQL playground returns seeded products" + Meilisearch
 * reindex bootstrap.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { GlobalFlag } from '@vendure/common/lib/generated-types';
import type { ID } from '@vendure/core';
import {
  bootstrapWorker,
  ChannelService,
  CollectionService,
  CountryService,
  Customer,
  CustomerService,
  LanguageCode,
  Logger,
  ProductService,
  ProductVariantService,
  RequestContextService,
  TaxCategoryService,
  TaxRateService,
  TransactionalConnection,
  ZoneService,
} from '@vendure/core';

// ResponsiblePerson is a runtime entity class for repository lookups.
import { ResponsiblePerson } from '../plugins/hurc-gpsr/responsible-person.entity.js';
import { config } from '../vendure-config.js';

const loggerCtx = 'Seed';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

type ProductFixtureVariant = {
  skuSuffix: string;
  optionValues: string[];
  priceMinor: number;
  currency: string;
};

type ProductFixture = {
  slug: string;
  name: string;
  description: string;
  activity: string[];
  collectionSlug: string;
  variants: ProductFixtureVariant[];
};

async function main(): Promise<void> {
  // bootstrapWorker spins up the Nest app context without binding the HTTP
  // port, so the seed can run while the dev server is up on 3000.
  const { app } = await bootstrapWorker(config);
  const requestContextService = app.get(RequestContextService);
  let ctx = await requestContextService.create({ apiType: 'admin' });
  const connection = app.get(TransactionalConnection);
  const productService = app.get(ProductService);
  const productVariantService = app.get(ProductVariantService);
  const collectionService = app.get(CollectionService);
  const customerService = app.get(CustomerService);
  const taxCategoryService = app.get(TaxCategoryService);
  const taxRateService = app.get(TaxRateService);
  const countryService = app.get(CountryService);
  const zoneService = app.get(ZoneService);
  const channelService = app.get(ChannelService);

  // ── 0. Tax category — prerequisite for ProductVariantService.create.
  // Vendure's "fresh DB" doesn't auto-seed a TaxCategory; we own this row.
  // The full multi-zone tax setup (per ADR-0002 §2.5) is a follow-up — for
  // the Phase 2 gate a single Standard category is sufficient.
  const existingTax = await taxCategoryService.findAll(ctx, {
    skip: 0,
    take: 1,
  });
  let taxCategoryId: ID;
  if (existingTax.totalItems === 0) {
    const created = await taxCategoryService.create(ctx, {
      name: 'Standard',
      isDefault: true,
    });
    taxCategoryId = created.id;
    Logger.info(`Created TaxCategory id=${created.id}`, loggerCtx);
  } else {
    const first = existingTax.items[0];
    if (!first) throw new Error('TaxCategory list returned empty page');
    taxCategoryId = first.id;
    Logger.info('TaxCategory exists — unchanged', loggerCtx);
  }

  // ── 0a. Country + Zone + default-channel TaxZone + TaxRate.
  // ProductVariantService.create -> applyChannelPriceAndTax requires the
  // active channel to have a defaultTaxZone. We seed the bare minimum here
  // (one country, one zone, one tax rate); the full multi-zone EU/UK setup
  // (per ADR-0002 §2.5) is a follow-up tracked in ADR-0003.
  const existingCountries = await countryService.findAll(ctx, {
    filter: { code: { eq: 'DE' } },
  });
  let countryId: ID;
  if (existingCountries.totalItems === 0) {
    const created = await countryService.create(ctx, {
      code: 'DE',
      enabled: true,
      translations: [{ languageCode: LanguageCode.en, name: 'Germany' }],
    });
    countryId = created.id;
    Logger.info(`Created Country DE id=${created.id}`, loggerCtx);
  } else {
    const first = existingCountries.items[0];
    if (!first) throw new Error('Country list returned empty page');
    countryId = first.id;
    Logger.info('Country DE exists — unchanged', loggerCtx);
  }

  const existingZones = await zoneService.findAll(ctx, {
    filter: { name: { eq: 'EU' } },
  });
  let zoneId: ID;
  if (existingZones.totalItems === 0) {
    const created = await zoneService.create(ctx, {
      name: 'EU',
      memberIds: [countryId],
    });
    zoneId = created.id;
    Logger.info(`Created Zone EU id=${created.id}`, loggerCtx);
  } else {
    const first = existingZones.items[0];
    if (!first) throw new Error('Zone list returned empty page');
    zoneId = first.id;
    Logger.info('Zone EU exists — unchanged', loggerCtx);
  }

  const defaultChannel = await channelService.getDefaultChannel(ctx);
  if (defaultChannel.defaultTaxZone?.id !== zoneId) {
    const result = await channelService.update(ctx, {
      id: defaultChannel.id,
      defaultTaxZoneId: zoneId,
      defaultShippingZoneId: zoneId,
    });
    if ('errorCode' in result) {
      throw new Error(`Channel update failed: ${result.message}`);
    }
    Logger.info('Default channel: defaultTaxZone+ShippingZone -> EU', loggerCtx);
  } else {
    Logger.info('Default channel zones already set — unchanged', loggerCtx);
  }

  const existingRates = await taxRateService.findAll(ctx, {
    filter: { name: { eq: 'EU Standard 19%' } },
  });
  if (existingRates.totalItems === 0) {
    await taxRateService.create(ctx, {
      name: 'EU Standard 19%',
      enabled: true,
      value: 19,
      categoryId: taxCategoryId,
      zoneId,
    });
    Logger.info('Created TaxRate EU Standard 19%', loggerCtx);
  } else {
    Logger.info('TaxRate EU Standard 19% exists — unchanged', loggerCtx);
  }

  // The active-channel snapshot in `ctx` was created before we attached the
  // default tax/shipping zones, so it still reads `defaultTaxZone: null` and
  // any subsequent `applyChannelPriceAndTax` call will throw
  // `error.no-active-tax-zone`. Refresh ctx so it picks up the updated
  // channel for the catalog seed below.
  ctx = await requestContextService.create({ apiType: 'admin' });

  // ── 1. Responsible person ────────────────────────────────────────────────
  const rpRepo = connection.getRepository(ctx, ResponsiblePerson);
  let rp = await rpRepo.findOne({
    where: { email: 'compliance@hurc.local' },
  });
  if (!rp) {
    rp = await rpRepo.save(
      rpRepo.create({
        name: 'HURC Compliance',
        email: 'compliance@hurc.local',
        address: 'Bahnhofstrasse 1, 10115 Berlin, Germany',
      }),
    );
    Logger.info(`Created ResponsiblePerson id=${rp.id}`, loggerCtx);
  } else {
    Logger.info('ResponsiblePerson exists — unchanged', loggerCtx);
  }

  // ── 2. Test customer ─────────────────────────────────────────────────────
  const customerRepo = connection.getRepository(ctx, Customer);
  const existingCustomer = await customerRepo.findOne({
    where: { emailAddress: 'tester@hurc.com' },
  });
  if (!existingCustomer) {
    const result = await customerService.create(
      ctx,
      {
        emailAddress: 'tester@hurc.com',
        firstName: 'Test',
        lastName: 'Customer',
      },
      'Hurc!Test123',
    );
    if ('errorCode' in result) {
      throw new Error(`Customer create failed: ${result.message}`);
    }
    Logger.info(`Created test customer id=${result.id}`, loggerCtx);
  } else {
    Logger.info('Test customer exists — unchanged', loggerCtx);
  }

  // ── 2a. Activity collections wired to the primary nav ──────────────────
  // Phase 6 nav links to /run /train /yoga /studio /sale; only `run` ships
  // a seeded product. Each collection gets a `variant-name-filter` keyed on
  // the slug term (e.g. 'Run' → matches "HURC Run Tee XS" etc.) so products
  // auto-attach via filter rules rather than direct join writes. The other
  // collections render empty until a matching product is added.
  const buildVariantNameFilter = (term: string) => [
    {
      code: 'variant-name-filter',
      arguments: [
        { name: 'operator', value: '"contains"' },
        { name: 'term', value: JSON.stringify(term) },
      ],
    },
  ];
  const navCollections: Array<{ slug: string; term: string }> = [
    { slug: 'run', term: 'Run' },
    { slug: 'train', term: 'Train' },
    { slug: 'yoga', term: 'Yoga' },
    { slug: 'studio', term: 'Studio' },
    { slug: 'sale', term: 'Sale' },
  ];
  for (const { slug, term } of navCollections) {
    const existing = await collectionService.findAll(ctx, {
      filter: { slug: { eq: slug } },
    });
    const found = existing.items[0];
    if (!found) {
      const created = await collectionService.create(ctx, {
        translations: [
          {
            languageCode: LanguageCode.en,
            name: slug.toUpperCase(),
            slug,
            description: '',
          },
        ],
        filters: buildVariantNameFilter(term),
      });
      Logger.info(`Created collection slug=${slug} id=${created.id}`, loggerCtx);
    } else if ((found.filters?.length ?? 0) === 0) {
      // Older seed run created the collection with empty filters; backfill.
      await collectionService.update(ctx, {
        id: found.id,
        filters: buildVariantNameFilter(term),
      });
      Logger.info(`Updated collection slug=${slug} with variant-name-filter`, loggerCtx);
    } else {
      Logger.info(`Collection slug=${slug} exists with filter — unchanged`, loggerCtx);
    }
  }

  // ── 3. Catalog (collections + products from fixture) ─────────────────────
  const fixtures = JSON.parse(
    readFileSync(path.join(__dirname, 'fixtures/hurc-products.json'), 'utf8'),
  ) as ProductFixture[];

  for (const fixture of fixtures) {
    // Collection lookups happen in the navCollections block above; the
    // fixture loop below only owns Product + Variant rows.

    // Product — find via slug filter, create if absent.
    const productList = await productService.findAll(ctx, {
      filter: { slug: { eq: fixture.slug } },
    });
    let product = productList.items[0];
    if (!product) {
      product = await productService.create(ctx, {
        translations: [
          {
            languageCode: LanguageCode.en,
            name: fixture.name,
            slug: fixture.slug,
            description: fixture.description,
          },
        ],
        enabled: true,
        customFields: {
          activity: fixture.activity,
          responsiblePersonId: rp.id,
          manufacturerInfo: 'HURC GmbH, Berlin',
          warnings: 'Wash before first use. Do not bleach.',
          traceabilityCode: `HURC-${fixture.slug.toUpperCase()}`,
        },
      });
      Logger.info(`Created product slug=${fixture.slug} id=${product.id}`, loggerCtx);
    } else {
      Logger.info(`Product slug=${fixture.slug} exists — unchanged`, loggerCtx);
    }

    // Variants — idempotent per-SKU. Survives partial-failure restarts where
    // a product was created but its variant loop didn't complete.
    //
    // Phase-2 minimum: one variant per product. Multi-size variants need a
    // ProductOptionGroup ("Size") with 6 options (XS..XXL); ADR-0003 D9
    // tracks the full multi-variant seed as a follow-up. With no option
    // groups, Vendure caps a product at one variant (otherwise
    // "options-combination-already-exists" fires on the second).
    const variantsToCreate = fixture.variants.slice(0, 1);
    let createdVariants = 0;
    for (const v of variantsToCreate) {
      const sku = `${fixture.slug.toUpperCase()}-${v.skuSuffix}`;
      const existingVariants = await productVariantService.findAll(ctx, {
        filter: { sku: { eq: sku } },
      });
      if (existingVariants.items.length > 0) continue;
      await productVariantService.create(ctx, [
        {
          productId: product.id,
          translations: [
            {
              languageCode: LanguageCode.en,
              name: `${fixture.name} ${v.optionValues.join(' ')}`,
            },
          ],
          sku,
          price: v.priceMinor,
          taxCategoryId,
          stockOnHand: 100,
          trackInventory: GlobalFlag.INHERIT,
          optionIds: [],
        },
      ]);
      createdVariants += 1;
    }
    if (createdVariants > 0) {
      Logger.info(
        `Created ${createdVariants}/${variantsToCreate.length} variants for ${fixture.slug}`,
        loggerCtx,
      );
    } else {
      Logger.info(
        `All ${variantsToCreate.length} variants for ${fixture.slug} exist — unchanged`,
        loggerCtx,
      );
    }
  }

  // Collection filter changes queue an apply-collection-filters job and a
  // search-index reindex job. Give the worker a few seconds to drain them
  // before we tear the app down — otherwise the storefront `/run` PLP
  // renders empty until the next worker tick.
  Logger.info('Seed complete — waiting for collection-filter + reindex jobs', loggerCtx);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await app.close();
}

main()
  .then(() => {
    // BullMQ workers keep the event loop alive past app.close(); force-exit
    // so this script can be chained from infra/scripts/dev-up.sh.
    process.exit(0);
  })
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
