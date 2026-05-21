/**
 * Static body components keyed by legal slug. Imported by the dispatcher
 * route at `/[locale]/legal/[slug]/page.tsx`. Each body is pure RSC — no
 * client interactivity — so it composes into Sanity's Portable-Text
 * pipeline (the dispatcher chooses one or the other, never both).
 */
import { type ComponentType } from 'react';

import { type LegalSlug } from '../slugs';
import { CookiesBody } from './cookies';
import { ImprintBody } from './imprint';
import { PrivacyBody } from './privacy';
import { TermsBody } from './terms';
import { WithdrawalBody } from './withdrawal';

export const legalBodies: Record<LegalSlug, ComponentType> = {
  imprint: ImprintBody,
  terms: TermsBody,
  privacy: PrivacyBody,
  cookies: CookiesBody,
  withdrawal: WithdrawalBody,
};
