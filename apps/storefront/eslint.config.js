import nextjs from '@hurc/config-eslint/nextjs';

/**
 * Studio-bleed guard: the `sanity` runtime is ~1MB; if it shows up in any
 * marketing/commerce chunk we've leaked it. The two legitimate consumers
 * are `src/sanity/**` (schema definitions, evaluated only at studio load)
 * and `src/app/studio/**` (the Studio mount itself). RSC code paths use
 * `next-sanity` (RSC-safe — exempt from the rule).
 *
 * `paths` (exact-match) is used instead of `patterns` (glob) so the rule
 * can't accidentally catch alias paths like `@/lib/sanity/queries`. The
 * studio mount disables this rule per-line for its single import of
 * `sanity.config`.
 */
const sanityBleedRule = {
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: 'sanity',
          message:
            'Sanity Studio runtime must not bleed into customer-facing routes. Move studio-only code to src/sanity/ or src/app/studio/.',
        },
        {
          name: 'sanity/structure',
          message: 'Sanity Studio runtime must not bleed into customer-facing routes.',
        },
        {
          name: 'sanity/cli',
          message: 'Sanity Studio runtime must not bleed into customer-facing routes.',
        },
        {
          name: 'next-sanity/studio',
          message: 'Sanity Studio runtime must not bleed into customer-facing routes.',
        },
      ],
    },
  ],
};

export default [
  ...nextjs,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/sanity/**', 'src/app/studio/**'],
    rules: sanityBleedRule,
  },
];
