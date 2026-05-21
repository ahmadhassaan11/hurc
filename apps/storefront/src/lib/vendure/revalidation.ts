/**
 * Cache-tag namespace shared by RSC `fetch({ next: { tags } })` calls and
 * the `revalidateTag` calls that Server Actions issue after Vendure mutations.
 * Sanity webhooks reuse this same namespace via the backend's
 * `hurc-sanity-bridge` plugin: `journalPost` documents emit
 * `[journal:<slug>, journal]`; `product` documents emit
 * `[product:<slug>, product]`. Keep the shapes in lockstep with
 * `apps/backend/src/plugins/hurc-sanity-bridge/payload-mapper.ts` and with
 * `lib/sanity/revalidate-allowlist.ts`.
 */

export const tags = {
  product: (slug: string) => `product:${slug}` as const,
  collection: (slug: string) => `collection:${slug}` as const,
  productList: (channelToken: string) => `productList:${channelToken}` as const,
  collectionList: (channelToken: string) => `collectionList:${channelToken}` as const,
  cart: (sessionId: string) => `cart:${sessionId}` as const,
  customer: (id: string) => `customer:${id}` as const,
  channel: (token: string) => `channel:${token}` as const,
  journal: (slug: string) => `journal:${slug}` as const,
  journalList: () => 'journal' as const,
  page: (slug: string) => `page:${slug}` as const,
  homepage: () => 'homepage' as const,
  activity: (slug: string) => `activity:${slug}` as const,
} as const;

export type Tag = ReturnType<(typeof tags)[keyof typeof tags]>;
