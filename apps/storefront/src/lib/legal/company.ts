import 'server-only';

/**
 * Compliance-footer + Impressum data, sourced from env vars so staging
 * stays placeholder-safe and prod values are injected via Doppler before
 * launch. The schema lives in `@/env`; this module is the typed view that
 * legal-page bodies and email templates consume.
 *
 * Phase 8 ships sensible placeholders for development. The build fails
 * (via `env.ts` superRefine) when any value is missing in production.
 */
import { env } from '@/env';

export type CompanyDetails = {
  name: string;
  address: string;
  vat: string;
  registry: string;
  directors: string;
  email: string;
  phone: string;
};

export function loadCompany(): CompanyDetails {
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
