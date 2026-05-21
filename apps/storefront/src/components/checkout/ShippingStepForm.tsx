'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Input, RadioGroup, RadioGroupItem, toast } from '@hurc/ui';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { type Locale } from '@/i18n/routing';
import { setShippingAddressAction, setShippingMethodAction } from '@/lib/actions/checkout';
import { formatMoney } from '@/lib/intl/format';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

const formSchema = z.object({
  fullName: z.string().min(1).max(120),
  company: z.string().max(120).optional(),
  streetLine1: z.string().min(1).max(255),
  streetLine2: z.string().max(255).optional(),
  city: z.string().min(1).max(120),
  province: z.string().max(120).optional(),
  postalCode: z.string().min(1).max(40),
  countryCode: z.string().min(2).max(8),
  phoneNumber: z.string().max(40).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  priceWithTax: number;
};

type Props = {
  countries: { code: string; name: string }[];
  shippingMethods: ShippingMethod[];
  initialAddress: Partial<FormValues>;
  initialMethodId: string | null;
  currency: string;
  locale: Locale;
};

export function ShippingStepForm({
  countries,
  shippingMethods,
  initialAddress,
  initialMethodId,
  currency,
  locale,
}: Props) {
  const t = useTranslations('checkout.shipping');
  const tErrors = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(initialMethodId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialAddress.fullName ?? '',
      company: initialAddress.company ?? '',
      streetLine1: initialAddress.streetLine1 ?? '',
      streetLine2: initialAddress.streetLine2 ?? '',
      city: initialAddress.city ?? '',
      province: initialAddress.province ?? '',
      postalCode: initialAddress.postalCode ?? '',
      countryCode: initialAddress.countryCode ?? countries[0]?.code ?? 'DE',
      phoneNumber: initialAddress.phoneNumber ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (selectedMethod === null) {
      toast.error(t('selectMethod'));
      return;
    }
    startTransition(async () => {
      const addressResult = await setShippingAddressAction({
        ...values,
        alsoBilling: true,
      });
      if (addressResult?.data?.ok !== true) {
        toast.error(tErrors('errors.generic'));
        return;
      }
      const methodResult = await setShippingMethodAction({
        shippingMethodId: selectedMethod,
      });
      if (methodResult?.data?.ok === true) {
        router.push('/checkout/payment');
        return;
      }
      const code = methodResult?.data?.ok === false ? methodResult.data.error : 'UNKNOWN_ERROR';
      toast.error(tErrors(vendureErrorMessageKey(code)));
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-medium uppercase tracking-[0.2em]">
          {t('addressTitle')}
        </legend>
        <Field
          label={t('fullName')}
          error={errors.fullName !== undefined ? t('required') : undefined}
          required
        >
          <Input autoComplete="name" {...register('fullName')} />
        </Field>
        <Field label={t('company')}>
          <Input autoComplete="organization" {...register('company')} />
        </Field>
        <Field
          label={t('streetLine1')}
          error={errors.streetLine1 !== undefined ? t('required') : undefined}
          required
        >
          <Input autoComplete="address-line1" {...register('streetLine1')} />
        </Field>
        <Field label={t('streetLine2')}>
          <Input autoComplete="address-line2" {...register('streetLine2')} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label={t('city')}
            error={errors.city !== undefined ? t('required') : undefined}
            required
          >
            <Input autoComplete="address-level2" {...register('city')} />
          </Field>
          <Field
            label={t('postalCode')}
            error={errors.postalCode !== undefined ? t('required') : undefined}
            required
          >
            <Input autoComplete="postal-code" {...register('postalCode')} />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t('province')}>
            <Input autoComplete="address-level1" {...register('province')} />
          </Field>
          <Field label={t('country')} required>
            <select
              className="h-12 w-full border border-[var(--color-line)] bg-transparent px-4 text-sm text-[var(--color-fg)] focus-visible:border-[var(--color-fg)] focus-visible:outline-none"
              {...register('countryCode')}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label={t('phone')}>
          <Input type="tel" autoComplete="tel" {...register('phoneNumber')} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium uppercase tracking-[0.2em]">
          {t('methodTitle')}
        </legend>
        {shippingMethods.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">{t('methodsEmpty')}</p>
        ) : (
          <RadioGroup
            {...(selectedMethod !== null ? { value: selectedMethod } : {})}
            onValueChange={setSelectedMethod}
            aria-label={t('methodTitle')}
          >
            {shippingMethods.map((method) => (
              <label
                key={method.id}
                className="flex cursor-pointer items-center justify-between gap-4 border border-[var(--color-line)] p-4 transition-colors hover:border-[var(--color-fg)] has-[[data-state=checked]]:border-[var(--color-fg)]"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={method.id} />
                  <div>
                    <p className="text-sm font-medium">{method.name}</p>
                    {method.description !== '' ? (
                      <p className="text-xs text-[var(--color-muted)]">{method.description}</p>
                    ) : null}
                  </div>
                </div>
                <p className="text-sm tabular-nums">
                  {formatMoney(method.priceWithTax, locale, currency)}
                </p>
              </label>
            ))}
          </RadioGroup>
        )}
      </fieldset>

      <Button type="submit" disabled={pending} size="lg" className="md:self-start">
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
