'use client';

import { Button, toast } from '@hurc/ui';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { logoutAction } from '@/lib/actions/account';

export function LogoutButton() {
  const t = useTranslations('account');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      intent="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await logoutAction({});
          if (result?.data?.ok === true) {
            toast.success(t('logoutSuccess'));
            router.push('/');
            router.refresh();
          } else {
            toast.error(tErrors('generic'));
          }
        });
      }}
    >
      {pending ? t('loggingOut') : t('logout')}
    </Button>
  );
}
