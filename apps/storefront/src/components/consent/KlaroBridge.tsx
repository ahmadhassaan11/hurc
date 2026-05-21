'use client';

import type * as Klaro from 'klaro';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { readConsentClient, writeConsentClient } from '@/lib/consent/client';
import { klaroServiceCatalog } from '@/lib/consent/service-catalog';
import { type ConsentCookiePayload } from '@/lib/consent/types';
import { CONSENT_VERSION } from '@/lib/consent/version';

import { useConsentDispatch } from './useConsent';

const KLARO_ELEMENT_ID = 'klaro-root';

type KlaroModule = typeof Klaro;

type KlaroDescriptions = {
  consentNotice: { description: string; learnMore: string };
  consentModal: { title: string; description: string };
  service: Record<
    string,
    { title?: string; description?: string; purposes?: Record<string, string> }
  >;
  ok: string;
  acceptAll: string;
  acceptSelected: string;
  decline: string;
  save: string;
  close: string;
  privacyPolicy: { name: string; text: string };
  poweredBy?: string;
};

function buildTranslations(t: ReturnType<typeof useTranslations<'consent'>>): KlaroDescriptions {
  return {
    consentNotice: {
      description: t('notice.description'),
      learnMore: t('notice.learnMore'),
    },
    consentModal: {
      title: t('modal.title'),
      description: t('modal.description'),
    },
    service: {
      functional: {
        title: t('services.functional.title'),
        description: t('services.functional.description'),
      },
      plausible: {
        title: t('services.plausible.title'),
        description: t('services.plausible.description'),
      },
      posthog: {
        title: t('services.posthog.title'),
        description: t('services.posthog.description'),
      },
      sentry: { title: t('services.sentry.title'), description: t('services.sentry.description') },
      klaviyo: {
        title: t('services.klaviyo.title'),
        description: t('services.klaviyo.description'),
      },
    },
    ok: t('actions.acceptAll'),
    acceptAll: t('actions.acceptAll'),
    acceptSelected: t('actions.acceptSelected'),
    decline: t('actions.decline'),
    save: t('actions.save'),
    close: t('actions.close'),
    privacyPolicy: {
      name: t('privacyPolicy.name'),
      // Raw string — `{privacyPolicy}` is a Klaro substitution token, not an
      // ICU placeholder. t.raw() bypasses next-intl's MessageFormat parser.
      text: t.raw('privacyPolicy.text') as string,
    },
  };
}

function payloadFromKlaroConsents(
  consents: Record<string, boolean>,
): ConsentCookiePayload['services'] {
  return {
    plausible: consents.plausible ?? true,
    posthog: consents.posthog ?? false,
    sentry: consents.sentry ?? false,
    klaviyo: consents.klaviyo ?? false,
  };
}

/**
 * Mount Klaro on the client, mirror its decisions into `hurc-consent`, and
 * push the coarse `ConsentState` through `useConsentDispatch` so PostHog /
 * Sentry can flip in-place without a navigation.
 *
 * Server-rendered nothing — the bridge is a side-effect-only component.
 * Klaro's modal mounts itself into `#klaro-root` once `setup()` runs.
 */
export function KlaroBridge() {
  const locale = useLocale();
  const t = useTranslations('consent');
  const dispatch = useConsentDispatch();
  const moduleRef = useRef<KlaroModule | null>(null);
  const ensureRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let watcherRef: { update: (manager: { consents: Record<string, boolean> }) => void } | null =
      null;

    void (async () => {
      // Mount the host element Klaro renders into (idempotent).
      if (typeof document !== 'undefined' && ensureRootRef.current === null) {
        let root = document.getElementById(KLARO_ELEMENT_ID) as HTMLDivElement | null;
        if (root === null) {
          root = document.createElement('div');
          root.id = KLARO_ELEMENT_ID;
          document.body.appendChild(root);
        }
        ensureRootRef.current = root;
      }

      const klaro = (await import('klaro')) as KlaroModule;
      if (cancelled) return;
      moduleRef.current = klaro;

      const translations = buildTranslations(t);
      const config = {
        version: 1,
        elementID: KLARO_ELEMENT_ID,
        storageMethod: 'cookie' as const,
        cookieName: `klaro-${CONSENT_VERSION}`,
        cookieExpiresAfterDays: 365,
        cookiePath: '/',
        htmlTexts: false,
        groupByPurpose: true,
        default: false,
        mustConsent: false,
        acceptAll: true,
        hideDeclineAll: false,
        disablePoweredBy: true,
        lang: locale,
        services: klaroServiceCatalog,
        translations: { [locale]: translations, en: translations },
        additionalClass: 'hurc-klaro',
      };

      klaro.setup(config);
      const manager = klaro.getManager(config);

      const mirror = () => {
        const services = payloadFromKlaroConsents(manager.consents);
        writeConsentClient(services);
        dispatch({
          analytics: services.posthog || services.sentry,
          marketing: services.klaviyo,
        });
      };

      // Hydrate dispatch from any existing first-party cookie immediately so
      // server-rendered state and client state agree. If Klaro already has a
      // saved decision (returning visitor), `manager.consents` is populated
      // before the watcher fires — mirror once now.
      const existing = readConsentClient();
      if (existing !== null) {
        dispatch({
          analytics: existing.services.posthog || existing.services.sentry,
          marketing: existing.services.klaviyo,
        });
      }
      if (manager.confirmed) mirror();

      watcherRef = {
        update: () => {
          mirror();
        },
      };
      manager.watch(watcherRef);
    })();

    return () => {
      cancelled = true;
      const klaro = moduleRef.current;
      if (klaro !== null && watcherRef !== null) {
        try {
          klaro.getManager().unwatch(watcherRef);
        } catch {
          // manager may not be initialised yet; safe to ignore
        }
      }
    };
  }, [dispatch, locale, t]);

  return null;
}
