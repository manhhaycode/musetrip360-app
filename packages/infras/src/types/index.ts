// Basic types for environment variable handling
export type Framework = 'nextjs' | 'vite' | 'expo' | 'node';

export type Environment = 'development' | 'staging' | 'production' | 'testing';

export interface EnvConfig {
  framework: Framework;
  environment: Environment;
  vars: Record<string, string>;
}
