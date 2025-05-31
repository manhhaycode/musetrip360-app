/**
 * Color Design Tokens for MuseTrip360
 * Supporting both light and dark themes with museum-specific branding
 */

// Base color palette
export const colors = {
  // Neutral colors - foundation for UI
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Primary brand colors - museum heritage
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Secondary colors - cultural warmth
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },

  // Accent colors - artistic expression
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
} as const;

// Semantic color mappings
export const semanticColors = {
  // Background colors
  background: {
    primary: colors.neutral[50],
    secondary: colors.neutral[100],
    tertiary: colors.neutral[200],
    inverse: colors.neutral[900],
    subtle: colors.neutral[50],
  },

  // Surface colors (cards, modals, etc.)
  surface: {
    primary: '#ffffff',
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100],
    inverse: colors.neutral[800],
    elevated: '#ffffff',
  },

  // Border colors
  border: {
    primary: colors.neutral[200],
    secondary: colors.neutral[300],
    focus: colors.primary[500],
    error: colors.error[500],
    inverse: colors.neutral[700],
  },

  // Text colors
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    inverse: colors.neutral[50],
    disabled: colors.neutral[400],
    link: colors.primary[600],
    linkHover: colors.primary[700],
    success: colors.success[700],
    warning: colors.warning[700],
    error: colors.error[700],
    info: colors.info[700],
  },

  // Interactive colors
  interactive: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
    primaryDisabled: colors.neutral[300],

    secondary: colors.secondary[500],
    secondaryHover: colors.secondary[600],
    secondaryActive: colors.secondary[700],

    accent: colors.accent[500],
    accentHover: colors.accent[600],
    accentActive: colors.accent[700],
  },
} as const;

// CSS custom properties for runtime theme switching
export const colorCssVars = {
  // Generate CSS variables for all color tokens
  ...Object.entries(colors).reduce(
    (acc, [colorName, colorScale]) => {
      Object.entries(colorScale).forEach(([shade, value]) => {
        acc[`--color-${colorName}-${shade}`] = value;
      });
      return acc;
    },
    {} as Record<string, string>
  ),

  // Semantic color variables
  ...Object.entries(semanticColors).reduce(
    (acc, [categoryName, categoryColors]) => {
      Object.entries(categoryColors).forEach(([colorName, value]) => {
        acc[`--color-${categoryName}-${colorName}`] = value;
      });
      return acc;
    },
    {} as Record<string, string>
  ),
} as const;

// Export types for TypeScript
export type ColorScale = typeof colors;
export type ColorName = keyof typeof colors;
export type ColorShade = keyof typeof colors.neutral;
export type SemanticColors = typeof semanticColors;
export type SemanticColorCategory = keyof typeof semanticColors;
