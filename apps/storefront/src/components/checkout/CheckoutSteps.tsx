import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export type CheckoutStep = 'customer' | 'shipping' | 'payment' | 'review';

const ORDER: CheckoutStep[] = ['customer', 'shipping', 'payment', 'review'];

const HREFS: Record<CheckoutStep, string> = {
  customer: '/checkout',
  shipping: '/checkout/shipping',
  payment: '/checkout/payment',
  review: '/checkout/review',
};

type Props = {
  current: CheckoutStep;
};

export function CheckoutSteps({ current }: Props) {
  const t = useTranslations('checkout.steps');
  const currentIndex = ORDER.indexOf(current);

  return (
    <ol className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em]">
      {ORDER.map((step, index) => {
        const isCurrent = step === current;
        const isPast = index < currentIndex;
        const label = (
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className={
                isCurrent
                  ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-fg)] text-[10px] text-[var(--color-bg)]'
                  : 'inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-line)] text-[10px] text-[var(--color-muted)]'
              }
            >
              {index + 1}
            </span>
            <span>{t(step)}</span>
          </span>
        );
        return (
          <li
            key={step}
            aria-current={isCurrent ? 'step' : undefined}
            className={isCurrent ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)]'}
          >
            {isPast ? (
              <Link href={HREFS[step]} className="hover:text-[var(--color-fg)]">
                {label}
              </Link>
            ) : (
              label
            )}
            {index < ORDER.length - 1 ? (
              <span aria-hidden className="ml-3 text-[var(--color-line)]">
                /
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
