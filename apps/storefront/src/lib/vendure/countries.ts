import 'server-only';

import { AvailableCountriesDocument } from '@hurc/graphql/shop';

import { logger } from '@/lib/logger/server';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';
import { tags } from '@/lib/vendure/revalidation';

export type Country = { code: string; name: string };

const FALLBACK_COUNTRIES: Country[] = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'GB', name: 'United Kingdom' },
];

/**
 * Fetch the channel's enabled countries. Cached per channel; falls back
 * to a reasonable EU+UK default if the backend is unreachable so the
 * checkout doesn't crash.
 */
export async function loadCountries(channelToken = 'default'): Promise<Country[]> {
  try {
    const data = await shopRequest(
      AvailableCountriesDocument,
      {},
      { tags: [tags.channel(channelToken)], revalidate: 3600 },
    );
    const enabled = data.availableCountries
      .filter((c) => c.enabled)
      .map((c) => ({ code: c.code, name: c.name }));
    return enabled.length > 0 ? enabled : FALLBACK_COUNTRIES;
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return FALLBACK_COUNTRIES;
    }
    logger.warn({ err }, 'availableCountries fetch failed');
    return FALLBACK_COUNTRIES;
  }
}
