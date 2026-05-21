'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: '#0a0a0a',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100dvh',
          margin: 0,
          padding: '4rem 1.5rem',
        }}
      >
        <main style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ color: '#b5b5b5', marginTop: '1rem' }}>
            We hit an unexpected issue. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
