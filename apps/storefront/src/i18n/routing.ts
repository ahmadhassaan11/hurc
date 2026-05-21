import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr', 'nl', 'es', 'it'] as const,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
