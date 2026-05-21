'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

/**
 * Footer trigger that re-opens the Klaro modal so a returning visitor can
 * change their decision at any time. Klaro exposes `show()` from its top-
 * level module; we lazy-import it so the footer doesn't pull Klaro into
 * its own chunk before the visitor interacts.
 */
export function ManageCookiesButton() {
  const t = useTranslations('consent');

  const onClick = useCallback(() => {
    void (async () => {
      const klaro = await import('klaro');
      klaro.show(undefined, true);
    })();
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-[var(--color-fg)] underline-offset-4 transition-colors hover:text-[var(--color-muted)] hover:underline"
    >
      {t('manageButton')}
    </button>
  );
}
