import 'server-only';

import {
  EligiblePaymentMethodsDocument,
  EligibleShippingMethodsDocument,
} from '@hurc/graphql/shop';

import { logger } from '@/lib/logger/server';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';

export type EligibleShippingMethod = {
  id: string;
  code: string;
  name: string;
  description: string;
  priceWithTax: number;
};

export type EligiblePaymentMethod = {
  id: string;
  code: string;
  name: string;
  description: string;
  isEligible: boolean;
  eligibilityMessage: string | null;
};

export async function loadEligibleShippingMethods(): Promise<EligibleShippingMethod[]> {
  try {
    const data = await shopRequest(EligibleShippingMethodsDocument, {});
    return data.eligibleShippingMethods.map((m) => ({
      id: m.id,
      code: m.code,
      name: m.name,
      description: m.description,
      priceWithTax: m.priceWithTax,
    }));
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return [];
    }
    logger.warn({ err }, 'eligibleShippingMethods fetch failed');
    return [];
  }
}

export async function loadEligiblePaymentMethods(): Promise<EligiblePaymentMethod[]> {
  try {
    const data = await shopRequest(EligiblePaymentMethodsDocument, {});
    return data.eligiblePaymentMethods.map((m) => ({
      id: m.id,
      code: m.code,
      name: m.name,
      description: m.description,
      isEligible: m.isEligible,
      eligibilityMessage: m.eligibilityMessage ?? null,
    }));
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return [];
    }
    logger.warn({ err }, 'eligiblePaymentMethods fetch failed');
    return [];
  }
}
