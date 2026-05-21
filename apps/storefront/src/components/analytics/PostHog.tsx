'use client';

import { useEffect } from 'react';

import { ensurePostHog } from '@/lib/analytics/posthog';

import { useConsent } from '../consent/useConsent';

export function PostHog() {
  const { analytics } = useConsent();

  useEffect(() => {
    void ensurePostHog(analytics);
  }, [analytics]);

  return null;
}
