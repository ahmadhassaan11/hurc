# ADR 0005 — Phase 4 implementation plan (storefront foundation)

- **Status:** Proposed (planning only — no code yet)
- **Date:** 2026-05-02
- **Decision owner:** Lead full-stack engineer
- **Supersedes:** Phase plan item 4 of [ADR-0001](./0001-stack.md), refined into
  executable sub-tasks. Also resolves the GraphQL-client decision deferred from
  [ADR-0004](./0004-phase-3-plan.md) §"Open follow-ups".
- **Depends on:** Phase 3 (`phase-3-complete` tag) — `@hurc/graphql/{admin,shop}`
  must publish typed `TypedDocumentNode` artifacts before Phase 4 wires a client.

## Why this plan exists

Phase 4 in [ADR-0001](./0001-stack.md) is one bullet ("Storefront foundation —
Next.js 15, i18n, Vendure client, SEO, analytics"). In practice it is the
**foundation that every later phase plugs into**:

- Phase 5 (`@hurc/ui`) renders into Phase 4's app shell.
- Phase 6 (commerce flows) lives inside Phase 4's locale-aware route groups,
  consumes Phase 4's Vendure client, and dispatches Phase 4's Server Actions.
- Phase 7 (Sanity editorial) revalidates Phase 4's RSC cache via tags Phase 4
  defines.
- Phase 8 (compliance) hooks into Phase 4's consent gate.
- Phase 9 (testing) runs against Phase 4's pages, layouts, and actions.

If the foundation is wrong, every later phase pays for it. This ADR pins
versions, fixes the file layout, picks the GraphQL client, defines cache and
auth conventions, and lists every test and gate so Phase 4 ends with a
provably bootable storefront — even though no product pages exist yet.

**Out of scope for Phase 4** (each gets its own phase or ADR):

- Real PLP / PDP / cart / checkout / account UI → Phase 6.
- shadcn/ui primitive population → Phase 5.
- Sanity client + page integrations → Phase 7.
- Klaro consent UI + cookie banner → Phase 8 (consent **gate** lands in Phase
  4 as a stub primitive so analytics respects it from day one).
- PostHog event taxonomy → Phase 6 / Phase 8.
- Mollie Components / Stripe Elements → Phase 6.
- Lighthouse-CI / axe gates → Phase 9.
- Vercel deploy + DNS / Caddy / Cloudflare → Phase 10.

## Decision summary

1. **Framework:** Next.js 15.5.15 App Router, React 19.2.5, RSC by default.
   `"use client"` only when an interaction or browser API demands it
   (CLAUDE.md §6 performance gate).
2. **TypeScript:** strict mode, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`
   inherited from `@hurc/config-tsconfig/base.json`. Storefront `tsconfig.json`
   adds `"plugins": [{ "name": "next" }]` and `"jsx": "preserve"`. Path alias
   `@/*` → `src/*`.
3. **Tailwind:** v4 (`@import 'tailwindcss'` + `@import '@hurc/config-tailwind/tokens.css'`).
   No `tailwind.config.js`; v4 reads tokens from CSS. PostCSS pipeline:
   `@tailwindcss/postcss` only.
4. **i18n:** `next-intl@4.11.0`. Locales: `en` (default), `de`, `fr`, `nl`,
   `es`, `it`. Markets routed via subpath: `/{locale}/...`. `en` is the default
   prefix-omitted locale. Currency derived from `Channel` (EUR for EU
   storefront, GBP for `/en-GB/...` once UK channel comes online).
5. **GraphQL client (resolves ADR-0004 follow-up):** **thin RSC fetch wrapper
   over `TypedDocumentNode`**. No urql, no Apollo, no react-query.
   - Server: `fetch(VENDURE_SHOP_API_URL_INTERNAL, { method: 'POST', body, next: { tags, revalidate } })`.
   - Browser (rare; cart drawer, search-as-you-type): same wrapper points at
     `NEXT_PUBLIC_VENDURE_SHOP_API_URL`.
   - Mutations live in Server Actions; client components call actions, not
     GraphQL endpoints directly. Cache invalidation via `revalidateTag`.
   - Reasoning in §3.2 below.
6. **Server Actions:** `next-safe-action@8.5.2`. `actionClient` exported from
   `src/lib/actions/client.ts`. Schema = Zod. Result = discriminated union
   `{ ok: true, data } | { ok: false, error }` per CLAUDE.md hard rule #2.
7. **Auth:** Vendure shop-api session cookies. Storefront forwards `cookie`
   header on every server fetch and propagates `set-cookie` from Vendure back
   to the user via `cookies()`. No tokens in `localStorage` (CLAUDE.md anti-
   pattern §13). Cookie attributes: `httpOnly`, `Secure`, `SameSite=Lax`.
8. **SEO:** Next 15 metadata API in `app/layout.tsx` + per-route `generateMetadata`.
   Canonical host from `NEXT_PUBLIC_SITE_URL`. `app/robots.ts` and
   `app/sitemap.ts` stubs (real product entries land in Phase 6). OG image
   route handler at `app/api/og/route.tsx` returning a tokens-styled
   `ImageResponse`.
9. **Analytics:** `next-plausible@4.0.0` (no consent needed — privacy-first,
   server-side aggregation, EU-hosted). `posthog-js@1.372.6` loaded
   **only after explicit analytics consent** via the `useConsent()` hook
   (Phase 8 ships the UI; Phase 4 ships the gate that returns `{ analytics:
false }` until then). PostHog host pinned to `https://eu.posthog.com`.
10. **Error monitoring:** `@sentry/nextjs@10.51.0`. Server + edge instrumented
    unconditionally. Browser SDK loaded **only after consent**, same gate as
    PostHog. DSN split: `SENTRY_DSN_STOREFRONT` is dual-scope per
    `infra/env.reference.md`.
11. **Logger:** `pino@10.3.1` (matches backend) for server / edge / RSC log
    lines. Browser logging is Sentry breadcrumbs only — no `console.*` in
    shipped client code per CLAUDE.md hard rule #6.
12. **Env:** `src/env.ts` exports a Zod-validated, frozen object. Module is
    `import 'server-only'`-guarded; a sibling `env.client.ts` exposes the
    `NEXT_PUBLIC_*` subset and is the only file that may read `process.env`
    in client code paths.
13. **Toaster:** `sonner@2.0.7`. Mounted once in the locale layout. Used for
    Server Action result feedback.
14. **Animation:** `framer-motion@12.38.0` declared as a dep but not used in
    Phase 4 (Phase 5+6 will). Pinning the version now keeps lockfile churn
    isolated to one PR.

## Verified version pins (as of 2026-05-02)

```
next                          15.5.15  (latest 15.x; Next 16 deferred — see Risk R1)
react                         19.2.5
react-dom                     19.2.5
next-intl                     4.11.0
next-safe-action              8.5.2
@sentry/nextjs                10.51.0
next-plausible                4.0.0
posthog-js                    1.372.6
posthog-node                  5.33.0
sonner                        2.0.7
framer-motion                 12.38.0
zod                           4.4.2     (matches backend pin from Phase 2)
pino                          10.3.1    (matches backend)
server-only                   0.0.1
@graphql-typed-document-node/core  3.2.0  (already a runtime dep of @hurc/graphql)

tailwindcss                   4.2.4     (already in @hurc/config-tailwind)
@tailwindcss/postcss          4.2.4
postcss                       8.x       (transitive via @tailwindcss/postcss)
```

Re-verify with `pnpm view <pkg> version` immediately before `pnpm install` per
CLAUDE.md hard rule #10. Lockfile is the contract.

## Risks called out before code

- **R1 — Next.js 16 is GA (16.2.4); we pin to 15.5.15.** ADR-0001 locks
  Next.js 15. Next 16 is a single major behind and would force a re-validation
  of the i18n routing API, the metadata API, and Sentry compatibility. Sticking
  to 15.5 keeps the spec contract; an upgrade to 16 belongs in its own ADR
  after Phase 9 lands the Lighthouse + Playwright safety net.
- **R2 — next-intl 4.x changed routing primitives from 3.x.** v4 ships the
  unified `routing` config object and `defineRouting()`. Most blog posts on
  the internet target 3.x. Mitigation: follow the v4 docs and the v4 example
  app verbatim. v4 is what we install — never copy-paste a 3.x example.
- **R3 — Vendure session-cookie domain mismatch in dev.** In production both
  the storefront and shop-api live on `*.hurc.com`, so the session cookie
  flows. In local dev the storefront runs on `localhost:3000` and Vendure on
  `localhost:3001` — different ports share cookies, but only if Vendure sets
  `SameSite=Lax` (the default). Mitigation: explicit `apiOptions.cors` config
  on the backend allows `http://localhost:3000` with credentials; storefront
  fetch uses `credentials: 'include'`. Verified in Phase 2 (`apiOptions.cors`
  is open in dev).
- **R4 — RSC fetch deduplication and Vendure session.** Next 15's RSC cache
  dedupes identical fetches within a render. If two server components fetch
  `activeOrder`, only one network call fires — but the Vendure session
  carried in the request cookie must be identical. Since both fetches happen
  inside the same request, the same cookie header is forwarded; this is safe.
  We document it in `src/lib/vendure/client.ts` so a future contributor does
  not "fix" it.
- **R5 — `set-cookie` propagation in Server Actions.** When a Server Action
  triggers a Vendure mutation that rotates the session (login, register,
  setCustomerForOrder), Vendure returns a new `set-cookie`. The fetch
  wrapper extracts it and calls `cookies().set(...)` so the user's session
  rotates on the next request. This only works inside Server Actions and
  Route Handlers — never inside RSC render. Documented + linted: any
  attempt to call the mutation wrapper inside an RSC component will throw
  at runtime via `headers()`/`cookies()` semantics.
- **R6 — CSP nonces vs Sentry replay.** Future hardening (Phase 10) ships a
  strict Content-Security-Policy with nonces. Sentry's session replay
  injects script tags. Mitigation: nonce middleware lands in Phase 10; for
  Phase 4, Sentry replay is disabled (`replaysSessionSampleRate: 0`).
- **R7 — Next 15 + React 19 + `useFormState` rename.** React 19 renamed
  `useFormState` → `useActionState` and `useFormStatus` is unchanged.
  Phase 4 uses `useActionState` exclusively; documenting because most
  examples on the web still use the old name.

## File layout (final, after Phase 4)

```
apps/storefront/
├── next.config.ts                      # Next 15 config (i18n plugin, sentry wrapper)
├── postcss.config.mjs                  # @tailwindcss/postcss
├── instrumentation.ts                  # Sentry server / edge bootstrap
├── instrumentation-client.ts           # Sentry browser bootstrap (consent-gated)
├── sentry.server.config.ts
├── sentry.edge.config.ts
├── sentry.client.config.ts
├── middleware.ts                       # next-intl locale negotiation + auth cookie passthrough
├── tsconfig.json                       # adds Next plugin, @/* alias, jsx preserve
├── package.json                        # scripts: dev / build / start / typecheck / lint / test
├── messages/
│   ├── en.json                         # canonical
│   ├── de.json                         # stub keys mirror en.json
│   ├── fr.json
│   ├── nl.json
│   ├── es.json
│   └── it.json
├── public/
│   ├── favicon.ico                     # Phase 4 ships placeholders; Phase 5 designs them
│   ├── icon.svg
│   └── apple-icon.png
└── src/
    ├── env.ts                          # server-only zod env
    ├── env.client.ts                   # NEXT_PUBLIC_* zod env
    ├── i18n/
    │   ├── routing.ts                  # defineRouting({ locales, defaultLocale, ... })
    │   ├── navigation.ts               # createSharedPathnamesNavigation re-exports
    │   └── request.ts                  # getRequestConfig() — locale + messages
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx              # locale-aware root layout (html lang, NextIntlClientProvider, fonts, toaster)
    │   │   ├── page.tsx                # placeholder home; Phase 6 replaces
    │   │   ├── error.tsx               # client error boundary
    │   │   ├── not-found.tsx           # localized 404
    │   │   └── loading.tsx             # placeholder skeleton
    │   ├── api/
    │   │   ├── health/route.ts         # { ok, version, commit, time }
    │   │   └── og/route.tsx            # ImageResponse — token-styled OG default
    │   ├── robots.ts                   # next 15 metadata route handler
    │   ├── sitemap.ts                  # ditto
    │   ├── global-error.tsx            # Sentry-wrapped fallback for layout-level crashes
    │   └── globals.css                 # @import 'tailwindcss'; @import '@hurc/config-tailwind/tokens.css';
    ├── components/                     # only Phase-4-essential primitives
    │   ├── analytics/
    │   │   ├── Plausible.tsx           # next-plausible <PlausibleProvider/>
    │   │   └── PostHog.tsx             # consent-gated init
    │   ├── consent/
    │   │   ├── ConsentProvider.tsx     # context returning { analytics: bool, marketing: bool }
    │   │   └── useConsent.ts           # hook
    │   ├── layout/
    │   │   ├── RootProviders.tsx       # NextIntl + Theme + Consent + Toaster
    │   │   └── HtmlShell.tsx           # <html lang> + <body className=...>
    │   └── primitives/
    │       └── Toaster.tsx             # sonner re-export with brand defaults
    └── lib/
        ├── actions/
        │   └── client.ts               # next-safe-action client + base middleware
        ├── analytics/
        │   ├── plausible.ts            # event helper (no PII)
        │   └── posthog.ts              # consent-gated client
        ├── intl/
        │   ├── format.ts               # Intl.NumberFormat / DateTimeFormat helpers
        │   └── locale.ts               # locale → Vendure LanguageCode mapping
        ├── seo/
        │   ├── metadata.ts             # buildMetadata() — defaults + per-route override
        │   └── og.ts                   # OG image data shape
        ├── sanity/                     # placeholder; Phase 7 fills in
        │   └── README.md
        ├── logger/
        │   ├── server.ts               # pino → Logtail transport in prod
        │   └── client.ts               # noop in dev; Sentry breadcrumb in prod
        └── vendure/
            ├── client.ts               # request<TQuery,TVars>(doc, vars, opts)
            ├── client.test.ts          # unit tests for cache tags + cookie passthrough
            ├── revalidation.ts         # tag constants + revalidateTag helpers
            └── errors.ts               # GraphQLClientError discriminated union
```

`apps/storefront/tests/{unit,e2e}/` already exist (Phase 1 stubs); Phase 4 only
adds Vitest unit tests for `lib/`. Playwright is wired in Phase 9.

## Sub-task plan

### 4.1 Tooling install + Next 15 scaffold

1. Add direct deps to `apps/storefront/package.json` from §"Verified version
   pins". `pnpm install` from repo root, lockfile committed.
2. `next.config.ts`:
   - `experimental.typedRoutes: true` (Next 15 stable).
   - `images.remotePatterns` allowing Bunny CDN host from
     `ASSET_PUBLIC_URL_PREFIX` and Sanity CDN.
   - Wrapped in `withSentryConfig()` and `createNextIntlPlugin('./src/i18n/request.ts')`.
3. `postcss.config.mjs` exports `{ plugins: { '@tailwindcss/postcss': {} } }`.
4. Replace `package.json` scripts:
   - `dev` → `next dev --turbopack`
   - `build` → `next build`
   - `start` → `next start`
   - `typecheck` → `tsc --noEmit -p tsconfig.json` (Next plugin still loads)
   - `lint` → `next lint && eslint src` (Next 15 dual-runs); change to plain
     `eslint src` once `next lint` is removed in Next 16.
   - `test` → `vitest run --config vitest.config.ts` (real tests now exist)
5. Drop the Phase-1 placeholder `src/index.ts`. The Next.js entry is `src/app/`.

### 4.2 GraphQL client decision (resolves ADR-0004 follow-up)

**Chosen:** thin RSC fetch wrapper over the `TypedDocumentNode` artifacts
emitted by `@hurc/graphql/shop` (and `/admin` once Phase 8 lands).

**Rejected alternatives:**

- `urql` — useful when you want client-side declarative subscriptions and
  fragment colocation, but Phase 4–6 do almost all reading in RSC and almost
  all writing through Server Actions. The Suspense-based RSC integration in
  urql 5.x is still beta. Adds ~20kB gzip to the client bundle for
  capabilities we do not yet need.
- `@apollo/client` — heavyweight; no RSC story we can lean on.
- `@tanstack/react-query` + `graphql-request` — `react-query` is the natural
  pick if mutations dominate and the storefront is mostly client-rendered.
  Ours is the opposite shape.
- "Use Vendure's @vendure/admin-ui SDK" — admin SDK, not shop SDK; not the
  same.

**Implementation contract** (`src/lib/vendure/client.ts`):

```ts
import 'server-only';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';
import { cookies, headers } from 'next/headers';
import { env } from '@/env';
import { GraphQLClientError } from './errors';

type FetchOpts = {
  /** Next 15 fetch tags. Defaults to no caching for personalized data. */
  tags?: readonly string[];
  /** Next 15 revalidate seconds. Omit for personalized (no-store). */
  revalidate?: number | false;
  /** Forward / capture session cookie. Default true. */
  session?: boolean;
};

export async function shopRequest<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
  opts: FetchOpts = {},
): Promise<TResult> {
  const cookieStore = await cookies();
  const sessionCookie = opts.session !== false ? cookieStore.get('session')?.value : undefined;

  const res = await fetch(env.VENDURE_SHOP_API_URL_INTERNAL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(sessionCookie ? { cookie: `session=${sessionCookie}` } : {}),
      'accept-language': /* derived from next-intl locale */ '',
    },
    body: JSON.stringify({ query: print(document), variables }),
    next: opts.tags ? { tags: [...opts.tags], revalidate: opts.revalidate ?? false } : undefined,
    cache: opts.tags ? undefined : 'no-store',
  });

  if (!res.ok) {
    throw new GraphQLClientError({ kind: 'http', status: res.status });
  }

  const json = (await res.json()) as {
    data?: TResult;
    errors?: Array<{ message: string; extensions?: unknown }>;
  };
  if (json.errors?.length) {
    throw new GraphQLClientError({ kind: 'graphql', errors: json.errors });
  }

  // Vendure may rotate the session — propagate it back to the user.
  const setCookie = res.headers.get('set-cookie');
  if (setCookie && opts.session !== false) {
    /* parsed + cookies().set(...) — only legal in Server Action / Route Handler */
  }

  return json.data!;
}
```

A sibling `shopMutation()` exists for cookie-rotating writes; it is the only
function that calls `cookies().set(...)`. RSC components calling
`shopMutation` will throw — by design.

**Cache tag conventions** (`src/lib/vendure/revalidation.ts`):

```ts
export const tags = {
  product: (slug: string) => `product:${slug}`,
  collection: (slug: string) => `collection:${slug}`,
  productList: (channel: string) => `productList:${channel}`,
  collectionList: (channel: string) => `collectionList:${channel}`,
  cart: (sessionId: string) => `cart:${sessionId}`,
  customer: (id: string) => `customer:${id}`,
} as const;
```

`revalidateTag(tags.product(slug))` is called from Server Actions after every
mutation that affects the tagged resource. Sanity revalidation in Phase 7 reuses
the same tag namespace.

### 4.3 i18n with next-intl 4

`src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr', 'nl', 'es', 'it'] as const,
  defaultLocale: 'en',
  localePrefix: 'as-needed', // /en/* served at /*; others prefixed
  localeDetection: true, // honors accept-language; can be disabled per-route
});

export type Locale = (typeof routing.locales)[number];
```

`src/i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as never)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Europe/Berlin', // editorial default; user override later
    now: new Date(),
  };
});
```

`middleware.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

Locale → Vendure `LanguageCode` mapping in `src/lib/intl/locale.ts`:

```
en -> en, de -> de, fr -> fr, nl -> nl, es -> es, it -> it
```

(Vendure ships matching enum values; verified against Phase 3 schema snapshot.)

`messages/en.json` is the canonical key set; the other five files start as
copies of `en.json` with English values (translated in a later phase by a
human, not by Claude). A small Vitest test asserts all six files have the
same key set so drift is caught in CI.

### 4.4 SEO foundation

- `app/layout.tsx` declares `metadata` defaults (title template, OG defaults,
  twitter card, theme-color, icon set).
- `buildMetadata({ title, description, path, ogImage })` in
  `src/lib/seo/metadata.ts` returns a `Metadata` object with canonical URL
  derived from `NEXT_PUBLIC_SITE_URL`.
- `app/robots.ts` returns `{ rules: [{ userAgent: '*', allow: '/' }], sitemap }`.
- `app/sitemap.ts` returns a static array in Phase 4 (home + locale roots).
  Phase 6 expands it via `productList` and `collectionList` queries.
- `app/api/og/route.tsx` ships a token-styled default OG image
  (`Bricolage Grotesque` headline on `surface-900` with `accent` underline).

### 4.5 Analytics + consent gate

- `ConsentProvider` in `src/components/consent/ConsentProvider.tsx` wraps the
  locale layout. Phase 4 ships a stub that returns
  `{ analytics: false, marketing: false }`. Phase 8 swaps in the real Klaro
  bridge — no API change required.
- `next-plausible`: loaded unconditionally (privacy-first by design). Domain
  from `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. No PII passed.
- `posthog-js`: dynamic import behind `useConsent().analytics === true`. Host
  pinned to `https://eu.posthog.com`. `autocapture: false` — events are
  declared explicitly in Phase 6.
- Server-side PostHog (`posthog-node`) is **not** wired in Phase 4. Defer to
  Phase 6 where conversion events live.

### 4.6 Sentry

- `instrumentation.ts` registers `@sentry/nextjs` for server + edge.
- `instrumentation-client.ts` registers the browser SDK only after consent.
- `sentry.server.config.ts`, `sentry.edge.config.ts`, `sentry.client.config.ts`
  initialize with `tracesSampleRate: 0.1`, `replaysSessionSampleRate: 0`
  (see Risk R6), and `beforeSend` strips known PII keys.
- `withSentryConfig` wraps `next.config.ts` with `silent: true` and
  `widenClientFileUpload: true`.

### 4.7 Server Actions wiring

`src/lib/actions/client.ts`:

```ts
import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';
import { logger } from '@/lib/logger/server';

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({ name: z.string() });
  },
  handleServerError(error, { metadata }) {
    logger.error({ err: error, action: metadata?.name }, 'server action failed');
    return 'INTERNAL_ERROR';
  },
}).use(async ({ next }) => {
  // Place to thread request-id, locale, channel context onto ctx.
  return next({
    ctx: {
      /* … */
    },
  });
});
```

Phase 4 ships **no** real actions — Phase 6 brings cart / checkout / account.
Phase 4 only ships the typed factory + a dummy `pingAction` covered by tests.

### 4.8 Logger

- `src/lib/logger/server.ts`: pino with `LOGTAIL_SOURCE_TOKEN_STOREFRONT`
  transport in production, pretty-print in dev.
- `src/lib/logger/client.ts`: no-op in dev; in production routes
  `logger.error` / `logger.warn` to `Sentry.captureMessage` as a breadcrumb.
- No `console.*` in shipped code (CLAUDE.md hard rule #6).

### 4.9 Env validation

`src/env.ts` is `'server-only'`. Zod schema mirrors the storefront table in
`infra/env.reference.md`. Boot fails loudly on missing required vars.

`src/env.client.ts` exports a `clientEnv` object of `NEXT_PUBLIC_*` vars
parsed once on the client (Next 15 inlines them at build time, so the parse
happens in the bundle but no secret is exposed).

### 4.10 Tailwind v4 wiring

`src/app/globals.css`:

```css
@import 'tailwindcss';
@import '@hurc/config-tailwind/tokens.css';

/* Phase 4 ships only base layer: html lang, body bg/fg, focus ring. */
@layer base {
  html {
    color-scheme: dark;
  }
  body {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-body);
  }
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
```

PostCSS uses `@tailwindcss/postcss`; no `tailwind.config.js`.

### 4.11 Tests (Vitest unit only — Playwright is Phase 9)

`apps/storefront/tests/unit/`:

- `vendure-client.test.ts` — `shopRequest` builds the right body, attaches the
  cookie, applies `next.tags`, throws `GraphQLClientError` on `errors[]`,
  parses `set-cookie` correctly. Backed by `vitest`'s `fetch` mock.
- `revalidation.test.ts` — tag helpers produce stable strings.
- `messages-shape.test.ts` — every locale json file has the same key set as
  `en.json` (recursive). Drift fails CI.
- `env.test.ts` — Zod schema rejects missing required vars and accepts a
  representative `.env`.
- `seo-metadata.test.ts` — `buildMetadata` produces a canonical URL given
  `NEXT_PUBLIC_SITE_URL` and a path.
- `intl-locale.test.ts` — locale → `LanguageCode` map round-trips.
- `actions-client.test.ts` — a sample action validates input, returns
  discriminated union, logs via the injected logger.

Phase 4 coverage gate: 80% line coverage for everything in `src/lib/**`
(matches the CLAUDE.md §7.3 floor for utility code).

### 4.12 Build integration (Turbo)

`turbo.json` updates:

- `build` task on `@hurc/storefront` already `dependsOn: ["^build"]`. Add
  `dependsOn: ["@hurc/graphql#codegen", "^build"]` so Next builds against
  fresh codegen output.
- New `outputs` for the storefront `build` task: `[".next/**", "!.next/cache/**"]`.
- `dev` task gets `cache: false, persistent: true` (Next dev server is
  long-running).

### 4.13 ESLint

- `apps/storefront/eslint.config.js` already extends `@hurc/config-eslint/nextjs`.
  Phase 4 verifies that the Next.js plugin v15 is current in
  `@hurc/config-eslint`; bumping the shared config is a separate PR if
  needed.
- Add an override that disables `react/no-unescaped-entities` inside
  `messages/*.json` paths (irrelevant; just defense).
- Storefront-specific rule: `no-restricted-imports` forbids `process.env`
  outside `src/env.ts` and `src/env.client.ts`.

## 4.X Phase 4 gate

- [ ] `pnpm install` clean (no peer warnings on `next`, `react`, `next-intl`).
- [ ] `pnpm --filter @hurc/storefront dev` boots, serves `/` (302 → `/en` is
      acceptable), and `/api/health` returns `{ ok: true }`.
- [ ] `pnpm --filter @hurc/storefront build` succeeds; bundle delta vs Phase 3
      under 250kB gzip for the locale layout (Phase 4 has near-zero UI; this
      is the floor we measure Phase 5/6 against).
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` green at the
      repo root. Backend untouched.
- [ ] `shopRequest` against the running backend (`pnpm --filter @hurc/backend dev`)
      returns `activeChannel` for `/en`. Smoke only — full e2e is Phase 9.
- [ ] Six locale JSON files exist with identical key sets (`messages-shape`
      test green).
- [ ] `app/robots.ts` and `app/sitemap.ts` produce valid output for `/en`,
      `/de`, etc.
- [ ] Sentry receives a test error from `/api/health?fail=1` in dev (DSN can
      be a dummy in dev).
- [ ] Plausible script tag present unconditionally; PostHog script tag absent
      until consent flips (verified in `analytics-gate.test.ts`).
- [ ] Tag commit `phase-4-complete`.

## Order of operations (one PR each)

1. `chore(storefront): install Next 15 + React 19 + tailwind v4 toolchain`
2. `feat(storefront): app router scaffold + globals + layout shell`
3. `feat(storefront): next-intl 4 routing + locale-aware layout`
4. `feat(storefront): env.ts + env.client.ts (zod validated)`
5. `feat(storefront): vendure shopRequest client + cache-tag conventions`
6. `feat(storefront): server actions client (next-safe-action)`
7. `feat(storefront): SEO metadata + robots + sitemap + OG route`
8. `feat(storefront): consent gate + plausible + posthog stub`
9. `feat(storefront): sentry server/edge/client wiring`
10. `feat(storefront): logger (pino server, sentry-breadcrumb client)`
11. `test(storefront): unit tests for lib/* (vitest)`
12. `chore(turbo): wire storefront build dependsOn @hurc/graphql#codegen`
13. `chore(repo): phase-4-complete tag`

Each PR independently revertable; each ends with all repo gates green.

## Open follow-ups (after Phase 4)

- **ADR-0006 — design system contract** (Phase 5): primitive surface,
  variant pattern, dark/light theming hook into the tokens already in
  `@hurc/config-tailwind`.
- **Sanity client + draft mode** (Phase 7): wires
  `NEXT_PUBLIC_SANITY_PROJECT_ID` + `SANITY_API_READ_TOKEN` and the
  `/api/revalidate` route handler that the backend's `hurc-sanity-bridge`
  posts to.
- **Klaro consent UI** (Phase 8): replaces the `ConsentProvider` stub with
  real cookie-controlled state.
- **Multi-currency / multi-channel switch** (Phase 6): `/en-GB/...` and the
  Channel-aware `shopRequest` variant.
- **Persisted operations** (post-launch): cuts shop-api egress; mirrors the
  follow-up already tracked in ADR-0004.
- **Strict CSP with nonces** (Phase 10): unblocks Sentry replay; needs a
  middleware rewrite that injects a per-request nonce.
- **`next lint` removal** (Next 16 upgrade ADR): plain `eslint` only.

## Phase-1 deviation reminder

ADR-0001 §"Phase 1 deviations" calls out that Node 22 must be installed
locally before Phase 4 begins (Next 15 supports Node 18.18+, tested on 20 and
22; the dev machine is on Node 25.2.1). **Action item before the first PR
in §"Order of operations" lands:** `fnm install 22 && fnm use 22`, verified
by `node -v` matching `engines.node` in the root `package.json`.
