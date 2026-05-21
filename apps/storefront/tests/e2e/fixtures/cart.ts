/**
 * Cart fixture — seeds an anonymous, non-empty cart against the live
 * Vendure shop-api and returns the session cookie for the test browser
 * context to adopt.
 *
 * Skipped when the backend is unreachable (see fixtures/backend.ts).
 */
import type { BrowserContext } from '@playwright/test';

const SHOP_API =
  process.env.VENDURE_SHOP_API_URL_INTERNAL ??
  process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL ??
  'http://localhost:3001/shop-api';

const FIRST_VARIANT_QUERY = `query FirstVariant {
  products(options: { take: 1 }) {
    items {
      variants { id }
    }
  }
}`;

const ADD_TO_ORDER_MUTATION = `mutation AddToOrder($id: ID!, $qty: Int!) {
  addItemToOrder(productVariantId: $id, quantity: $qty) {
    __typename
  }
}`;

export async function seedCart(context: BrowserContext): Promise<void> {
  const productRes = await fetch(SHOP_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: FIRST_VARIANT_QUERY }),
  });
  if (!productRes.ok) throw new Error(`shop-api unreachable (${productRes.status})`);
  const { data } = (await productRes.json()) as {
    data: { products: { items: { variants: { id: string }[] }[] } };
  };
  const variantId = data.products.items[0]?.variants[0]?.id;
  if (variantId === undefined) throw new Error('no products seeded in dev backend');

  const addRes = await fetch(SHOP_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: ADD_TO_ORDER_MUTATION,
      variables: { id: variantId, qty: 1 },
    }),
  });
  const sessionCookie = addRes.headers.get('set-cookie');
  if (sessionCookie === null) throw new Error('shop-api did not set a session cookie');

  // Vendure ships the cookie under `session=...; ...`; copy it into the
  // browser context so the storefront RSC fetches see the same cart.
  const value = sessionCookie.split(';')[0]?.split('=')[1];
  if (value === undefined) throw new Error('malformed session cookie');
  await context.addCookies([
    {
      name: 'session',
      value,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}
