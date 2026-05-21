# ADR 0009 — Phase 8 implementation plan (EU compliance)

- **Status:** Proposed (planning only — no code yet at the time this ADR was written)
- **Date:** 2026-05-03
- **Decision owner:** Lead full-stack engineer
- **Supersedes:** Phase plan item 8 of [ADR-0001](./0001-stack.md), refined into
  five executable sub-phases.
- **Depends on:**
  - Phase 2 (`hurc-gpsr`, `hurc-gdpr` plugins) — already shipped:
    `Product` GPSR custom fields (`responsiblePerson`, `manufacturerInfo`,
    `warnings`, `traceabilityCode`); `POST /gdpr/export` (ZIP), `POST /gdpr/delete`
    (PII scrub with retention-window). Phase 8 must not regress those contracts.
  - Phase 4 (`<ConsentProvider>` stub returning `{analytics:false, marketing:false}`,
    Sentry/PostHog gated on `useConsent().analytics`, Plausible loaded
    cookielessly). Phase 8 swaps the stub for a real Klaro-driven state.
  - Phase 6 (`<GpsrPanel>` on PDP, `account/data` route + `<GdprPanel>` calling
    the storefront's `/api/gdpr/{export,delete}` proxies to the backend).
    Phase 8 surfaces an EU 14-day-withdrawal disclosure on checkout and
    extends the order-confirmation email with the legally required Impressum
    block + withdrawal notice.
  - Phase 7 (`page` Sanity schema with localized SEO + Portable-Text body,
    `loadPage(slug)` GROQ loader). Phase 8 reuses it for editor-overrideable
    legal copy without taking a hard dependency: legal pages **render from
    a static, repo-versioned body by default** and overlay Sanity content
    when a `page` document with the matching slug exists.

## Why this plan exists

Phase 8 is the **legal launch gate**. Without it the EU storefront cannot be
sold into: GDPR consent for analytics, GPSR safety disclosure on every
listing, the §5 TMG Impressum, the consumer 14-day withdrawal right, and a
DSGVO-compliant cookie banner are all _legal pre-requisites_, not feature
work. The previous phases left compliance "load-bearing rails" in place
deliberately — Phase 8 closes the gaps without re-engineering them:

1. **Consent.** `<ConsentProvider>` is a stub. PostHog/Sentry already
   gate on its `analytics` flag — they are dormant until a real banner
   flips it. Phase 8 ships the banner, the cookie, the re-prompt mechanic,
   and the full service catalog Klaro needs to render.
2. **Legal copy.** Footer columns already link to `/legal/{imprint,terms,
privacy,cookies}` (the strings exist in all six locales). The pages
   themselves 404. Phase 8 ships the routes + copy.
3. **GPSR display.** PDP shows custom-field disclosures via `<GpsrPanel>`.
   Phase 8 verifies that path is wired into every product enabled in EU
   channels and adds an admin-side soft-block (an admin alert banner; the
   hard CustomFieldUiInput block stays deferred per ADR-0002).
4. **GDPR self-service.** `account/data` already exposes export/delete
   buttons. Phase 8 hardens the UX (confirmation modal, post-deletion
   sign-out + redirect, audit log entry on every export and deletion).
5. **Order email DSGVO.** The Phase 6 transactional templates ship a
   logo + order summary. Phase 8 adds the Impressum block, the legally
   required 14-day withdrawal notice, and a privacy-policy link.

If Phase 8 is shipped as one bullet ("add Klaro"), we miss four other
mandates. This ADR splits it into five sub-phases, each independently
shippable, each ending gate-green.

## Decision summary

1. **Sub-phase split:**
   - **8.1 Consent foundation** — Klaro UI (vanilla bundle, lazy-loaded),
     a thin React bridge that mirrors Klaro state into a first-party
     `hurc-consent` cookie, and a `<ConsentProvider value={…}>` connection
     so PostHog/Sentry flip live. Re-prompt mechanism (cookie versioning).
     Footer "Manage cookies" trigger. No legal pages yet — the banner
     links to existing static placeholder routes that 404 until 8.2.
   - **8.2 Legal pages** — five routes: `/legal/imprint`, `/legal/terms`,
     `/legal/privacy`, `/legal/cookies`, `/legal/withdrawal`. Each renders
     from a repo-versioned static body by default and overlays a Sanity
     `page` document if one exists with matching slug. Footer extended
     with the `withdrawal` link. SEO: indexable except `/legal/cookies`
     and `/legal/withdrawal` (low-value pages; `noindex,follow`).
   - **8.3 Checkout + email DSGVO** — checkout-step-3 adds a required
     "I have read the GTC and Privacy Policy" checkbox plus the EU
     withdrawal disclosure. Order-confirmation email gains an Impressum
     block in the footer + the 14-day-withdrawal notice + a link to the
     privacy policy. Withdrawal form route mirrors the legal text.
   - **8.4 GPSR + GDPR polish** — admin-bar alert banner on products
     enabled with missing GPSR fields (uses the existing ProductEvent
     guard's log signal); PDP `<GpsrPanel>` renders an explicit
     "Information pending" empty state instead of returning `null`;
     GDPR export/delete UI gains a confirmation modal, post-deletion
     sign-out + redirect, and an audit-log breadcrumb (Sentry tag);
     storefront `/api/gdpr/*` proxies tighten error responses.
   - **8.5 Compliance test surface** — Playwright e2e for the
     accept-all / reject-all / re-open / version-bump cycle; axe scan
     on the consent modal and all legal pages; Vitest unit for cookie
     read/write, version comparison, ConsentProvider value flip; an
     i18n drift test asserting `legal.*` keys exist in all six locales;
     a lighthouserc budget addition for the modal interaction.

2. **Library choice — Klaro (`klaro@0.7.21`, BSD-3-Clause), not a
   bespoke React component.** Klaro is the de-facto OSS DSGVO consent
   manager: localized strings out of the box (de/fr/nl/es/it/en
   coverage), a service catalog model that matches our actual
   third-party deps, and a deterministic cookie API. Bundle size is
   ~25 KB gzipped; we lazy-load it after first paint so it never
   blocks LCP. The "klaro-react" community wrapper is unmaintained and
   adds no value over a 30-line in-house bridge — we write that bridge
   ourselves and treat Klaro as a vanilla DOM library. Klaro reads
   first-party cookies only; no third-party requests during
   initialization.

3. **Consent cookie shape — first-party, signed, versioned.**

   ```json
   {
     "v": "2026-05-03",
     "services": {
       "plausible": true,
       "posthog": false,
       "sentry": false,
       "klaviyo": false
     }
   }
   ```

   Stored as `hurc-consent` (no `httpOnly` — the client needs to read
   it to render the banner; no PII, no session linkage). `Secure;
SameSite=Lax; Path=/; Max-Age=34560000` (12 months — DSGVO
   recommendation; legal upper bound is "as long as needed" but the
   ICO/EDPB consensus is 12-24mo).
   The banner re-prompts when stored `v` ≠ the source-of-truth version
   constant in `lib/consent/version.ts`. **Bumping the version is a
   deliberate act**: re-prompt means re-consent, which is what we
   want when the service catalog changes (new third party added,
   data-processing terms updated). The version constant is a date
   string, not a semver — humans reason about it as "the date the
   privacy policy last changed."

4. **Service catalog — explicit, audit-ready.** Four services in
   the catalog, each declared with purpose, cookies set, processor,
   transfer disclosure, and "required-vs-optional":
   | Service | Required | Purpose | Processor | Transfer | Cookies / IDs |
   | ---------- | -------- | ------------------- | -------------------- | -------- | ----------------------------------- |
   | Functional | yes | Cart, auth, lang | HURC self-hosted | EU | `session`, `NEXT_LOCALE` |
   | Plausible | yes | Analytics (no PII) | Plausible (DE) | EU only | none — fingerprint-based, anon |
   | PostHog | no | Product analytics | PostHog (EU region) | EU only | `ph_*` in localStorage on consent |
   | Sentry | no | Error monitoring | Sentry (EU region) | EU only | `_sentry_*` on consent |
   | Klaviyo | no | Marketing (email) | Klaviyo (US, SCC) | US | `klaviyo_*` on consent |
   "Required" services run regardless of consent and are listed for
   transparency only — they are technically necessary under DSGVO
   Art. 6(1)(b) (contract performance) and PECR Reg. 6(4)(b) (strictly
   necessary cookies). Plausible is classified "required" because we
   self-host an instance and it sets no identifying cookies; this is
   defensible under the EDPB's 2019 cookie guidance and is documented
   in the privacy policy.

5. **Legal pages — static body first, Sanity overlay second.** Each
   `/legal/[slug]` route resolves in this order:
   - **(a)** Try `loadPage(\`legal-${slug}\`, locale)` from Phase 7's
     Sanity loader. If a document exists, render it via the existing
     Portable-Text + SEO pipeline.
   - **(b)** Fall back to a typed static body component
     `<ImprintBody locale={…} />` etc., which composes prose from a
     namespaced message file `messages/legal-${locale}.json`.
   - **(c)** Static bodies live in source control because legal copy
     **must be auditable in git history** and survive a Sanity outage.
     The Sanity overlay exists so legal/marketing can patch typos
     without a deploy — but the base copy is what shipped on launch
     day, fully reviewed.
     The five static bodies are placeholder copy authored in English
     only at scaffold time, with German fallback identical to English
     and a visible `<TranslationNotice>` strip on non-English routes.
     **CLAUDE.md hard rule violation watch:** these placeholders are
     not legally adequate and must not be deployed to production.
     `infra/env.reference.md` will gain a launch-checklist note;
     `docs/backlog.md` gains a "lawyer review of /legal/\* copy" item.

6. **Withdrawal form — separate route + email link.** EU consumer law
   (Verbraucherrechte-Richtlinie 2011/83/EU Annex I-B) requires a
   pre-formulated withdrawal form to be **easily accessible** during
   and after purchase. We render it at `/legal/withdrawal` with a
   downloadable PDF link (the PDF is a static asset, generated once
   and committed; not generated dynamically — the legal text doesn't
   vary per order). The order-confirmation email links to this route
   in the standard footer block. The form **does not need to be
   submittable** per the directive — a customer may also withdraw
   "by any unequivocal statement." We add a `mailto:` link to
   `legal@hurc.com` next to the form, and an email-template hook for
   handling inbound withdrawals lands in Phase 9.

7. **Checkout consent gate — single combined checkbox.** Many EU shops
   use two checkboxes ("I accept the GTC" + "I have read the privacy
   policy"). Legally, _one_ checkbox is sufficient if it links to both
   documents — and EDPB guidance discourages "consent fatigue" via
   over-prompting. We use one required checkbox at checkout step 3
   ("Review & pay") with the label `I have read the [GTC]({/legal/terms})
and the [Privacy Policy]({/legal/privacy}) and agree to both.`
   The 14-day withdrawal disclosure is a non-checkbox notice block
   under the order summary: it is **information**, not consent.
   Failure to check the box disables the place-order button but
   does **not** clear cart state.

8. **Email DSGVO — Impressum block, withdrawal notice, no images.**
   Every transactional email gets a footer extension:

   ```
   HURC Apparel GmbH · Friedrichstraße 1 · 10117 Berlin, Germany
   HRB 999999 B (AG Berlin) · USt-IdNr. DE999999999
   Geschäftsführer: <name>
   support@hurc.com · +49 30 0000 0000
   Impressum: https://hurc.com/legal/imprint  ·  Privacy: https://hurc.com/legal/privacy
   Right of withdrawal (14 days): https://hurc.com/legal/withdrawal
   ```

   The `_layout.tsx` template in `apps/backend/src/email-templates/`
   gains a `<ComplianceFooter />` partial. Order-confirmation emails
   additionally include a one-paragraph withdrawal notice immediately
   above the footer. The placeholder company details above are
   overrideable via env vars (`COMPANY_*`) so the same template
   serves staging without leaking the legal entity. **No tracking
   pixels, no remote images** in compliance blocks (transactional
   email engagement tracking would require analytics consent we
   don't have for non-customers; we route around the question by
   not tracking).

9. **GPSR — admin alert + storefront empty state.** The Phase 2
   `hurc-gpsr` plugin already logs an error when an enabled product
   is missing GPSR fields. Phase 8 surfaces that signal:
   - **Admin side:** a NestJS controller route under `hurc-gpsr` lists
     non-compliant products (`GET /gpsr/violations`); the admin UI's
     existing "Channels" section gets a small alert banner via a
     Vendure admin-ui-extension (the smallest possible — a single
     Angular component — to avoid pulling in the full admin-ui-plugin
     extension build chain). If that proves disproportionate during
     implementation, we ship a `pnpm --filter backend gpsr:check` CLI
     instead and surface it in CI as a soft warning. **Decision
     deferred to first commit of 8.4** based on actual effort.
   - **Storefront side:** `<GpsrPanel>` currently returns `null` when
     a product has no GPSR data. Phase 8 changes it to render an
     explicit "Safety information pending" panel for products
     missing data — this is a more honest failure mode (the absence
     of disclosure is itself disclosed) and matches GPSR Art. 9 §1
     "before the product is placed on the market" — i.e., a product
     visibly _enabled in the storefront_ without GPSR data violates
     the regulation regardless of whether the panel renders. The
     better fix is an end-to-end e2e test asserting that no enabled
     product in the EU channel renders the empty state — that test
     ships in 8.5 and is permitted to be `.skip()`'d locally
     pre-launch but **must pass in CI before the launch tag**.

10. **GDPR self-service hardening.** The existing `account/data`
    surface uses two unconfirmed POST buttons. Phase 8 wraps them in
    a confirmation modal (uses `<AlertDialog>` from `@hurc/ui` —
    already shipped in Phase 5):
    - **Export:** confirmation modal → POST → server returns ZIP →
      browser downloads → toast "Export ready"; on failure toast +
      Sentry breadcrumb.
    - **Delete:** confirmation modal with the literal phrase "DELETE
      MY ACCOUNT" required as text input (anti-misclick) → POST →
      backend scrubs PII → response → client signs out, clears
      session cookie, hard-redirects to `/?account=deleted` with a
      one-time toast.
    - **Audit:** every export and deletion logs a structured Sentry
      breadcrumb + a server-side log line tagged `gdpr.export` /
      `gdpr.delete` with the customer ID hashed (`sha256` truncated to
      12 chars) — never the raw email. The backend already records the
      action in its own audit log; the storefront breadcrumb is a
      defense-in-depth signal for "the request reached the proxy."

11. **`/api/gdpr/*` proxy hardening.** Both proxies currently forward
    the session cookie and stream the upstream body back. Phase 8
    adds:
    - Rate limit: 1 request per 60s per session for export, per IP+session
      for delete (delete is irreversible, so a client misclick can't
      DOS the endpoint either way — rate limit is anti-script, not
      anti-typo).
    - A `Cache-Control: no-store, no-cache, must-revalidate` response
      header on both routes (defense in depth — the route is already
      `force-dynamic`, but Cloudflare honors response headers more
      reliably).
    - Body-size cap on the upstream stream (50 MB; rejects with
      `502 PAYLOAD_TOO_LARGE` so a runaway export doesn't OOM the
      Vercel function).

12. **Performance budget — Klaro must not regress LCP.** The banner
    loads after first paint via `dynamic(() => import('klaro/dist/klaro-no-css'),
{ssr: false, loading: () => null})`. Klaro CSS is loaded inline
    (single `<style>` injected by the bridge) to avoid a render-blocking
    request. The cookie read happens server-side in `layout.tsx` so
    consent state is available on first RSC pass without a hydration
    flash. Lighthouse budget addition: `total-byte-weight` may grow by
    no more than 30 KB; LCP/INP must stay within Phase 4 budgets
    (LCP ≤ 2.0s, INP ≤ 200ms, CLS ≤ 0.05).

13. **Internationalization — Klaro built-in + override.** Klaro ships
    German, French, Dutch, Spanish, Italian, English locale strings.
    We pass the active locale to the Klaro init based on
    `next-intl`'s current locale; we override only the service
    descriptions (which are HURC-specific). Translations for legal
    page placeholder copy ship English-only with a translation notice;
    professional translations are a Phase 9 / pre-launch task.

14. **Privacy-by-design tightening — no new client logging.** Phase 8
    explicitly does **not** add any new logging on the consent gate.
    The temptation is to track "consent banner shown / dismissed /
    accepted-all / accepted-some / rejected-all" for funnel analysis —
    this would itself require analytics consent, creating the
    bootstrap problem we're solving for. We accept the analytics
    blind spot. Aggregate consent rates can be inferred from
    PostHog session counts vs. raw page-view counts.

## Verified version pins (as of 2026-05-03 via `pnpm view`)

```
klaro                     0.7.21    (BSD-3-Clause; weekly downloads ~5k; last publish 2024-09-04)
@types/klaro              none — Klaro ships its own d.ts (klaro/dist/klaro.d.ts)
```

No other dependencies are added. The legal-page route, modal, and
withdrawal form compose existing `@hurc/ui` primitives (`Card`,
`AlertDialog`, `Button`, `Separator`) and `next-intl` already present.
Email-template changes use the existing `react-email` runtime.

Re-verify with `pnpm view klaro version` immediately before
`pnpm install` per CLAUDE.md hard rule #10. If a `0.8.x` line has
shipped by then, prefer the latest minor as long as the license is
unchanged and the API is backwards-compatible (Klaro follows semver;
the bridge depends only on `setup`, `getManager`, and the consent
events, all stable since `0.6`).

## Risks called out before code

- **R1 — Klaro hydration flash.** Klaro is client-only; until it
  initializes, nothing is rendered. If we render a server-side banner
  shell and Klaro hydrates over it, FOUC. Mitigation: render no shell
  on the server. The first user paint is the storefront without a
  banner. Klaro mounts ~200ms later and animates in. Acceptable
  because the banner does **not** carry consent state — it is purely
  the prompt UI; consent state is read from the cookie (server-side)
  and gates downstream services in the same RSC pass. A user who
  navigates away before Klaro mounts is treated as "no consent" —
  the default-deny stance — and analytics never fire.
- **R2 — Consent state desync.** Klaro stores its decisions in its
  own cookie (`klaro`). Our app reads `hurc-consent`. A divergence
  (Klaro updates its cookie, our wrapper fails to mirror) means the
  banner shows "all accepted" but PostHog stays off. Mitigation: the
  bridge subscribes to Klaro's `change` event and writes
  `hurc-consent` synchronously in the same handler; a unit test
  asserts every accept/reject path mirrors. Klaro's own cookie is
  retained (Klaro reads it on mount to skip the banner for returning
  users); our cookie is the source of truth for _services_.
- **R3 — Re-prompt loop.** Bumping the version constant re-prompts
  every user. If we bump it accidentally during an unrelated change,
  we degrade UX site-wide. Mitigation: the version constant lives in
  `apps/storefront/src/lib/consent/version.ts` with a docstring
  enumerating "things that should bump this." A `pnpm typecheck`
  hook is not added (would be heavy); the rule is enforced via a
  CODEOWNERS rule on the file (no merge without compliance review)
  in Phase 10 (CI/CD).
- **R4 — Stale Klaro cookie after policy change.** A user who
  consented to "PostHog: yes" three months ago should **not** be
  bound by that consent if we add a new processor. Mitigation:
  bumping the version constant (R3) invalidates every prior consent.
  Klaro's own cookie persists, but our bridge ignores it when the
  version mismatches and forces a re-prompt.
- **R5 — Server-side cookie read is missing on first request.** On a
  first visit (no cookie), `lib/consent/server.ts:readConsentCookie()`
  returns the default-deny shape. PostHog never initializes; that's
  correct. But if the user accepts and the `set-cookie` write happens
  in the response, the **same** RSC render that produced the response
  saw no consent cookie — so analytics doesn't fire on the page where
  consent was granted. Mitigation: the Klaro bridge initializes the
  client-side analytics SDK _immediately on consent flip_, without
  waiting for a navigation. The unit test for ConsentProvider
  asserts the value flips in-place (no React reconciliation gap).
- **R6 — Legal page slugs colliding with Sanity routes.** Phase 7's
  `page` schema accepts arbitrary slugs. An editor could create a
  Sanity page with slug `imprint` (no `legal-` prefix), believing
  they are editing the imprint page. Mitigation: the dispatcher
  loads `legal-${slug}`, not `${slug}`; the slug-prefix convention
  is documented in the Sanity field description. A backlog item
  tracks "Sanity Studio role-restricted legal documents" (a Sanity
  desk-tool config that exposes legal documents only to the legal
  editor role) — out of scope for Phase 8, but called out.
- **R7 — Withdrawal-form PDF generation drift.** The PDF is a
  static asset, but the withdrawal text is reproduced inline on
  `/legal/withdrawal`. If one drifts from the other we are
  technically non-compliant (the directive requires the text and
  the form to match). Mitigation: the PDF is generated _from_ the
  same source string the route renders, in a build step
  (`pnpm --filter @hurc/storefront build:withdrawal-pdf`),
  committed to `apps/storefront/public/legal/withdrawal-form.pdf`.
  A repo guard (a `pnpm verify:withdrawal-pdf` script in CI)
  re-generates and `git diff --exit-code`s. Heavy for one file —
  if effort > 1 hour, fall back to two manually-synchronized
  sources with a clear comment in both. **Decision deferred to
  first commit of 8.2.**
- **R8 — Klaro bundle ends up in marketing bundle.** Per Phase 7's
  studio-bleed lesson, the dynamic-import strategy must be
  verified post-build. Mitigation: a `next.config.ts` webpack tap
  asserts no chunk loaded by `[locale]/page.tsx` resolves a module
  starting with `klaro`. Same shape of guard as the Sanity guard;
  add to the existing block.
- **R9 — Rate limit storage in serverless.** The `/api/gdpr/*`
  rate limit needs durable storage. Mitigation: use Vercel KV (we
  already have a Phase 4 instance for ISR) keyed by hashed session
  ID. If KV is not available in dev, the limiter is a no-op;
  this is documented and acceptable because the limit is
  defense-in-depth, not a primary control.
- **R10 — GDPR delete removes the user mid-flow.** A user clicks
  "Delete" → backend scrubs → user is signed out, but a stale
  RSC render queued in the same tick may still render account
  data. Mitigation: the storefront waits for the deletion HTTP
  response, _then_ clears `cookies()`'s session, _then_
  hard-redirects with `window.location` (not `next/navigation`'s
  `redirect`) to bypass the RSC cache. The hard redirect is a
  conscious break from `next/navigation` style — documented inline.
- **R11 — Email Impressum hard-codes the legal entity.** During
  the pre-incorporation phase, the placeholder `HURC Apparel GmbH`
  is wrong. Mitigation: the entire compliance footer is composed
  from env vars (`COMPANY_NAME`, `COMPANY_ADDRESS`, `COMPANY_VAT`,
  `COMPANY_REGISTRY`, `COMPANY_DIRECTORS`, `SUPPORT_EMAIL`,
  `SUPPORT_PHONE`). Staging has placeholder values; production
  values are injected via Doppler before launch. The template
  fails the build if any of the seven env vars are missing in
  production mode (`NODE_ENV=production`).
- **R12 — Re-prompt UX in middle of checkout.** If an editor bumps
  the consent version while a customer is at checkout step 2, a
  full-screen modal interrupting the checkout would be brutal.
  Mitigation: Klaro's modal is dismissable to step 2 (the
  customer can postpone), and the analytics/marketing services
  stay off until they consent. Required services keep working.
  Tested in 8.5's e2e.

## File layout (additions for Phase 8)

```
apps/storefront/
├── next.config.ts                           # +images.remotePatterns no-op; +klaro chunk guard
├── package.json                             # + klaro ^0.7.21
├── public/
│   └── legal/
│       └── withdrawal-form.pdf              # generated; committed
├── messages/
│   ├── en.json                              # + consent.*, legal.*, withdrawal.*
│   ├── de.json                              # + same keys (placeholder = en)
│   ├── fr.json
│   ├── nl.json
│   ├── es.json
│   └── it.json
├── messages/legal/                          # long-form prose split out
│   ├── en.json
│   ├── de.json
│   ├── fr.json
│   ├── nl.json
│   ├── es.json
│   └── it.json
├── src/
│   ├── lib/
│   │   ├── consent/
│   │   │   ├── version.ts                   # CONSENT_VERSION constant
│   │   │   ├── cookie.ts                    # read/write hurc-consent (server)
│   │   │   ├── client.ts                    # client-side cookie helpers
│   │   │   ├── service-catalog.ts           # the four Klaro services
│   │   │   └── server.ts                    # readConsentCookie() RSC entry
│   │   ├── legal/
│   │   │   ├── load.ts                      # Sanity-then-static dispatcher
│   │   │   ├── slugs.ts                     # const LEGAL_SLUGS = […]
│   │   │   └── content/                     # static-fallback bodies
│   │   │       ├── imprint.tsx
│   │   │       ├── terms.tsx
│   │   │       ├── privacy.tsx
│   │   │       ├── cookies.tsx
│   │   │       └── withdrawal.tsx
│   │   └── gdpr/
│   │       └── rate-limit.ts                # KV-backed limiter
│   ├── components/
│   │   ├── consent/
│   │   │   ├── ConsentProvider.tsx          # MODIFIED: real value from cookie
│   │   │   ├── KlaroBridge.tsx              # NEW: client wrapper
│   │   │   ├── ManageCookiesButton.tsx      # NEW: footer trigger
│   │   │   └── useConsent.ts                # unchanged (re-exports)
│   │   ├── checkout/
│   │   │   ├── ConsentCheckbox.tsx          # NEW: GTC + privacy gate
│   │   │   └── WithdrawalNotice.tsx         # NEW: 14-day disclosure
│   │   ├── legal/
│   │   │   ├── LegalPageShell.tsx           # consistent layout
│   │   │   └── TranslationNotice.tsx        # non-en visible warning
│   │   ├── account/
│   │   │   └── GdprPanel.tsx                # MODIFIED: confirmation modal,
│   │   │                                    # delete-text-confirm, audit log
│   │   └── layout/
│   │       └── Footer.tsx                   # MODIFIED: + withdrawal link,
│   │                                        # + ManageCookiesButton
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx                   # MODIFIED: read cookie, mount KlaroBridge
│   │   │   ├── legal/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx             # dispatcher
│   │   │   └── checkout/
│   │   │       └── payment/
│   │   │           └── page.tsx             # MODIFIED: + ConsentCheckbox
│   │   └── api/
│   │       └── gdpr/
│   │           ├── export/route.ts          # MODIFIED: + rate limit, no-store
│   │           └── delete/route.ts          # MODIFIED: + rate limit, no-store
│   └── env.ts                               # + COMPANY_* (server-only)
├── tests/
│   ├── unit/
│   │   ├── consent-version.test.ts
│   │   ├── consent-cookie.test.ts
│   │   ├── consent-bridge.test.ts
│   │   ├── service-catalog.test.ts
│   │   ├── legal-load.test.ts
│   │   ├── legal-slugs.test.ts
│   │   ├── gdpr-rate-limit.test.ts
│   │   └── gdpr-panel.test.ts
│   └── e2e/
│       ├── consent-flow.spec.ts             # accept/reject/manage/version-bump
│       ├── legal-pages.spec.ts              # axe + i18n
│       ├── checkout-consent.spec.ts         # required checkbox blocks place-order
│       └── gdpr-self-service.spec.ts        # export+delete round-trip

apps/backend/
├── .env.example                             # + COMPANY_* + GPSR_ALERT_*
├── src/
│   ├── env.ts                               # + COMPANY_*
│   ├── email-templates/
│   │   ├── _layout.tsx                      # MODIFIED: + ComplianceFooter
│   │   ├── _compliance-footer.tsx           # NEW
│   │   ├── _withdrawal-notice.tsx           # NEW
│   │   └── order-confirmation.tsx           # MODIFIED: + WithdrawalNotice
│   └── plugins/
│       └── hurc-gpsr/
│           ├── gpsr.controller.ts           # NEW: GET /gpsr/violations
│           ├── violation-store.service.ts   # NEW: in-memory list, refreshed
│           │                                # on ProductEvent
│           └── gpsr.plugin.test.ts          # MODIFIED: + controller tests

infra/
└── env.reference.md                         # + COMPANY_*, + consent guidance,
                                             # + launch-checklist note
docs/
├── ARCHITECTURE.md                          # MODIFIED: § Compliance, § Consent
├── decisions/0009-phase-8-plan.md           # this file
└── backlog.md                               # + lawyer review, + admin-ui hard
                                             # block, + Sanity legal-doc role
```

## Sub-phase acceptance gates

Each sub-phase ends with **all four root gates green** (`pnpm typecheck`,
`pnpm lint`, `pnpm test`, `pnpm build`) plus the sub-phase-specific
contract:

- **8.1 Consent foundation** — Klaro modal renders on first visit;
  accept-all flips PostHog/Sentry on; reject-all keeps them off; the
  `hurc-consent` cookie is written with `Secure; SameSite=Lax`;
  bumping `CONSENT_VERSION` re-prompts; lighthouse LCP unchanged;
  bundle delta ≤ 30 KB compressed.
- **8.2 Legal pages** — five routes return 200 in all six locales;
  static body renders when no Sanity overlay exists; Sanity overlay
  takes precedence when present; footer links resolve; axe clean
  on each route; sitemap.xml includes the indexable subset.
- **8.3 Checkout + email DSGVO** — checkout step 3 disables place-order
  without the consent checkbox; order-confirmation email rendered
  to MJML preview shows the compliance footer + withdrawal notice;
  the seven `COMPANY_*` env vars are required in production.
- **8.4 GPSR + GDPR polish** — `<GpsrPanel>` empty-state renders for
  products missing data (Storybook-equivalent screenshot diff);
  `GET /gpsr/violations` returns the current violation set; export
  and delete buttons gate behind confirmation modal; delete requires
  literal "DELETE MY ACCOUNT" text input; audit Sentry breadcrumbs
  fire on both actions; `/api/gdpr/*` proxies cap body at 50 MB
  and rate-limit per session.
- **8.5 Compliance test surface** — Playwright suite green; axe
  scan zero violations on `/`, `/products/[slug]`, `/checkout/payment`,
  `/legal/imprint`, `/legal/privacy`, `/legal/cookies`,
  `/legal/withdrawal`, `/account/data`; lighthouserc budget green;
  i18n drift script asserts `legal.*` keys present in all six locales.

## Tagging plan

The user drives the `phase-8-complete` tag commit. Phase 8 stacks on
the still-uncommitted Phases 2+3+4+5+6+7 working tree on
`feat/phase-3-graphql-codegen`. Per CLAUDE.md hard rule #9 (no commits
to main) and the established cadence, each sub-phase remains uncommitted
until the user explicitly tags. The four root gates must be green at
each sub-phase boundary even pre-commit.

## Open follow-ups (after Phase 8)

- **Lawyer review** of the static legal-page bodies — must complete
  before the production launch tag. Tracked in
  [docs/backlog.md](../backlog.md).
- **Professional translation** of legal pages into de/fr/nl/es/it.
- **Sanity Studio role-restricted legal documents** — desk-tool
  config exposing `legal-*` slugs only to a "legal" editor role.
- **GPSR admin-ui hard block** (CustomFieldUiInput component) —
  deferred per ADR-0002; revisit in Phase 9 once the admin-ui-plugin
  extension build chain is set up for other reasons.
- **Withdrawal-form inbound handler** — auto-respond + create a
  return record. Phase 9 commerce-ops.
- **Cookie-consent A/B test** — measure consent rates with subtle
  copy variations; requires anon-only analytics so chicken-and-egg
  with consent itself. Deferred indefinitely.
- **Phase 9 (testing & quality) extends 8.5** — formal Playwright
  visual-regression baselines for consent modal and legal pages;
  axe budget thresholds; WCAG 2.2 AA audit pass.

---

_End of ADR-0009._
