'use client';

import dynamic from 'next/dynamic';
import { type ReactNode } from 'react';

import { type ConsentState } from '@/lib/consent/types';

import { Plausible } from '../analytics/Plausible';
import { PostHog } from '../analytics/PostHog';
import { ConsentProvider } from '../consent/ConsentProvider';

const KlaroBridge = dynamic(
  () => import('../consent/KlaroBridge').then((m) => ({ default: m.KlaroBridge })),
  { ssr: false },
);

const Toaster = dynamic(() => import('./LazyToaster'), { ssr: false });

type RootProvidersProps = {
  children: ReactNode;
  initialConsent?: ConsentState;
};

export function RootProviders({ children, initialConsent }: RootProvidersProps) {
  return (
    <ConsentProvider {...(initialConsent !== undefined ? { initialValue: initialConsent } : {})}>
      <Plausible />
      {children}
      <PostHog />
      <KlaroBridge />
      <Toaster />
    </ConsentProvider>
  );
}
