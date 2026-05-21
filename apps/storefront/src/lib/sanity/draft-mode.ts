import 'server-only';

import { draftMode } from 'next/headers';

import { draftClient, sanityClient } from './client';

/**
 * Centralised editorial fetch. Reads `draftMode()` once per RSC render and
 * switches both the client (published vs draft) and the cache strategy
 * (tagged-revalidate vs no-store) accordingly. Routes/loaders never touch
 * `draftMode()` directly — keeping that knowledge here means we can audit
 * draft semantics in one place.
 *
 * Falls through to the published client if `draftMode()` is unavailable
 * (e.g. during a static export build, where headers() is not invocable).
 */
export async function fetchEditorial<T>(
  query: string,
  params: Record<string, unknown>,
  cacheTags: string[],
  revalidate = 600,
): Promise<T | null> {
  let isDraft = false;
  try {
    const dm = await draftMode();
    isDraft = dm.isEnabled;
  } catch {
    // headers() not available — fall back to published.
  }

  if (isDraft) {
    return draftClient.fetch<T>(query, params, { cache: 'no-store' });
  }
  return sanityClient.fetch<T>(query, params, {
    next: { tags: cacheTags, revalidate },
  });
}

export async function isDraftModeEnabled(): Promise<boolean> {
  try {
    const dm = await draftMode();
    return dm.isEnabled;
  } catch {
    return false;
  }
}
