'use client';

import { Checkbox } from '@hurc/ui';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

type Props = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
};

/**
 * Required consent gate at checkout step 3. Single combined checkbox: GTC
 * + Privacy in one. EDPB consent-fatigue guidance discourages double
 * prompts when one ticked statement covers both.
 */
export function ConsentCheckbox({ checked, onCheckedChange, disabled }: Props) {
  const t = useTranslations('checkout.consent');

  return (
    <div className="flex items-start gap-3 border border-[var(--color-line)] bg-[var(--color-surface-900)] p-4">
      <Checkbox
        id="checkout-consent"
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        disabled={disabled ?? false}
        aria-required
        className="mt-0.5"
      />
      <label
        htmlFor="checkout-consent"
        className="cursor-pointer select-none text-sm leading-relaxed"
      >
        {t.rich('label', {
          terms: (chunks) => (
            <Link href="/legal/terms" target="_blank" rel="noopener" className="underline">
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link href="/legal/privacy" target="_blank" rel="noopener" className="underline">
              {chunks}
            </Link>
          ),
        })}
      </label>
    </div>
  );
}
