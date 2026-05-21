'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Input, toast } from '@hurc/ui';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateCustomerAction } from '@/lib/actions/account';

const formSchema = z.object({
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  phoneNumber: z.string().max(40).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  initialValues: {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    emailAddress: string;
  };
};

export function ProfileForm({ initialValues }: Props) {
  const t = useTranslations('account.profile');
  const tErrors = useTranslations('errors');
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialValues.firstName,
      lastName: initialValues.lastName,
      phoneNumber: initialValues.phoneNumber ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateCustomerAction(values);
      if (result?.data?.ok === true) {
        toast.success(t('success'));
        reset(values);
      } else {
        toast.error(tErrors('generic'));
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field label={t('email')} helper={t('emailReadOnly')}>
        <Input type="email" value={initialValues.emailAddress} readOnly disabled />
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
      <Button type="submit" disabled={pending || !isDirty} size="lg" className="md:self-start">
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
