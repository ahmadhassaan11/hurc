'use client';

import { type ComponentProps } from 'react';
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';

export type ToasterProps = ComponentProps<typeof SonnerToaster>;

/**
 * Branded `<Toaster />` mount. Drop once near the root of the app tree
 * (typically inside `RootProviders`). Theme is dark to match HURC's
 * dark-default surface; `[data-theme="light"]` consumers may override
 * via the `theme` prop.
 */
export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'border border-[var(--color-line)] bg-[var(--color-surface-800)]',
        },
      }}
      {...props}
    />
  );
}

export { sonnerToast as toast };
