/**
 * `@hurc/ui` public surface. CLAUDE.md §8 explicitly permits a barrel in
 * this package because it is a public API; combined with `sideEffects:
 * false` in `package.json`, modern bundlers tree-shake correctly.
 *
 * Sub-paths exported separately from `package.json`:
 *   - `@hurc/ui/tokens` — design tokens (colors, spacing, motion)
 *   - `@hurc/ui/icons`  — curated lucide-react re-exports
 */

export * from './lib/cn';
export * from './lib/cva';
export * from './primitives/accordion';
export * from './primitives/avatar';
export * from './primitives/badge';
export * from './primitives/button';
export * from './primitives/checkbox';
export * from './primitives/dialog';
export * from './primitives/dropdown-menu';
export * from './primitives/field';
export * from './primitives/input';
export * from './primitives/label';
export * from './primitives/link';
export * from './primitives/pagination';
export * from './primitives/popover';
export * from './primitives/radio-group';
export * from './primitives/select';
export * from './primitives/separator';
export * from './primitives/sheet';
export * from './primitives/skeleton';
export * from './primitives/switch';
export * from './primitives/tabs';
export * from './primitives/textarea';
export * from './primitives/toast';
export * from './primitives/tooltip';
