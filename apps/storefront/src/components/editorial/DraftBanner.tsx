import { isDraftModeEnabled } from '@/lib/sanity/draft-mode';

/**
 * Editor-facing banner shown only when `draftMode().isEnabled`. Provides
 * a single-click "Disable preview" link back to the published view. The
 * banner is server-rendered (RSC); no client island needed.
 */
export async function DraftBanner() {
  const enabled = await isDraftModeEnabled();
  if (!enabled) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white md:px-6"
    >
      <span>Preview mode is active — you are viewing draft Sanity content.</span>
      <a href="/api/disable-draft" className="underline underline-offset-2 hover:no-underline">
        Exit preview
      </a>
    </div>
  );
}
