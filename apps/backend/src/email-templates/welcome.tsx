import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';

import { Layout } from './_layout.js';
import type { EmailLocale } from './i18n.js';
import { t } from './i18n.js';

export type WelcomeProps = {
  locale: EmailLocale;
  customerFirstName: string;
  verifyUrl: string;
};

export function Welcome(props: WelcomeProps): React.ReactElement {
  const { locale, customerFirstName, verifyUrl } = props;
  return (
    <Layout locale={locale}>
      <Heading style={{ fontSize: 22, marginTop: 0 }}>
        {t(locale, {
          en: `Welcome to HURC, ${customerFirstName}.`,
          de: `Willkommen bei HURC, ${customerFirstName}.`,
        })}
      </Heading>
      <Text>
        {t(locale, {
          en: 'Confirm your email address to finish setting up your account.',
          de: 'Bestätige deine E-Mail-Adresse, um dein Konto einzurichten.',
        })}
      </Text>
      <Section style={{ margin: '24px 0' }}>
        <Button
          href={verifyUrl}
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
            en: 'Confirm email',
            de: 'E-Mail bestätigen',
          })}
        </Button>
      </Section>
    </Layout>
  );
}
