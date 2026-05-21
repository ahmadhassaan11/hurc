# ADR 0008 — Phase 7 implementation plan (editorial via Sanity)

- **Status:** Proposed (planning only — no code yet at the time this ADR was written)
- **Date:** 2026-05-03
- **Decision owner:** Lead full-stack engineer
- **Supersedes:** Phase plan item 7 of [ADR-0001](./0001-stack.md), refined into
  four executable sub-phases.
- **Depends on:**
  - Phase 2 (`hurc-sanity-bridge` plugin) — already shipped: HMAC verification
    over the raw body, `payloadToTags()` mapper, retry+backoff revalidate
    service. Phase 7 must honor the tag contract that plugin already produces.
  - Phase 4 (RSC fetch wrapper, `lib/vendure/revalidation.ts:tags` namespace,
    `next-intl` routing). Sanity env vars are already reserved as `optional`
    in `apps/storefront/src/env.ts` + `env.client.ts` + `infra/env.reference.md`.
  - Phase 6 (`phase-6-complete` tag pending) — every editorial route composes
    `@hurc/ui` primitives and the Phase 6 layout shell.

## Why this plan exists

Phase 7 is the **editorial overlay**: a content surface that is _separate
from commerce data_ (which is Vendure-sourced) and lets a non-engineer
publish marketing copy, hero imagery, brand-story pages, and a journal of
posts without a deploy. It plugs into three contracts the codebase has
_already declared_ but not yet _consumed_:

1. The backend's `hurc-sanity-bridge` plugin POSTs `{tags}` to the
   storefront's `${STOREFRONT_URL}/api/revalidate?secret=…`. The
   storefront does not yet expose that handler — Phase 7 ships it.
2. `apps/storefront/src/lib/vendure/revalidation.ts` declares the tag
   namespace and explicitly states (in its docstring) that "Sanity webhooks
   (Phase 7) reuse this same namespace." The bridge already emits
   `product:<slug>` (the same shape as `tags.product(slug)`) and
   `journal:<slug>` / `journal` (the shape Phase 7 will add).
3. The home page marketing components (`Hero`, `ActivityGrid`,
   `BrandStatement`) currently render from `next-intl` messages only. ADR-0007
   §6.2 explicitly defers their Sanity wiring to Phase 7.

If we plan Phase 7 as one bullet, we ship a Studio nobody uses with a schema
that doesn't match the bridge's tag contract. This ADR splits it into four
sub-phases, each independently shippable, each ending gate-green.

## Decision summary

1. **Sub-phase split:**
   - **7.1 Sanity foundations** — `next-sanity` client, image builder,
     `/api/revalidate` route handler, cache-tag namespace extension. No
     content yet; everything still renders from `next-intl`. Verifiable end-
     to-end: backend bridge → storefront `/api/revalidate` → `revalidateTag`
     fires.
   - **7.2 Studio + schemas** — embedded Studio mounted at `/studio/[[...tool]]`,
     four schema types (`homepage` singleton, `page`, `journalPost`,
     `activity`), shared SEO + Portable-Text objects. `sanity typegen` wired
     into `pnpm codegen`; generated `sanity.types.ts` committed.
   - **7.3 Editorial routes** — `/[locale]/journal` index, `/[locale]/journal/[slug]`
     post, `/[locale]/story` brand-story page. Portable-Text renderer with
     the project's typographic tokens. Hero + ActivityGrid accept optional
     Sanity overrides (gracefully degrade to current i18n+gradient when no
     `homepage` document exists).
   - **7.4 Draft mode + Presentation** — `/api/draft` enable handler
     (Sanity-signed token), `/api/disable-draft` disable handler, draft-aware
     client. Studio's Presentation tool wired to the storefront preview URL.
2. **Client choice — `next-sanity` (12.4.0), not `@sanity/client` directly.**
   `next-sanity` is the Next-tuned bundle: it re-exports `createClient` with
   RSC-safe defaults, ships `<NextStudio />` for the embedded studio mount,
   and includes draft-mode helpers (`defineLive`, `<VisualEditing />`). We
   treat `@sanity/client` as a transitive dependency only. `@sanity/image-url`
   (2.1.1) gives us the same shape as `assetUrl()` for Bunny — predictable
   widths, predictable quality. `@portabletext/react` (6.0.3) renders Portable
   Text. `sanity` (5.23.0) is the studio runtime, peer-installed because the
   embedded studio imports it.
3. **Cache-tag namespace is shared and extended in-place.** `lib/vendure/
revalidation.ts:tags` gains two helpers: `journal(slug)` →
   `"journal:<slug>"` and `journalList()` → `"journal"`. The shape exactly
   matches what `payload-mapper.ts:payloadToTags` already emits for
   `journalPost` documents. The `product:<slug>` overlap is intentional: a
   Sanity update to a product's editorial copy invalidates the same RSC
   cache key as a Vendure mutation. We do **not** introduce a `sanity:` tag
   prefix — that would split the namespace and require the bridge to know
   whether a tag is "for Sanity content" or "for Vendure content," which is
   exactly the discipline the existing design avoids.
4. **Schema set — minimal-and-honest.** Four document types only:
   - `homepage` — singleton, optional. Holds an optional hero override
     (eyebrow, headline, subhead, image, primary CTA), optional activity
     tile assets keyed by activity slug, and an optional brand-statement
     override. Every field is optional so the storefront still renders if
     this document doesn't exist. The home page composes Vendure data
     (`FeaturedCollections`) with Sanity overlay (Hero/ActivityGrid) — the
     overlay never blocks the commerce path.
   - `page` — generic SEO-bearing page used by `/story` and any future
     marketing route. Title, slug, hero image, Portable-Text body, SEO
     object.
   - `journalPost` — title, slug, language, publishedAt, hero image,
     Portable-Text body, author (string for now; reference type is a polish
     pass), SEO object. Matches the `_type` the bridge already maps.
   - `activity` — slug, eyebrow, title, hero image, optional Portable-Text
     blurb. The `ActivityGrid` looks up tile copy by slug; activities
     without a Sanity document fall back to the current i18n strings.
   - **Reusable objects:** `seo` (title, description, image) and
     `portableTextBody` (Portable-Text array with the project's allowed
     marks and inline types). No `product` document type — products live in
     Vendure; the bridge's `product` mapping covers a _future_ editorial
     overlay on PDP, which is **not in Phase 7 scope.**
5. **Internationalization — per-document, not per-field.** Each editorial
   document has a `language` field (one of the six locale codes). Storefront
   queries filter `language == $locale`, with `en` fallback (`coalesce()` in
   GROQ). This matches editorial workflows: an author writes a journal
   post in English, then optionally creates a Dutch version as a separate
   document. The alternative (per-field translations via
   `internationalizedArrayField`) couples authoring to translation and
   makes the GROQ shape ugly. Per-document keeps the queries straight.
   English is the **canonical** locale and seeds the fallback chain.
6. **`/api/revalidate` route handler is the contract endpoint.** Verifies
   `?secret=` against `SANITY_REVALIDATE_SECRET`, parses `{tags: string[]}`
   from the body, calls `revalidateTag(t)` for each. Rejects unknown tag
   shapes by **whitelisting** the tag prefixes the bridge can legitimately
   emit (`journal`, `journal:`, `product:`, `homepage`, `page:`, `activity:`).
   This is defense-in-depth: an attacker who somehow obtained the secret
   still cannot revalidate arbitrary tags (e.g. spam-revalidating the cart
   namespace). Returns `{ ok, revalidated: string[] }`.
7. **Draft mode — Sanity-signed token, no session check.** `/api/draft` is
   called from Studio's Presentation tool with a JWT-signed token (Sanity
   issues this; the storefront verifies the signature against the project's
   public JWKS via `next-sanity`'s `validatePreviewUrl`). On success, set
   `draftMode().enable()` and redirect to the slug. This avoids coupling
   Studio access to the storefront's customer session (Studio editors are
   not customers). `/api/disable-draft` clears the flag. **Draft fetches
   are uncacheable** (`cache: 'no-store'`); production fetches use
   `next: { tags: [...] }`.
8. **Studio mount — embedded at `/studio/[[...tool]]`.** Single Next.js
   route group renders `<NextStudio config={...} />`. We do **not** host
   Studio separately. Pros: one origin, one auth surface (Sanity SSO),
   draft URLs are first-party. Cons: pulls the `sanity` package (~1MB) into
   the storefront app, but Next code-splits it — it never hits the
   marketing/commerce bundles. We add a build-time guard (`@hurc/eslint`
   rule equivalent or a manual check in `next.config.ts`'s `webpack`
   tap) to fail the build if any module under `app/[locale]` imports from
   `sanity` or `sanity/structure`. Studio's URL is reachable in production
   only if the env is configured — without `NEXT_PUBLIC_SANITY_PROJECT_ID`,
   the route 404s with a friendly message.
9. **Asset CDN handling.** Sanity hosts at `cdn.sanity.io`; we add it to
   `next.config.ts:images.remotePatterns`. We render via `next/image` with
   the URL produced by `@sanity/image-url`'s `urlFor(asset).width(...).quality(...)`.
   The `EditorialImage` component centralises the transform so PDP gallery
   later reuses it. We do **not** proxy Sanity assets through Bunny.
10. **Marketing component contract — additive overrides.** `Hero`,
    `ActivityGrid`, and `BrandStatement` keep their current i18n-only
    rendering and gain an _optional_ `override` prop that, when supplied,
    swaps in Sanity-sourced asset/text. The `home/page.tsx` server
    component fetches the `homepage` singleton, threads the relevant slice
    into each marketing component as a prop, and lets each component decide
    whether to render the override or the i18n default. This means Phase 7
    cannot regress the home page if the `homepage` document is absent —
    the test suite covers both branches. **`FeaturedCollections` stays
    Vendure-sourced**; we do **not** add a Sanity featured-collections
    document type (Phase 6 already wires this, and Vendure is the source
    of truth for which collections exist).
11. **Generated types — committed, not gitignored.** `sanity typegen`
    emits `apps/storefront/sanity.types.ts` (and `sanity.schema.json` as an
    intermediate). We commit both, mirroring the `@hurc/graphql` codegen
    convention — CI consumers (Vercel build, contributors) don't need to
    run typegen. The `pnpm codegen` script gains a `sanity` step:
    `sanity schema extract && sanity typegen generate`. Drift is detected
    by re-running typegen and asserting the file is unchanged.
12. **Studio access control.** Phase 7 keeps Studio open (anyone with the
    URL can attempt to log in; only configured Sanity members succeed).
    Phase 8 (compliance) revisits whether the `/studio` path needs a
    blanket robots-disallow + IP allowlist on the Cloudflare layer. We
    add `Disallow: /studio` to `apps/storefront/src/app/robots.ts` now.
13. **Live preview — deferred.** `next-sanity` 12 ships `defineLive` /
    `<SanityLive />` for instant preview without `revalidateTag` cycles
    through the bridge. We **do not** wire that in Phase 7; the
    bridge → `revalidateTag` path is the contract that's already
    implemented and tested. Live preview is a Phase 9-or-later optimization
    once we have real editorial usage and the bridge's roundtrip latency
    becomes a problem. Captured as a follow-up.
14. **Local dev — Sanity is optional.** Without a `NEXT_PUBLIC_SANITY_PROJECT_ID`
    set, `lib/sanity/client.ts` returns a "noop" client whose every method
    resolves to `null` / `[]`. Editorial routes 404 gracefully; the home
    page renders i18n-only. Tests run against a recorded fixture client
    (no real network), not the noop — to keep the noop's behavior real.

## Verified version pins (as of 2026-05-03 via `pnpm view`, after install-time check)

```
next-sanity              11.6.13   (v12 requires Next ^16; we run Next 15.5.15)
@sanity/client            7.22.0   (transitive via next-sanity)
@sanity/image-url         2.1.1
@portabletext/react       6.0.3
sanity                    5.23.0   (peer of next-sanity; runtime for /studio)
styled-components         6.4.1    (peer of sanity; required at studio runtime)
```

**Amendment (install-time):** the ADR initially proposed
`next-sanity@12.4.0`. At install time `pnpm view next-sanity@12.4.0
peerDependencies` revealed a `next: ^16.0.0-0` requirement, incompatible
with our pinned Next 15.5.15. Pinned to the latest `11.x` (11.6.13),
which declares `next: ^15.1.0-0 || ^16.0.0-0` and is otherwise
feature-equivalent for our Phase 7 surface (RSC `createClient`,
`<NextStudio />`, `defineLive` hooks). Upgrading to `next-sanity@12`
becomes part of the eventual Next 16 upgrade ADR.

`styled-components` is added because `sanity@5` declares it as a peer
(the Studio's UI uses styled-components internally). It is not loaded
on marketing/commerce routes — the studio-bleed guard in `next.config.ts`
prevents that.

Re-verify with `pnpm view <pkg> version` immediately before each
`pnpm install` per CLAUDE.md hard rule #10.

## Risks called out before code

- **R1 — Studio bundle bleed.** The `sanity` package is large (~1MB).
  Without a build-time guard, an absent-minded import like
  `import {defineType} from 'sanity'` from a marketing component would
  pull the whole studio runtime into the marketing chunk. Mitigation:
  (a) studio code lives under `app/studio/` and `src/sanity/schemas/`;
  (b) marketing/editorial code under `src/components/editorial/` only
  imports from `@portabletext/react` and `@sanity/image-url`; (c) a
  `next.config.ts` webpack tap that errors if any chunk loaded by a
  `[locale]/...` route resolves a module starting with `sanity/` or
  `next-sanity/studio`. The guard ships in 7.2 alongside the studio mount.
- **R2 — Draft mode + RSC cache hazards.** `draftMode()` is per-request;
  any RSC route that calls it becomes dynamic. The risk is _forgetting_ to
  call it in a route that should be draft-aware: the route stays static and
  draft authors see published content. Mitigation: every editorial loader
  in `lib/sanity/queries.ts` reads `draftMode()` itself and switches
  client + tag strategy internally — route-level code never touches it.
  A unit test asserts the draft client uses `cache: 'no-store'`.
- **R3 — Secret-name confusion.** Three distinct secrets exist:
  - `SANITY_WEBHOOK_SECRET` (backend) — Sanity Studio's webhook HMAC.
  - `NEXT_REVALIDATE_SECRET` (backend) — bearer the bridge sends to the
    storefront's `/api/revalidate?secret=…`.
  - `SANITY_REVALIDATE_SECRET` (storefront) — what `/api/revalidate`
    verifies that bearer against.
    The last two **must be equal** for the bridge to work, but they are named
    differently because they live in different `.env` files. Mitigation:
    add a paragraph to `infra/env.reference.md`'s "Adding a variable" section
    calling this out; the storefront's `/api/revalidate` log line on a
    bad-secret rejection includes a hint.
- **R4 — Tag whitelist drift.** The bridge's `payloadToTags` and the
  storefront's `/api/revalidate` whitelist are _paired contracts_. If
  someone adds a new `_type` to `payloadToTags` without updating the
  whitelist, real Sanity updates get silently rejected at the storefront.
  Mitigation: a single shared constant for the prefix list, exported from
  `apps/storefront/src/lib/sanity/revalidate-allowlist.ts`, and the
  backend payload-mapper test imports a `.ts` snapshot of the same list.
  Tighter: declare the allowlist once and import on both sides — but the
  backend doesn't depend on the storefront package and doing so would
  invert the dependency direction. Alternative: the allowlist is part of
  the ADR (this document) and a CI-level grep test asserts the bridge's
  `_type` switch and the allowlist agree. Pick the grep test approach;
  no cross-package dependency required.
- **R5 — Locale fallback semantics.** A journal post in `de` should fall
  back to the `en` version if the `de` document doesn't exist (the German
  shopper still sees content rather than 404). But the URL is
  `/de/journal/some-post` — if we serve the `en` doc at that URL, search
  engines may flag duplicate content. Mitigation: when falling back, the
  page emits a `rel="alternate" hreflang="en"` _and_ a `Content-Language: en`
  header so the locale mismatch is honest. Documented in
  `lib/sanity/queries.ts:loadJournalPost`.
- **R6 — Schema migrations.** Sanity is schemaless at the JSON layer but
  the storefront's TS types are derived from the schema. Adding a required
  field is a breaking change to existing draft documents. Mitigation: every
  new field declares `validation: Rule => Rule.optional()` (the Sanity
  default); we promote to required only after a `sanity migrate` run that
  backfills. This is not a Phase 7 concern (no migrations on day one) but
  is documented for future work.
- **R7 — `next/image` + Sanity image hotspots.** Sanity supports
  per-asset hotspot/crop metadata. `@sanity/image-url`'s `fit('crop').crop('focalpoint')`
  honors it; `next/image`'s `object-position` does not. We default to
  Sanity's URL-side cropping (more bandwidth-efficient anyway) and pass
  the resulting URL straight to `next/image`. Documented in
  `EditorialImage.tsx`.
- **R8 — Robots / search indexing of `/studio`.** Studio at `/studio` would
  get indexed by Google if not blocked. Mitigation: add `Disallow: /studio`
  to `app/robots.ts` and an `X-Robots-Tag: noindex` header from the
  studio route's `headers()` export.
- **R9 — Tests against the live Sanity API.** Unit tests must not hit the
  real Sanity CDN. Mitigation: every test imports from
  `lib/sanity/__fixtures__/client.ts`, which is a typed `MockSanityClient`
  that returns canned responses for the GROQ strings under test. The
  generated `sanity.types.ts` is what we test our consumers against.
- **R10 — Empty initial dataset.** On day one no Sanity content exists.
  Editorial routes must 404 gracefully (not 500); home page must render
  i18n-only without a `homepage` singleton. Tests cover both empty and
  populated branches.

## File layout (additions for Phase 7)

```
apps/storefront/
├── sanity.config.ts                          # 7.2 — studio + schema config (basePath: /studio)
├── sanity.cli.ts                             # 7.2 — CLI for `sanity typegen` etc.
├── sanity.types.ts                           # 7.2 — generated; committed
├── sanity.schema.json                        # 7.2 — generated intermediate; committed
├── src/
│   ├── app/
│   │   ├── studio/                           # 7.2 — embedded studio mount
│   │   │   └── [[...tool]]/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── revalidate/route.ts           # 7.1 — bridge callback handler
│   │   │   ├── draft/route.ts                # 7.4 — enable draft mode (Sanity token)
│   │   │   └── disable-draft/route.ts        # 7.4 — disable draft mode
│   │   ├── [locale]/
│   │   │   ├── journal/
│   │   │   │   ├── page.tsx                  # 7.3 — index
│   │   │   │   └── [slug]/page.tsx           # 7.3 — post
│   │   │   └── story/page.tsx                # 7.3 — Sanity-sourced brand story
│   │   └── robots.ts                         # 7.2 — gains Disallow: /studio
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts                     # 7.1 — published + draft clients (or noop)
│   │   │   ├── image.ts                      # 7.1 — urlFor + EditorialImage helpers
│   │   │   ├── queries.ts                    # 7.1 — typed GROQ loaders
│   │   │   ├── revalidate-allowlist.ts       # 7.1 — tag prefix whitelist
│   │   │   ├── draft-mode.ts                 # 7.4 — token verification + redirect helper
│   │   │   └── __fixtures__/client.ts        # 7.1 — mock for tests
│   │   └── vendure/
│   │       └── revalidation.ts               # 7.1 — extends `tags` with journal/journalList/page/homepage/activity
│   ├── sanity/
│   │   └── schemas/
│   │       ├── index.ts
│   │       ├── homepage.ts                   # 7.2 — singleton
│   │       ├── page.ts                       # 7.2 — generic page (/story)
│   │       ├── journalPost.ts                # 7.2 — bridge already maps `journalPost`
│   │       ├── activity.ts                   # 7.2 — keyed by slug for ActivityGrid
│   │       └── objects/
│   │           ├── seo.ts                    # 7.2 — title/description/image
│   │           └── portableTextBody.ts       # 7.2 — Portable-Text array spec
│   └── components/
│       └── editorial/                        # 7.3 — Sanity-rendering components only
│           ├── PortableText.tsx              # custom block + mark + inline-type serializers
│           ├── EditorialImage.tsx            # next/image + @sanity/image-url
│           ├── JournalCard.tsx               # listing card
│           └── HeroOverride.tsx              # rendered by Hero when a Sanity hero exists
├── package.json                              # 7.1 — adds next-sanity, @sanity/image-url, @portabletext/react, sanity
└── messages/
    ├── en.json                               # 7.3 — adds journal.* + story.* + studio.* namespaces
    ├── de.json
    ├── fr.json
    ├── nl.json
    ├── es.json
    └── it.json
infra/env.reference.md                        # 7.1 — adds the secret-pair note (R3)
```

Modified existing files (high-level):

```
apps/storefront/src/components/marketing/Hero.tsx          # accepts override prop
apps/storefront/src/components/marketing/ActivityGrid.tsx  # accepts per-slug override map
apps/storefront/src/components/marketing/BrandStatement.tsx # accepts override prop
apps/storefront/src/app/[locale]/page.tsx                  # fetches `homepage` singleton, threads overrides
apps/storefront/next.config.ts                             # cdn.sanity.io remotePattern + studio bleed guard
apps/storefront/package.json                               # codegen script gains `sanity` step
turbo.json                                                 # `sanity` task (depends on schemas) feeds typecheck
```

## Sub-task plan

### 7.1 — Sanity foundations

- **Install:** `next-sanity@12.4.0`, `@sanity/image-url@2.1.1`,
  `@portabletext/react@6.0.3` (runtime); `sanity@5.23.0` (peer for studio).
  Pinned with `pnpm add --save-exact`. Verify with `pnpm audit` clean.
- **`lib/sanity/client.ts`** — exports `sanityClient` (published, RSC-cacheable,
  `useCdn: true`, `perspective: 'published'`) and `draftClient` (uses
  `SANITY_API_READ_TOKEN`, `useCdn: false`, `perspective: 'previewDrafts'`).
  When `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing, both exports are a typed
  `NoopSanityClient` whose every method returns `null` / `[]`.
- **`lib/sanity/image.ts`** — wraps `@sanity/image-url`'s `imageUrlBuilder`,
  exports `urlFor(asset)` returning a URL builder; `EditorialImage` (in
  `components/editorial/`) uses it.
- **`lib/sanity/revalidate-allowlist.ts`** — exports
  `ALLOWED_TAG_PREFIXES = ['journal', 'product:', 'homepage', 'page:', 'activity:'] as const`.
- **`lib/vendure/revalidation.ts`** — extends `tags` with `journal(slug)`,
  `journalList()`, `page(slug)`, `homepage()`, `activity(slug)`. Keep the
  existing docstring; clarify that Sanity content tags follow the same
  rules as Vendure data tags.
- **`app/api/revalidate/route.ts`** — `POST` handler. Verifies `?secret=`
  via `timingSafeEqual` against `SANITY_REVALIDATE_SECRET`; rejects 401 on
  mismatch. Parses `{tags: string[]}` (Zod). Filters tags through the
  allowlist (rejected tags logged at `warn`, not failed). Calls
  `revalidateTag(t)` for each accepted tag. Returns
  `{ ok: true, revalidated: string[] }`.

Tests: noop client returns nullable shapes, `/api/revalidate` rejects
bad secret, accepts good secret + only revalidates whitelisted tags,
empty body returns `{revalidated: []}`, malformed JSON returns 400.

### 7.2 — Studio + schemas

- **`sanity.config.ts`** — defines the project (`projectId`, `dataset`),
  registers schemas, sets `basePath: '/studio'`, enables Vision (a query
  playground) for development.
- **`sanity.cli.ts`** — points `sanity typegen` at the schema entry +
  emits to `apps/storefront/sanity.types.ts`.
- **Schemas:** `homepage`, `page`, `journalPost`, `activity` + `seo` and
  `portableTextBody` objects. Each document has `language` (string,
  enum of locale codes) and `slug` (auto-generated from title; required
  for `page`/`journalPost`/`activity`; absent for `homepage` since it's
  a singleton).
- **`app/studio/[[...tool]]/page.tsx`** — renders `<NextStudio config={config} />`.
  Imports `metadata` and `viewport` per `next-sanity` docs (Studio sets
  its own viewport scaling).
- **`app/robots.ts`** — adds `Disallow: /studio`.
- **`next.config.ts`** — adds `cdn.sanity.io` to `images.remotePatterns`;
  adds the studio-bleed guard (a small webpack tap that errors if a
  chunk reachable from `/[locale]/...` resolves anything starting with
  `sanity/` — except `@sanity/image-url` and `@portabletext/react`,
  which are runtime-safe).
- **`pnpm codegen`** — gains a step:
  `pnpm --filter storefront sanity schema extract && pnpm --filter storefront sanity typegen generate`.
- **`turbo.json`** — a new `sanity-codegen` task feeds typecheck inputs.

Tests: schema parses (a snapshot test against the `extract` output),
the studio route renders a stub (no real auth), `pnpm sanity typegen`
produces a deterministic `sanity.types.ts` (drift detector — re-run
and assert no diff).

### 7.3 — Editorial routes + marketing override wiring

- **`/[locale]/journal/page.tsx`** — fetches `journalPost` documents
  matching the locale (with `en` fallback for missing translations),
  paginated 12-per-page, sorted by `publishedAt desc`. Cache tag
  `tags.journalList()`. Renders the `JournalCard` grid + pagination.
- **`/[locale]/journal/[slug]/page.tsx`** — fetches one post by slug +
  language. 404s if absent. Cache tag `tags.journal(slug)`. Renders
  hero image, title, byline, Portable-Text body. Emits
  `BlogPosting` JSON-LD per schema.org. Sets `Content-Language: <doc.language>`.
- **`/[locale]/story/page.tsx`** — fetches the `page` document with
  slug `story` + language. Renders hero + Portable-Text body. Cache tag
  `tags.page('story')`. Emits `WebPage` JSON-LD.
- **`components/editorial/PortableText.tsx`** — defines serializers:
  `block.h1` → `<h2>` (only the page hero is `<h1>`), images via
  `EditorialImage`, link mark with `rel="noopener noreferrer"` on
  external URLs, blockquote with the project's accent rule, code blocks
  via `<pre><code>`, lists with the project's bullet styling.
- **Hero override** — `Hero.tsx` accepts an optional `override?: {
eyebrow?: string; title: string; subtitle?: string; image?: SanityImage;
primaryCta?: { label: string; href: string } }` prop. When supplied,
  the override replaces the corresponding i18n text; `image` swaps the
  gradient background for an `EditorialImage`. The home page server
  component fetches the `homepage` singleton and threads the slice.
- **ActivityGrid override** — `ActivityGrid.tsx` accepts an optional
  `overrides?: Record<ActivityKey, { eyebrow?: string; title?: string;
image?: SanityImage }>`. Each tile checks for an override and uses it
  when present, falls back to i18n + gradient otherwise.
- **BrandStatement override** — accepts `override?: { eyebrow?: string;
headline: string; body?: string }`.
- **Messages — six locales:** `journal.{indexTitle,indexEyebrow,indexEmpty,
byAuthor,readMore,publishedOn,backToIndex,...}`, `story.{title,
eyebrow}`, `studio.{disabled}`. Drift detector covers them.

Tests: `/[locale]/journal` renders given fixture posts, `/[locale]/journal/[slug]`
404s on missing slug, locale fallback emits the right `hreflang` tag,
PortableText renders all serializers (one fixture document hits each),
Hero with override renders the Sanity image + CTA, Hero without override
renders the i18n hero (snapshot test), ActivityGrid mixes overridden
tiles with fallback tiles correctly.

### 7.4 — Draft mode + Presentation

- **`/api/draft/route.ts`** — `GET` with `?slug=&token=`. Verifies the
  token via `next-sanity`'s `validatePreviewUrl` (or equivalent JWKS
  check against the project). On success, calls
  `(await draftMode()).enable()` and `redirect(slug)`. On failure, 401.
- **`/api/disable-draft/route.ts`** — `GET`. Disables draft mode and
  redirects home.
- **`lib/sanity/draft-mode.ts`** — exposes `withDraftMode<T>(loader: ()
=> Promise<T>): Promise<T>` — reads `draftMode()`, swaps in the draft
  client + `cache: 'no-store'` for the duration of `loader`. Editorial
  loaders in `queries.ts` wrap themselves in this helper so route-level
  code never touches the API.
- **Studio Presentation tool** — configured in `sanity.config.ts` to
  point at `${NEXT_PUBLIC_SITE_URL}/api/draft?slug=$slug`. Editors click
  "Preview" in Studio and land on the draft-mode storefront.
- **`<DraftBanner />`** — small client island visible only when
  `draftMode().isEnabled`; provides a "Disable preview" button that
  navigates to `/api/disable-draft`.

Tests: token verification rejects malformed/expired tokens, draft-mode
helper invokes the draft client + no-store fetch, banner renders
conditionally, e2e (deferred to Phase 9) verifies the round-trip.

## Crosscutting deliverables

- **`@hurc/eslint`-rule** — none added; the studio-bleed guard is a
  webpack-side check, not a lint rule. (Adding a real ESLint rule
  would justify its own ADR.)
- **CI:** `pnpm codegen` already runs in the existing flow; the new
  `sanity` step inherits cache from Turbo. No new CI job.
- **Storefront `.env.example`** — already has the four Sanity entries
  reserved (Phase 4). Phase 7 adds explanatory comments and uncomments
  the `SANITY_REVALIDATE_SECRET=` line.
- **`infra/env.reference.md`** — adds an "Important: secret pairs"
  callout near the table noting that `NEXT_REVALIDATE_SECRET` (backend)
  must equal `SANITY_REVALIDATE_SECRET` (storefront).

## Phase 7 gate (cumulative, after 7.4)

- [ ] All four sub-phases ended gate-green at the time of merge.
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` clean
      at repo root.
- [ ] `pnpm sanity typegen` deterministic (drift detector test).
- [ ] Editorial routes render given fixtures; locale fallback works.
- [ ] `/api/revalidate` rejects bad secret (test) and accepts the
      bridge's `payloadToTags` shapes (cross-checked against
      `apps/backend/src/plugins/hurc-sanity-bridge/payload-mapper.ts`).
- [ ] Storefront builds without `NEXT_PUBLIC_SANITY_PROJECT_ID` set
      (Sanity remains optional; editorial routes 404 with a friendly
      message; home renders i18n-only).
- [ ] Bundle delta on home/PLP/PDP ≤ 0 kB (Sanity must not bleed into
      these chunks). Editorial routes ≤ 280 kB (the Phase 6 cap).
      Studio chunk excluded from the budget (it's an admin surface).
- [ ] axe scan clean on `/[locale]/journal`, `/[locale]/journal/<fixture>`,
      `/[locale]/story`.
- [ ] `app/robots.ts` blocks `/studio`.
- [ ] All six locale message files updated; drift detector passes.
- [ ] Self-review block (CLAUDE.md §6.1) output in the implementation
      summary.
- [ ] Tag commit `phase-7-complete` (user-driven; CLAUDE.md hard rule #9).

## Order of operations (one logical PR per chunk)

In a clean branching workflow this is one PR per chunk. The current
working tree carries Phases 2–6 uncommitted on `feat/phase-3-graphql-codegen`
per the user's explicit instruction; Phase 7 lands on top of that same
working tree. Logical chunks below are **commit boundaries**, not
branch boundaries, until the user drives a consolidation pass.

**7.1 (Sanity foundations)**

1. `feat(storefront): add Sanity client + image builder + tag namespace extension`
2. `feat(storefront): /api/revalidate route handler with allowlist + tests`

**7.2 (Studio + schemas)** 3. `feat(storefront): sanity.config + schemas (homepage, page, journalPost, activity)` 4. `feat(storefront): embedded Studio mount at /studio + robots Disallow + bundle guard` 5. `chore(storefront): sanity typegen wired into pnpm codegen + types committed`

**7.3 (Editorial routes + overrides)** 6. `feat(storefront): /[locale]/journal index + post route + JournalCard + PortableText` 7. `feat(storefront): /[locale]/story page (Sanity-sourced)` 8. `feat(storefront): Hero/ActivityGrid/BrandStatement accept Sanity overrides; home threads them` 9. `feat(storefront): journal.* + story.* + studio.* messages across six locales`

**7.4 (Draft mode + Presentation)** 10. `feat(storefront): /api/draft + /api/disable-draft + draft-mode helper` 11. `feat(storefront): Studio Presentation tool + DraftBanner client island`

**Cap** 12. `docs(infra): env.reference.md secret-pair callout + .env.example uncomment` 13. `chore(repo): phase-7-complete tag` (user-driven)

## Phase 7 deviations (D1–D2 from implementation)

**D1 — Studio mount deferred; editors use sanity.io's hosted Studio.**
ADR §"Decision summary 8" mounted Studio at `/studio/[[...tool]]`. At build
time, `sanity@5.23.0` imports `useEffectEvent` from `react`, a stable
hook in React 19.2 — but Next 15.5.15 bundles its own internal React copy
(`next/dist/compiled/react`) that does not yet expose this export. The
client-side studio chunk fails to compile against Next's bundled React,
even with `transpilePackages: ['sanity']`. Downgrading to `sanity@4.22.0`
introduced an unrelated pnpm `ERR_PNPM_IGNORED_BUILDS` block on
`esbuild@0.27`. Pivoted to **sanity.io's hosted Studio** (already
included in any Sanity project — editors log into `sanity.io/manage` and
edit there). The storefront's published-content surface is unchanged;
`app/robots.ts` still disallows `/studio` so the route is reserved for a
future remount post-Next-16. The `studio.disabled` i18n key is wired but
intentionally unrendered.

Files removed since the ADR draft: `src/app/studio/[[...tool]]/page.tsx`,
`src/app/studio/layout.tsx`. Files retained: `sanity.config.ts`,
`sanity.cli.ts` (both feed `sanity typegen`, build-time only — never
bundled by Next).

**D2 — Studio-bleed ESLint rule uses `paths` (exact-match), not
`patterns` (glob).** ADR §"Risks R1" called for a webpack tap. ESLint's
`no-restricted-imports` `patterns.group` matches with picomatch and
caught alias paths like `@/lib/sanity/queries` as false positives.
Switched to `paths: [{name: 'sanity'}, {name: 'sanity/structure'}, ...]`
— exact-match, no false positives, lower-mechanism complexity. The
guard still fires against the four legitimate studio imports (`sanity`,
`sanity/structure`, `sanity/cli`, `next-sanity/studio`); editorial code
under `src/sanity/**` is `ignores`-listed (still none of those imports
reach a marketing/commerce chunk because the Studio route was removed
in D1).

## Open follow-ups (after Phase 7)

- **Sanity Live preview** (`defineLive` / `<SanityLive />`) — bypasses
  the bridge's roundtrip for instant draft updates. Wait until editorial
  usage shows the bridge latency is a problem.
- **Per-product editorial overlay** — the bridge already maps `_type:
product`; add a `productEditorial` document type referencing the
  Vendure slug, render the overlay in PDP. Polish; not Phase 7.
- **Reference type for journal authors** — currently a string; promote
  to a `personalAuthor` document with bio + headshot once we have
  multiple authors.
- **Klaro consent gate over Studio** (Phase 8) — the Studio drops
  cookies (Sanity auth); document the editor-facing implication.
- **Cloudflare IP allowlist on `/studio`** (Phase 10) — defence in
  depth on top of Sanity SSO.
- **Image hotspot/crop fidelity** — wire Sanity hotspot data into
  `EditorialImage` via `next/image`'s `objectPosition` prop, computed
  from the hotspot percentages.
- **Per-field i18n** — if editorial volume grows enough that
  duplicating posts across six locales becomes burdensome, revisit the
  per-document strategy and migrate to `internationalizedArrayField`.
  Decision documented in this ADR; revisit after first six months of
  editorial use.
- **Persisted Sanity queries** — `next-sanity` supports them via
  `experimental_taintObjectReference`-style flow; cuts CDN egress.
  Post-launch optimization.
