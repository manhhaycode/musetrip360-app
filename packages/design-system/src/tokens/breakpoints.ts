/**
 * Breakpoint Design Tokens for MuseTrip360
 * Responsive design breakpoints for consistent cross-device experiences
 */

// Base breakpoints (mobile-first approach)
export const breakpoints = {
  xs: '375px', // Small mobile devices
  sm: '640px', // Large mobile devices
  md: '768px', // Tablets
  lg: '1024px', // Small desktops/laptops
  xl: '1280px', // Large desktops
  '2xl': '1536px', // Extra large screens
} as const;

// Container max-widths for each breakpoint
export const containerSizes = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Media query helpers
export const mediaQueries = {
  // Min-width queries (mobile-first)
  up: {
    xs: `@media (min-width: ${breakpoints.xs})`,
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
    '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  },

  // Max-width queries (desktop-first)
  down: {
    xs: `@media (max-width: ${parseInt(breakpoints.xs) - 1}px)`,
    sm: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
    md: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
    lg: `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
    xl: `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
    '2xl': `@media (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
  },

  // Between breakpoints
  between: {
    'xs-sm': `@media (min-width: ${breakpoints.xs}) and (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
    'sm-md': `@media (min-width: ${breakpoints.sm}) and (max-width: ${parseInt(breakpoints.md) - 1}px)`,
    'md-lg': `@media (min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
    'lg-xl': `@media (min-width: ${breakpoints.lg}) and (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
    'xl-2xl': `@media (min-width: ${breakpoints.xl}) and (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
  },

  // Only specific breakpoint
  only: {
    xs: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
    sm: `@media (min-width: ${breakpoints.sm}) and (max-width: ${parseInt(breakpoints.md) - 1}px)`,
    md: `@media (min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
    lg: `@media (min-width: ${breakpoints.lg}) and (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
    xl: `@media (min-width: ${breakpoints.xl}) and (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
    '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  },
} as const;

// Device-specific queries
export const deviceQueries = {
  mobile: mediaQueries.down.md,
  tablet: mediaQueries.between['md-lg'],
  desktop: mediaQueries.up.lg,
  touch: '@media (hover: none) and (pointer: coarse)',
  mouse: '@media (hover: hover) and (pointer: fine)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  highContrast: '@media (prefers-contrast: high)',
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)',
} as const;

// Grid breakpoint configurations
export const gridBreakpoints = {
  xs: {
    columns: 4,
    gutter: '16px',
    margin: '16px',
  },
  sm: {
    columns: 8,
    gutter: '20px',
    margin: '24px',
  },
  md: {
    columns: 12,
    gutter: '24px',
    margin: '32px',
  },
  lg: {
    columns: 12,
    gutter: '32px',
    margin: '48px',
  },
  xl: {
    columns: 12,
    gutter: '32px',
    margin: '64px',
  },
  '2xl': {
    columns: 12,
    gutter: '40px',
    margin: '80px',
  },
} as const;

// CSS custom properties for breakpoints
export const breakpointCssVars = {
  ...Object.entries(breakpoints).reduce(
    (acc, [breakpoint, value]) => {
      acc[`--breakpoint-${breakpoint}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  ...Object.entries(containerSizes).reduce(
    (acc, [breakpoint, value]) => {
      acc[`--container-${breakpoint}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),
} as const;

// Breakpoint helper functions
export const breakpointHelpers = {
  // Get breakpoint value
  get: (key: keyof typeof breakpoints) => breakpoints[key],

  // Get container size
  getContainer: (key: keyof typeof containerSizes) => containerSizes[key],

  // Get media query
  getMediaQuery: (direction: 'up' | 'down' | 'only', breakpoint: keyof typeof breakpoints) => {
    return mediaQueries[direction][breakpoint];
  },

  // Check if value is above breakpoint
  isAbove: (value: string, breakpoint: keyof typeof breakpoints) => {
    return parseInt(value) >= parseInt(breakpoints[breakpoint]);
  },

  // Check if value is below breakpoint
  isBelow: (value: string, breakpoint: keyof typeof breakpoints) => {
    return parseInt(value) < parseInt(breakpoints[breakpoint]);
  },

  // Get grid configuration for breakpoint
  getGrid: (breakpoint: keyof typeof gridBreakpoints) => gridBreakpoints[breakpoint],
} as const;

// Export types
export type Breakpoint = keyof typeof breakpoints;
export type MediaQuery = typeof mediaQueries;
export type DeviceQuery = typeof deviceQueries;
export type GridBreakpoint = typeof gridBreakpoints;
