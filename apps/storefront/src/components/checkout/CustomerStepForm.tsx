'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Input, toast } from '@hurc/ui';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { setCustomerForOrderAction } from '@/lib/actions/checkout';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

const formSchema = z.object({
  emailAddress: z.string().email(),
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  phoneNumber: z.string().max(40).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  initial: Partial<FormValues>;
};

export function CustomerStepForm({ initial }: Props) {
  const t = useTranslations('checkout.customer');
  const tErrors = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: initial.emailAddress ?? '',
      firstName: initial.firstName ?? '',
      lastName: initial.lastName ?? '',
      phoneNumber: initial.phoneNumber ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await setCustomerForOrderAction(values);
      if (result?.data?.ok === true) {
        router.push('/checkout/shipping');
        return;
      }
      const code = result?.data?.ok === false ? result.data.error : 'UNKNOWN_ERROR';
      toast.error(tErrors(vendureErrorMessageKey(code)));
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field
        label={t('email')}
        error={errors.emailAddress !== undefined ? t('emailError') : undefined}
        required
      >
        <Input type="email" autoComplete="email" {...register('emailAddress')} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label={t('firstName')}
          error={errors.firstName !== undefined ? t('required') : undefined}
          required
        >
          <Input autoComplete="given-name" {...register('firstName')} />
        </Field>
        <Field
          label={t('lastName')}
          error={errors.lastName !== undefined ? t('required') : undefined}
          required
        >
          <Input autoComplete="family-name" {...register('lastName')} />
        </Field>
      </div>
      <Field label={t('phone')}>
        <Input type="tel" autoComplete="tel" {...register('phoneNumber')} />
      </Field>
      <Button type="submit" disabled={pending} size="lg" className="md:self-start">
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
