// Basic types for environment variable handling
export type Framework = 'nextjs' | 'vite' | 'expo' | 'node';

export type Environment = 'development' | 'staging' | 'production' | 'testing';

export interface EnvConfig {
  framework: Framework;
  environment: Environment;
  vars: Record<string, string>;
}

export interface StorageClient {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
