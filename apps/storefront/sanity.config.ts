/**
 * Sanity Studio configuration. Loaded only by `app/studio/[[...tool]]/page.tsx`,
 * which the storefront's `eslint.config.js` `no-restricted-imports` rule
 * keeps separate from marketing/commerce routes — the `sanity` runtime
 * (~1MB) must not bleed into customer-facing chunks.
 *
 * `projectId` and `dataset` are read from `process.env` directly here
 * because `defineConfig` is called at studio-load time (browser-side once
 * the user navigates to `/studio`); `NEXT_PUBLIC_*` is inlined at build.
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './src/sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? '';

export default defineConfig({
  name: 'hurc-editorial',
  title: 'HURC Editorial',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
