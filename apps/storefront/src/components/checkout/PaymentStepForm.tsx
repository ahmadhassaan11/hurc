'use client';

import { Button, RadioGroup, RadioGroupItem, toast } from '@hurc/ui';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { ConsentCheckbox } from '@/components/checkout/ConsentCheckbox';
import {
  addPaymentToOrderAction,
  transitionToArrangingPaymentAction,
} from '@/lib/actions/checkout';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

export type PaymentMethodOption = {
  id: string;
  code: string;
  name: string;
  description: string;
  isEligible: boolean;
  eligibilityMessage?: string | null;
};

type Props = {
  methods: PaymentMethodOption[];
};

export function PaymentStepForm({ methods }: Props) {
  const t = useTranslations('checkout.payment');
  const tErrors = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string | null>(
    methods.find((m) => m.isEligible)?.code ?? null,
  );
  const [consented, setConsented] = useState<boolean>(false);

  function submit() {
    if (selected === null) {
      toast.error(t('selectMethod'));
      return;
    }
    if (!consented) {
      toast.error(t('consentRequired'));
      return;
    }
    startTransition(async () => {
      const transition = await transitionToArrangingPaymentAction({});
      if (transition?.data?.ok === false) {
        toast.error(tErrors(vendureErrorMessageKey(transition.data.error)));
        return;
      }
      const result = await addPaymentToOrderAction({ method: selected });
      if (result?.data?.ok === true) {
        if (result.data.redirectUrl !== null && result.data.redirectUrl !== undefined) {
          // Hosted-redirect: send the customer to Mollie / Stripe.
          window.location.assign(result.data.redirectUrl);
          return;
        }
        // No redirect URL — payment was synchronous (rare; e.g. zero-total
        // free order). Skip ahead to confirmation.
        if (result.data.orderCode !== null && result.data.orderCode !== undefined) {
          router.push(`/checkout/confirmation/${result.data.orderCode}`);
          return;
        }
      }
      const code = result?.data?.ok === false ? result.data.error : 'UNKNOWN_ERROR';
      toast.error(tErrors(vendureErrorMessageKey(code)));
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <RadioGroup
        {...(selected !== null ? { value: selected } : {})}
        onValueChange={setSelected}
        aria-label={t('methodsTitle')}
      >
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center gap-3 border p-4 transition-colors ${
              method.isEligible
                ? 'border-[var(--color-line)] hover:border-[var(--color-fg)] has-[[data-state=checked]]:border-[var(--color-fg)]'
                : 'cursor-not-allowed border-[var(--color-line)] opacity-50'
            }`}
          >
            <RadioGroupItem value={method.code} disabled={!method.isEligible} />
            <div>
              <p className="text-sm font-medium">{method.name}</p>
              {method.description !== '' ? (
                <p className="text-xs text-[var(--color-muted)]">{method.description}</p>
              ) : null}
              {!method.isEligible &&
              method.eligibilityMessage !== null &&
              method.eligibilityMessage !== undefined ? (
                <p className="text-xs text-[var(--color-accent)]">{method.eligibilityMessage}</p>
              ) : null}
            </div>
          </label>
        ))}
      </RadioGroup>

      <p className="text-xs text-[var(--color-muted)]">{t('hostedRedirectNote')}</p>

      <ConsentCheckbox checked={consented} onCheckedChange={setConsented} disabled={pending} />

      <Button
        type="button"
        size="lg"
        disabled={pending || selected === null || !consented}
        onClick={submit}
        className="md:self-start"
      >
        {pending ? t('submitting') : t('submit')}
      </Button>
    </div>
  );
}
