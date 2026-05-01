# Contributing

## Local setup

1. Install Node 22 LTS (see [`.nvmrc`](../.nvmrc)).
2. Enable pnpm via Corepack: `corepack enable`. The repo pins the version in
   `packageManager`.
3. Clone, then `pnpm install` from the repo root.
4. Run quality gates: `pnpm typecheck && pnpm lint && pnpm test`.

> Phase 2 will add Docker Compose for Postgres + Redis + Meilisearch + MailHog
> via `pnpm dev:up`. Until then, only the typecheck / lint gates are wired.

## Branching

- `main` is always deployable.
- Feature branches: `feat/<short-slug>`, `fix/<short-slug>`, `chore/<short-slug>`.
- Open a PR early; CI runs lint + typecheck + tests on every push.

## Commits

We use [Conventional Commits](https://www.conventionalcommits.org). Allowed
types: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `build`,
`ci`, `style`, `revert`. The `commit-msg` hook enforces this via commitlint.

Examples:

```
feat(storefront): add country/currency switcher modal
fix(backend): correct VAT zone mapping for IT
chore(repo): bump pnpm to 11.0.3
```

Each phase ends with a commit tagged `phase-N-complete`.

## Code style

- TypeScript strict mode everywhere. No `any`. No `// @ts-ignore` without an
  inline justification.
- Prettier + ESLint flat config run via `lint-staged` on commit.
- Server-first React: default to RSC; reach for `"use client"` only when
  interactivity demands it.
- Server Actions always return a discriminated union
  `{ ok: true; data } | { ok: false; error }`.
- Money is stored as integer minor units; format with `Intl.NumberFormat`.

## Codegen

Phase 3 wires `graphql-codegen` against the Vendure shop-api. The generated
file at `packages/graphql/src/generated.ts` is **committed**. The
`codegen-check.yml` workflow fails the PR if `pnpm codegen` produces a diff.

## PR checklist

- [ ] Typecheck, lint, unit tests, e2e tests all green locally
- [ ] No new `any`, `@ts-ignore`, or `console.log`
- [ ] Localized strings flow through `next-intl` (no hardcoded English in JSX)
- [ ] Accessibility checked (keyboard, focus, axe)
- [ ] If GraphQL ops changed, codegen has been re-run and committed
- [ ] If env vars added, `infra/env.reference.md` and the `.env.example`
      files are updated
- [ ] ADR added under `docs/decisions/` for any architecturally meaningful
      decision
