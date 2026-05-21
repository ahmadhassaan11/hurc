'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Input, toast } from '@hurc/ui';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { requestPasswordResetAction, resetPasswordAction } from '@/lib/actions/account';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

const requestSchema = z.object({ emailAddress: z.string().email() });
type RequestValues = z.infer<typeof requestSchema>;

export function RequestPasswordResetForm() {
  const t = useTranslations('account.passwordReset.request');
  const tErrors = useTranslations();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { emailAddress: '' },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await requestPasswordResetAction(values);
      if (result?.data?.ok === true) {
        toast.success(t('success'));
        reset();
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
      <Button type="submit" disabled={pending} size="lg">
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});
type ResetValues = z.infer<typeof resetSchema>;

type ResetProps = { token: string };

export function ResetPasswordForm({ token }: ResetProps) {
  const t = useTranslations('account.passwordReset.complete');
  const tErrors = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { token, password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      if (result?.data?.ok === true) {
        toast.success(t('success'));
        router.push('/account');
        router.refresh();
        return;
      }
      const code = result?.data?.ok === false ? result.data.error : 'UNKNOWN_ERROR';
      toast.error(tErrors(vendureErrorMessageKey(code)));
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <input type="hidden" {...register('token')} />
      <Field
        label={t('password')}
        helper={t('passwordHelper')}
        error={errors.password !== undefined ? t('passwordError') : undefined}
        required
      >
        <Input type="password" autoComplete="new-password" {...register('password')} />
      </Field>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
