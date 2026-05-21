import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';

import { Layout } from './_layout.js';
import type { EmailLocale } from './i18n.js';
import { t } from './i18n.js';

export type NewsletterConfirmProps = {
  locale: EmailLocale;
  confirmUrl: string;
};

export function NewsletterConfirm(props: NewsletterConfirmProps): React.ReactElement {
  const { locale, confirmUrl } = props;
  return (
    <Layout locale={locale}>
      <Heading style={{ fontSize: 22, marginTop: 0 }}>
        {t(locale, {
          en: 'Confirm your subscription',
          de: 'Newsletter bestätigen',
        })}
      </Heading>
      <Text>
        {t(locale, {
          en: 'One last step — confirm you want HURC drops, training notes, and the occasional offer in your inbox.',
          de: 'Ein letzter Schritt — bestätige, dass du HURC-Drops, Trainings-Notizen und gelegentliche Angebote per E-Mail erhalten möchtest.',
        })}
      </Text>
      <Section style={{ margin: '24px 0' }}>
        <Button
          href={confirmUrl}
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
            en: 'Confirm subscription',
            de: 'Anmeldung bestätigen',
          })}
        </Button>
      </Section>
      <Text style={{ fontSize: 13, color: '#666' }}>
        {t(locale, {
          en: "If you didn't sign up, you can safely ignore this email.",
          de: 'Wenn du dich nicht angemeldet hast, kannst du diese E-Mail ignorieren.',
        })}
      </Text>
    </Layout>
  );
}
