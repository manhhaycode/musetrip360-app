/**
 * Theme Helper Utilities
 * Utilities for managing themes, theme switching, and theme-aware styling
 */

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Get the current theme from the document
 */
export function getCurrentTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'light';

  const theme = document.documentElement.getAttribute('data-theme');
  return (theme as ThemeMode) || 'light';
}

/**
 * Set the theme on the document
 */
export function setTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;

  if (theme === 'system') {
    // Remove the data-theme attribute to use system preference
    document.documentElement.removeAttribute('data-theme');
    // Apply system preference
    const systemTheme = getSystemTheme();
    document.documentElement.setAttribute('data-theme', systemTheme);
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Store preference in localStorage
  try {
    localStorage.setItem('theme-preference', theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}

/**
 * Get the system's preferred theme
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get the stored theme preference
 */
export function getStoredTheme(): ThemeMode | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    const stored = localStorage.getItem('theme-preference');
    return stored as ThemeMode;
  } catch (error) {
    console.warn('Failed to read theme preference:', error);
    return null;
  }
}

/**
 * Initialize theme on app startup
 */
export function initializeTheme(): void {
  const stored = getStoredTheme();
  const theme = stored || 'system';
  setTheme(theme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  const current = getCurrentTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

/**
 * Listen for system theme changes
 */
export function watchSystemTheme(callback: (theme: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    const systemTheme = e.matches ? 'dark' : 'light';
    callback(systemTheme);

    // If user has system preference, update the theme
    const currentPreference = getStoredTheme();
    if (currentPreference === 'system') {
      document.documentElement.setAttribute('data-theme', systemTheme);
    }
  };

  mediaQuery.addEventListener('change', handler);

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}

/**
 * Get theme-aware CSS custom property value
 */
export function getThemeValue(property: string, theme?: ThemeMode): string {
  if (typeof document === 'undefined') return '';

  const currentTheme = theme || getCurrentTheme();
  const element = document.documentElement;

  // Try theme-specific property first
  const themeProperty = `--${currentTheme}-${property}`;
  const themeValue = getComputedStyle(element).getPropertyValue(themeProperty);

  if (themeValue) return themeValue.trim();

  // Fallback to base property
  const baseProperty = `--${property}`;
  const baseValue = getComputedStyle(element).getPropertyValue(baseProperty);

  return baseValue.trim();
}

/**
 * Create theme-aware class names
 */
export function createThemeClasses(
  baseClass: string,
  variants: {
    light?: string;
    dark?: string;
  }
): string {
  const classes = [baseClass];

  if (variants.light) {
    classes.push(`[data-theme="light"] ${variants.light}`);
  }

  if (variants.dark) {
    classes.push(`[data-theme="dark"] ${variants.dark}`);
  }

  return classes.join(' ');
}

/**
 * Check if dark theme is active
 */
export function isDarkTheme(): boolean {
  const current = getCurrentTheme();
  if (current === 'dark') return true;
  if (current === 'system') return getSystemTheme() === 'dark';
  return false;
}

/**
 * Check if light theme is active
 */
export function isLightTheme(): boolean {
  return !isDarkTheme();
}

/**
 * Get theme-aware color value
 */
export function getThemeColor(colorName: string, shade?: number): string {
  const shadeStr = shade ? `-${shade}` : '';
  return `var(--color-${colorName}${shadeStr})`;
}

/**
 * Create a theme context for React components
 */
export interface ThemeContext {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  systemTheme: 'light' | 'dark';
}

/**
 * Create theme context value
 */
export function createThemeContext(): ThemeContext {
  const theme = getCurrentTheme();
  const systemTheme = getSystemTheme();

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: isDarkTheme(),
    isLight: isLightTheme(),
    systemTheme,
  };
}

/**
 * Utility to create CSS variables for theme switching
 */
export function createThemeVariables(lightValues: Record<string, string>, darkValues: Record<string, string>): string {
  const lightVars = Object.entries(lightValues)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');

  const darkVars = Object.entries(darkValues)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');

  return `
:root {
${lightVars}
}

[data-theme="dark"] {
${darkVars}
}
`.trim();
}

/**
 * Utility to generate theme-aware gradient
 */
export function createThemeGradient(
  direction: string,
  lightColors: string[],
  darkColors: string[]
): { light: string; dark: string } {
  const lightGradient = `linear-gradient(${direction}, ${lightColors.join(', ')})`;
  const darkGradient = `linear-gradient(${direction}, ${darkColors.join(', ')})`;

  return {
    light: lightGradient,
    dark: darkGradient,
  };
}
