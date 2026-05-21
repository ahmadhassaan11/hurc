/**
 * Plausible event helper. Plausible loads unconditionally (privacy-first,
 * no consent required); this module is the single seam between code and
 * the global `plausible()` function the standard Plausible script mounts on
 * `window`.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- TS module augmentation of `Window` requires interface syntax
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean | null> },
    ) => void;
  }
}

export function trackPlausibleEvent(
  eventName: string,
  props?: Record<string, string | number | boolean | null>,
): void {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible !== 'function') return;
  window.plausible(eventName, props !== undefined ? { props } : undefined);
}
