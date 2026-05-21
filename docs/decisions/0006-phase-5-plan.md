# ADR 0006 — Phase 5 implementation plan (`@hurc/ui` design system)

- **Status:** Proposed (planning only — no code yet)
- **Date:** 2026-05-03
- **Decision owner:** Lead full-stack engineer
- **Supersedes:** Phase plan item 5 of [ADR-0001](./0001-stack.md), refined into
  executable sub-tasks. Also resolves the design-system follow-up flagged in
  [ADR-0005](./0005-phase-4-plan.md) §"Open follow-ups".
- **Depends on:** Phase 4 (`phase-4-complete` tag) — the storefront already
  imports two stub primitives from this package (`Toaster` via Phase 4's local
  re-export) and assumes the export shape this ADR locks in.

## Why this plan exists

`packages/ui/` is currently an empty Phase-1 stub. Phase 5 fills it with
the design-system layer that **every Phase 6+ surface composes from**:

- Phase 6 commerce flows (header/footer, home, PLP, PDP, cart drawer,
  checkout, account) are 80% primitive composition.
- Phase 7 editorial blocks reuse the same primitives.
- Phase 8 compliance UI (Klaro consent banner, GDPR self-service) lives
  inside Dialogs, Switches, Buttons from this package.
- Phase 9 visual-regression snapshots have a stable surface only if the
  primitive API doesn't churn.

If we get the primitive shape wrong, every later phase pays for it. This
ADR pins versions, locks the variant pattern, fixes the file layout,
defines theming behavior, and lists every test so Phase 5 ends with a
provably testable design system — even though no commerce surfaces
consume it yet.

**Out of scope for Phase 5** (each lands later or in its own ADR):

- Domain-specific composites (`PriceTag`, `ColorSwatch`,
  `FreeShippingProgress`, `SizeChart`, `StockBadge`) — these consume
  Vendure data shapes and belong in `apps/storefront/components/commerce/`
  in Phase 6.
- Storybook / a11y showcase site — defer; visual regression is Playwright
  snapshots in Phase 9.
- Klaro consent UI dressing — Phase 8 builds it from Phase 5 primitives.
- Animation choreography (page transitions, scroll-driven reveals) —
  Phase 6 owns it; Phase 5 only ships motion-respecting variants
  (`prefers-reduced-motion` honoured by every primitive that animates).

## Decision summary

1. **Approach:** **Headless Radix primitives + `class-variance-authority`
   (cva) + `tailwind-merge`**, NOT shadcn copy-paste. We own the
   primitives directly. CLAUDE.md §2 names "shadcn/ui" as a stack member,
   but in current ecosystem usage that name describes the _pattern_
   (Radix + cva + Tailwind), not the literal `npx shadcn add` workflow.
   Reasoning in §3.1.
2. **Variant engine:** `class-variance-authority@0.7.1`. Variants and
   compound variants are typed; `tailwind-merge@3.5.0` deduplicates
   conflicting classes when the consumer passes `className`. `clsx@2.1.1`
   for conditional classes.
3. **Theming:** Reuse the existing `@hurc/config-tailwind/tokens.css`
   `@theme` block (already wired by storefront in Phase 4). Dark is
   default; `[data-theme="light"]` flips semantic surfaces.
   `next-themes@0.4.6` is **not** added in Phase 5 — the spec is
   dark-default with no user toggle in Phase 6. If Phase 6/7 surfaces a
   toggle, an addendum ADR introduces `next-themes`.
4. **Distribution:** single barrel `src/index.ts` + `sideEffects: false`
   in `package.json`. Modern bundlers (Turbopack, Vite) tree-shake
   correctly through ESM barrels with sideEffects pinned. The Phase-1
   `./tokens` subpath stays. Per-primitive subpaths are NOT added —
   they'd explode the exports map for a marginal win, and CLAUDE.md §8
   explicitly permits barrels in `packages/ui` because it's a public API.
5. **Icons:** `lucide-react@1.14.0`. Single re-export from
   `src/icons/index.ts` of the icons used by Phase 6+7. Tree-shaking is
   per-icon (lucide-react is named-export friendly).
6. **Toast system:** the storefront's Phase 4 `sonner` dep is **promoted
   to `@hurc/ui`**. The storefront's `components/primitives/Toaster.tsx`
   stub is replaced by `@hurc/ui`'s `<Toaster />` export. Phase 4's stub
   path stays valid through one round of import-rename in the Phase 5
   merge.
7. **A11y baseline:** every primitive ships with: keyboard navigation
   (Radix supplies it), focus-visible ring (already in
   `globals.css`), correct ARIA on Radix-less leaves
   (Button, Badge, Skeleton, Field), color contrast ≥ 4.5:1 (verified
   per-variant in tests), `prefers-reduced-motion` honoured by any
   animation. Tests use `vitest-axe@0.1.0` (Vitest-native binding for
   axe-core).
8. **Test runner:** `vitest@4.1.5` (matches monorepo) with `happy-dom@20.9.0`
   (faster than jsdom; React 19 compatible) + `@testing-library/react@16.3.2`
   - `@vitejs/plugin-react@6.0.1`. Coverage gate: 80% lines on
     `src/primitives/**`. Generated icon barrel excluded.

## Verified version pins (as of 2026-05-03)

```
class-variance-authority           0.7.1
tailwind-merge                     3.5.0
clsx                               2.1.1

@radix-ui/react-slot               1.2.4
@radix-ui/react-dialog             1.1.15
@radix-ui/react-dropdown-menu      2.1.16
@radix-ui/react-tooltip            1.2.8
@radix-ui/react-accordion          1.2.12
@radix-ui/react-tabs               1.1.13
@radix-ui/react-switch             1.2.6
@radix-ui/react-checkbox           1.3.3
@radix-ui/react-radio-group        1.3.8
@radix-ui/react-select             2.2.6
@radix-ui/react-popover            1.1.15
@radix-ui/react-avatar             1.1.11
@radix-ui/react-label              2.1.8
@radix-ui/react-separator          1.1.8

lucide-react                       1.14.0
sonner                             2.0.7   (already in storefront; promote to @hurc/ui)

vitest                             4.1.5   (matches monorepo)
@vitejs/plugin-react               6.0.1
@testing-library/react             16.3.2
@testing-library/dom               10.4.1
happy-dom                          20.9.0
vitest-axe                         0.1.0

react                              19.2.5  (peer)
react-dom                          19.2.5  (peer)
```

Re-verify with `pnpm view <pkg> version` immediately before `pnpm install`
per CLAUDE.md hard rule #10.

## Risks called out before code

- **R1 — `lucide-react` 1.x is fresh.** lucide-react cut a 1.0 in 2026
  after years on 0.x. The API of named icon exports is unchanged from
  0.575+; risk is low. Mitigation: pin `1.14.0` exact (no caret), stage
  any minor bump behind its own ADR if breaking.
- **R2 — Radix v3 (forthcoming) reshuffles peer deps.** Currently every
  primitive is independently versioned at v1.x or v2.x. Some have
  pre-released v3 betas. We pin `latest stable` per primitive. Phase 5
  does not opt into any beta.
- **R3 — `vitest-axe` is at 0.1.x and quiet.** Maintenance signal is
  thin. Mitigation: run axe via `axe-core/react` directly inside
  `@testing-library/react` if 0.1.x bit-rots; the _interface_ in tests is
  thin (`expect(await axe(container)).toHaveNoViolations()`) — swappable.
- **R4 — `tailwind-merge` 3.x changed its config API.** v3 dropped some
  legacy config helpers. We do not pass any custom config in Phase 5
  (the default Tailwind v4 ruleset matches our token names). If Phase 5b
  needs custom merge groups, an addendum extends `extendTailwindMerge`.
- **R5 — Storefront `sonner` dep duplication.** Promoting `sonner` to
  `@hurc/ui` means it's in two `package.json` files transiently — Phase 4
  declared it as a direct dep. Mitigation: as part of the §"Order of
  operations" final PR, remove `sonner` from `apps/storefront/package.json`
  and have it flow through `@hurc/ui` only. Lockfile collapses to one
  resolved version (already true).
- **R6 — `class-variance-authority` returns `string`, not `string &
Branded`**. Means the variant function output is assignable anywhere
  a string is. Acceptable; cva is the de-facto industry standard and
  the alternative (`tv` from `tailwind-variants`) has its own ergonomic
  costs.

## File layout (final, after Phase 5)

```
packages/ui/
├── package.json                  (sideEffects: false; exports map for ./, ./tokens, ./icons; peer react 19)
├── tsconfig.json                 (composite stays; jsx: react-jsx)
├── eslint.config.js
├── vitest.config.ts              (happy-dom, plugin-react, alias @/ → src/)
└── src/
    ├── index.ts                  (barrel: re-export every primitive + lib/utils)
    ├── tokens/
    │   └── index.ts              (existing — token re-exports; unchanged)
    ├── icons/
    │   └── index.ts              (curated lucide-react named re-exports)
    ├── lib/
    │   ├── cn.ts                 (twMerge(clsx(...)))
    │   └── cva.ts                (re-export cva + helpers; central place for shared variant defaults)
    └── primitives/
        ├── button.tsx
        ├── link.tsx              (wraps next-intl Link with cva variants)
        ├── input.tsx
        ├── textarea.tsx
        ├── label.tsx             (Radix Label)
        ├── field.tsx             (composition: label + control slot + helper + error)
        ├── checkbox.tsx          (Radix)
        ├── radio-group.tsx       (Radix)
        ├── switch.tsx            (Radix)
        ├── select.tsx            (Radix)
        ├── dialog.tsx            (Radix; modal)
        ├── sheet.tsx             (Radix Dialog with `side` variants — used for cart drawer in Phase 6)
        ├── dropdown-menu.tsx     (Radix)
        ├── popover.tsx           (Radix)
        ├── tooltip.tsx           (Radix)
        ├── accordion.tsx         (Radix)
        ├── tabs.tsx              (Radix)
        ├── avatar.tsx            (Radix)
        ├── separator.tsx         (Radix)
        ├── skeleton.tsx
        ├── badge.tsx
        └── toast.tsx             (sonner Toaster + toast() re-export with brand defaults)
```

`tests/` lives next to `src/` per the existing repo pattern:

```
packages/ui/test/
├── primitives/                   (one test file per primitive)
│   ├── button.test.tsx
│   ├── input.test.tsx
│   ├── dialog.test.tsx
│   └── ... (21 files)
├── lib/
│   └── cn.test.ts
└── setup.ts                      (registers vitest-axe matcher, happy-dom DOM globals)
```

`apps/storefront` Phase-4-stub `components/primitives/Toaster.tsx` is
**deleted** in the Phase 5 merge; its sole consumer (`RootProviders.tsx`)
import-renames to `@hurc/ui`.

## Sub-task plan

### 5.1 Tooling install + skeleton

1. Add direct deps to `packages/ui/package.json` (see §"Verified version
   pins"). React + react-dom move into `peerDependencies` (v19) +
   `devDependencies` (v19 for tsconfig); React 19 only.
2. Replace the placeholder `src/index.ts` with the barrel scaffold.
3. Create `vitest.config.ts` (happy-dom, plugin-react, `setupFiles:
['./test/setup.ts']`, alias `@/` → `src/`). `package.json` `test`
   script becomes `vitest run`. The Phase-2 D22 fix (broken `test`
   script) remains in scope: this re-introduces a real one.
4. Add `sideEffects: false` to `package.json` so consumer bundlers
   tree-shake correctly through the barrel.
5. Update the package's `exports` map: add `./icons` and adjust the `./`
   target to the new barrel.

### 5.2 cn + cva foundation (`src/lib/`)

```ts
// src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

```ts
// src/lib/cva.ts
export { cva, type VariantProps } from 'class-variance-authority';
```

These are the only "owned" utilities in `lib/`. Every primitive's
className composition goes through `cn()`. `lib/cn.test.ts` covers
conflict resolution (e.g., `cn('p-4', 'p-6')` → `'p-6'`).

### 5.3 Primitive contract

Every primitive follows the same shape:

```tsx
// src/primitives/button.tsx
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from '../lib/cva';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium uppercase tracking-[0.2em] transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        primary: 'bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-ink-700)]',
        secondary: 'border border-[var(--color-line)] hover:bg-[var(--color-surface-700)]',
        ghost: 'hover:bg-[var(--color-surface-700)]',
        destructive: 'bg-[var(--color-accent)] text-[var(--color-brand-white)] hover:opacity-90',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-12 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: { intent: 'primary', size: 'md' },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} className={cn(buttonVariants({ intent, size }), className)} {...props} />
    );
  },
);
Button.displayName = 'Button';
export { buttonVariants };
```

Conventions baked into this template:

- `forwardRef` everywhere — Radix needs it for slotting; downstream form
  libraries need it for register patterns in Phase 6.
- `asChild` via `@radix-ui/react-slot` so consumers can swap the
  rendered element (e.g., a `<Link>` rendered as a button).
- All variant _values_ are strings keyed against tokens in
  `@hurc/config-tailwind/tokens.css` — never hard-coded hex.
- `displayName` set explicitly so React DevTools shows the right name
  through `forwardRef`.
- Variants exported as a sibling so consumer composites can extend them.

### 5.4 Primitive surface

| Primitive      | Backing Radix package        | Variant axes                                                  |
| -------------- | ---------------------------- | ------------------------------------------------------------- |
| `Button`       | `react-slot` (for `asChild`) | `intent` × `size`                                             |
| `Link`         | next-intl `Link`             | `intent` × `underline`                                        |
| `Input`        | none                         | `state` (default / error)                                     |
| `Textarea`     | none                         | `state`                                                       |
| `Label`        | `react-label`                | none                                                          |
| `Field`        | none (composition)           | none                                                          |
| `Checkbox`     | `react-checkbox`             | `size`                                                        |
| `RadioGroup`   | `react-radio-group`          | `size`                                                        |
| `Switch`       | `react-switch`               | `size`                                                        |
| `Select`       | `react-select`               | `state`                                                       |
| `Dialog`       | `react-dialog`               | `size` (`sm` / `md` / `lg`)                                   |
| `Sheet`        | `react-dialog` (via `side`)  | `side` (top/right/bottom/left), `size`                        |
| `DropdownMenu` | `react-dropdown-menu`        | none                                                          |
| `Popover`      | `react-popover`              | none                                                          |
| `Tooltip`      | `react-tooltip`              | none                                                          |
| `Accordion`    | `react-accordion`            | `variant` (single/multi)                                      |
| `Tabs`         | `react-tabs`                 | `variant` (underline / pill)                                  |
| `Avatar`       | `react-avatar`               | `size`                                                        |
| `Separator`    | `react-separator`            | `orientation`                                                 |
| `Skeleton`     | none                         | `radius`                                                      |
| `Badge`        | none                         | `intent` (default/success/warning/destructive)                |
| `Toast`        | `sonner`                     | re-export with brand `<Toaster />` defaults + typed `toast()` |

### 5.5 Icons

```ts
// src/icons/index.ts
export {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  ShoppingBag,
  User,
  X,
  Menu,
  Globe,
  Heart,
  Plus,
  Minus,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';
```

Curated re-export — keeps the icon vocabulary auditable. Adding an icon
is a one-line PR. lucide-react's named exports are individually
tree-shakable in modern bundlers, so re-export does not bloat consumers
that only import a subset.

### 5.6 Theming

- **No new theme provider.** The existing `tokens.css` `@theme` block
  defines every token; semantic surfaces flip via `[data-theme="light"]`
  on `<html>`. Phase 5 primitives only reference CSS variables, never
  raw hex.
- **No `next-themes`.** Spec is dark-default with no user toggle in
  Phase 6. The first surface that requires a toggle adds `next-themes`
  in its own ADR.

### 5.7 Tests

For every primitive (`packages/ui/test/primitives/<name>.test.tsx`):

- **Renders without crashing** — happy path with default props.
- **Variants compile** — each variant value renders the expected class
  string fragment.
- **Keyboard navigation** — Tab focus, Enter/Space activation, Escape
  for dismissables. `userEvent` from `@testing-library/user-event`.
- **ARIA correctness** — `aria-expanded`, `aria-controls`, `aria-label`,
  `role` for stateful components.
- **axe scan** — `expect(await axe(container)).toHaveNoViolations()`.

Cross-cutting:

- `lib/cn.test.ts` — `cn('p-4', 'p-6')` → `'p-6'`; `cn('text-sm',
undefined, false && 'hidden')` works.
- `index.barrel.test.ts` — every primitive name in §5.4 is exported
  from the barrel (drift-detector for accidental forgetfulness).

Coverage gate: 80% lines on `src/primitives/**` and `src/lib/**`. Icons
re-export is excluded.

### 5.8 Build integration (Turbo)

`turbo.json` already covers the `build`/`typecheck`/`lint`/`test` tasks
generically. **No turbo.json changes needed** — `@hurc/ui#test` already
inherits the right `inputs` glob (`src/**`, `test/**`, `vitest.config.*`,
`package.json`) and `outputs` (`coverage/**`).

Storefront's `package.json` already declares `@hurc/ui` is **not** a
direct dep (Phase 4 only consumed `@hurc/config-tailwind`). The Phase 5
merge adds `@hurc/ui: workspace:*` to `apps/storefront/package.json` and
import-renames `Toaster` (and any future stub uses).

### 5.9 ESLint

- Reuse `@hurc/config-eslint/react` (already extended by `packages/ui`'s
  `eslint.config.js`).
- No new rule additions; the existing `consistent-type-imports`,
  `simple-import-sort`, `react-hooks` rules apply unchanged.

## Phase 5 gate

- [ ] `pnpm install` clean (no peer warnings on React, Radix).
- [ ] `pnpm --filter @hurc/ui build` produces `dist/` with one `.js` and
      one `.d.ts` per primitive plus the `index.{js,d.ts}` barrel.
- [ ] `pnpm --filter @hurc/ui test` passes — 21 primitive test files +
      `cn` + barrel = ~60+ tests. Every primitive has a green axe scan.
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` green at
      the repo root. Storefront Phase-4-stub `Toaster.tsx` is gone and
      `RootProviders.tsx` imports `@hurc/ui`.
- [ ] Bundle delta: storefront `/[locale]` First Load JS stays ≤ 250 kB
      (Phase 4 floor). Adding the design system should add < 10 kB
      gzip because Phase 4 doesn't yet _use_ most primitives — the
      growth budget is reserved for Phase 6.
- [ ] Coverage ≥ 80% lines on `src/primitives/**` and `src/lib/**`.
- [ ] Tag commit `phase-5-complete`.

## Order of operations (one PR each)

1. `chore(ui): install Radix primitives + cva + tailwind-merge + lucide-react`
2. `feat(ui): cn + cva + tokens-aware variant scaffolding`
3. `feat(ui): Button + Link + Badge + Skeleton (no-Radix primitives)`
4. `feat(ui): Input + Textarea + Label + Field`
5. `feat(ui): Checkbox + RadioGroup + Switch`
6. `feat(ui): Select + Dialog + Sheet`
7. `feat(ui): DropdownMenu + Popover + Tooltip`
8. `feat(ui): Accordion + Tabs + Avatar + Separator`
9. `feat(ui): Toast (sonner re-export with brand defaults)`
10. `feat(ui): icon barrel (lucide-react curated re-exports)`
11. `test(ui): vitest + happy-dom + axe — primitive + cn + barrel tests`
12. `refactor(storefront): import @hurc/ui Toaster, drop local stub`
13. `chore(repo): phase-5-complete tag`

Each PR independently revertable; each ends with all repo gates green.

## Open follow-ups (after Phase 5)

- **Phase 6 commerce composites** — `PriceTag`, `ColorSwatch`,
  `FreeShippingProgress`, `SizeChart`, `StockBadge`. These compose
  primitives and Vendure data; they belong in `apps/storefront/components/commerce/`,
  not in `@hurc/ui`.
- **Light theme toggle** (post-launch) — only if marketing requests one.
  Adds `next-themes` and a Theme primitive in its own ADR.
- **Storybook** (post-launch) — once the design vocabulary stabilises
  past Phase 6. Visual regression in Phase 9 is enough for now.
- **Tailwind merge custom groups** — if Phase 6 introduces
  HURC-specific class groups (e.g., a `tone-*` semantic family), extend
  `tailwind-merge` config in its own addendum.
- **Animation primitives** — Framer Motion is already in storefront
  deps; Phase 6 introduces an `<AnimatedReveal>` primitive. Could
  promote to `@hurc/ui` later; for Phase 5 it stays out.
- **Form library** — `react-hook-form` + Zod is the natural pick for
  Phase 6 checkout/account. The `Field` primitive in Phase 5 is shaped
  to compose with RHF's `Controller`, but RHF itself is added in Phase
  6 with its own ADR.
