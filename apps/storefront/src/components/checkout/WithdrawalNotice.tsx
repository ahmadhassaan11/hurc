import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

/**
 * 14-day withdrawal disclosure shown at checkout step 3. Informational —
 * not a checkbox. EU consumer law requires it to be clearly displayed
 * before order submission and reproduced in the order-confirmation email.
 */
export async function WithdrawalNotice() {
  const t = await getTranslations('checkout.withdrawal');
  return (
    <aside
      role="note"
      className="border border-[var(--color-line)] bg-[var(--color-surface-900)] p-4 text-sm text-[var(--color-muted)]"
    >
      <p className="font-medium text-[var(--color-fg)]">{t('title')}</p>
      <p className="mt-2 leading-relaxed">
        {t.rich('body', {
          link: (chunks) => (
            <Link href="/legal/withdrawal" target="_blank" rel="noopener" className="underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </aside>
  );
}
