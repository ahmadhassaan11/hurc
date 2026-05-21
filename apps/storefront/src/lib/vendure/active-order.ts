import 'server-only';

import { ActiveOrderDocument } from '@hurc/graphql/shop';

import { type CartLineData } from '@/components/commerce/CartLine';
import { logger } from '@/lib/logger/server';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';

export type CartSummary = {
  totalQuantity: number;
  subTotalWithTax: number;
  shippingWithTax: number;
  totalWithTax: number;
  currencyCode: string;
  couponCodes: string[];
  lines: CartLineData[];
};

/**
 * Fetch the visitor's active Vendure order, normalised to the storefront
 * shape used by the cart drawer + mini-cart count. Returns `null` if
 * there is no order (anonymous, no items added) or if the backend is
 * unreachable. Always uncached — the order is per-session.
 */
export async function loadActiveOrder(): Promise<CartSummary | null> {
  try {
    const data = await shopRequest(ActiveOrderDocument, {});
    const order = data.activeOrder;
    if (order === null || order === undefined) return null;
    return {
      totalQuantity: order.totalQuantity,
      subTotalWithTax: order.subTotalWithTax,
      shippingWithTax: order.shippingWithTax,
      totalWithTax: order.totalWithTax,
      currencyCode: order.currencyCode,
      couponCodes: [...order.couponCodes],
      lines: order.lines.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        unitPriceWithTax: line.unitPriceWithTax,
        linePriceWithTax: line.linePriceWithTax,
        currencyCode: line.productVariant.currencyCode,
        productVariantName: line.productVariant.name,
        productName: line.productVariant.product.name,
        slug: line.productVariant.product.slug,
        optionLabels: line.productVariant.options.map((o) => o.name),
        asset: line.featuredAsset
          ? {
              source: line.featuredAsset.source,
              preview: line.featuredAsset.preview,
            }
          : null,
      })),
    };
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return null;
    }
    logger.warn({ err }, 'activeOrder fetch failed');
    return null;
  }
}
