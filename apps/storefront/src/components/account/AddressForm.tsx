'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Input, toast } from '@hurc/ui';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createAddressAction, updateAddressAction } from '@/lib/actions/account';

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

export type AddressFormValues = z.infer<typeof formSchema>;

type Country = { code: string; name: string };

type Props = {
  countries: Country[];
  initial?: Partial<AddressFormValues> & { id?: string };
  onSuccess?: () => void;
};

export function AddressForm({ countries, initial, onSuccess }: Props) {
  const t = useTranslations('account.address');
  const tErrors = useTranslations('errors');
  const [pending, startTransition] = useTransition();
  const isEdit = initial?.id !== undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initial?.fullName ?? '',
      company: initial?.company ?? '',
      streetLine1: initial?.streetLine1 ?? '',
      streetLine2: initial?.streetLine2 ?? '',
      city: initial?.city ?? '',
      province: initial?.province ?? '',
      postalCode: initial?.postalCode ?? '',
      countryCode: initial?.countryCode ?? countries[0]?.code ?? 'DE',
      phoneNumber: initial?.phoneNumber ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result =
        isEdit && initial?.id !== undefined
          ? await updateAddressAction({ ...values, id: initial.id })
          : await createAddressAction(values);
      if (result?.data?.ok === true) {
        toast.success(isEdit ? t('updated') : t('created'));
        if (!isEdit) reset();
        onSuccess?.();
      } else {
        toast.error(tErrors('generic'));
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
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
          {/*
            Native <select> avoids pulling in the Radix Select runtime here.
            The full Select primitive is available for richer surfaces.
          */}
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
      <Button type="submit" disabled={pending} size="lg" className="md:self-start">
        {pending ? t('submitting') : isEdit ? t('saveChanges') : t('addAddress')}
      </Button>
    </form>
  );
}
