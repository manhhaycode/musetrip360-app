# @musetrip360/tsconfig

This package contains shared TypeScript configurations for the MuseTrip360 project.

## Available Configurations

- `tsconfig.base.json`: Base TypeScript configuration with sensible defaults
- `tsconfig.nextjs.json`: Configuration for Next.js projects
- `tsconfig.react.json`: Configuration for React projects

## Usage

### Base Configuration

```json
{
  "extends": "@musetrip360/tsconfig/tsconfig.base.json",
  "compilerOptions": {
    // Add your project-specific compiler options here
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Next.js Configuration

```json
{
  "extends": "@musetrip360/tsconfig/tsconfig.nextjs.json",
  "compilerOptions": {
    // Add your project-specific compiler options here
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### React Configuration

```json
{
  "extends": "@musetrip360/tsconfig/tsconfig.react.json",
  "compilerOptions": {
    // Add your project-specific compiler options here
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Customization

Each project can extend and override these base configurations to suit their specific needs.
