/**
 * Sanity CLI configuration — drives `sanity schema extract` and
 * `sanity typegen generate`. The schema extract produces
 * `sanity.schema.json`; typegen produces `sanity.types.ts`. Both files
 * are committed and consumed by RSC loaders in `lib/sanity/queries.ts`.
 */

import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? '';

export default defineCliConfig({
  api: { projectId, dataset },
});
