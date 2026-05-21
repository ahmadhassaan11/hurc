import { Hr, Section, Text } from '@react-email/components';
import * as React from 'react';

import { env } from '../env.js';
import type { EmailLocale } from './i18n.js';
import { t } from './i18n.js';

const muted = '#666666';

function loadCompany() {
  return {
    name: env.COMPANY_NAME ?? 'HURC Apparel GmbH',
    address: env.COMPANY_ADDRESS ?? 'Friedrichstraße 1, 10117 Berlin, Germany',
    vat: env.COMPANY_VAT ?? 'DE000000000',
    registry: env.COMPANY_REGISTRY ?? 'HRB 000000 B (AG Berlin)',
    directors: env.COMPANY_DIRECTORS ?? 'Pending appointment',
    email: env.COMPANY_SUPPORT_EMAIL ?? 'support@hurc.example',
    phone: env.COMPANY_SUPPORT_PHONE ?? '+49 30 0000 0000',
  };
}

type Props = { locale: EmailLocale };

/**
 * DSGVO/§5 TMG-compliant footer block. Appended to every transactional
 * email by `_layout.tsx`. No remote images, no tracking pixels — keeps
 * the footer consent-free under PECR.
 */
export function ComplianceFooter({ locale }: Props): React.ReactElement {
  const c = loadCompany();
  const storefront = env.STOREFRONT_URL.replace(/\/$/, '');
  return (
    <Section>
      <Hr style={{ borderColor: '#E5E5E5', margin: '24px 0 12px 0' }} />
      <Text style={{ color: muted, fontSize: 11, lineHeight: 1.6, margin: 0 }}>
        {c.name} · {c.address}
        <br />
        {c.registry} · {t(locale, { en: 'VAT ID', de: 'USt-IdNr.' })} {c.vat}
        <br />
        {t(locale, { en: 'Managing directors', de: 'Geschäftsführer' })}: {c.directors}
        <br />
        <a href={`mailto:${c.email}`} style={{ color: muted }}>
          {c.email}
        </a>{' '}
        · {c.phone}
        <br />
        <a href={`${storefront}/legal/imprint`} style={{ color: muted }}>
          {t(locale, { en: 'Imprint', de: 'Impressum' })}
        </a>{' '}
        ·{' '}
        <a href={`${storefront}/legal/privacy`} style={{ color: muted }}>
          {t(locale, { en: 'Privacy', de: 'Datenschutz' })}
        </a>{' '}
        ·{' '}
        <a href={`${storefront}/legal/withdrawal`} style={{ color: muted }}>
          {t(locale, { en: 'Right of withdrawal', de: 'Widerrufsrecht' })}
        </a>
      </Text>
    </Section>
  );
}
