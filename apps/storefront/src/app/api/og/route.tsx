import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

export function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get('title') ?? 'HURC';
  const subtitle =
    request.nextUrl.searchParams.get('subtitle') ?? 'Hustle Unleashed, Resilience Crafted';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: '#0a0a0a',
        color: '#ffffff',
        padding: '80px',
      }}
    >
      <div
        style={{
          fontSize: 24,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#b5b5b5',
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          fontSize: 180,
          fontWeight: 700,
          lineHeight: 0.95,
          marginTop: 16,
          background: 'linear-gradient(90deg, #ffffff 70%, #e63946 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 32,
          height: 4,
          width: 96,
          background: '#e63946',
        }}
      />
    </div>,
    { width: 1200, height: 630 },
  );
}
