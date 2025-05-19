# @musetrip360/ui

This package provides theming and styling utilities for MuseTrip360 applications. It includes a custom Mantine theme, CSS variable resolver, and pre-styled components designed for consistency across the MuseTrip360 ecosystem.

## Installation

To use this package in your project, add it to your dependencies:

```bash
# Using npm
npm install @musetrip360/ui

# Using yarn
yarn add @musetrip360/ui

# Using pnpm
pnpm add @musetrip360/ui
```

### Peer Dependencies

This package requires the following peer dependencies:

- `@mantine/core`: ^8.0.1
- `@mantine/hooks`: ^8.0.1
- `tailwindcss`: ^4.1.5
- `postcss`: ^8.5.3

Make sure to install these dependencies in your project as well if they're not already included.

## Usage

### Importing the Theme and CSS Variables Resolver

The package exports a custom Mantine theme and CSS variables resolver that you can use to set up your application:

```tsx
import { MantineProvider } from '@mantine/core';
import { theme, cssVariablesResolver } from '@musetrip360/ui';

function App({ children }) {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
      {children}
    </MantineProvider>
  );
}
```

### Importing Styles

Import the CSS styles in your main CSS file:

```css
@import '@musetrip360/ui/main.css';
```

### Next.js Example

Here's a complete example for a Next.js application (in a layout.tsx file):

```tsx
'use client';
import { MantineProvider } from '@mantine/core';
import { theme, cssVariablesResolver } from '@musetrip360/ui';
import './globals.css'; // This file should import '@musetrip360/ui/main.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
```

### PostCSS Configuration

For proper integration with Tailwind CSS, make sure you have the correct PostCSS configuration:

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

## Features

- **Consistent Theme**: Pre-configured theme compatible with Mantine v8
- **CSS Variables**: Custom CSS variable resolver to ensure consistent styling
- **Tailwind Integration**: Works seamlessly with Tailwind CSS v4
- **Component Styling**: Includes styling for common Mantine components

## Theme Customization

The theme includes several color palettes based on the Tailwind CSS color scheme, including:

- Primary color (orange-based)
- Secondary colors (stone-based)
- Error, success, info, and warning colors
- Complete set of Tailwind CSS colors (slate, gray, zinc, etc.)

## Support

For issues, feature requests, or questions, please contact the MuseTrip360 development team.
