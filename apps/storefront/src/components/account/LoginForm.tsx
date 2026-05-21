'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Input, toast } from '@hurc/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { loginAction } from '@/lib/actions/account';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

const formSchema = z.object({
  username: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const t = useTranslations('account.login');
  const tErrors = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values);
      if (result?.data?.ok === true) {
        toast.success(t('success'));
        const next = searchParams.get('next');
        router.push(next !== null && next.startsWith('/') ? next : '/account');
        router.refresh();
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
        error={errors.username !== undefined ? t('emailError') : undefined}
        required
      >
        <Input type="email" autoComplete="email" {...register('username')} />
      </Field>
      <Field
        label={t('password')}
        error={errors.password !== undefined ? t('passwordError') : undefined}
        required
      >
        <Input type="password" autoComplete="current-password" {...register('password')} />
      </Field>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
