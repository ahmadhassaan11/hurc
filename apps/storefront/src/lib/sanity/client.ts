import 'server-only';

import { createClient } from 'next-sanity';

import { env } from '@/env';

import { SANITY_API_VERSION } from './api-version';

/**
 * Two clients:
 *  - `sanityClient` — published-content client; CDN-cached; safe in RSC.
 *  - `draftClient`  — preview client with a read token; uncached; only used
 *    inside `draftMode().isEnabled` branches (see `lib/sanity/draft-mode.ts`).
 *
 * When `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing (local dev without a
 * Sanity project, CI fixture builds), both clients are a typed noop whose
 * `fetch()` resolves to `null`. Editorial loaders normalise `null` → empty
 * list / 404, so the home page renders i18n-only and editorial routes
 * 404 gracefully.
 */

export type SanityFetcher = {
  fetch<T = unknown>(
    query: string,
    params?: Record<string, unknown>,
    options?: { next?: { tags?: string[]; revalidate?: number | false }; cache?: RequestCache },
  ): Promise<T | null>;
};

function noopClient(): SanityFetcher {
  return {
    fetch: async () => null,
  };
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const isConfigured = Boolean(projectId && dataset);

export const sanityClient: SanityFetcher = isConfigured
  ? createClient({
      projectId: projectId as string,
      dataset: dataset as string,
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
      perspective: 'published',
    })
  : noopClient();

export const draftClient: SanityFetcher =
  isConfigured && env.SANITY_API_READ_TOKEN
    ? createClient({
        projectId: projectId as string,
        dataset: dataset as string,
        apiVersion: SANITY_API_VERSION,
        useCdn: false,
        token: env.SANITY_API_READ_TOKEN,
        perspective: 'previewDrafts',
      })
    : noopClient();

export function isSanityConfigured(): boolean {
  return isConfigured;
}
