import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { type Locale, routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const messages = (
    (await import(`../../messages/${locale}.json`)) as { default: Record<string, unknown> }
  ).default;

  return {
    locale,
    messages,
    timeZone: 'Europe/Berlin',
    now: new Date(),
  };
});
