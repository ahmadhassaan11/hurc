import 'server-only';

import { ActiveCustomerDocument } from '@hurc/graphql/shop';

import { logger } from '@/lib/logger/server';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';

export type ActiveCustomerSummary = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
  addresses: {
    id: string;
    fullName: string | null;
    company: string | null;
    streetLine1: string;
    streetLine2: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    countryCode: string;
    countryName: string;
    phoneNumber: string | null;
    defaultShippingAddress: boolean;
    defaultBillingAddress: boolean;
  }[];
  marketingOptIn: boolean | null;
  preferredActivity: readonly string[] | null;
};

/**
 * Fetch the signed-in customer or `null`. Always uncached
 * (`shopRequest` with no tags). The caller decides whether absence is
 * a redirect-to-login or a graceful "guest mode" rendering.
 */
export async function loadActiveCustomer(): Promise<ActiveCustomerSummary | null> {
  try {
    const data = await shopRequest(ActiveCustomerDocument, {});
    const c = data.activeCustomer;
    if (c === null || c === undefined) return null;
    return {
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      emailAddress: c.emailAddress,
      phoneNumber: c.phoneNumber ?? null,
      addresses: (c.addresses ?? []).map((a) => ({
        id: a.id,
        fullName: a.fullName ?? null,
        company: a.company ?? null,
        streetLine1: a.streetLine1,
        streetLine2: a.streetLine2 ?? null,
        city: a.city ?? null,
        province: a.province ?? null,
        postalCode: a.postalCode ?? null,
        countryCode: a.country.code,
        countryName: a.country.name,
        phoneNumber: a.phoneNumber ?? null,
        defaultShippingAddress: a.defaultShippingAddress ?? false,
        defaultBillingAddress: a.defaultBillingAddress ?? false,
      })),
      marketingOptIn: c.customFields?.marketingOptIn ?? null,
      preferredActivity:
        (c.customFields?.preferredActivity as readonly string[] | null | undefined) ?? null,
    };
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return null;
    }
    logger.warn({ err }, 'activeCustomer fetch failed');
    return null;
  }
}
