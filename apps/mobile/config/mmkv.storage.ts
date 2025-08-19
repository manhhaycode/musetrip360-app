import { StorageClient } from '@musetrip360/infras';
import { MMKV } from 'react-native-mmkv'; // Import MMKV from react-native-mmkv
// MMKV storage implementation for React Native
export class MMKVStorage implements StorageClient {
  private mmkv: MMKV;

  constructor() {
    this.mmkv = new MMKV();
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
