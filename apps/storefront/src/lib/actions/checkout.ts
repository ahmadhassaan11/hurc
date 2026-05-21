'use server';

import 'server-only';

import {
  AddPaymentToOrderDocument,
  SetCustomerForOrderDocument,
  SetOrderBillingAddressDocument,
  SetOrderShippingAddressDocument,
  SetOrderShippingMethodDocument,
  TransitionOrderToStateDocument,
} from '@hurc/graphql/shop';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { actionClient } from '@/lib/actions/client';
import { logger } from '@/lib/logger/server';
import { shopMutation } from '@/lib/vendure/client';
import { isVendureErrorCode } from '@/lib/vendure/error-messages';
import { tags } from '@/lib/vendure/revalidation';

type ResultPayload = {
  __typename?: string;
  errorCode?: string;
  message?: string;
  state?: string | null;
};

function isErrorResult(value: ResultPayload | null | undefined): value is {
  __typename: string;
  errorCode: string;
  message: string;
} {
  return (
    value !== null &&
    value !== undefined &&
    'errorCode' in value &&
    isVendureErrorCode(value.errorCode)
  );
}

function invalidateCart(): void {
  revalidateTag(tags.cart('current'));
}

const addressFields = z.object({
  fullName: z.string().min(1).max(120),
  company: z.string().max(120).optional(),
  streetLine1: z.string().min(1).max(255),
  streetLine2: z.string().max(255).optional(),
  city: z.string().min(1).max(120),
  province: z.string().max(120).optional(),
  postalCode: z.string().min(1).max(40),
  countryCode: z.string().min(2).max(8),
  phoneNumber: z.string().max(40).optional(),
});

export const setCustomerForOrderAction = actionClient
  .metadata({ name: 'checkout/customer' })
  .inputSchema(
    z.object({
      emailAddress: z.string().email(),
      firstName: z.string().min(1).max(120),
      lastName: z.string().min(1).max(120),
      phoneNumber: z.string().max(40).optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(SetCustomerForOrderDocument, {
        input: parsedInput,
      });
      const result = data.setCustomerForOrder as ResultPayload;
      if (isErrorResult(result)) {
        return { ok: false as const, error: result.errorCode };
      }
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'setCustomerForOrder failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const setShippingAddressAction = actionClient
  .metadata({ name: 'checkout/shipping-address' })
  .inputSchema(addressFields.extend({ alsoBilling: z.boolean().optional() }))
  .action(async ({ parsedInput }) => {
    const { alsoBilling, ...input } = parsedInput;
    try {
      await shopMutation(SetOrderShippingAddressDocument, { input });
      if (alsoBilling === true) {
        await shopMutation(SetOrderBillingAddressDocument, { input });
      }
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'setShippingAddress failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const setBillingAddressAction = actionClient
  .metadata({ name: 'checkout/billing-address' })
  .inputSchema(addressFields)
  .action(async ({ parsedInput }) => {
    try {
      await shopMutation(SetOrderBillingAddressDocument, { input: parsedInput });
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'setBillingAddress failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const setShippingMethodAction = actionClient
  .metadata({ name: 'checkout/shipping-method' })
  .inputSchema(z.object({ shippingMethodId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(SetOrderShippingMethodDocument, {
        shippingMethodId: [parsedInput.shippingMethodId],
      });
      const result = data.setOrderShippingMethod as ResultPayload;
      if (isErrorResult(result)) {
        return { ok: false as const, error: result.errorCode };
      }
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'setShippingMethod failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const transitionToArrangingPaymentAction = actionClient
  .metadata({ name: 'checkout/transition-arranging' })
  .inputSchema(z.object({}))
  .action(async () => {
    try {
      const data = await shopMutation(TransitionOrderToStateDocument, {
        state: 'ArrangingPayment',
      });
      const result = data.transitionOrderToState as ResultPayload | null;
      if (isErrorResult(result)) {
        return { ok: false as const, error: result.errorCode };
      }
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'transition arranging failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

/**
 * Add a payment to the active order. Returns the order's payment metadata
 * so the caller can redirect the customer to Mollie / Stripe's hosted
 * checkout. Vendure's payment plugins (Mollie, Stripe) populate
 * `payments[].metadata.public.redirectUrl` with the provider's hosted
 * URL; the storefront `redirect`s there.
 */
export const addPaymentToOrderAction = actionClient
  .metadata({ name: 'checkout/add-payment' })
  .inputSchema(
    z.object({
      method: z.string().min(1),
      // Optional provider-specific metadata (e.g. Mollie issuer for iDEAL).
      metadata: z.record(z.string(), z.unknown()).optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(AddPaymentToOrderDocument, {
        input: {
          method: parsedInput.method,
          metadata: parsedInput.metadata ?? {},
        },
      });
      const order = data.addPaymentToOrder as ResultPayload & {
        payments?: { metadata?: { public?: { redirectUrl?: string } } }[];
        code?: string;
      };
      if (isErrorResult(order)) {
        return { ok: false as const, error: order.errorCode };
      }
      const lastPayment = order.payments?.[order.payments.length - 1];
      const redirectUrl = lastPayment?.metadata?.public?.redirectUrl ?? null;
      invalidateCart();
      return {
        ok: true as const,
        redirectUrl,
        orderCode: order.code ?? null,
      };
    } catch (err) {
      logger.error({ err }, 'addPaymentToOrder failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });
