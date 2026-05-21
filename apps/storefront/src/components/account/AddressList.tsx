'use client';

import { Badge, Button, toast } from '@hurc/ui';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { deleteAddressAction } from '@/lib/actions/account';
import { type ActiveCustomerSummary } from '@/lib/vendure/active-customer';

type Props = {
  addresses: ActiveCustomerSummary['addresses'];
};

export function AddressList({ addresses }: Props) {
  const t = useTranslations('account.address');
  const tErrors = useTranslations('errors');
  const [pending, startTransition] = useTransition();

  if (addresses.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">{t('empty')}</p>;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {addresses.map((address) => (
        <li
          key={address.id}
          className="flex flex-col gap-3 border border-[var(--color-line)] bg-[var(--color-surface-800)] p-6"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-medium uppercase tracking-[0.15em]">
              {address.fullName ?? ''}
            </p>
            <div className="flex gap-2">
              {address.defaultShippingAddress ? (
                <Badge intent="default">{t('defaultShipping')}</Badge>
              ) : null}
              {address.defaultBillingAddress ? (
                <Badge intent="default">{t('defaultBilling')}</Badge>
              ) : null}
            </div>
          </div>
          <address className="text-sm not-italic text-[var(--color-muted)]">
            {address.company !== null ? <p>{address.company}</p> : null}
            <p>{address.streetLine1}</p>
            {address.streetLine2 !== null ? <p>{address.streetLine2}</p> : null}
            <p>
              {[address.postalCode, address.city, address.province]
                .filter((s) => s !== null && s !== '')
                .join(' · ')}
            </p>
            <p>{address.countryName}</p>
            {address.phoneNumber !== null ? <p>{address.phoneNumber}</p> : null}
          </address>
          <Button
            type="button"
            intent="ghost"
            size="sm"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const result = await deleteAddressAction({ id: address.id });
                if (result?.data?.ok === true) {
                  toast.success(t('deleted'));
                } else {
                  toast.error(tErrors('generic'));
                }
              });
            }}
            className="self-start text-[var(--color-muted)] hover:text-[var(--color-accent)]"
          >
            {t('delete')}
          </Button>
        </li>
      ))}
    </ul>
  );
}
