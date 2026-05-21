'use client';

import { Button, toast } from '@hurc/ui';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { addToCartAction } from '@/lib/actions/cart';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

type Props = {
  variantId: string | undefined;
  /** Disable separately from the no-variant case (e.g. out of stock). */
  disabled?: boolean;
};

export function AddToCartButton({ variantId, disabled }: Props) {
  const t = useTranslations('commerce.pdp');
  const tErrors = useTranslations();
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    if (variantId === undefined) return;
    startTransition(async () => {
      const result = await addToCartAction({ productVariantId: variantId, quantity: 1 });
      if (result?.data?.ok === true) {
        toast.success(t('added'));
        return;
      }
      const error = result?.data?.ok === false ? result.data.error : 'UNKNOWN_ERROR';
      toast.error(tErrors(vendureErrorMessageKey(error)));
    });
  };

  return (
    <Button
      type="button"
      size="lg"
      onClick={onClick}
      disabled={disabled === true || pending || variantId === undefined}
      className="w-full"
    >
      {pending ? t('adding') : t('addToBag')}
    </Button>
  );
}
