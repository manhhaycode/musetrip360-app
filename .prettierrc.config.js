/**
 * @fileoverview Shared Prettier configuration for MuseTrip360 projects
 * @author MuseTrip360
 */

/**
 * MuseTrip360 Prettier Configuration
 * Optimized for consistency across web, mobile, and package development
 */
export default {
  // Print width - balance readability with modern wide screens
  printWidth: 120,

  // Use single quotes for consistency with JavaScript ecosystem
  singleQuote: true,

  // Always use semicolons for clarity and ASI safety
  semi: true,

  // Trailing commas for cleaner diffs and easier reordering
  trailingComma: "es5",

  // Bracket spacing for readability
  bracketSpacing: true,

  // Bracket same line - keep opening bracket on same line for JSX
  bracketSameLine: false,

  // Arrow function parentheses - always for consistency
  arrowParens: "always",

  // Tab width - 2 spaces for better nesting readability
  tabWidth: 2,

  // Use spaces instead of tabs
  useTabs: false,

  // Quote props only when needed
  quoteProps: "as-needed",

  // JSX quotes - use double quotes in JSX for distinction from JS
  jsxSingleQuote: false,

  // Prose wrap - preserve for documentation consistency
  proseWrap: "preserve",

  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: "css",

  // Vue indentation
  vueIndentScriptAndStyle: false,

  // Embedded language formatting
  embeddedLanguageFormatting: "auto",

  // End of line - use LF for cross-platform consistency
  endOfLine: "lf",

  // Insert pragma
  insertPragma: false,

  // Require pragma
  requirePragma: false,

  // File-specific overrides for different environments
  overrides: [
    {
      files: ["*.json", "*.jsonc"],
      options: {
        printWidth: 100,
        tabWidth: 2,
      },
    },
    {
      files: ["*.md", "*.mdx"],
      options: {
        printWidth: 80,
        proseWrap: "always",
        singleQuote: false,
      },
    },
    {
      files: ["*.yaml", "*.yml"],
      options: {
        printWidth: 100,
        singleQuote: true,
      },
    },
    {
      files: ["*.css", "*.scss", "*.less"],
      options: {
        printWidth: 100,
        singleQuote: true,
      },
    },
    {
      files: ["*.svg"],
      options: {
        parser: "html",
        htmlWhitespaceSensitivity: "ignore",
      },
    },
  ],
};
