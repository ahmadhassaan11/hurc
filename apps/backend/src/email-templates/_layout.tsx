import { Body, Container, Head, Hr, Html, Section, Text } from '@react-email/components';
import * as React from 'react';

import { ComplianceFooter } from './_compliance-footer.js';
import type { EmailLocale } from './i18n.js';
import { t } from './i18n.js';

type LayoutProps = {
  locale: EmailLocale;
  preview?: string;
  children: React.ReactNode;
};

const colors = { ink: '#0A0A0A', paper: '#FFFFFF', muted: '#666666' };

export function Layout({ locale, children }: LayoutProps): React.ReactElement {
  const lang = locale === 'de' ? 'de' : 'en';
  return (
    <Html lang={lang}>
      <Head />
      <Body
        style={{
          backgroundColor: colors.paper,
          color: colors.ink,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: '0 auto',
            padding: '32px 24px',
          }}
        >
          <Section>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 2,
                margin: 0,
              }}
            >
              HURC
            </Text>
          </Section>
          <Hr style={{ borderColor: colors.ink, margin: '16px 0 24px 0' }} />
          {children}
          <Hr style={{ borderColor: '#E5E5E5', margin: '32px 0 16px 0' }} />
          <Text style={{ color: colors.muted, fontSize: 12, margin: 0 }}>
            {t(locale, {
              en: 'Hustle Unleashed, Resilience Crafted. — HURC',
              de: 'Hustle Unleashed, Resilience Crafted. — HURC',
            })}
          </Text>
          <ComplianceFooter locale={locale} />
        </Container>
      </Body>
    </Html>
  );
}
