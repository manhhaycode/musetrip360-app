/**
 * Border Design Tokens for MuseTrip360
 * Consistent border radius, widths, and styles for components
 */

// Border widths
export const borderWidths = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

// Border radius
export const borderRadius = {
  none: '0',
  xs: '0.125rem', // 2px
  sm: '0.25rem', // 4px
  base: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
  full: '9999px', // Pill shape
} as const;

// Border styles
export const borderStyles = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  none: 'none',
} as const;

// Semantic border configurations
export const semanticBorders = {
  // Card borders
  card: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
    elevated: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.xl,
    },
    interactive: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
  },

  // Button borders
  button: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.md,
    },
    rounded: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.full,
    },
    sharp: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.none,
    },
  },

  // Input borders
  input: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.base,
    },
    focus: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.base,
    },
    error: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.base,
    },
  },

  // Modal borders
  modal: {
    default: {
      width: borderWidths[0],
      style: borderStyles.none,
      radius: borderRadius.xl,
    },
    sheet: {
      width: borderWidths[0],
      style: borderStyles.none,
      radius: borderRadius['2xl'],
    },
  },

  // Museum-specific borders
  museum: {
    artifact: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
    gallery: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.xl,
    },
    exhibition: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius['2xl'],
    },
  },

  // Navigation borders
  navigation: {
    tab: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.base,
    },
    menu: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
  },

  // Avatar borders
  avatar: {
    default: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.full,
    },
    square: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.md,
    },
  },

  // Badge borders
  badge: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.full,
    },
    square: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.sm,
    },
  },

  // Table borders
  table: {
    cell: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.none,
    },
    header: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.none,
    },
  },
} as const;

// CSS custom properties for borders
export const borderCssVars = {
  // Border widths
  ...Object.entries(borderWidths).reduce(
    (acc, [width, value]) => {
      acc[`--border-width-${width}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  // Border radius
  ...Object.entries(borderRadius).reduce(
    (acc, [radius, value]) => {
      acc[`--border-radius-${radius}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),

  // Border styles
  ...Object.entries(borderStyles).reduce(
    (acc, [style, value]) => {
      acc[`--border-style-${style}`] = value;
      return acc;
    },
    {} as Record<string, string>
  ),
} as const;

// Border helper functions
export const borderHelpers = {
  // Get border width by key
  getWidth: (key: keyof typeof borderWidths) => borderWidths[key],

  // Get border radius by key
  getRadius: (key: keyof typeof borderRadius) => borderRadius[key],

  // Get border style by key
  getStyle: (key: keyof typeof borderStyles) => borderStyles[key],

  // Get semantic border configuration
  getSemantic: (category: keyof typeof semanticBorders, variant: string) => {
    const categoryBorders = semanticBorders[category] as Record<string, any>;
    return categoryBorders[variant] || semanticBorders.card.default;
  },

  // Create border shorthand CSS
  createBorder: (width: keyof typeof borderWidths, style: keyof typeof borderStyles, color: string) =>
    `${borderWidths[width]} ${borderStyles[style]} ${color}`,

  // Convert to CSS custom property references
  toCssVars: (config: { width: string; style: string; radius?: string }) => ({
    borderWidth: config.width,
    borderStyle: config.style,
    ...(config.radius && { borderRadius: config.radius }),
  }),
} as const;

// Export types
export type BorderWidth = keyof typeof borderWidths;
export type BorderRadius = keyof typeof borderRadius;
export type BorderStyle = keyof typeof borderStyles;
export type SemanticBorders = typeof semanticBorders;
export type SemanticBorderCategory = keyof typeof semanticBorders;
