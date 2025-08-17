import { StorageClient } from './types';
import { MMKV } from 'react-native-mmkv'; // Ensure this is installed in your React Native project

// Web localStorage implementation
class WebStorage implements StorageClient {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

// MMKV storage implementation for React Native
class MMKVStorage implements StorageClient {
  private mmkv: any;

  constructor() {
    try {
      this.mmkv = new MMKV();
      console.dir(this.mmkv, { depth: 10 });
    } catch (error) {
      console.error('Failed to initialize MMKV:', error);
    }
  }

  async getItem(key: string): Promise<string | null> {
    return this.mmkv.getString(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.mmkv.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.mmkv.delete(key);
  }

  async clear(): Promise<void> {
    this.mmkv.clearAll();
  }
}

// Simple platform detection
function isReactNative(): boolean {
  return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}

// Main function to get storage client
export function getStorageClient(): StorageClient {
  if (isReactNative()) {
    console.log('Using MMKV storage for React Native');
    try {
      return new MMKVStorage();
    } catch {
      throw new Error('MMKV not available in React Native environment');
    }
  }

  console.log('Using WebStorage for web');
  if (typeof window !== 'undefined' && window.localStorage) {
    return new WebStorage();
  }

  throw new Error('No storage available for this platform');
}

export type { StorageClient };
