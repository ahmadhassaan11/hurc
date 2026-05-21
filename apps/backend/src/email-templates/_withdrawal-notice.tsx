import { Section, Text } from '@react-email/components';
import * as React from 'react';

import { env } from '../env.js';
import type { EmailLocale } from './i18n.js';
import { t } from './i18n.js';

type Props = { locale: EmailLocale };

/**
 * EU 14-day withdrawal disclosure included in order-confirmation emails.
 * Required by Verbraucherrechte-Richtlinie 2011/83/EU when the contract
 * is concluded online. Links to the full withdrawal page on the
 * storefront.
 */
export function WithdrawalNotice({ locale }: Props): React.ReactElement {
  const storefront = env.STOREFRONT_URL.replace(/\/$/, '');
  return (
    <Section>
      <Text style={{ color: '#0A0A0A', fontSize: 13, lineHeight: 1.6, margin: '24px 0 0 0' }}>
        <strong>
          {t(locale, {
            en: '14-day right of withdrawal',
            de: '14-tägiges Widerrufsrecht',
          })}
        </strong>
        <br />
        {t(locale, {
          en: 'You may cancel this order within 14 days of receiving the goods, no reason required.',
          de: 'Sie können diese Bestellung innerhalb von 14 Tagen nach Erhalt der Ware ohne Angabe von Gründen widerrufen.',
        })}{' '}
        <a href={`${storefront}/legal/withdrawal`}>
          {t(locale, { en: 'Read the full terms.', de: 'Vollständige Bedingungen lesen.' })}
        </a>
      </Text>
    </Section>
  );
}
