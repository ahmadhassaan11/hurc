import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';

import { Layout } from './_layout.js';
import { WithdrawalNotice } from './_withdrawal-notice.js';
import type { EmailLocale } from './i18n.js';
import { t } from './i18n.js';

export type OrderConfirmationProps = {
  locale: EmailLocale;
  customerFirstName: string;
  orderCode: string;
  orderTotalFormatted: string;
};

export function OrderConfirmation(props: OrderConfirmationProps): React.ReactElement {
  const { locale, customerFirstName, orderCode, orderTotalFormatted } = props;
  return (
    <Layout locale={locale}>
      <Heading style={{ fontSize: 22, marginTop: 0 }}>
        {t(locale, {
          en: `Thanks, ${customerFirstName} — your order is in.`,
          de: `Danke, ${customerFirstName} — deine Bestellung ist eingegangen.`,
        })}
      </Heading>
      <Text>
        {t(locale, {
          en: `We've received order #${orderCode} for ${orderTotalFormatted}. You'll get another email the moment it ships.`,
          de: `Wir haben deine Bestellung #${orderCode} über ${orderTotalFormatted} erhalten. Sobald sie versandt wird, erhältst du eine weitere E-Mail.`,
        })}
      </Text>
      <Section>
        <Text style={{ fontSize: 14, color: '#666' }}>
          {t(locale, {
            en: 'Questions? Reply to this email — we read every one.',
            de: 'Fragen? Antworte einfach auf diese E-Mail — wir lesen jede.',
          })}
        </Text>
      </Section>
      <WithdrawalNotice locale={locale} />
    </Layout>
  );
}
