'use client';

import { Button, Input, toast } from '@hurc/ui';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { applyCouponCodeAction, removeCouponCodeAction } from '@/lib/actions/cart';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

type Props = {
  appliedCodes: string[];
};

export function CouponForm({ appliedCodes }: Props) {
  const t = useTranslations('commerce.cart.coupon');
  const tErrors = useTranslations();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [pending, startTransition] = useTransition();

  function apply() {
    if (pending || code.trim() === '') return;
    startTransition(async () => {
      const result = await applyCouponCodeAction({ couponCode: code.trim() });
      if (result?.data?.ok === true) {
        toast.success(t('applied'));
        setCode('');
      } else if (result?.data?.ok === false) {
        toast.error(tErrors(vendureErrorMessageKey(result.data.error)));
      }
    });
  }

  function remove(value: string) {
    startTransition(async () => {
      const result = await removeCouponCodeAction({ couponCode: value });
      if (result?.data?.ok === false) {
        toast.error(tErrors(vendureErrorMessageKey(result.data.error)));
      }
    });
  }

  return (
    <div className="border-t border-[var(--color-line)] pt-4">
      {appliedCodes.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {appliedCodes.map((c) => (
            <li
              key={c}
              className="inline-flex items-center gap-2 border border-[var(--color-line)] px-3 py-1 text-xs uppercase tracking-[0.2em]"
            >
              {c}
              <button
                type="button"
                aria-label={t('remove', { code: c })}
                onClick={() => {
                  remove(c);
                }}
                className="text-[var(--color-muted)] hover:text-[var(--color-accent)]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open ? (
        <div className="mt-3 flex gap-2">
          <Input
            aria-label={t('label')}
            placeholder={t('placeholder')}
            value={code}
            onChange={(e) => {
              setCode(e.currentTarget.value);
            }}
          />
          <Button type="button" size="md" onClick={apply} disabled={pending || code.trim() === ''}>
            {pending ? t('applying') : t('apply')}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
          className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-fg)] hover:underline"
        >
          {t('toggle')}
        </button>
      )}
    </div>
  );
}
