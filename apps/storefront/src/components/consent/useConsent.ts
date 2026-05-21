'use client';

import { use } from 'react';

import { ConsentContext, ConsentDispatchContext, type ConsentState } from './ConsentProvider';

export function useConsent(): ConsentState {
  return use(ConsentContext);
}

export function useConsentDispatch(): (next: ConsentState) => void {
  return use(ConsentDispatchContext);
}
