import type { Framework, Environment } from './types';

/**
 * Singleton class to manage environment variables with framework-specific prefixes
 */
class EnvManager {
  private static instance: EnvManager | null = null;
  private envObject: NodeJS.ProcessEnv | ImportMetaEnv | null = null;
  private framework: Framework | null = null;

  private constructor() {}

  static getInstance(): EnvManager {
    if (!EnvManager.instance) {
      EnvManager.instance = new EnvManager();
    }
    return EnvManager.instance;
  }

  /**
   * Initialize the environment manager with an environment object
   */
  init(envObject: Record<string, any>, framework: Framework): void {
    this.envObject = envObject;
    this.framework = framework;
  }

  /**
   * Get environment variable with framework-specific prefix
   */
  get(key: string, framework?: Framework): string | undefined {
    const currentFramework = framework || this.framework;

    const prefixes = {
      nextjs: 'NEXT_PUBLIC_',
      vite: 'VITE_',
      expo: 'EXPO_PUBLIC_',
      node: '',
    };

    const prefix = prefixes[currentFramework!];
    const fullKey = prefix + key;

    // Priority: prefixed key first, then unprefixed key
    const keys = prefix ? [fullKey, key] : [key];

    // Use stored env object if available
    if (this.envObject) {
      for (const k of keys) {
        if (this.envObject[k] !== undefined) {
          return String(this.envObject[k]);
        }
      }
      return undefined;
    }

    // Fall back to direct access
    return this.getFromDirectAccess(keys, currentFramework!);
  }

  /**
   * Check if the environment manager is initialized
   */
  isInitialized(): boolean {
    return this.envObject !== null;
  }

  /**
   * Reset the environment manager (useful for testing)
   */
  reset(): void {
    this.envObject = null;
    this.framework = null;
  }

  /**
   * Get the current framework
   */
  getFramework(): Framework | null {
    return this.framework;
  }

  /**
   * Get all available environment variable keys
   */
  getKeys(): string[] {
    if (this.envObject) {
      return Object.keys(this.envObject);
    }

    // Fall back to direct access
    const env = this.getAllEnvVarsFromDirectAccess();
    return Object.keys(env);
  }

  /**
   * Get raw environment object
   */
  getRawEnv(): Record<string, any> | null {
    return this.envObject;
  }

  /**
   * Get environment variable from direct access (fallback)
   */
  private getFromDirectAccess(keys: string[], framework: Framework): string | undefined {
    for (const k of keys) {
      if (typeof process !== 'undefined' && process.env[k]) {
        return process.env[k];
      }

      // For Vite in browser
      if (framework === 'vite' && typeof import.meta !== 'undefined' && import.meta.env) {
        const value = import.meta.env[k];
        if (typeof value === 'string') {
          return value;
        }
      }
    }

    return undefined;
  }

  /**
   * Get all environment variables from direct access (fallback)
   */
  getAllEnvVarsFromDirectAccess(): Record<string, string> {
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
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      Object.keys(import.meta.env).forEach((key) => {
        const value = import.meta.env[key];
        if (typeof value === 'string') {
          env[key] = value;
        }
      });
    }

    return env;
  }
}

// Public API functions that use the singleton

/**
 * Initialize environment manager with an environment object
 */
export function initEnv(envObject: Record<string, any>, framework: Framework): void {
  EnvManager.getInstance().init(envObject, framework);
}

/**
 * Get environment variable with framework-specific prefix
 */
export function getEnvVar(key: string, framework?: Framework): string | undefined {
  return EnvManager.getInstance().get(key, framework);
}

/**
 * Reset environment manager (useful for testing)
 */
export function resetEnv(): void {
  EnvManager.getInstance().reset();
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
export function getAllEnvVars(): Record<string, string> {
  const manager = EnvManager.getInstance();

  if (manager.isInitialized()) {
    const rawEnv = manager.getRawEnv();
    const result: Record<string, string> = {};

    if (rawEnv) {
      Object.keys(rawEnv).forEach((key) => {
        const value = rawEnv[key];
        if (typeof value === 'string') {
          result[key] = value;
        }
      });
    }

    return result;
  }

  // Fall back to direct access
  return manager.getAllEnvVarsFromDirectAccess();
}

/**
 * Simple configuration helper
 */
export function config(key: string, fallback?: string, framework?: Framework): string {
  return getEnvVar(key, framework) || fallback || '';
}

/**
 * Check if environment manager is initialized
 */
export function isEnvInitialized(): boolean {
  return EnvManager.getInstance().isInitialized();
}

/**
 * Get available environment variable keys
 */
export function getEnvKeys(): string[] {
  return EnvManager.getInstance().getKeys();
}
