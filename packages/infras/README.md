# @musetrip360/infras

Simple environment variable handling across different frameworks (Next.js, Vite, Expo, Node.js).

## Installation

```bash
pnpm add @musetrip360/infras
```

## Usage

### Auto-detect framework and get environment variables

```typescript
import { getEnvVar, detectFramework } from '@musetrip360/infras';

// Auto-detect current framework
const framework = detectFramework(); // 'nextjs' | 'vite' | 'expo' | 'node'

// Get environment variable with appropriate prefix
const apiUrl = getEnvVar('API_URL'); // Automatically uses NEXT_PUBLIC_, VITE_, EXPO_PUBLIC_, or no prefix
```

### Manual framework specification

```typescript
import { getEnvVar } from '@musetrip360/infras';

// For Next.js app - looks for NEXT_PUBLIC_API_URL first, then API_URL
const apiUrl = getEnvVar('API_URL', 'nextjs');

// For Vite app - looks for VITE_API_URL first, then API_URL
const apiUrl = getEnvVar('API_URL', 'vite');

// For Expo app - looks for EXPO_PUBLIC_API_URL first, then API_URL
const apiUrl = getEnvVar('API_URL', 'expo');

// For Node.js - looks for API_URL only
const apiUrl = getEnvVar('API_URL', 'node');
```

### Quick config helper

```typescript
import { config } from '@musetrip360/infras';

// Get environment variable with fallback
const apiUrl = config('API_URL', 'http://localhost:3000');
const timeout = config('TIMEOUT', '5000');
```

### Get environment info

```typescript
import { getEnvironment, createEnvConfig } from '@musetrip360/infras';

const env = getEnvironment(); // 'development' | 'staging' | 'production' | 'testing'

const envConfig = createEnvConfig();
console.log(envConfig.framework); // Current framework
console.log(envConfig.environment); // Current environment
console.log(envConfig.vars); // All environment variables
```

## Framework Detection

The package automatically detects your framework:

- **Next.js**: Detected by `process.env.NEXT_RUNTIME`
- **Vite**: Detected by `import.meta.env`
- **Expo**: Detected by `process.env.EXPO_PUBLIC_PROJECT_ID`
- **Node.js**: Default fallback

## Environment Variable Prefixes

Each framework uses different prefixes for client-side environment variables:

- **Next.js**: `NEXT_PUBLIC_*`
- **Vite**: `VITE_*`
- **Expo**: `EXPO_PUBLIC_*`
- **Node.js**: No prefix (all variables accessible)

The package handles these prefixes automatically, so you can use the same variable names across all frameworks.

## License

MIT
