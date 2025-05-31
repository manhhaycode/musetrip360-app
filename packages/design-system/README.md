# MuseTrip360 Design System

A comprehensive design system for the MuseTrip360 digital museum platform, built with Tailwind CSS v4, TypeScript, and modern web standards.

## 🎨 Features

- **Tailwind CSS v4** integration with `@theme` configuration
- **Comprehensive Design Tokens** for colors, typography, spacing, borders, shadows, breakpoints, and animations
- **Theme System** with light/dark mode support and theme switching utilities
- **Class Variance Authority (CVA)** for type-safe component variants
- **CSS Helper Utilities** for dynamic styling and responsive design
- **TypeScript Support** with full type definitions
- **Museum-Specific Design** tailored for cultural heritage applications

## 📦 Installation

```bash
pnpm add @musetrip360/design-system
```

## 🚀 Usage

### Basic Setup

```tsx
// Import the CSS styles
import '@musetrip360/design-system/styles.css';

// Import design tokens and utilities
import { colors, spacing, buttonVariants, cn } from '@musetrip360/design-system';
```

### Using Design Tokens

```tsx
import { colors, spacing, typography } from '@musetrip360/design-system';

const MyComponent = () => (
  <div
    style={{
      color: colors.primary[600],
      padding: spacing[4],
      fontSize: typography.fontSize.lg,
    }}
  >
    Museum Content
  </div>
);
```

### Using CVA Variants

```tsx
import { buttonVariants, cn } from '@musetrip360/design-system';

const Button = ({ variant, size, className, ...props }) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);

// Usage
<Button variant="primary" size="lg">
  Book Tour
</Button>;
```

### Theme Management

```tsx
import { initializeTheme, setTheme, toggleTheme, getCurrentTheme } from '@musetrip360/design-system';

// Initialize theme on app startup
initializeTheme();

// Set specific theme
setTheme('dark');

// Toggle between light/dark
toggleTheme();

// Get current theme
const currentTheme = getCurrentTheme();
```

### CSS Helpers

```tsx
import { cssVar, cssClamp, responsiveFontSize, mediaQuery } from '@musetrip360/design-system';

const styles = {
  // Use CSS custom properties
  color: cssVar('color-primary-500'),

  // Responsive font sizing
  fontSize: cssClamp('1rem', '2.5vw', '2rem'),

  // Media queries
  [mediaQuery('md')]: {
    fontSize: '1.5rem',
  },
};
```

## 🎨 Design Tokens

### Colors

- **Neutral**: 50-950 scale for backgrounds and text
- **Primary**: Museum heritage blue (50-950)
- **Secondary**: Cultural purple (50-950)
- **Accent**: Artistic amber (50-950)
- **Status**: Success, warning, error, info colors

### Typography

- **Font Families**: Inter (primary), Crimson Text (museum content), JetBrains Mono
- **Font Sizes**: xs (0.75rem) to 9xl (8rem)
- **Font Weights**: thin (100) to black (900)
- **Line Heights**: tight, normal, relaxed, loose

### Spacing

- **Scale**: 0.5 (0.125rem) to 96 (24rem)
- **Semantic**: component, layout, container, form, content spacing

### Breakpoints

- **xs**: 475px
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🧩 Component Variants

### Button Variants

```tsx
// Available variants
buttonVariants({
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline',
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl',
});
```

### Card Variants

```tsx
cardVariants({
  variant: 'default' | 'elevated' | 'outlined' | 'ghost',
  padding: 'none' | 'sm' | 'base' | 'lg',
});
```

### Museum-Specific Variants

```tsx
// Artifact cards
artifactCardVariants({
  variant: 'default' | 'featured' | 'compact',
  aspect: 'square' | 'portrait' | 'landscape',
});

// Gallery layouts
galleryVariants({
  layout: 'grid' | 'masonry' | 'carousel',
  columns: 1 | 2 | 3 | 4 | 6,
});
```

## 🌙 Theme Configuration

The design system uses Tailwind CSS v4's `@theme` configuration:

```css
@theme {
  /* Color palette */
  --color-primary-500: #0ea5e9;
  --color-secondary-500: #8b5cf6;

  /* Typography */
  --font-family-primary: 'Inter', sans-serif;
  --font-size-base: 1rem;

  /* Spacing */
  --spacing-4: 1rem;

  /* And many more... */
}
```

### Dark Theme

Dark theme is automatically applied when `data-theme="dark"` is set on the document element:

```css
[data-theme='dark'] {
  --color-primary-500: #38bdf8;
  /* Dark theme overrides */
}
```

## 🛠️ Development

### Building

```bash
pnpm build
```

### Development Mode

```bash
pnpm dev
```

### Type Checking

```bash
pnpm type-check
```

## 📁 Package Structure

```
src/
├── tokens/           # Design tokens
├── themes/           # Theme configurations
├── utils/            # Utility functions
├── css/              # CSS generation utilities
├── types/            # TypeScript definitions
└── index.css         # Main CSS file with Tailwind v4 config
```

## 🎯 Museum-Specific Features

This design system is specifically tailored for museum and cultural heritage applications:

- **Cultural Color Palette**: Heritage blues, cultural purples, artistic ambers
- **Accessibility First**: WCAG 2.1 AA compliant color contrasts
- **Artifact Display**: Specialized variants for artifact cards and galleries
- **Virtual Tour Support**: Design tokens optimized for 3D/360° experiences
- **Multi-language Support**: Typography scales for various languages
- **Print Optimization**: Museum brochure and guide styling

## 🔧 Customization

### Extending Colors

```tsx
import { colors } from '@musetrip360/design-system';

const customColors = {
  ...colors,
  brand: {
    museum: '#your-color',
  },
};
```

### Custom Variants

```tsx
import { cva } from '@musetrip360/design-system';

const customVariants = cva('base-classes', {
  variants: {
    variant: {
      custom: 'custom-classes',
    },
  },
});
```

## 📚 Related Packages

- `@musetrip360/web-components` - Web UI components
- `@musetrip360/mobile-components` - React Native components
- `@musetrip360/museum-components` - Museum-specific business components

## 🤝 Contributing

Please refer to the main repository's contributing guidelines.

## 📄 License

MIT License - see the main repository for details.
