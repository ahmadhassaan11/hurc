/**
 * EU + UK VAT rates — **standard rate only**. Reduced rates (groceries, books)
 * are not relevant to activewear and are intentionally not modeled.
 *
 * Source: EU Commission VAT rates table, retrieved 2026-05-01 (per ADR-0002).
 * Re-verify against the Commission table at the start of every fiscal year and
 * bump rows here as needed; the seed script is idempotent so a row update +
 * re-seed is safe.
 */

export type EuCountryIso =
  | 'DE'
  | 'FR'
  | 'NL'
  | 'BE'
  | 'ES'
  | 'IT'
  | 'AT'
  | 'IE'
  | 'PT'
  | 'FI'
  | 'DK'
  | 'SE'
  | 'PL'
  | 'CZ'
  | 'GR'
  | 'HU'
  | 'SK'
  | 'SI'
  | 'EE'
  | 'LV'
  | 'LT'
  | 'LU'
  | 'BG'
  | 'RO'
  | 'HR'
  | 'CY'
  | 'MT';

export type UkCountryIso = 'GB';
export type CountryIso = EuCountryIso | UkCountryIso;

export type VatRow = {
  iso: CountryIso;
  name: string;
  /** Standard VAT rate, as a percent (e.g. `19` means 19%). */
  standardRate: number;
};

export const euVatRates: readonly VatRow[] = [
  { iso: 'DE', name: 'Germany', standardRate: 19 },
  { iso: 'FR', name: 'France', standardRate: 20 },
  { iso: 'NL', name: 'Netherlands', standardRate: 21 },
  { iso: 'BE', name: 'Belgium', standardRate: 21 },
  { iso: 'ES', name: 'Spain', standardRate: 21 },
  { iso: 'IT', name: 'Italy', standardRate: 22 },
  { iso: 'AT', name: 'Austria', standardRate: 20 },
  { iso: 'IE', name: 'Ireland', standardRate: 23 },
  { iso: 'PT', name: 'Portugal', standardRate: 23 },
  { iso: 'FI', name: 'Finland', standardRate: 25.5 },
  { iso: 'DK', name: 'Denmark', standardRate: 25 },
  { iso: 'SE', name: 'Sweden', standardRate: 25 },
  { iso: 'PL', name: 'Poland', standardRate: 23 },
  { iso: 'CZ', name: 'Czechia', standardRate: 21 },
  { iso: 'GR', name: 'Greece', standardRate: 24 },
  { iso: 'HU', name: 'Hungary', standardRate: 27 },
  { iso: 'SK', name: 'Slovakia', standardRate: 23 },
  { iso: 'SI', name: 'Slovenia', standardRate: 22 },
  { iso: 'EE', name: 'Estonia', standardRate: 24 },
  { iso: 'LV', name: 'Latvia', standardRate: 21 },
  { iso: 'LT', name: 'Lithuania', standardRate: 21 },
  { iso: 'LU', name: 'Luxembourg', standardRate: 17 },
  { iso: 'BG', name: 'Bulgaria', standardRate: 20 },
  { iso: 'RO', name: 'Romania', standardRate: 21 },
  { iso: 'HR', name: 'Croatia', standardRate: 25 },
  { iso: 'CY', name: 'Cyprus', standardRate: 19 },
  { iso: 'MT', name: 'Malta', standardRate: 18 },
];

export const ukVatRate: VatRow = {
  iso: 'GB',
  name: 'United Kingdom',
  standardRate: 20,
};

/** All rows the seed script must create — handy single import point. */
export const allVatRates: readonly VatRow[] = [...euVatRates, ukVatRate];
