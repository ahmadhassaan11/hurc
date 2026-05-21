import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';

import { Layout } from './_layout.js';
import type { EmailLocale } from './i18n.js';
import { t } from './i18n.js';

export type OrderShippedProps = {
  locale: EmailLocale;
  customerFirstName: string;
  orderCode: string;
  trackingUrl?: string;
  carrier?: string;
};

export function OrderShipped(props: OrderShippedProps): React.ReactElement {
  const { locale, customerFirstName, orderCode, trackingUrl, carrier } = props;
  return (
    <Layout locale={locale}>
      <Heading style={{ fontSize: 22, marginTop: 0 }}>
        {t(locale, {
          en: `On its way, ${customerFirstName}.`,
          de: `Unterwegs, ${customerFirstName}.`,
        })}
      </Heading>
      <Text>
        {t(locale, {
          en: `Order #${orderCode} just left the warehouse${carrier ? ` with ${carrier}` : ''}.`,
          de: `Bestellung #${orderCode} hat soeben das Lager verlassen${
            carrier ? ` (Transport: ${carrier})` : ''
          }.`,
        })}
      </Text>
      {trackingUrl ? (
        <Section style={{ margin: '24px 0' }}>
          <Button
            href={trackingUrl}
            style={{
              backgroundColor: '#0A0A0A',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 0,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {t(locale, {
              en: 'Track your shipment',
              de: 'Sendung verfolgen',
            })}
          </Button>
        </Section>
      ) : null}
    </Layout>
  );
}
