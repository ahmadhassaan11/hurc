import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';

import { Layout } from './_layout.js';
import type { EmailLocale } from './i18n.js';
import { t } from './i18n.js';

export type PasswordResetProps = {
  locale: EmailLocale;
  resetUrl: string;
};

export function PasswordReset(props: PasswordResetProps): React.ReactElement {
  const { locale, resetUrl } = props;
  return (
    <Layout locale={locale}>
      <Heading style={{ fontSize: 22, marginTop: 0 }}>
        {t(locale, {
          en: 'Reset your password',
          de: 'Passwort zurücksetzen',
        })}
      </Heading>
      <Text>
        {t(locale, {
          en: 'Tap the button below to choose a new password. The link is valid for 1 hour.',
          de: 'Klicke auf den Button, um ein neues Passwort zu wählen. Der Link ist 1 Stunde gültig.',
        })}
      </Text>
      <Section style={{ margin: '24px 0' }}>
        <Button
          href={resetUrl}
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
            en: 'Reset password',
            de: 'Passwort zurücksetzen',
          })}
        </Button>
      </Section>
      <Text style={{ fontSize: 13, color: '#666' }}>
        {t(locale, {
          en: "Didn't request this? Ignore this email — your password stays unchanged.",
          de: 'Du hast das nicht angefordert? Ignoriere diese E-Mail — dein Passwort bleibt unverändert.',
        })}
      </Text>
    </Layout>
  );
}
