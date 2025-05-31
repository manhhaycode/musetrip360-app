/**
 * Typography Design Tokens for MuseTrip360
 * Professional typography scale for museum and cultural content
 */

// Font families
export const fontFamilies = {
  primary: ['Inter', 'system-ui', 'sans-serif'],
  secondary: ['Crimson Text', 'serif'], // For museum content, elegant serif
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  display: ['Inter', 'system-ui', 'sans-serif'], // For headings and hero text
} as const;

// Font sizes - modular scale
export const fontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem', // 72px
  '8xl': '6rem', // 96px
  '9xl': '8rem', // 128px
} as const;

// Font weights
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Line heights
export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
  '3': '.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Typography semantic scales for consistent usage
export const typographyScale = {
  // Display text - hero sections, major headings
  display: {
    '2xl': {
      fontSize: fontSizes['9xl'],
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.black,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.display,
    },
    xl: {
      fontSize: fontSizes['8xl'],
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.display,
    },
    lg: {
      fontSize: fontSizes['7xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.display,
    },
    md: {
      fontSize: fontSizes['6xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.display,
    },
    sm: {
      fontSize: fontSizes['5xl'],
      lineHeight: lineHeights.snug,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.display,
    },
  },

  // Headings - section headers, card titles
  heading: {
    '4xl': {
      fontSize: fontSizes['4xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.primary,
    },
    '3xl': {
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
    '2xl': {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
    xl: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.snug,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.snug,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
  },

  // Body text - paragraphs, descriptions
  body: {
    xl: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.relaxed,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.relaxed,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.primary,
    },
    xs: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontFamilies.primary,
    },
  },

  // Museum content - artifact descriptions, historical text
  content: {
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.relaxed,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.secondary,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.relaxed,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.secondary,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.secondary,
    },
  },

  // Labels and UI text
  label: {
    lg: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontFamilies.primary,
    },
    md: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontFamilies.primary,
    },
    sm: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wider,
      fontFamily: fontFamilies.primary,
    },
  },

  // Code and technical text
  code: {
    lg: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono,
    },
    md: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono,
    },
    sm: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono,
    },
  },
} as const;

// CSS variables for typography
export const typographyCssVars = {
  // Font families
  '--font-family-primary': fontFamilies.primary.join(', '),
  '--font-family-secondary': fontFamilies.secondary.join(', '),
  '--font-family-mono': fontFamilies.mono.join(', '),
  '--font-family-display': fontFamilies.display.join(', '),

  // Font sizes
  ...Object.entries(fontSizes).reduce(
    (acc, [size, value]) => {
      acc[`--font-size-${size}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  // Font weights
  ...Object.entries(fontWeights).reduce(
    (acc, [weight, value]) => {
      acc[`--font-weight-${weight}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  // Line heights
  ...Object.entries(lineHeights).reduce(
    (acc, [height, value]) => {
      acc[`--line-height-${height}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  // Letter spacing
  ...Object.entries(letterSpacing).reduce(
    (acc, [spacing, value]) => {
      acc[`--letter-spacing-${spacing}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),
} as const;

// Export types
export type FontFamily = typeof fontFamilies;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type TypographyScale = typeof typographyScale;
