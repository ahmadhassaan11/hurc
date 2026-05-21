import imageUrlBuilder, { type ImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import { clientEnv } from '@/env.client';

const projectId = clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = clientEnv.NEXT_PUBLIC_SANITY_DATASET;

const builder: ImageUrlBuilder | null =
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }) : null;

/**
 * Returns a Sanity image-URL builder for the given asset, or `null` if
 * either the asset is absent or Sanity isn't configured. Callers render
 * fallbacks (gradient, placeholder) when this returns `null`.
 *
 * Usage:
 *   const builder = urlFor(post.heroImage);
 *   const src = builder?.width(1600).quality(85).url();
 */
export function urlFor(source: SanityImageSource | null | undefined): ImageUrlBuilder | null {
  if (!source || !builder) return null;
  return builder.image(source);
}
