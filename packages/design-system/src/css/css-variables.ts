/**
 * CSS Variables for MuseTrip360 design system
 */

import { colorCssVars } from '../tokens/colors';
import { spacingCssVars } from '../tokens/spacing';

// Combine all CSS variables
export const allCssVars = {
  ...colorCssVars,
  ...spacingCssVars,
} as const;

// Generate CSS root declaration
export function generateRootCss(): string {
  const vars = Object.entries(allCssVars)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');

  return `:root {\n${vars}\n}`;
}
