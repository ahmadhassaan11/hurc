# ADR 0001 — Stack & phase plan

- **Status:** Accepted
- **Date:** 2026-05-01
- **Decision owner:** Lead full-stack engineer
- **Context:** Initial scope hand-off for the HURC e-commerce build.

## Decision

The stack and 10-phase plan are taken verbatim from the project specification
delivered on 2026-05-01 ("HURC Production Build Specification: Premium
Activewear E-commerce Platform"). The spec is the source of truth and is
captured in this repository at:

- `HURC Production Build Specification_ Premium Activewear E-commerce Platform.pdf`

Key locked choices (no alternatives explored at this time):

| Layer      | Choice                                         |
| ---------- | ---------------------------------------------- |
| Monorepo   | Turborepo + pnpm workspaces                    |
| Runtime    | Node 22 LTS                                    |
| Backend    | Vendure 3.x on Postgres 16 + Redis 7           |
| Search     | Meilisearch v1                                 |
| CMS        | Sanity.io                                      |
| Storefront | Next.js 15 App Router                          |
| UI         | Tailwind v4 + shadcn/ui + custom design system |
| Payments   | Mollie (primary) + Stripe (fallback)           |
| Hosting    | Hetzner CX22 (backend) + Vercel (storefront)   |
| DNS / WAF  | Cloudflare                                     |

## Phase plan

1. Monorepo foundation (this PR).
2. Vendure backend with custom plugins, BullMQ, Bunny S3 assets, Mollie/Stripe.
3. GraphQL codegen package.
4. Storefront foundation (Next.js 15, i18n, Vendure client, SEO, analytics).
5. Design system (`@hurc/ui`).
6. Commerce flows (header/footer, home, PLP, PDP, cart drawer, checkout, account).
7. Editorial via Sanity.
8. EU compliance (GDPR, GPSR, Klaro, legal pages).
9. Testing & quality (Vitest, Playwright, axe, Lighthouse CI).
10. Infra, CI/CD, deployment.

Each phase ends with a tagged commit `phase-N-complete` after running
`pnpm typecheck && pnpm lint && pnpm test && pnpm build` clean.

## Consequences

- All future architecturally meaningful choices (e.g. PLP pagination strategy,
  GraphQL client library, hosting split) get their own ADR file in this
  directory and reference this document for the umbrella context.
- Deviations from the spec require an ADR explaining the trade-off.

## Phase 1 deviations

- **Node version on dev machine.** The lead developer's machine has Node
  25.2.1 installed. The repo pins Node 22 in `.nvmrc` and `engines.node`; CI
  and prod will use Node 22. Phase 1 setup work (pnpm install, typecheck,
  lint) runs on the local Node 25 because pnpm and `tsc` are version-tolerant
  for this scope. Action item: install Node 22 LTS via `fnm` / `nvm` before
  Phase 4 (Next.js 15 has a hard floor of 18.18; v15 is tested on 20 and 22).
- **pnpm version.** Spec asks for `pnpm ≥ 9`. Homebrew installed `11.0.3`,
  which satisfies the floor; `packageManager` in `package.json` pins it.
