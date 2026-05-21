'use server';

import 'server-only';

import {
  AddItemToOrderDocument,
  AdjustOrderLineDocument,
  ApplyCouponCodeDocument,
  RemoveCouponCodeDocument,
  RemoveOrderLineDocument,
} from '@hurc/graphql/shop';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { actionClient } from '@/lib/actions/client';
import { logger } from '@/lib/logger/server';
import { shopMutation } from '@/lib/vendure/client';
import { isVendureErrorCode } from '@/lib/vendure/error-messages';
import { tags } from '@/lib/vendure/revalidation';

type ResultPayload<T extends string> = { __typename: T };

function isErrorResult(
  value: { __typename?: string; errorCode?: string } | null | undefined,
): value is {
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
  // Until we read the order's session-scoped id, we invalidate the cart
  // bucket as a whole. Refining to per-session tags is a polish pass.
  revalidateTag(tags.cart('current'));
}

export const addToCartAction = actionClient
  .metadata({ name: 'cart/add' })
  .inputSchema(
    z.object({
      productVariantId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(AddItemToOrderDocument, parsedInput);
      const order = data.addItemToOrder as ResultPayload<string>;
      if (isErrorResult(order)) {
        return { ok: false as const, error: order.errorCode };
      }
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'addToCart failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const adjustOrderLineAction = actionClient
  .metadata({ name: 'cart/adjust' })
  .inputSchema(
    z.object({
      orderLineId: z.string().min(1),
      quantity: z.number().int().min(0).max(99),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(AdjustOrderLineDocument, parsedInput);
      const order = data.adjustOrderLine as ResultPayload<string>;
      if (isErrorResult(order)) {
        return { ok: false as const, error: order.errorCode };
      }
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'adjustOrderLine failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const removeOrderLineAction = actionClient
  .metadata({ name: 'cart/remove' })
  .inputSchema(z.object({ orderLineId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(RemoveOrderLineDocument, parsedInput);
      const order = data.removeOrderLine as ResultPayload<string>;
      if (isErrorResult(order)) {
        return { ok: false as const, error: order.errorCode };
      }
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'removeOrderLine failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const applyCouponCodeAction = actionClient
  .metadata({ name: 'cart/coupon-apply' })
  .inputSchema(z.object({ couponCode: z.string().min(1).max(64) }))
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(ApplyCouponCodeDocument, parsedInput);
      const order = data.applyCouponCode as ResultPayload<string>;
      if (isErrorResult(order)) {
        return { ok: false as const, error: order.errorCode };
      }
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'applyCouponCode failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const removeCouponCodeAction = actionClient
  .metadata({ name: 'cart/coupon-remove' })
  .inputSchema(z.object({ couponCode: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    try {
      await shopMutation(RemoveCouponCodeDocument, parsedInput);
      invalidateCart();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'removeCouponCode failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });
