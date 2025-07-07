import { QueryClient, DefaultOptions, QueryCache, MutationCache } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type {
  QueryCacheConfig,
  OfflineQueryConfig,
  BackgroundSyncConfig,
  SyncStatus,
  APIError,
} from '../types/query-types';

/**
 * Default query cache configuration
 */
const DEFAULT_QUERY_CACHE_CONFIG: QueryCacheConfig = {
  defaultStaleTime: 5 * 60 * 1000, // 5 minutes
  defaultCacheTime: 10 * 60 * 1000, // 10 minutes
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  maxQueries: 1000,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  retryOnMount: true,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

/**
 * Default offline configuration
 */
const DEFAULT_OFFLINE_CONFIG: OfflineQueryConfig = {
  enabled: true,
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
  private isOnline: boolean = navigator.onLine;
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
          // Don't retry for 4xx errors except specific cases
          if (error?.statusCode >= 400 && error?.statusCode < 500) {
            return error?.statusCode === 408 || error?.statusCode === 429;
          }
          return failureCount < 3;
        },
        retryDelay: this.cacheConfig.retryDelay,
        refetchOnMount: this.cacheConfig.refetchOnMount,
        refetchOnWindowFocus: this.cacheConfig.refetchOnWindowFocus,
        refetchOnReconnect: this.cacheConfig.refetchOnReconnect,
        networkMode: 'offlineFirst',
      },
      mutations: {
        retry: (failureCount: number, error: any) => {
          // Only retry mutations for network errors or 5xx
          if (error?.statusCode >= 400 && error?.statusCode < 500) {
            return false;
          }
          return failureCount < 2;
        },
        networkMode: 'offlineFirst',
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
   * Setup offline persistence
   */
  private async setupPersistence(): Promise<void> {
    if (!this.offlineConfig.enabled) return;

    try {
      // Create storage persister with IDB for better storage capacity
      this.persister = createSyncStoragePersister({
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        serialize: JSON.stringify,
        deserialize: JSON.parse,
        key: 'musetrip360-query-cache',
      });

      await persistQueryClient({
        queryClient: this.queryClient,
        persister: this.persister,
        maxAge: this.cacheConfig.maxAge,
        buster: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        hydrateOptions: undefined,
      });

      console.log('[Query Foundation] Persistence setup complete');
    } catch (error) {
      console.error('[Query Foundation] Persistence setup failed:', error);
    }
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
        this.queryClient.removeQueries({ queryKey: ['auth'] });
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
  public clearCache(): void {
    this.queryClient.clear();
    if (this.persister) {
      this.persister.removeClient();
    }
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
  public destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.onlineHandler);
      window.removeEventListener('offline', this.offlineHandler);
    }

    this.queryClient.clear();
  }
}

/**
 * Default query client manager instance
 */
export const queryClientManager = new QueryClientManager();

/**
 * Default query client instance
 */
export const queryClient = queryClientManager.getQueryClient();
