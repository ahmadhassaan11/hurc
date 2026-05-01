## Summary

<!-- 1-3 bullets on what changed and why. Link the relevant phase / ADR. -->

## Type

- [ ] feat
- [ ] fix
- [ ] chore / docs / refactor / perf / test
- [ ] ci / build

## Checklist

- [ ] `pnpm typecheck && pnpm lint && pnpm test` green locally
- [ ] No new `any`, `@ts-ignore`, or `console.log` in shipped code
- [ ] Localized strings flow through `next-intl`
- [ ] Accessibility checked (keyboard, focus, axe) for any UI change
- [ ] If GraphQL ops changed, codegen has been re-run and committed
- [ ] If env vars added, `infra/env.reference.md` and `.env.example` updated
- [ ] ADR added under `docs/decisions/` for any architectural decision
