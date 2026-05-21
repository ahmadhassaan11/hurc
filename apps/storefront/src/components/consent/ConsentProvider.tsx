'use client';

import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react';

import { type ConsentState, defaultConsent } from '@/lib/consent/types';

export type { ConsentState };
export { defaultConsent };

export const ConsentContext = createContext<ConsentState>(defaultConsent);

export type ConsentDispatch = (next: ConsentState) => void;

export const ConsentDispatchContext = createContext<ConsentDispatch>(() => {
  /* noop until the bridge mounts */
});

type ConsentProviderProps = {
  children: ReactNode;
  /** Server-rendered initial value, hydrated from `hurc-consent` cookie. */
  initialValue?: ConsentState;
};

export function ConsentProvider({ children, initialValue }: ConsentProviderProps) {
  const [state, setState] = useState<ConsentState>(initialValue ?? defaultConsent);

  const dispatch = useCallback<ConsentDispatch>((next) => {
    setState(next);
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <ConsentContext value={value}>
      <ConsentDispatchContext value={dispatch}>{children}</ConsentDispatchContext>
    </ConsentContext>
  );
}
