# ADR 0007 — Phase 6 implementation plan (commerce flows)

- **Status:** Proposed (planning only — no code yet at the time this ADR was written)
- **Date:** 2026-05-03
- **Decision owner:** Lead full-stack engineer
- **Supersedes:** Phase plan item 6 of [ADR-0001](./0001-stack.md), refined into
  seven executable sub-phases.
- **Depends on:** Phase 5 (`phase-5-complete` tag) — every commerce surface
  composes the `@hurc/ui` primitive layer.

## Why this plan exists

Phase 6 is the **user-visible commerce surface**: header, footer, home,
PLP, PDP, cart drawer, checkout, account. It is the largest phase by
far — roughly 4× the work of Phase 4 or Phase 5 combined — and it is
where every prior phase's contract gets exercised end-to-end:

- Phase 2 plugins (Meili, GPSR, Sendcloud, Mollie, Stripe, GDPR) become
  real surfaces a customer touches.
- Phase 3 typed operations (every shop-api `*.graphql` file) get
  consumers; mutations finally fire.
- Phase 4 RSC fetch wrapper, Server Actions, consent gate, `revalidateTag`
  conventions get production traffic.
- Phase 5 primitives compose into the actual UI.

If we plan Phase 6 as one bullet, we ship a mess. This ADR splits it
into seven sub-phases, each independently shippable, each ending
gate-green. The sub-phases land **sequentially** because each later
one builds on the layout/state model of the earlier ones.

## Decision summary

1. **Sub-phase split:**
   - **6.1 Layout shell** — Header, Footer, locale switcher, mini-cart
     trigger, mobile nav, container/grid primitives, theme + skip-to-content.
   - **6.2 Home page** — hero, activity grid, featured collection
     stripe, newsletter signup, brand statement.
   - **6.3 PLP** — `/[locale]/[collection-slug]` with grid, sorting,
     facet filtering, paginated list.
   - **6.4 PDP** — `/[locale]/products/[slug]` with gallery, variant
     picker, add-to-cart, GPSR panel, related products, JSON-LD.
   - **6.5 Cart drawer** — Sheet primitive triggered from header; full
     line-item editing, coupon application, totals, checkout CTA.
   - **6.6 Checkout** — multi-step (customer → shipping → payment →
     review) with Mollie Components + Stripe Elements wiring.
   - **6.7 Account** — login, register, verify, password reset,
     profile, addresses, orders, GDPR self-service.
2. **Forms:** `react-hook-form@7.75.0` + `@hookform/resolvers@5.2.2` for
   every form. `Field` primitive (Phase 5) composes with `Controller`.
   Zod schemas mirror the Vendure-input shape.
3. **Server Actions, no client mutations:** Every `shopMutation` call
   lives behind a `next-safe-action` action. Client islands call the
   action; the action calls Vendure; the action calls `revalidateTag`.
   Vendure error codes (`UnionResult` errorCode strings) map to
   localized messages via `next-intl`'s `t.rich(...)`.
4. **Cart state model:** Vendure's `activeOrder` is the source of
   truth. The storefront does **not** maintain a parallel cart store.
   Mini-cart count + drawer contents both read from `activeOrder`.
   Optimistic updates use React 19's `useOptimistic` for snappy UX,
   but the Vendure response is the eventual reconciliation.
5. **PLP pagination:** **offset+limit**, page-numbered URLs
   (`/[locale]/[collection]?page=2&sort=price-asc`). Vendure's
   `ProductListOptions` supports `skip`/`take`/`sort`/`filter`
   natively; cursor pagination is not implemented backend-side.
   Performance is acceptable up to ~10k SKUs (Vendure's own threshold).
   Cursor is a Phase 9-or-later optimization if needed.
6. **Variant selection ergonomics:** Reproduce the option-group product
   model — each `ProductOptionGroup` becomes a row of clickable chips
   (Size, Color, etc.). Selecting one option per group resolves to a
   single `ProductVariant` via local lookup against the product's
   `variants[].options[]`. URL state via `?size=m&color=black` is
   **not** added in Phase 6 (defer to a polish pass) — selection lives
   in component state and resets on navigation.
7. **Image strategy:** `next/image` on the Bunny CDN host (whitelisted
   Phase 4). Asset URL transform (Bunny URL templates) lives in
   `apps/storefront/src/lib/asset.ts`. No client-side cropping.
   `priority` set on the first PDP gallery image and the home hero;
   everywhere else lazy by default. `sizes` props derived from the
   layout grid breakpoints declared in §6.1.
8. **Payments:** Mollie Components loaded via Next `<Script>` from
   `https://js.mollie.com/v1/mollie.js`. **Mollie does not publish a
   maintained npm package for the runtime;** we wire it via the global
   `window.Mollie` constructor (typed locally in
   `src/lib/payments/mollie.types.ts`). Stripe Elements via
   `@stripe/react-stripe-js@6.3.0` + `@stripe/stripe-js@9.4.0`
   (Stripe is the fallback; Mollie is primary per spec). Both
   provider islands are consent-independent (payment forms do not
   constitute analytics under GDPR).
9. **JSON-LD structured data:** PDP emits `Product` + `Offer` +
   `BreadcrumbList`. PLP emits `BreadcrumbList`. Home emits
   `Organization` + `WebSite`. JSON serialised via a thin helper in
   `src/lib/seo/structured-data.ts`; never injected via
   `dangerouslySetInnerHTML` from user input.
10. **Vendure error code mapping:** A single `src/lib/vendure/error-messages.ts`
    maps every shop-api `ErrorCode` enum value to an `errors.<code>`
    `next-intl` key. Server Actions return `{ ok: false, error: code }`
    and the calling client island looks the code up via `t(...)` for the
    visible toast/inline message.
11. **Search:** Mini-search bar in the header uses
    `cmdk@1.1.1` for the command-menu UX. Backend Meilisearch is
    queried via a thin Server Action that wraps the existing
    `hurc-meilisearch` plugin's REST surface. **Defer until 6.4** so
    PDP wiring lands first; search is a 6.4 ride-along, not its own
    sub-phase.
12. **Mobile nav:** `Sheet` primitive (left side) opens the full-screen
    nav on mobile (≤768px). Desktop nav lives in the header bar.
13. **Locale switcher:** `DropdownMenu` primitive in the header lists
    the six locales; selecting routes to the same path on the new
    locale via `next-intl`'s `redirect`. Persisted via the `NEXT_LOCALE`
    cookie that next-intl sets automatically.
14. **`framer-motion` use:** Reserved for tasteful page-level
    transitions (hero reveal, PLP card entry stagger, drawer enter/exit
    if Radix's defaults aren't enough). Never on form controls or
    accessibility-critical elements. Every animation honors
    `prefers-reduced-motion`.

## Verified version pins (as of 2026-05-03)

```
react-hook-form           7.75.0
@hookform/resolvers       5.2.2
@stripe/stripe-js         9.4.0
@stripe/react-stripe-js   6.3.0
cmdk                      1.1.1
@vercel/og                0.11.1   (only if we move OG image generation off
                                    the existing edge route — defer)
```

Mollie's web runtime is **not on npm**. It is loaded via
`<Script src="https://js.mollie.com/v1/mollie.js">` per Mollie's docs.
We type the global `window.Mollie` constructor locally in
`apps/storefront/src/lib/payments/mollie.types.ts`. CDN script integrity
hash will be added in Phase 10's CSP work.

Re-verify with `pnpm view <pkg> version` immediately before
`pnpm install` per CLAUDE.md hard rule #10.

## Risks called out before code

- **R1 — Multi-step checkout state.** A checkout that crosses
  page navigations needs a state model. Options: per-step Server Actions
  that mutate the active order (Vendure already persists everything
  server-side); URL state for the current step; React 19's
  `useFormState` to surface validation errors. We pick **Vendure-as-state**:
  every step writes to the `activeOrder` and reads from it on entry.
  No client store. Step progress is a derived value based on which
  required fields the order already has.
- **R2 — Mollie + Stripe mutual exclusion.** Spec is "Mollie primary,
  Stripe fallback." Implementation: `eligiblePaymentMethods` query
  on entering the payment step returns the methods enabled per
  channel; the UI renders a list and the customer picks. If Mollie
  fails (e.g. iDEAL bank rejected), the customer can pick Stripe in
  the same payment list — no special fallback logic, the customer is
  in control.
- **R3 — Variant selection edge cases.** Out-of-stock variants must be
  visibly disabled, not hidden. A product with zero in-stock variants
  shows "Notify me when back in stock" instead of an add-to-cart
  button (defer the notify-me Server Action to a polish pass — Phase 6
  ships the disabled state only).
- **R4 — Image dimensions.** Vendure exposes `width`/`height` on
  `Asset` (verified Phase 3 SDL). next/image's CLS guard demands those
  dimensions be passed; we read them from the GraphQL response, never
  guess.
- **R5 — Hydration mismatch on locale-aware paths.** The
  `next-intl` `<Link>` resolves the prefixed path on the server; the
  client must match. Failure mode is silent: links go to the wrong
  locale. Mitigation: only ever build paths via the typed
  `next-intl/navigation` `Link` / `redirect` / `usePathname` —
  never string-build.
- **R6 — Cart drawer + RSC cache.** The drawer reads `activeOrder`,
  which is per-session and **uncacheable** (`cache: 'no-store'`).
  Every PLP/PDP layout that renders the mini-cart count therefore
  forces dynamic rendering on those routes. Mitigation: split the
  mini-cart count into a tiny client island that fetches via Server
  Action on mount (and after every cart mutation via `useOptimistic`
  reconciliation). Static HTML stays static; only the badge is dynamic.
- **R7 — Newsletter form CSRF.** The Phase 2 backend's
  `/newsletter/subscribe` endpoint is `@Allow(Permission.Public)` —
  it intentionally has no auth. CSRF is not a concern because the
  endpoint creates an unverified row that requires email confirmation
  before any value is delivered. We document this in
  `src/lib/forms/newsletter.ts` so a future contributor doesn't add a
  CSRF token "for safety."
- **R8 — JSON-LD injection.** Structured data is built from Vendure
  responses, which are sanitized at the source. The risk is escaping
  `</script>` in product descriptions — we use
  `JSON.stringify(...).replace(/</g, '\\u003c')` per OWASP guidance.
  No `dangerouslySetInnerHTML` from raw user input.

## File layout (additions for Phase 6)

```
apps/storefront/src/
├── app/[locale]/
│   ├── (marketing)/                  # route group; no leading-segment in URL
│   │   ├── page.tsx                  # 6.2 home — replaces Phase 4 placeholder
│   │   └── layout.tsx                # marketing-only chrome (full-bleed hero)
│   ├── (commerce)/
│   │   ├── layout.tsx                # commerce shell (default chrome)
│   │   ├── [collection]/page.tsx     # 6.3 PLP
│   │   ├── products/[slug]/page.tsx  # 6.4 PDP
│   │   ├── cart/page.tsx             # full-page cart fallback (drawer is primary)
│   │   └── search/page.tsx           # search results — uses Meili
│   ├── checkout/
│   │   ├── layout.tsx                # checkout shell (no header nav)
│   │   ├── page.tsx                  # /checkout — customer step
│   │   ├── shipping/page.tsx         # shipping step
│   │   ├── payment/page.tsx          # payment step
│   │   ├── review/page.tsx           # review step
│   │   └── confirmation/[code]/page.tsx
│   └── account/
│       ├── layout.tsx                # account shell (sidebar nav)
│       ├── page.tsx                  # dashboard
│       ├── login/page.tsx
│       ├── register/page.tsx
│       ├── verify/page.tsx
│       ├── reset-password/page.tsx
│       ├── profile/page.tsx
│       ├── addresses/page.tsx
│       ├── orders/page.tsx
│       ├── orders/[code]/page.tsx
│       └── data/page.tsx             # GDPR self-service
├── components/
│   ├── layout/                       # 6.1
│   │   ├── Header.tsx
│   │   ├── HeaderClient.tsx          # client island for cart trigger + locale switcher + nav
│   │   ├── Footer.tsx
│   │   ├── LocaleSwitcher.tsx
│   │   ├── MobileNav.tsx
│   │   ├── MiniCartTrigger.tsx
│   │   └── SkipToContent.tsx
│   ├── commerce/                     # all domain composites land here
│   │   ├── ProductCard.tsx           # 6.3
│   │   ├── ProductCardSkeleton.tsx
│   │   ├── PriceTag.tsx              # 6.3+
│   │   ├── ColorSwatch.tsx           # 6.4
│   │   ├── SizeChip.tsx              # 6.4
│   │   ├── VariantPicker.tsx         # 6.4
│   │   ├── ProductGallery.tsx        # 6.4
│   │   ├── AddToCartButton.tsx       # 6.4
│   │   ├── GpsrPanel.tsx             # 6.4
│   │   ├── StockBadge.tsx
│   │   ├── FreeShippingProgress.tsx  # 6.5
│   │   ├── CartDrawer.tsx            # 6.5
│   │   ├── CartLine.tsx              # 6.5
│   │   ├── CouponForm.tsx            # 6.5
│   │   ├── CheckoutSteps.tsx         # 6.6
│   │   ├── CustomerForm.tsx          # 6.6
│   │   ├── AddressForm.tsx           # 6.6
│   │   ├── ShippingMethodList.tsx    # 6.6
│   │   ├── PaymentMethodList.tsx     # 6.6
│   │   ├── MollieComponents.tsx      # 6.6
│   │   ├── StripeElements.tsx        # 6.6
│   │   ├── OrderSummaryCard.tsx
│   │   ├── BreadcrumbTrail.tsx
│   │   ├── ProductFacets.tsx         # 6.3
│   │   ├── ProductSort.tsx           # 6.3
│   │   └── Pagination.tsx            # 6.3
│   └── marketing/
│       ├── Hero.tsx                  # 6.2
│       ├── ActivityGrid.tsx          # 6.2
│       ├── FeaturedCollections.tsx   # 6.2
│       ├── NewsletterForm.tsx        # 6.2
│       └── BrandStatement.tsx        # 6.2
├── lib/
│   ├── actions/
│   │   ├── cart.ts                   # 6.5
│   │   ├── checkout.ts               # 6.6
│   │   ├── auth.ts                   # 6.7
│   │   ├── account.ts                # 6.7
│   │   └── newsletter.ts             # 6.2
│   ├── asset.ts                      # 6.1+ — Bunny URL transform
│   ├── payments/
│   │   ├── mollie.types.ts           # 6.6 — typed window.Mollie
│   │   └── stripe.ts                 # 6.6
│   ├── seo/
│   │   └── structured-data.ts        # 6.4
│   ├── search/
│   │   └── meili.ts                  # 6.4 — Server Action wrapper
│   └── vendure/
│       └── error-messages.ts         # crosscutting — one place to map ErrorCode → t()
└── messages/
    └── (every locale gets a deep `commerce.*` namespace expansion)
```

## Sub-task plan

### 6.1 — Layout shell

- **Header** — logo, primary nav (Activities dropdown, Collections,
  Editorial, Sale), search button (opens cmdk in 6.4), locale
  switcher, account icon, mini-cart trigger.
- **Footer** — link columns (Shop, Help, Brand, Legal), newsletter CTA
  pointing at the home form, locale + currency badge,
  Plausible/PostHog/Klaro stub link.
- **Mobile nav** — Sheet (left side) revealing the full nav tree.
- **MiniCartTrigger** — client island, `useOptimistic` over the count.
- **LocaleSwitcher** — `DropdownMenu` of six locales; navigates via
  `useRouter().replace(pathname, { locale: x })` from
  `next-intl/navigation`.
- **SkipToContent** — already keyed in messages; mounts in `Header`.
- **Bunny URL transform** — `assetUrl(asset, { width, height, quality })`
  builds Bunny CDN URLs.

Tests: `Header` renders nav, locale switcher reachable by keyboard,
mini-cart count updates on Server Action result, mobile nav opens via
Sheet trigger.

### 6.2 — Home page

- **Hero** — full-bleed `next/image` from Sanity (Phase 7 wires; Phase
  6 uses a Bunny placeholder), tagline + dual CTA (Shop / Watch).
  `priority` set on the hero image; `sizes` covers full viewport.
- **ActivityGrid** — 4-up grid of activity tiles (Run, Train, Yoga,
  Studio) — links to `/[locale]/run`, etc. Slug-driven; tiles read
  from a hard-coded list in Phase 6, swapped to Sanity in Phase 7.
- **FeaturedCollections** — server-fetches `collectionTreeNav` →
  picks 3 featured collections → renders the lead product card per
  collection via `ProductCard` (which lands in 6.3). For 6.2 we ship
  a simpler `CollectionTeaser` that shows just the collection's
  featured asset + name.
- **NewsletterForm** — client island; calls a `subscribeNewsletter`
  Server Action that POSTs to backend `/newsletter/subscribe`.
  Returns `{ ok, status }`; UI shows success/error via toast.
  Honeypot field (`website` hidden input) for bot mitigation.
- **BrandStatement** — typographic block; uses `framer-motion`'s
  `whileInView` for a scroll-triggered fade-up; respects
  `prefers-reduced-motion`.
- **JSON-LD** — `Organization` + `WebSite` injected in `<head>` via
  metadata `other` field (Next 15 typed).

Tests: home renders, newsletter happy path, newsletter error path,
JSON-LD validates against schema.org.

### 6.3 — PLP

- **Route:** `/[locale]/[collection]?page=N&sort=price-asc&size=m&color=black`
- **Server fetch:** `productList` with `ProductListOptions` derived
  from search params; cache tag `productList:{channel}` +
  `collection:{slug}`.
- **Faceting:** Vendure ships `FacetValueFilterInput` natively;
  facets to expose in 6.3 are Activity, Color, Size. The backend's
  Meilisearch indexer (Phase 2) already pumps these; we read facet
  counts from a `searchProducts` (Meili-backed) query if enabled,
  else fall back to client-side filtering of the page's items.
- **Sort:** name asc/desc, price asc/desc, createdAt desc (newest).
  URL-driven so each combination is a shareable link.
- **Pagination:** offset/limit; page-numbered URL; `<Pagination>`
  primitive from `@hurc/ui` (lands as a 6.3 ride-along addition to
  the design system — small enough to skip a separate ADR).
- **Empty state:** "No products match your filters" + clear-filters
  CTA.

Tests: Server Component renders given a slug, sort URL roundtrips,
filter URL roundtrips, axe pass on representative state, JSON-LD
breadcrumb validates.

### 6.4 — PDP

- **Route:** `/[locale]/products/[slug]`
- **Gallery** — variant-aware; gallery thumbnails on the side
  (desktop) or below (mobile). `next/image` with explicit
  width/height from `Asset.width`/`height`.
- **VariantPicker** — one row per `ProductOptionGroup`; visually:
  Color = `ColorSwatch`, Size = `SizeChip`, others = chip list.
  Selecting one option per group resolves to a single
  `ProductVariant`. Out-of-stock variants render disabled (not
  hidden).
- **AddToCartButton** — client island, calls `addToCartAction` Server
  Action; `useOptimistic` over the mini-cart count; toast on success
  with "View cart" CTA opening the drawer.
- **GpsrPanel** — collapsible (`Accordion`) that surfaces the GPSR
  custom fields: responsible person, manufacturer info, warnings,
  traceability code, material composition, care instructions.
  Required for EU launch; never lazy-loaded.
- **Related products** — `productList` filtered by the same primary
  collection; horizontal scroller of `ProductCard`.
- **JSON-LD** — `Product` (with offers per variant), `BreadcrumbList`.

Tests: PDP renders, variant selection updates price/stock, add to
cart action shapes correctly, GPSR fields surface every backend
field.

### 6.5 — Cart drawer

- **Sheet** primitive (right side, sm:max-w-md).
- **CartLine** — image + name + variant options + price + quantity
  stepper (using `Input type=number` or +/- buttons backed by
  `adjustOrderLineAction`); remove button.
- **CouponForm** — small inline form behind a "Have a code?"
  expander; calls `applyCouponCodeAction`.
- **Totals** — `OrderSummaryCard` shows subtotal, shipping (placeholder
  until shipping picked), discount, tax, total.
- **FreeShippingProgress** — linear bar comparing `activeOrder.subTotalWithTax`
  to a per-channel free-shipping threshold (env var:
  `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD_EUR=7000` in minor units).
- **Empty state** — illustration + "Continue shopping" CTA.
- **Server Actions:** `addToCart`, `adjustOrderLine`,
  `removeOrderLine`, `applyCouponCode`, `removeCouponCode`. Every
  action calls `revalidateTag(tags.cart(...))` on success.

Tests: drawer opens on trigger, line edit updates the order,
coupon application surfaces error code → localized message, free-
shipping progress hits 100% at threshold.

### 6.6 — Checkout

- **Step 1 — Customer:** email + (optional) phone. If logged-in, pre-
  filled. Calls `setCustomerForOrder`.
- **Step 2 — Shipping:** address form (full HUUC `Address` shape) +
  shipping method list (`eligibleShippingMethods` query). Calls
  `setOrderShippingAddress` + `setOrderShippingMethod`.
- **Step 3 — Payment:** `eligiblePaymentMethods` query → list. Mollie
  methods load Mollie Components (iDEAL bank picker, Klarna copy,
  Bancontact, etc.). Stripe methods load Stripe Elements (card).
  Cancel returns to step 2.
- **Step 4 — Review:** read-only summary; `transitionOrderToState('ArrangingPayment')`
  on enter, `addPaymentToOrder` on submit, then redirects to the
  channel-specific Mollie checkout URL or completes locally for
  Stripe.
- **Confirmation:** `/checkout/confirmation/[code]` reads `orderByCode`,
  shows order summary, fires PostHog `purchase` event (consent-
  gated, post-launch will move to GTM-style server-side dispatch).

Tests: each step's Server Action validates input, error codes
surface, navigation between steps works keyboard-only, axe pass on
each step.

### 6.7 — Account

- **Login / Register / Verify / Reset password:** standard flows, all
  server-action driven.
- **Profile:** `updateCustomer` for first/last name, phone, marketing
  opt-in (writes the existing `customerCustomFields.marketingOptIn`).
- **Addresses:** CRUD via `createCustomerAddress` /
  `updateCustomerAddress` / `deleteCustomerAddress`.
- **Orders:** list (`activeCustomerOrders`) + detail
  (`orderByCode`).
- **GDPR self-service:** "Export my data" downloads the JSON via the
  backend's existing `/gdpr/export` REST endpoint;
  "Delete my account" calls the Phase 2 plugin's confirmation flow.

Tests: each Server Action validates, login error code → localized
message, password-reset email link round-trips (mocked at the
fetch layer in unit tests; real email is Phase 9 e2e).

## Crosscutting deliverables (added during 6.1 → 6.7 as needed)

- **`Pagination` primitive** — added to `@hurc/ui` during 6.3. Single
  file, ~80 lines, follows the existing primitive contract. Skip
  the separate ADR; size doesn't warrant it.
- **`vendure-error-messages.ts`** — exhaustive map of every shop-api
  `ErrorCode` enum value to a `next-intl` key. The `Vendure-error-codes`
  list is in the schema snapshot (`packages/graphql/src/schema-snapshots/shop-api.graphql`).
- **`messages/<locale>.json`** — every locale gets a `commerce.*`
  namespace expansion: cart, checkout, product, account, errors,
  forms.
- **Sitemap expansion** — `app/sitemap.ts` reads the entire
  `productList` and `collectionList` for every locale; cached with
  `revalidate: 3600`.
- **`next.config.ts`** — `images.remotePatterns` may need additions
  if Sanity image URLs differ from the Phase 4 whitelist; verified
  in Phase 7.

## Phase 6 gate (cumulative, after 6.7)

- [ ] All seven sub-phases ended gate-green at the time of merge.
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` clean
      at repo root.
- [ ] Storefront `/[locale]` First Load JS still under 280 kB
      (Phase 4 baseline 212 kB + a 70 kB Phase 6 budget; budget is
      generous to give Mollie/Stripe runtime room).
- [ ] PDP routes render, variant pick → add-to-cart → cart drawer →
      checkout end-to-end against the running backend (manual smoke
      gate; Phase 9 ships the Playwright e2e).
- [ ] axe scan clean on home, PLP representative state, PDP, cart
      drawer, checkout step 1, login.
- [ ] Every Vendure error code surfaces a localized message in en;
      drift-detector test covers all six locales' `errors.*`
      namespace presence.
- [ ] Tag commit `phase-6-complete`.

## Order of operations (large; one PR per logical chunk)

The 7 sub-phases each produce 2–4 PRs. Indicative grouping:

**6.1 (Layout shell)**

1. `feat(storefront): asset URL transform + image helpers`
2. `feat(storefront): Header + LocaleSwitcher + MiniCartTrigger`
3. `feat(storefront): Footer + MobileNav + SkipToContent`

**6.2 (Home)** 4. `feat(storefront): home hero + activity grid + brand statement` 5. `feat(storefront): newsletter Server Action + form` 6. `feat(storefront): home JSON-LD + featured collections teaser`

**6.3 (PLP)** 7. `feat(ui): Pagination primitive` 8. `feat(storefront): PLP page + ProductCard + PriceTag` 9. `feat(storefront): PLP sort + facet UI + URL roundtrip`

**6.4 (PDP)** 10. `feat(storefront): PDP page + gallery + variant picker` 11. `feat(storefront): add-to-cart Server Action + GPSR panel` 12. `feat(storefront): PDP JSON-LD + related products + Meili search bar`

**6.5 (Cart drawer)** 13. `feat(storefront): cart drawer (Sheet) + CartLine + Server Actions` 14. `feat(storefront): coupon form + free-shipping progress + totals`

**6.6 (Checkout)** 15. `feat(storefront): checkout customer + shipping steps` 16. `feat(storefront): payment step + Mollie Components` 17. `feat(storefront): payment step + Stripe Elements` 18. `feat(storefront): review + confirmation + PostHog purchase event`

**6.7 (Account)** 19. `feat(storefront): auth flows (login/register/verify/reset)` 20. `feat(storefront): account profile + addresses` 21. `feat(storefront): account orders + GDPR self-service`

**Cap** 22. `chore(repo): phase-6-complete tag`

## Open follow-ups (after Phase 6)

- **Variant URL state** — selection persists in `?size=m&color=black`;
  bookmarkable / shareable. Polish pass; not gated on Phase 7.
- **Notify-me-when-back-in-stock** — add a backend mutation +
  storefront form behind out-of-stock variants. Polish.
- **Cursor pagination** — if Meilisearch usage exceeds threshold;
  Phase 9-or-later optimization.
- **Server-side analytics dispatch** — `posthog-node` from a Route
  Handler so events fire even without consent for the user-actor
  (still consent-respectful, just shifts the network call).
- **OG image per product** — `app/api/og/route.tsx` accepts a slug
  and renders a token-styled card. Already in place from Phase 4 with
  defaults; PDP wiring lands here.
- **Reviews + UGC** — out of spec scope; would need a CMS/collector
  decision in its own ADR.
