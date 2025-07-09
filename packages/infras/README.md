# @musetrip360/infras

Simple environment variable handling across different frameworks (Next.js, Vite, Expo, Node.js) with global environment object support.

## Installation

```bash
pnpm add @musetrip360/infras
```

## Usage

### Initialize with your environment object (Recommended)

```typescript
import { initEnv, getEnvVar } from '@musetrip360/infras';

// Initialize with your environment object
initEnv(import.meta.env); // For Vite
// or
initEnv(process.env); // For Next.js/Node.js

// Now get environment variables with automatic prefix detection
const apiUrl = getEnvVar('API_URL'); // Automatically looks for VITE_API_URL, NEXT_PUBLIC_API_URL, etc.
const timeout = getEnvVar('TIMEOUT');
```

### Framework-specific initialization

```typescript
import { initEnv, getEnvVar } from '@musetrip360/infras';

// For Vite app
initEnv(import.meta.env, 'vite');

// For Next.js app
initEnv(process.env, 'nextjs');

// For Expo app
initEnv(process.env, 'expo');

// For Node.js app
initEnv(process.env, 'node');

// Get environment variable with appropriate prefix
const apiUrl = getEnvVar('API_URL');
```

### Auto-detect framework without initialization

```typescript
import { getEnvVar, detectFramework } from '@musetrip360/infras';

// Auto-detect current framework
const framework = detectFramework(); // 'nextjs' | 'vite' | 'expo' | 'node'

// Get environment variable with appropriate prefix (fallback to direct access)
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

### Environment management utilities

```typescript
import { initEnv, getEnvVar, resetEnv, isEnvInitialized, getEnvKeys } from '@musetrip360/infras';

// Initialize
initEnv(import.meta.env);

// Check if initialized
if (isEnvInitialized()) {
  console.log('Environment manager is ready');
}

// Get all available keys
const keys = getEnvKeys();
console.log('Available env vars:', keys);

// Reset (useful for testing)
resetEnv();
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

## How It Works

The package uses a singleton pattern to manage environment variables:

1. **Initialization**: Call `initEnv(yourEnvObject)` to provide your environment object
2. **Framework Detection**: Automatically detects your framework or uses the one you specify
3. **Prefix Logic**: Applies the correct prefix (`VITE_`, `NEXT_PUBLIC_`, `EXPO_PUBLIC_`) based on framework
4. **Fallback**: Falls back to direct environment access if not initialized

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

## Example Usage Patterns

### In a Vite React App

```typescript
// main.tsx or App.tsx
import { initEnv } from '@musetrip360/infras';

initEnv(import.meta.env);

// Later in any component
import { getEnvVar } from '@musetrip360/infras';

function ApiService() {
  const apiUrl = getEnvVar('API_URL'); // Gets VITE_API_URL
  const apiKey = getEnvVar('API_KEY'); // Gets VITE_API_KEY

  // ... rest of your code
}
```

### In a Next.js App

```typescript
// _app.tsx or layout.tsx
import { initEnv } from '@musetrip360/infras';

initEnv(process.env);

// Later in any component
import { getEnvVar } from '@musetrip360/infras';

function ApiService() {
  const apiUrl = getEnvVar('API_URL'); // Gets NEXT_PUBLIC_API_URL
  const apiKey = getEnvVar('API_KEY'); // Gets NEXT_PUBLIC_API_KEY

  // ... rest of your code
}
```

### In Testing

```typescript
import { initEnv, resetEnv, getEnvVar } from '@musetrip360/infras';

describe('Environment Tests', () => {
  beforeEach(() => {
    // Setup test environment
    initEnv(
      {
        VITE_API_URL: 'http://test-api.com',
        VITE_API_KEY: 'test-key',
      },
      'vite'
    );
  });

  afterEach(() => {
    // Clean up
    resetEnv();
  });

  it('should get environment variables', () => {
    expect(getEnvVar('API_URL')).toBe('http://test-api.com');
    expect(getEnvVar('API_KEY')).toBe('test-key');
  });
});
```

## License

MIT
