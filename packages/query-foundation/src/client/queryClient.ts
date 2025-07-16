import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { DefaultOptions, MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { openDB, type IDBPDatabase } from 'idb';
import type {
  APIError,
  BackgroundSyncConfig,
  OfflineQueryConfig,
  QueryCacheConfig,
  SyncStatus,
} from '../types/query-types';

// Define global window object for TypeScript to using devtools
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

/**
 * IndexedDB storage implementation for query cache persistence
 */
class IndexedDBStorage {
  private dbName = 'musetrip360-query-cache';
  private storeName = 'cache';
  private version = 1;
  private db: IDBPDatabase | null = null;

  async init(): Promise<void> {
    if (typeof window === 'undefined') return; // SSR safety

    try {
      this.db = await openDB(this.dbName, this.version, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('cache')) {
            const store = db.createObjectStore('cache');
            store.createIndex('timestamp', 'timestamp');
          }
        },
      });
    } catch (error) {
      console.warn('[IndexedDB] Failed to initialize, falling back to memory storage:', error);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.db) {
      await this.init();
      if (!this.db) return null;
    }

    try {
      const result = await this.db.get(this.storeName, key);
      return result?.value || null;
    } catch (error) {
      console.warn('[IndexedDB] Failed to get item:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.db) {
      await this.init();
      if (!this.db) return;
    }

    try {
      await this.db.put(
        this.storeName,
        {
          key,
          value,
          timestamp: Date.now(),
        },
        key
      );
    } catch (error) {
      console.warn('[IndexedDB] Failed to set item:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.db) {
      await this.init();
      if (!this.db) return;
    }

    try {
      await this.db.delete(this.storeName, key);
    } catch (error) {
      console.warn('[IndexedDB] Failed to remove item:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.db) {
      await this.init();
      if (!this.db) return;
    }

    try {
      await this.db.clear(this.storeName);
    } catch (error) {
      console.warn('[IndexedDB] Failed to clear storage:', error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    if (!this.db) {
      await this.init();
      if (!this.db) return [];
    }

    try {
      return (await this.db.getAllKeys(this.storeName)) as string[];
    } catch (error) {
      console.warn('[IndexedDB] Failed to get all keys:', error);
      return [];
    }
  }

  async size(): Promise<number> {
    if (!this.db) {
      await this.init();
      if (!this.db) return 0;
    }

    try {
      return await this.db.count(this.storeName);
    } catch (error) {
      console.warn('[IndexedDB] Failed to get size:', error);
      return 0;
    }
  }

  async getStorageUsage(): Promise<number> {
    if (!this.db) return 0;

    try {
      // Estimate storage usage by getting all values and calculating their size
      const allData = await this.db.getAll(this.storeName);
      return allData.reduce((total, item) => {
        return total + new Blob([JSON.stringify(item.value)]).size;
      }, 0);
    } catch (error) {
      console.warn('[IndexedDB] Failed to calculate storage usage:', error);
      return 0;
    }
  }

  async cleanup(maxAge: number): Promise<void> {
    if (!this.db) return;

    try {
      const cutoffTime = Date.now() - maxAge;
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const index = store.index('timestamp');

      // Get all keys with timestamp older than cutoff
      const range = IDBKeyRange.upperBound(cutoffTime);
      const oldKeys = await index.getAllKeys(range);

      // Delete old entries
      await Promise.all(oldKeys.map((key) => store.delete(key)));
      await tx.done;

      console.log(`[IndexedDB] Cleaned up ${oldKeys.length} expired entries`);
    } catch (error) {
      console.warn('[IndexedDB] Failed to cleanup old entries:', error);
    }
  }
}

/**
 * Default query cache configuration
 */
const DEFAULT_QUERY_CACHE_CONFIG: QueryCacheConfig = {
  defaultStaleTime: 5 * 60 * 1000, // 5 minutes
  defaultCacheTime: 10 * 60 * 1000, // 10 minutes
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  maxQueries: 1000,
  retryDelay: () => 0,
  retryOnMount: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

/**
 * Default offline configuration
 */
const DEFAULT_OFFLINE_CONFIG: OfflineQueryConfig = {
  enabled: false,
  storageQuota: 50 * 1024 * 1024, // 50MB
  maxOfflineQueries: 100,
  syncOnReconnect: true,
  backgroundSync: true,
  conflictResolution: 'server',
};

/**
 * Default background sync configuration
 */
const DEFAULT_BACKGROUND_SYNC_CONFIG: BackgroundSyncConfig = {
  enabled: true,
  syncInterval: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  batchSize: 10,
  priorityQueries: [],
};

/**
 * Query client manager for centralized query management
 */
export class QueryClientManager {
  private queryClient: QueryClient;
  private persister: any;
  private indexedDBStorage: IndexedDBStorage;
  private isOnline: boolean = typeof window !== 'undefined' ? navigator.onLine : true;
  private syncStatus: SyncStatus = 'idle';
  private syncTimer: NodeJS.Timeout | null = null;
  private cacheConfig: QueryCacheConfig;
  private offlineConfig: OfflineQueryConfig;
  private backgroundSyncConfig: BackgroundSyncConfig;
  private onlineHandler = () => {
    this.isOnline = true;
    this.handleNetworkStatusChange(true);
  };
  private offlineHandler = () => {
    this.isOnline = false;
    this.handleNetworkStatusChange(false);
  };

  constructor(
    cacheConfig: Partial<QueryCacheConfig> = {},
    offlineConfig: Partial<OfflineQueryConfig> = {},
    backgroundSyncConfig: Partial<BackgroundSyncConfig> = {}
  ) {
    this.cacheConfig = { ...DEFAULT_QUERY_CACHE_CONFIG, ...cacheConfig };
    this.offlineConfig = { ...DEFAULT_OFFLINE_CONFIG, ...offlineConfig };
    this.backgroundSyncConfig = { ...DEFAULT_BACKGROUND_SYNC_CONFIG, ...backgroundSyncConfig };
    this.indexedDBStorage = new IndexedDBStorage();

    this.queryClient = this.createQueryClient();
    this.setupPersistence();
    this.setupNetworkListeners();
    this.startBackgroundSync();
  }

  /**
   * Convert regular Error to APIError
   */
  private toAPIError(error: Error): APIError {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: {},
      timestamp: new Date().toISOString(),
      statusCode: 0,
    };
  }

  /**
   * Create and configure QueryClient
   */
  private createQueryClient(): QueryClient {
    const defaultOptions: DefaultOptions = {
      queries: {
        staleTime: this.cacheConfig.defaultStaleTime,
        gcTime: this.cacheConfig.defaultCacheTime,
        retry: (failureCount: number, error: any) => {
          return failureCount < 3 && error.response?.data?.retry;
        },
        retryDelay: this.cacheConfig.retryDelay,
        refetchOnMount: this.cacheConfig.refetchOnMount,
        refetchOnWindowFocus: this.cacheConfig.refetchOnWindowFocus,
        refetchOnReconnect: this.cacheConfig.refetchOnReconnect,
      },
    };

    const queryCache = new QueryCache({
      onError: (error: Error, query) => {
        console.error('[Query Cache] Error:', { error, queryKey: query.queryKey });
        this.handleQueryError(this.toAPIError(error), [...query.queryKey]);
      },
      onSuccess: (data, query) => {
        console.log('[Query Cache] Success:', { queryKey: query.queryKey });
      },
    });

    const mutationCache = new MutationCache({
      onError: (error: Error, variables, context, mutation) => {
        console.error('[Mutation Cache] Error:', {
          error,
          variables,
          mutationKey: mutation.options.mutationKey,
        });
        this.handleMutationError(
          this.toAPIError(error),
          mutation.options.mutationKey ? ([...mutation.options.mutationKey] as string[]) : undefined
        );
      },
      onSuccess: (data, variables, context, mutation) => {
        console.log('[Mutation Cache] Success:', {
          mutationKey: mutation.options.mutationKey,
        });
      },
    });

    return new QueryClient({
      defaultOptions,
      queryCache,
      mutationCache,
    });
  }

  /**
   * Setup offline persistence using IndexedDB
   */
  private async setupPersistence(): Promise<void> {
    if (!this.offlineConfig.enabled || typeof window === 'undefined') return;

    try {
      // Initialize IndexedDB storage
      await this.indexedDBStorage.init();

      // Create async storage persister with IndexedDB
      this.persister = createAsyncStoragePersister({
        storage: this.indexedDBStorage,
        key: 'musetrip360-query-cache',
        serialize: JSON.stringify,
        deserialize: JSON.parse,
        throttleTime: 1000, // Throttle writes to 1 second
      });

      await persistQueryClient({
        queryClient: this.queryClient,
        persister: this.persister,
        maxAge: this.cacheConfig.maxAge,
        buster: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        hydrateOptions: undefined,
      });

      // Setup periodic cleanup
      this.setupPeriodicCleanup();

      console.log('[Query Foundation] IndexedDB persistence setup complete');
    } catch (error) {
      console.error('[Query Foundation] Persistence setup failed:', error);
      // Fallback to localStorage if IndexedDB fails
      await this.setupFallbackPersistence();
    }
  }

  /**
   * Setup fallback persistence using localStorage
   */
  private async setupFallbackPersistence(): Promise<void> {
    try {
      // Fallback to localStorage-based async persister
      const fallbackStorage = {
        async getItem(key: string): Promise<string | null> {
          return localStorage.getItem(key);
        },
        async setItem(key: string, value: string): Promise<void> {
          localStorage.setItem(key, value);
        },
        async removeItem(key: string): Promise<void> {
          localStorage.removeItem(key);
        },
        async clear(): Promise<void> {
          localStorage.clear();
        },
      };

      this.persister = createAsyncStoragePersister({
        storage: fallbackStorage,
        key: 'musetrip360-query-cache-fallback',
        serialize: JSON.stringify,
        deserialize: JSON.parse,
        throttleTime: 1000,
      });

      await persistQueryClient({
        queryClient: this.queryClient,
        persister: this.persister,
        maxAge: this.cacheConfig.maxAge,
        buster: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        hydrateOptions: undefined,
      });

      console.log('[Query Foundation] Fallback localStorage persistence setup complete');
    } catch (error) {
      console.error('[Query Foundation] Fallback persistence also failed:', error);
    }
  }

  /**
   * Setup periodic cleanup for IndexedDB
   */
  private setupPeriodicCleanup(): void {
    // Clean up expired entries every hour
    const cleanupInterval = 60 * 60 * 1000; // 1 hour

    const cleanup = async () => {
      try {
        await this.indexedDBStorage.cleanup(this.cacheConfig.maxAge);

        // Check storage usage and cleanup if over quota
        const usage = await this.indexedDBStorage.getStorageUsage();
        if (usage > this.offlineConfig.storageQuota * 0.9) {
          // 90% of quota
          console.warn('[Query Foundation] Storage quota nearly reached, performing aggressive cleanup');
          // Cleanup entries older than half the max age
          await this.indexedDBStorage.cleanup(this.cacheConfig.maxAge / 2);
        }
      } catch (error) {
        console.warn('[Query Foundation] Periodic cleanup failed:', error);
      }
    };

    // Run cleanup immediately and then periodically
    cleanup();
    setInterval(cleanup, cleanupInterval);
  }

  /**
   * Setup network status listeners
   */
  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
  }

  /**
   * Handle network status changes
   */
  private handleNetworkStatusChange(isOnline: boolean): void {
    console.log(`[Query Foundation] Network status changed: ${isOnline ? 'online' : 'offline'}`);

    if (isOnline && this.offlineConfig.syncOnReconnect) {
      this.syncOfflineData();
    }

    // Resume or pause queries based on network status
    if (isOnline) {
      this.queryClient.resumePausedMutations();
      this.queryClient.invalidateQueries();
    }
  }

  /**
   * Start background sync process
   */
  private startBackgroundSync(): void {
    if (!this.backgroundSyncConfig.enabled || typeof window === 'undefined') return;

    this.syncTimer = setInterval(() => {
      if (this.isOnline && this.syncStatus === 'idle') {
        this.backgroundSync();
      }
    }, this.backgroundSyncConfig.syncInterval);
  }

  /**
   * Perform background sync
   */
  private async backgroundSync(): Promise<void> {
    this.syncStatus = 'syncing';

    try {
      // Sync priority queries first
      if (this.backgroundSyncConfig.priorityQueries.length > 0) {
        await this.queryClient.refetchQueries({
          queryKey: this.backgroundSyncConfig.priorityQueries,
        });
      }

      // Invalidate stale queries
      await this.queryClient.invalidateQueries({
        stale: true,
        refetchType: 'none',
      });

      this.syncStatus = 'idle';
    } catch (error) {
      console.error('[Query Foundation] Background sync failed:', error);
      this.syncStatus = 'error';
    }
  }

  /**
   * Sync offline data when reconnecting
   */
  private async syncOfflineData(): Promise<void> {
    try {
      this.syncStatus = 'syncing';

      // Resume paused mutations
      await this.queryClient.resumePausedMutations();

      // Refetch queries that were active when offline
      await this.queryClient.refetchQueries({
        type: 'active',
      });

      console.log('[Query Foundation] Offline data sync complete');
      this.syncStatus = 'idle';
    } catch (error) {
      console.error('[Query Foundation] Offline data sync failed:', error);
      this.syncStatus = 'error';
    }
  }

  /**
   * Handle query errors
   */
  private handleQueryError(error: APIError, queryKey: unknown[]): void {
    // Log error for monitoring
    console.error('[Query Foundation] Query Error:', { error, queryKey });

    // Handle specific error types
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Clear auth-related queries
        // this.queryClient.removeQueries({ queryKey: ['auth'] });
        break;
      case 'FORBIDDEN':
        // Handle permission errors
        break;
      case 'NETWORK_ERROR':
        // Handle network errors
        if (!this.isOnline) {
          this.syncStatus = 'offline';
        }
        break;
      default:
        // Handle other errors
        break;
    }
  }

  /**
   * Handle mutation errors
   */
  private handleMutationError(error: APIError, mutationKey?: string[]): void {
    console.error('[Query Foundation] Mutation Error:', { error, mutationKey });

    // Queue mutation for retry if offline
    if (!this.isOnline && mutationKey) {
      // Mutations are automatically queued by TanStack Query
      console.log('[Query Foundation] Mutation queued for retry when online');
    }
  }

  /**
   * Get query client instance
   */
  public getQueryClient(): QueryClient {
    return this.queryClient;
  }

  /**
   * Get current sync status
   */
  public getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  /**
   * Get online status
   */
  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Get pending mutations count
   */
  public getPendingMutationsCount(): number {
    return this.queryClient.getMutationCache().getAll().length;
  }

  /**
   * Clear all cache
   */
  public async clearCache(): Promise<void> {
    this.queryClient.clear();
    if (this.persister) {
      try {
        await this.persister.removeClient();
      } catch (error) {
        console.warn('[Query Foundation] Failed to clear persisted cache:', error);
      }
    }

    // Also clear IndexedDB storage
    if (this.indexedDBStorage) {
      try {
        await this.indexedDBStorage.clear();
      } catch (error) {
        console.warn('[Query Foundation] Failed to clear IndexedDB storage:', error);
      }
    }
  }

  /**
   * Get storage usage information
   */
  public async getStorageInfo(): Promise<{
    usage: number;
    quota: number;
    count: number;
    usagePercentage: number;
  }> {
    const usage = await this.indexedDBStorage.getStorageUsage();
    const count = await this.indexedDBStorage.size();
    const quota = this.offlineConfig.storageQuota;
    const usagePercentage = (usage / quota) * 100;

    return {
      usage,
      quota,
      count,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
    };
  }

  /**
   * Manually trigger cache cleanup
   */
  public async performCleanup(maxAge?: number): Promise<void> {
    const age = maxAge || this.cacheConfig.maxAge;
    await this.indexedDBStorage.cleanup(age);
  }

  /**
   * Update configuration
   */
  public updateConfig(
    cacheConfig?: Partial<QueryCacheConfig>,
    offlineConfig?: Partial<OfflineQueryConfig>,
    backgroundSyncConfig?: Partial<BackgroundSyncConfig>
  ): void {
    if (cacheConfig) {
      this.cacheConfig = { ...this.cacheConfig, ...cacheConfig };
    }
    if (offlineConfig) {
      this.offlineConfig = { ...this.offlineConfig, ...offlineConfig };
    }
    if (backgroundSyncConfig) {
      this.backgroundSyncConfig = { ...this.backgroundSyncConfig, ...backgroundSyncConfig };
    }
  }

  /**
   * Cleanup resources
   */
  public async destroy(): Promise<void> {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.onlineHandler);
      window.removeEventListener('offline', this.offlineHandler);
    }

    // Clear query client
    this.queryClient.clear();

    // Clean up persister
    if (this.persister) {
      try {
        await this.persister.removeClient();
      } catch (error) {
        console.warn('[Query Foundation] Failed to clean up persister:', error);
      }
    }

    // Close IndexedDB connection
    if (this.indexedDBStorage) {
      try {
        // Close the IDB connection if available
        const db = (this.indexedDBStorage as any).db;
        if (db && db.close) {
          db.close();
        }
      } catch (error) {
        console.warn('[Query Foundation] Failed to close IndexedDB connection:', error);
      }
    }
  }
}

/**
 * Default query client manager instance (lazy-initialized)
 */
let _queryClientManager: QueryClientManager | null = null;

/**
 * Get or create the default query client manager with optional configuration
 */
export function getQueryClientManager(
  cacheConfig?: Partial<QueryCacheConfig>,
  offlineConfig?: Partial<OfflineQueryConfig>,
  backgroundSyncConfig?: Partial<BackgroundSyncConfig>
): QueryClientManager {
  if (!_queryClientManager) {
    _queryClientManager = new QueryClientManager(cacheConfig, offlineConfig, backgroundSyncConfig);
  }
  return _queryClientManager;
}

/**
 * Get or create the default query client with optional configuration
 */
export function getQueryClient(
  cacheConfig?: Partial<QueryCacheConfig>,
  offlineConfig?: Partial<OfflineQueryConfig>,
  backgroundSyncConfig?: Partial<BackgroundSyncConfig>
): QueryClient {
  const queryClient = getQueryClientManager(cacheConfig, offlineConfig, backgroundSyncConfig).getQueryClient();
  if (typeof window !== 'undefined' && !window.__TANSTACK_QUERY_CLIENT__) {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  }
  return queryClient;
}

/**
 * Reset the singleton instance (useful for testing or reconfiguration)
 */
export async function resetQueryClientManager(): Promise<void> {
  if (_queryClientManager) {
    await _queryClientManager.destroy();
    _queryClientManager = null;
  }
}
