/**
 * Top-level not-found used when a path does not match any locale segment
 * (e.g. malformed locale prefix). Locale-aware 404s live in
 * `src/app/[locale]/not-found.tsx`.
 */
export default function RootNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Page not found</h1>
          <p style={{ color: '#b5b5b5', marginTop: '1rem' }}>
            The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
          </p>
        </main>
      </body>
    </html>
  );
}
