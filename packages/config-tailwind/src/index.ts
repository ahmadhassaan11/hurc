/**
 * HURC design tokens. Source of truth for color, spacing, typography, motion.
 * Tailwind v4 reads these via the `tokens.css` sibling export (`@theme` block);
 * runtime code can also import the typed values from this module.
 */

export const colors = {
  black: '#0A0A0A',
  white: '#FFFFFF',
  accent: '#E63946',
  accentMuted: 'rgba(230, 57, 70, 0.12)',
  ink: {
    900: '#0A0A0A',
    700: '#1A1A1A',
    500: '#3A3A3A',
    300: '#6B6B6B',
    100: '#B5B5B5',
  },
  surface: {
    900: '#0A0A0A',
    800: '#111111',
    700: '#1A1A1A',
    100: '#F6F6F6',
    50: '#FFFFFF',
  },
  line: {
    onDark: 'rgba(255, 255, 255, 0.08)',
    onLight: 'rgba(10, 10, 10, 0.08)',
  },
} as const;

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  24: '6rem',
  32: '8rem',
} as const;

export const fontFamilies = {
  display: ['"Bricolage Grotesque"', 'Geist', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
} as const;

export const motion = {
  durations: {
    fast: '120ms',
    base: '200ms',
    slow: '320ms',
    cinematic: '600ms',
  },
  easings: {
    standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type HurcTokens = {
  colors: typeof colors;
  spacing: typeof spacing;
  fontFamilies: typeof fontFamilies;
  motion: typeof motion;
  breakpoints: typeof breakpoints;
};

export const tokens: HurcTokens = {
  colors,
  spacing,
  fontFamilies,
  motion,
  breakpoints,
};
