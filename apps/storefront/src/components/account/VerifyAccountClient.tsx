'use client';

import { Button, toast } from '@hurc/ui';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';

import { verifyAccountAction } from '@/lib/actions/account';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

type Props = { token: string };

type State = 'pending' | 'success' | 'error';

export function VerifyAccountClient({ token }: Props) {
  const t = useTranslations('account.verify');
  const tErrors = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<State>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    startTransition(async () => {
      const result = await verifyAccountAction({ token });
      if (result?.data?.ok === true) {
        setState('success');
        toast.success(t('success'));
        return;
      }
      const code = result?.data?.ok === false ? result.data.error : 'UNKNOWN_ERROR';
      setState('error');
      setErrorMessage(tErrors(vendureErrorMessageKey(code)));
    });
  }, [token, startTransition, t, tErrors]);

  if (state === 'pending' || pending) {
    return <p className="text-sm text-[var(--color-muted)]">{t('verifying')}</p>;
  }
  if (state === 'success') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm">{t('successDescription')}</p>
        <Button
          type="button"
          intent="primary"
          size="lg"
          onClick={() => {
            router.push('/account');
            router.refresh();
          }}
          className="md:self-start"
        >
          {t('continue')}
        </Button>
      </div>
    );
  }
  return (
    <p className="text-sm text-[var(--color-accent)]">
      {errorMessage ?? tErrors('errors.generic')}
    </p>
  );
}
