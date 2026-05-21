/**
 * Asset URL helpers. Vendure stores raw asset paths; the Bunny CDN
 * pull zone serves them via `ASSET_PUBLIC_URL_PREFIX` (per
 * `infra/env.reference.md`). For Phase 6 the storefront only ever
 * resolves assets through this seam.
 *
 * Bunny supports inline image transforms via the `?width=&height=&quality=`
 * query params on the pull zone. We add them when callers ask, but
 * never strip the original — Bunny's `optimizer` endpoint handles
 * fallthrough.
 */

export type VendureAsset = {
  source: string;
  preview?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ImageTransform = {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
};

/**
 * Resolve a Vendure asset URL through the Bunny pull zone with optional
 * transforms. Bunny supports query-string transforms on absolute pull-zone
 * URLs, so we apply them whenever requested. Phase 7's Sanity client gets
 * its own helper for `cdn.sanity.io` URLs.
 */
export function assetUrl(asset: VendureAsset, transform?: ImageTransform): string {
  const raw = asset.preview ?? asset.source;
  if (raw === '') return '';

  if (transform === undefined) {
    return raw;
  }

  const params = new URLSearchParams();
  if (transform.width !== undefined) {
    params.set('width', String(transform.width));
  }
  if (transform.height !== undefined) {
    params.set('height', String(transform.height));
  }
  if (transform.quality !== undefined) {
    params.set('quality', String(transform.quality));
  }
  if (transform.format !== undefined && transform.format !== 'auto') {
    params.set('format', transform.format);
  }

  const query = params.toString();
  if (query === '') return raw;
  return raw.includes('?') ? `${raw}&${query}` : `${raw}?${query}`;
}

/**
 * Build a `sizes` attribute for `next/image` from a small set of
 * breakpoints. Saves a few characters at every callsite.
 */
export function imageSizes(map: {
  default: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}): string {
  const queries: string[] = [];
  if (map.xl !== undefined) queries.push(`(min-width: 1280px) ${map.xl}`);
  if (map.lg !== undefined) queries.push(`(min-width: 1024px) ${map.lg}`);
  if (map.md !== undefined) queries.push(`(min-width: 768px) ${map.md}`);
  if (map.sm !== undefined) queries.push(`(min-width: 640px) ${map.sm}`);
  queries.push(map.default);
  return queries.join(', ');
}
