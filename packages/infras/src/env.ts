import type { Framework, Environment, EnvConfig } from './types';

/**
 * Detect the current framework based on available globals
 */
export function detectFramework(): Framework {
  // Check for Next.js
  if (typeof process !== 'undefined' && process.env.NEXT_RUNTIME) {
    return 'nextjs';
  }

  // Check for Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return 'vite';
  }

  // Check for Expo
  if (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_PROJECT_ID) {
    return 'expo';
  }

  // Fallback to Node.js
  return 'node';
}

/**
 * Get environment variable with framework-specific prefix
 */
export function getEnvVar(key: string, framework?: Framework): string | undefined {
  const currentFramework = framework || detectFramework();

  const prefixes = {
    nextjs: 'NEXT_PUBLIC_',
    vite: 'VITE_',
    expo: 'EXPO_PUBLIC_',
    node: '',
  };

  const prefix = prefixes[currentFramework];
  const fullKey = prefix + key;

  // For client-side frameworks, also try the unprefixed version on server
  const keys = prefix ? [fullKey, key] : [key];

  for (const k of keys) {
    if (typeof process !== 'undefined' && process.env[k]) {
      return process.env[k];
    }

    // For Vite in browser
    if (currentFramework === 'vite' && typeof import.meta !== 'undefined' && import.meta.env) {
      const value = import.meta.env[k];
      if (typeof value === 'string') {
        return value;
      }
    }
  }

  return undefined;
}

/**
 * Get current environment
 */
export function getEnvironment(): Environment {
  const nodeEnv = getEnvVar('NODE_ENV')?.toLowerCase();

  switch (nodeEnv) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    case 'test':
    case 'testing':
      return 'testing';
    default:
      return 'development';
  }
}

/**
 * Get all environment variables for current framework
 */
export function getAllEnvVars(framework?: Framework): Record<string, string> {
  const currentFramework = framework || detectFramework();
  const env: Record<string, string> = {};

  if (typeof process !== 'undefined' && process.env) {
    Object.keys(process.env).forEach((key) => {
      const value = process.env[key];
      if (typeof value === 'string') {
        env[key] = value;
      }
    });
  }

  // For Vite in browser, also include import.meta.env
  if (currentFramework === 'vite' && typeof import.meta !== 'undefined' && import.meta.env) {
    Object.keys(import.meta.env).forEach((key) => {
      const value = import.meta.env[key];
      if (typeof value === 'string') {
        env[key] = value;
      }
    });
  }

  return env;
}

/**
 * Create environment configuration
 */
export function createEnvConfig(framework?: Framework): EnvConfig {
  const currentFramework = framework || detectFramework();

  return {
    framework: currentFramework,
    environment: getEnvironment(),
    vars: getAllEnvVars(currentFramework),
  };
}

/**
 * Simple configuration helper
 */
export function config(key: string, fallback?: string, framework?: Framework): string {
  return getEnvVar(key, framework) || fallback || '';
}
