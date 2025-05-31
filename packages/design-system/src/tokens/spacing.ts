/**
 * Spacing Design Tokens for MuseTrip360
 * Consistent spacing scale for layout, padding, margins, and gaps
 */

// Base spacing scale (in rem units)
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

// Semantic spacing for specific use cases
export const semanticSpacing = {
  // Component internal spacing
  component: {
    xs: spacing[1], // 4px - tight spacing within components
    sm: spacing[2], // 8px - small internal padding
    md: spacing[4], // 16px - standard internal padding
    lg: spacing[6], // 24px - loose internal padding
    xl: spacing[8], // 32px - extra loose internal padding
  },

  // Layout spacing - between components and sections
  layout: {
    xs: spacing[4], // 16px - tight section spacing
    sm: spacing[6], // 24px - small section spacing
    md: spacing[8], // 32px - standard section spacing
    lg: spacing[12], // 48px - large section spacing
    xl: spacing[16], // 64px - extra large section spacing
    '2xl': spacing[20], // 80px - huge section spacing
    '3xl': spacing[24], // 96px - massive section spacing
  },

  // Container padding and margins
  container: {
    xs: spacing[4], // 16px - mobile container padding
    sm: spacing[6], // 24px - small screen container padding
    md: spacing[8], // 32px - medium screen container padding
    lg: spacing[12], // 48px - large screen container padding
    xl: spacing[16], // 64px - extra large screen container padding
  },

  // Form spacing
  form: {
    field: spacing[4], // 16px - between form fields
    group: spacing[6], // 24px - between form groups
    section: spacing[8], // 32px - between form sections
    input: spacing[3], // 12px - internal input padding
    label: spacing[2], // 8px - label to input spacing
  },

  // Card and content spacing
  card: {
    padding: spacing[6], // 24px - standard card padding
    gap: spacing[4], // 16px - gap between card elements
    margin: spacing[4], // 16px - space between cards
  },

  // Navigation spacing
  navigation: {
    item: spacing[3], // 12px - padding for nav items
    gap: spacing[2], // 8px - gap between nav items
    section: spacing[6], // 24px - gap between nav sections
  },

  // Museum-specific spacing
  museum: {
    gallery: spacing[8], // 32px - space between gallery items
    artifact: spacing[6], // 24px - space around artifact content
    tour: spacing[4], // 16px - space in tour interfaces
    exhibition: spacing[12], // 48px - space between exhibition sections
  },
} as const;

// Responsive spacing utilities
export const responsiveSpacing = {
  // Mobile-first responsive spacing
  responsive: {
    xs: {
      mobile: spacing[2], // 8px on mobile
      tablet: spacing[4], // 16px on tablet
      desktop: spacing[6], // 24px on desktop
    },
    sm: {
      mobile: spacing[4], // 16px on mobile
      tablet: spacing[6], // 24px on tablet
      desktop: spacing[8], // 32px on desktop
    },
    md: {
      mobile: spacing[6], // 24px on mobile
      tablet: spacing[8], // 32px on tablet
      desktop: spacing[12], // 48px on desktop
    },
    lg: {
      mobile: spacing[8], // 32px on mobile
      tablet: spacing[12], // 48px on tablet
      desktop: spacing[16], // 64px on desktop
    },
    xl: {
      mobile: spacing[12], // 48px on mobile
      tablet: spacing[16], // 64px on tablet
      desktop: spacing[20], // 80px on desktop
    },
  },
} as const;

// CSS custom properties for spacing
export const spacingCssVars = {
  // Base spacing scale
  ...Object.entries(spacing).reduce(
    (acc, [size, value]) => {
      // Handle numeric keys that need string conversion
      const key = typeof size === 'string' && !isNaN(Number(size)) ? size : size;
      acc[`--spacing-${key}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  // Semantic spacing variables
  ...Object.entries(semanticSpacing).reduce(
    (acc, [category, categorySpacing]) => {
      Object.entries(categorySpacing).forEach(([size, value]) => {
        acc[`--spacing-${category}-${size}`] = value;
      });
      return acc;
    },
    {} as Record<string, string>
  ),
} as const;

// Spacing helper functions for programmatic usage
export const spacingHelpers = {
  // Get spacing value by key
  get: (key: keyof typeof spacing) => spacing[key],

  // Get semantic spacing
  getSemantic: (category: keyof typeof semanticSpacing, size: string) => {
    const categorySpacing = semanticSpacing[category] as Record<string, string>;
    return categorySpacing[size] || spacing[4]; // fallback to 16px
  },

  // Convert spacing to CSS custom property reference
  toCssVar: (key: keyof typeof spacing) => `var(--spacing-${key})`,

  // Convert semantic spacing to CSS custom property reference
  toSemanticCssVar: (category: keyof typeof semanticSpacing, size: string) => `var(--spacing-${category}-${size})`,
} as const;

// Export types
export type SpacingScale = typeof spacing;
export type SpacingKey = keyof typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;
export type SemanticSpacingCategory = keyof typeof semanticSpacing;
