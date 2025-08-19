import { StorageClient } from './types';

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
}

// Storage factory with configurable client
export class StorageFactory {
  private static instance: StorageClient | null = StorageFactory.createWebStorageClient();
  public static getItem: (name: string) => Promise<any> = async (name: string) => {
    return this.instance?.getItem(name);
  };
  public static setItem: (name: string, value: any) => Promise<void> = async (name: string, value: any) => {
    return this.instance?.setItem(name, value);
  };
  public static removeItem: (name: string) => Promise<void> = async (name: string) => {
    return this.instance?.removeItem(name);
  };

  static setClient(client: StorageClient): void {
    this.instance = createJSONStorage(() => client)!;
    console.log('Storage client set:', this.instance);
  }

  static getClient(): StorageClient | null {
    if (!this.instance) {
      // Fallback to web storage for web environments
      this.instance = this.createWebStorageClient();
    }
    return this.instance;
  }

  static getStorageClient(): StorageClient {
    return {
      getItem: this.getItem,
      setItem: this.setItem,
      removeItem: this.removeItem,
    };
  }

  static createWebStorageClient(): StorageClient | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return createJSONStorage(() => new WebStorage())!;
    }
    return null;
  }
}

// JSON Storage wrapper function
function createJSONStorage(
  getStorage: () => StorageClient | null,
  options?: {
    reviver?: (key: string, value: any) => any;
    replacer?: (key: string, value: any) => any;
  }
) {
  let storage: StorageClient | null;
  try {
    storage = getStorage();
  } catch (e) {
    return;
  }

  if (!storage) {
    return;
  }

  const persistStorage = {
    getItem: async (name: string) => {
      const parse = (str: string | null) => {
        if (str === null) {
          return null;
        }
        return JSON.parse(str, options?.reviver);
      };
      const str = await storage!.getItem(name);
      return parse(str);
    },
    setItem: async (name: string, newValue: any) => storage!.setItem(name, JSON.stringify(newValue, options?.replacer)),
    removeItem: async (name: string) => storage!.removeItem(name),
  };
  return persistStorage;
}

export type { StorageClient };
