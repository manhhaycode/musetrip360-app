/**
 * Shadow Design Tokens for MuseTrip360
 * Elevation and depth system for interface hierarchy
 */

// Base shadow definitions
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Semantic shadows for component states
export const semanticShadows = {
  card: {
    default: shadows.sm,
    hover: shadows.md,
    active: shadows.xs,
  },

  button: {
    default: shadows.xs,
    hover: shadows.sm,
    active: shadows.inner,
  },

  modal: {
    backdrop: shadows.none,
    content: shadows.xl,
  },

  navigation: {
    navbar: shadows.sm,
    dropdown: shadows.lg,
  },
} as const;

// CSS variables
export const shadowCssVars = {
  ...Object.entries(shadows).reduce(
    (acc, [shadow, value]) => {
      acc[`--shadow-${shadow}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),
} as const;
