import type { ResponsiblePerson } from './plugins/hurc-gpsr/responsible-person.entity.js';

/**
 * TypeScript module augmentation for the runtime customFields declared in
 * vendure-config.ts (Customer + Product) and the GPSR plugin (Product
 * extras). Vendure cannot derive these statically — adding them here is
 * what lets `customer.customFields.marketingOptIn` typecheck.
 *
 * Module augmentation REQUIRES `interface` (declarations merge); a `type`
 * alias does not merge across files, so the lint rule preferring type aliases
 * is suspended for this file only.
 *
 * Keep this file in sync with vendure-config.ts → customFields and with
 * GpsrPlugin's configuration callback.
 */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare module '@vendure/core/dist/entity/custom-entity-fields.js' {
  interface CustomCustomerFields {
    marketingOptIn?: boolean;
    marketingOptInAt?: Date | null;
    preferredActivity?: string | null;
  }
  interface CustomProductFields {
    activity?: string[];
    materialComposition?: string;
    careInstructions?: string;
    sustainabilityNotes?: string;
    responsiblePerson?: ResponsiblePerson | null;
    responsiblePersonId?: string | number | null;
    manufacturerInfo?: string;
    warnings?: string;
    traceabilityCode?: string;
  }
}
/* eslint-enable @typescript-eslint/consistent-type-definitions */
