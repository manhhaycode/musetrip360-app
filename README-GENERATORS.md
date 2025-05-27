# MuseTrip360 Turborepo Generators

This document explains how to use the Turborepo generators to create new apps and packages in the MuseTrip360 platform.

## Overview

The generator system provides templates for:

### Apps

- **Next.js Web App** (`nextjs`) - For web applications
- **Vite React Web App** (`vite-react`) - For lightweight React web applications
- **Expo React Native Mobile App** (`expo`) - For mobile applications

### Packages

- **React Component Library** (`react-lib`) - For shared React components with Vite lib mode
- **TypeScript Library** (`ts-lib`) - For utility libraries and business logic
- **Shared Configuration** (`config`) - For shared configuration packages
- **Utilities Library** (`utils`) - For utility functions and helpers

## Usage

### Creating a New App

```bash
# Interactive prompt to create a new app
pnpm gen app

# Or using turbo directly
pnpm turbo gen app
```

You'll be prompted to:

1. Choose the app type (Next.js, Vite React, or Expo)
2. Enter the app name
3. Provide a description

The app will be created in `apps/{name}/` with the appropriate structure.

### Creating a New Package

```bash
# Interactive prompt to create a new package
pnpm gen package

# Or using turbo directly
pnpm turbo gen package
```

You'll be prompted to:

1. Choose the package type (React lib, TypeScript lib, Config, or Utils)
2. Enter the package name
3. Provide a description

The package will be created in `packages/{name}/` with the appropriate structure.

## Template Features

### Next.js App Template

- **Framework**: Next.js 14 with App Router
- **TypeScript**: Full TypeScript support
- **Styling**: Tailwind CSS ready
- **Features**:
  - SEO optimized with metadata API
  - Package transpilation configured
  - Path aliases configured (`@/*`)

### Vite React App Template

- **Framework**: Vite + React 18
- **TypeScript**: Full TypeScript support
- **Features**:
  - Fast development with Vite
  - Path aliases configured (`@/*`)
  - Optimized build configuration

### Expo React Native App Template

- **Framework**: Expo SDK 50 + React Native
- **Router**: Expo Router for navigation
- **TypeScript**: Full TypeScript support
- **Features**:
  - Cross-platform (iOS, Android, Web)
  - Path aliases configured (`@/*`)

### React Component Library Template

- **Build**: Vite in library mode
- **TypeScript**: Full type definitions generated
- **Features**:
  - ESM and CJS output formats
  - Automatic type generation with `vite-plugin-dts`
  - Peer dependencies for React
  - Example Button and Card components

### TypeScript Library Template

- **Build**: Vite in library mode
- **TypeScript**: Full type definitions generated
- **Features**:
  - ESM and CJS output formats
  - No React dependencies
  - Example utilities (date, validation, API client)

### Configuration Package Template

- **Purpose**: Shared configuration files
- **Features**:
  - ESLint configuration
  - TypeScript configuration
  - Minimal dependencies

### Utilities Library Template

- **Build**: Vite in library mode
- **TypeScript**: Full type definitions generated
- **Features**:
  - ESM and CJS output formats
  - Optimized for utility functions

## Vite Library Mode Configuration

All package templates use Vite's library mode for optimal bundling:

```typescript
// vite.config.ts for libraries
export default defineConfig({
  plugins: [
    // React plugin (for React libraries only)
    react(),
    // Generate TypeScript declarations
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'LibraryName',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      // Externalize React for React libraries
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
  },
});
```

## Package.json Structure

### Library Packages

```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"]
}
```

## Development Workflow

### After Creating an App

1. Navigate to the app directory: `cd apps/{name}`
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`

### After Creating a Package

1. Navigate to the package directory: `cd packages/{name}`
2. Install dependencies: `pnpm install`
3. Build the package: `pnpm build`
4. Watch for changes: `pnpm dev`

## Integration with Existing Apps

### Using Packages in Apps

```typescript
// In your app
import { Button, Card } from '@packages/ui-components';
import { formatDate } from '@packages/utils';
import { ApiClient } from '@packages/api-client';
```

### Package Dependencies

Make sure to add your packages to the app's `package.json`:

```json
{
  "dependencies": {
    "@packages/ui-components": "workspace:*",
    "@packages/utils": "workspace:*"
  }
}
```

## Best Practices

### Naming Conventions

- **Apps**: Use kebab-case (e.g., `visitor-portal`, `museum-dashboard`)
- **Packages**: Use kebab-case (e.g., `ui-components`, `api-client`)

### Package Structure

```
packages/your-package/
├── src/
│   ├── index.ts          # Main export file
│   ├── components/       # For React libraries
│   ├── utils/           # For utility functions
│   └── types/           # Type definitions
├── package.json
├── tsconfig.json
├── vite.config.ts       # For libraries
└── README.md
```

### App Structure

```
apps/your-app/
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # App-specific components
│   ├── lib/            # App utilities
│   └── styles/         # Styling files
├── public/             # Static assets
├── package.json
├── next.config.js      # Next.js config
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **Module not found errors**: Make sure to run `pnpm install` in the root after creating new packages
2. **Type errors**: Ensure TypeScript paths are configured correctly in `tsconfig.json`
3. **Build errors**: Check that all dependencies are properly listed in `package.json`

### Getting Help

- Check the Turborepo documentation: https://turbo.build/repo/docs
- Review existing apps and packages for examples
- Use `pnpm turbo --help` for CLI options

## Scripts Reference

```bash
# Generate new app or package
pnpm gen

# Build all packages and apps
pnpm build

# Start development for all apps
pnpm dev

# Lint all code
pnpm lint

# Type check all TypeScript
pnpm type-check

# Clean all build outputs
pnpm clean
```
