import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge class names using clsx
 * Provides a consistent way to combine conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Utility to merge multiple class name arrays or strings
 */
export function mergeClasses(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility to conditionally apply classes based on boolean conditions
 */
export function conditionalClasses(baseClasses: string, conditionalClasses: Record<string, boolean>): string {
  const conditionals = Object.entries(conditionalClasses)
    .filter(([, condition]) => condition)
    .map(([className]) => className);

  return mergeClasses(baseClasses, ...conditionals);
}

/**
 * Utility to create responsive class names
 */
export function responsiveClasses(
  base: string,
  responsive: Partial<{
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  }>
): string {
  const classes = [base];

  Object.entries(responsive).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  });

  return classes.join(' ');
}

/**
 * Utility to create state-based class names (hover, focus, active, etc.)
 */
export function stateClasses(
  base: string,
  states: Partial<{
    hover: string;
    focus: string;
    active: string;
    disabled: string;
    'focus-visible': string;
  }>
): string {
  const classes = [base];

  Object.entries(states).forEach(([state, className]) => {
    if (className) {
      classes.push(`${state}:${className}`);
    }
  });

  return classes.join(' ');
}

/**
 * Utility to create data attribute classes
 */
export function dataClasses(base: string, dataAttributes: Record<string, string>): string {
  const classes = [base];

  Object.entries(dataAttributes).forEach(([attribute, className]) => {
    classes.push(`data-[${attribute}]:${className}`);
  });

  return classes.join(' ');
}

/**
 * Utility to create theme-aware classes
 */
export function themeClasses(lightClasses: string, darkClasses?: string): string {
  if (!darkClasses) return lightClasses;
  return `${lightClasses} dark:${darkClasses}`;
}
