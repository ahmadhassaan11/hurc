/**
 * Re-export of `class-variance-authority` so every primitive imports the
 * variant engine through a single seam. If the engine is ever swapped
 * (e.g. for `tailwind-variants`) only this file changes.
 */
export { cva, type VariantProps } from 'class-variance-authority';
