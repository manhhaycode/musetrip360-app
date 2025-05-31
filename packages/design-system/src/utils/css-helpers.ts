/**
 * CSS Helper Utilities
 * Utilities for working with CSS custom properties, calculations, and dynamic styles
 */

/**
 * Create a CSS custom property reference
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(--${name}, ${fallback})` : `var(--${name})`;
}

/**
 * Create a CSS calc() expression
 */
export function cssCalc(expression: string): string {
  return `calc(${expression})`;
}

/**
 * Create a CSS clamp() expression for responsive values
 */
export function cssClamp(min: string, preferred: string, max: string): string {
  return `clamp(${min}, ${preferred}, ${max})`;
}

/**
 * Create a CSS min() expression
 */
export function cssMin(...values: string[]): string {
  return `min(${values.join(', ')})`;
}

/**
 * Create a CSS max() expression
 */
export function cssMax(...values: string[]): string {
  return `max(${values.join(', ')})`;
}

/**
 * Convert pixel values to rem units
 */
export function pxToRem(px: number, baseFontSize: number = 16): string {
  return `${px / baseFontSize}rem`;
}

/**
 * Convert rem values to pixel units
 */
export function remToPx(rem: number, baseFontSize: number = 16): number {
  return rem * baseFontSize;
}

/**
 * Create a CSS custom property with a fallback chain
 */
export function cssVarWithFallbacks(name: string, ...fallbacks: string[]): string {
  if (fallbacks.length === 0) {
    return cssVar(name);
  }

  let result = fallbacks[fallbacks.length - 1];
  for (let i = fallbacks.length - 2; i >= 0; i--) {
    result = `var(--${fallbacks[i]}, ${result})`;
  }
  return `var(--${name}, ${result})`;
}

/**
 * Create a spacing value using the design system's spacing scale
 */
export function spacing(multiplier: number): string {
  return cssCalc(`${cssVar('spacing')} * ${multiplier}`);
}

/**
 * Create a responsive font size using clamp
 */
export function responsiveFontSize(minSize: string, preferredSize: string, maxSize: string): string {
  return cssClamp(minSize, preferredSize, maxSize);
}

/**
 * Create a CSS grid template with dynamic columns
 */
export function gridTemplate(columns: number, gap?: string): Record<string, string> {
  const styles: Record<string, string> = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  if (gap) {
    styles.gap = gap;
  }

  return styles;
}

/**
 * Create flexbox utilities
 */
export function flexCenter(): Record<string, string> {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

export function flexBetween(): Record<string, string> {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
}

/**
 * Create a CSS transition with design system timing
 */
export function transition(
  property: string = 'all',
  duration: string = cssVar('duration-normal'),
  easing: string = cssVar('easing-smooth')
): string {
  return `${property} ${duration} ${easing}`;
}

/**
 * Create a box shadow with design system values
 */
export function boxShadow(size: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | 'inner'): string {
  return cssVar(`shadow-${size}`);
}

/**
 * Create a border radius with design system values
 */
export function borderRadius(size: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'): string {
  return cssVar(`radius-${size}`);
}

/**
 * Create a media query string
 */
export function mediaQuery(breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'): string {
  return `@media (min-width: ${cssVar(`breakpoint-${breakpoint}`)})`;
}

/**
 * Create a container query string
 */
export function containerQuery(size: string): string {
  return `@container (min-width: ${size})`;
}

/**
 * Create CSS for truncating text
 */
export function textTruncate(): Record<string, string> {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

/**
 * Create CSS for line clamping (multi-line truncation)
 */
export function lineClamp(lines: number): Record<string, string> {
  return {
    display: '-webkit-box',
    WebkitLineClamp: lines.toString(),
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };
}

/**
 * Create CSS for aspect ratio
 */
export function aspectRatio(ratio: string): Record<string, string> {
  return {
    aspectRatio: ratio,
  };
}

/**
 * Create CSS for visually hidden content (accessible but not visible)
 */
export function visuallyHidden(): Record<string, string> {
  return {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  };
}
