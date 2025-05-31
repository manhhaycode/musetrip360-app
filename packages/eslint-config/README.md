# @musetrip360/eslint-config

This package contains shared ESLint configurations for the MuseTrip360 project.

## Available Configurations

- `eslint-config-nextjs.js`: Configuration for Next.js projects
- `eslint-config-react.js`: Configuration for React projects

## Usage

### Next.js Configuration

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import nextConfig from "@musetrip360/eslint-config/eslint-config-nextjs";

export default defineConfig([
  nextConfig,
  {
    ignores: ["dist/*"],
  },
]);
```

### React Configuration

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import reactConfig from "@musetrip360/eslint-config/eslint-config-react";

export default defineConfig([
  reactConfig,
  {
    ignores: ["dist/*"],
  },
]);
```
