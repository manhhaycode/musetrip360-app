/**
 * Light Theme for MuseTrip360
 * Default light theme configuration using design tokens
 */

import { colors } from '../tokens/colors';
import { typographyScale } from '../tokens/typography';
import { semanticShadows } from '../tokens/shadows';
import { semanticSpacing } from '../tokens/spacing';
import { semanticBorders } from '../tokens/borders';

export const lightTheme = {
  name: 'light',
  displayName: 'Light Theme',

  // Color mappings for light theme
  colors: {
    // Background colors
    background: {
      primary: '#ffffff',
      secondary: colors.neutral[50],
      tertiary: colors.neutral[100],
      inverse: colors.neutral[900],
      subtle: colors.neutral[50],
    },

    // Surface colors
    surface: {
      primary: '#ffffff',
      secondary: colors.neutral[50],
      tertiary: colors.neutral[100],
      inverse: colors.neutral[800],
      elevated: '#ffffff',
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

    // Border colors
    border: {
      primary: colors.neutral[200],
      secondary: colors.neutral[300],
      focus: colors.primary[500],
      error: colors.error[500],
      inverse: colors.neutral[700],
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

    // Status colors
    status: {
      success: colors.success[500],
      successBackground: colors.success[50],
      successBorder: colors.success[200],

      warning: colors.warning[500],
      warningBackground: colors.warning[50],
      warningBorder: colors.warning[200],

      error: colors.error[500],
      errorBackground: colors.error[50],
      errorBorder: colors.error[200],

      info: colors.info[500],
      infoBackground: colors.info[50],
      infoBorder: colors.info[200],
    },

    // Brand colors
    brand: {
      primary: colors.primary[500],
      secondary: colors.secondary[500],
      accent: colors.accent[500],
    },
  },

  // Typography
  typography: typographyScale,

  // Spacing
  spacing: semanticSpacing,

  // Borders
  borders: semanticBorders,

  // Shadows
  shadows: semanticShadows,

  // Component-specific theme values
  components: {
    button: {
      primary: {
        background: colors.primary[500],
        backgroundHover: colors.primary[600],
        backgroundActive: colors.primary[700],
        backgroundDisabled: colors.neutral[300],
        text: '#ffffff',
        textDisabled: colors.neutral[500],
        border: colors.primary[500],
        borderHover: colors.primary[600],
      },
      secondary: {
        background: 'transparent',
        backgroundHover: colors.neutral[100],
        backgroundActive: colors.neutral[200],
        backgroundDisabled: 'transparent',
        text: colors.neutral[900],
        textDisabled: colors.neutral[400],
        border: colors.neutral[300],
        borderHover: colors.neutral[400],
      },
      ghost: {
        background: 'transparent',
        backgroundHover: colors.neutral[100],
        backgroundActive: colors.neutral[200],
        backgroundDisabled: 'transparent',
        text: colors.neutral[700],
        textDisabled: colors.neutral[400],
        border: 'transparent',
        borderHover: 'transparent',
      },
    },

    card: {
      background: '#ffffff',
      backgroundHover: colors.neutral[50],
      border: colors.neutral[200],
      borderHover: colors.neutral[300],
      shadow: semanticShadows.card.default,
      shadowHover: semanticShadows.card.hover,
    },

    input: {
      background: '#ffffff',
      backgroundDisabled: colors.neutral[50],
      border: colors.neutral[300],
      borderHover: colors.neutral[400],
      borderFocus: colors.primary[500],
      borderError: colors.error[500],
      text: colors.neutral[900],
      textDisabled: colors.neutral[500],
      placeholder: colors.neutral[500],
    },

    modal: {
      backdrop: 'rgba(0, 0, 0, 0.5)',
      background: '#ffffff',
      border: colors.neutral[200],
      shadow: semanticShadows.modal.content,
    },

    navigation: {
      background: '#ffffff',
      backgroundHover: colors.neutral[100],
      backgroundActive: colors.primary[50],
      text: colors.neutral[700],
      textHover: colors.neutral[900],
      textActive: colors.primary[700],
      border: colors.neutral[200],
      shadow: semanticShadows.navigation.navbar,
    },
  },
} as const;

export type LightTheme = typeof lightTheme;
