/**
 * Base Styles Utilities
 * Utilities for generating CSS reset and foundational styles
 */

/**
 * Generate CSS reset styles
 */
export function generateResetStyles(): string {
  return `
/* CSS Reset and Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: var(--font-family-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

#root,
#__next {
  isolation: isolate;
}

/* Remove default button styles */
button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

/* Remove default list styles */
ul,
ol {
  list-style: none;
  padding: 0;
}

/* Remove default link styles */
a {
  color: inherit;
  text-decoration: none;
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Smooth scrolling */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`.trim();
}

/**
 * Generate typography base styles
 */
export function generateTypographyStyles(): string {
  return `
/* Typography Base Styles */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-4);
}

h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
}

h2 {
  font-size: var(--font-size-3xl);
}

h3 {
  font-size: var(--font-size-2xl);
}

h4 {
  font-size: var(--font-size-xl);
}

h5 {
  font-size: var(--font-size-lg);
}

h6 {
  font-size: var(--font-size-base);
}

p {
  margin-bottom: var(--spacing-4);
  line-height: var(--line-height-relaxed);
}

small {
  font-size: var(--font-size-sm);
}

strong, b {
  font-weight: var(--font-weight-semibold);
}

em, i {
  font-style: italic;
}

code {
  font-family: var(--font-family-mono);
  font-size: 0.875em;
  background-color: var(--color-neutral-100);
  padding: 0.125rem 0.25rem;
  border-radius: var(--radius-sm);
}

pre {
  font-family: var(--font-family-mono);
  background-color: var(--color-neutral-100);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin-bottom: var(--spacing-4);
}

blockquote {
  border-left: 4px solid var(--color-primary-500);
  padding-left: var(--spacing-4);
  margin: var(--spacing-4) 0;
  font-style: italic;
  color: var(--color-neutral-600);
}
`.trim();
}

/**
 * Generate form base styles
 */
export function generateFormStyles(): string {
  return `
/* Form Base Styles */
input,
textarea,
select {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  transition: border-color var(--duration-fast) var(--easing-snappy);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

input:disabled,
textarea:disabled,
select:disabled {
  background-color: var(--color-neutral-100);
  color: var(--color-neutral-500);
  cursor: not-allowed;
}

label {
  display: block;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-2);
  color: var(--color-neutral-700);
}

fieldset {
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

legend {
  font-weight: var(--font-weight-semibold);
  padding: 0 var(--spacing-2);
}
`.trim();
}

/**
 * Generate utility classes
 */
export function generateUtilityStyles(): string {
  return `
/* Utility Classes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

.aspect-photo {
  aspect-ratio: 4 / 3;
}

/* Design System Specific Utilities */
.ds-transition-fast {
  transition-duration: var(--duration-fast);
  transition-timing-function: var(--easing-snappy);
}

.ds-transition-normal {
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--easing-smooth);
}

.ds-transition-slow {
  transition-duration: var(--duration-slow);
  transition-timing-function: var(--easing-smooth);
}

.ds-shadow-interactive {
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-fast) var(--easing-snappy);
}

.ds-shadow-interactive:hover {
  box-shadow: var(--shadow-md);
}

.ds-focus-ring {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.ds-focus-ring:focus-visible {
  outline: 2px solid var(--color-primary-500);
}
`.trim();
}

/**
 * Generate all base styles
 */
export function generateAllBaseStyles(): string {
  return [generateResetStyles(), generateTypographyStyles(), generateFormStyles(), generateUtilityStyles()].join(
    '\n\n'
  );
}
