# @musetrip360/query-foundation

A comprehensive React Query foundation with API client setup, caching strategies, and offline functionality for the MuseTrip360 museum platform.

## Features

- 🚀 **Enhanced TanStack Query** - Extended hooks with custom configuration
- 🔄 **HTTP Client** - Axios-based client with automatic retries and token refresh
- 📦 **Centralized Cache Management** - Organized cache keys for consistent invalidation
- 🔄 **Offline-First** - Background sync and offline query strategies with IndexedDB
- ⚡ **Optimistic Updates** - Automatic rollback on errors
- 📱 **Cross-Platform** - Works with web and React Native
- 🎯 **TypeScript** - Comprehensive type definitions
- 💾 **IndexedDB Storage** - High-capacity persistent storage with automatic cleanup
- 🔧 **Storage Management** - Quota monitoring, cleanup, and fallback strategies

## Installation

```bash
# From monorepo root
pnpm add @musetrip360/query-foundation

# Install peer dependencies if needed
pnpm add react react-dom @tanstack/react-query
```

## Quick Start

### 1. Initialize the Query Foundation

```typescript
import { initializeQueryFoundation, QueryClientProvider, getQueryClient } from '@musetrip360/query-foundation';

// Initialize with your API configuration (now async)
await initializeQueryFoundation({
  apiBaseURL: 'https://api.musetrip360.com',
  enableOffline: true,
  enableLogging: true,
  // Advanced configuration options
  cacheConfig: {
    defaultStaleTime: 10 * 60 * 1000, // 10 minutes
    defaultCacheTime: 30 * 60 * 1000, // 30 minutes
    maxQueries: 2000,
  },
  offlineConfig: {
    enabled: true,
    storageQuota: 100 * 1024 * 1024, // 100MB
    syncOnReconnect: true,
  },
  backgroundSyncConfig: {
    enabled: true,
    syncInterval: 45000, // 45 seconds
    maxRetries: 5,
  }
});

// Wrap your app with QueryClientProvider (using lazy initialization)
function App() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

## 🔧 **Lazy Initialization**

By default, instances are created lazily to avoid issues with SSR, testing, and configuration timing:

```typescript
// ✅ Recommended: Lazy initialization (SSR-safe)
import { getQueryClient, getHttpClient } from '@musetrip360/query-foundation';

const queryClient = getQueryClient(); // Created when called
const httpClient = getHttpClient(); // Created when called

// ⚠️ Legacy: Direct imports (may cause SSR issues)
import { queryClient, httpClient } from '@musetrip360/query-foundation';
// These create instances immediately on import
```

**Benefits of Lazy Initialization:**

- **SSR Safe** - No `navigator.onLine` errors in Node.js
- **Configurable** - Configure before creating instances
- **Memory Efficient** - Only create instances when needed
- **Test Friendly** - Better control in testing environments

### Passing Arguments to QueryClientManager

You can pass configuration arguments directly to the `QueryClientManager`:

```typescript
import { getQueryClient, getQueryClientManager } from '@musetrip360/query-foundation';

// Method 1: Pass config to getQueryClient
const queryClient = getQueryClient(
  // Cache config
  {
    defaultStaleTime: 10 * 60 * 1000, // 10 minutes
    defaultCacheTime: 30 * 60 * 1000, // 30 minutes
    maxQueries: 2000,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  // Offline config
  {
    enabled: true,
    storageQuota: 100 * 1024 * 1024, // 100MB
    maxOfflineQueries: 200,
    syncOnReconnect: true,
    backgroundSync: true,
  },
  // Background sync config
  {
    enabled: true,
    syncInterval: 45000, // 45 seconds
    maxRetries: 5,
    retryDelay: 10000,
    batchSize: 20,
  }
);

// Method 2: Get manager instance directly
const queryClientManager = getQueryClientManager(
  { defaultStaleTime: 5 * 60 * 1000 },
  { enabled: true, storageQuota: 50 * 1024 * 1024 },
  { enabled: true, syncInterval: 30000 }
);
const queryClient = queryClientManager.getQueryClient();

// Method 3: Create a new instance (not singleton)
import { QueryClientManager } from '@musetrip360/query-foundation';

const customManager = new QueryClientManager(
  { defaultStaleTime: 15 * 60 * 1000 },
  { enabled: false }, // Disable offline
  { enabled: false } // Disable background sync
);
```

### Reconfiguration and Reset

```typescript
import { resetQueryClientManager, getQueryClient } from '@musetrip360/query-foundation';

// Reset the singleton instance (useful for testing or reconfiguration)
await resetQueryClientManager(); // Now async

// Create new instance with different config
const newQueryClient = getQueryClient({
  defaultStaleTime: 1 * 60 * 1000, // 1 minute
});
```

## 💾 IndexedDB Storage & Management

The package now uses **IndexedDB** for persistent storage with automatic fallback to localStorage:

### Storage Features

✅ **High Capacity** - Store up to 100MB+ of data (configurable)  
✅ **Automatic Cleanup** - Periodic cleanup of expired entries  
✅ **Quota Management** - Monitor storage usage and prevent overflow  
✅ **Fallback Strategy** - Automatic fallback to localStorage if IndexedDB fails  
✅ **SSR Safe** - Graceful handling in server environments

### Storage Management APIs

```typescript
import { getQueryClientManager } from '@musetrip360/query-foundation';

const manager = getQueryClientManager();

// Get storage usage information
const storageInfo = await manager.getStorageInfo();
console.log('Storage usage:', storageInfo);
// {
//   usage: 1024000,        // Bytes used
//   quota: 52428800,       // Total quota (50MB)
//   count: 245,            // Number of cached entries
//   usagePercentage: 1.95  // Percentage of quota used
// }

// Manually trigger cleanup
await manager.performCleanup(); // Uses default maxAge
await manager.performCleanup(24 * 60 * 60 * 1000); // Custom 24h cleanup

// Clear all cached data
await manager.clearCache(); // Now async

// Cleanup resources when done
await manager.destroy(); // Now async
```

### Storage Configuration

```typescript
// Configure storage limits and behavior
const queryClient = getQueryClient(
  undefined, // cache config
  {
    enabled: true,
    storageQuota: 100 * 1024 * 1024, // 100MB quota
    maxOfflineQueries: 500, // Max number of queries to cache
    syncOnReconnect: true,
    backgroundSync: true,
    conflictResolution: 'server', // 'client' | 'server' | 'manual'
  }
);
```

### Automatic Storage Management

The system automatically:

- **Cleans up expired entries** every hour
- **Monitors storage quota** and performs aggressive cleanup at 90% usage
- **Handles storage errors** gracefully with fallbacks
- **Optimizes storage** with efficient IndexedDB usage patterns

### Storage Events & Monitoring

```typescript
// Monitor storage usage in your app
const checkStorageHealth = async () => {
  const manager = getQueryClientManager();
  const info = await manager.getStorageInfo();

  if (info.usagePercentage > 80) {
    console.warn('Storage usage high:', info.usagePercentage + '%');
    // Optionally trigger cleanup
    await manager.performCleanup();
  }
};

// Run periodic health checks
setInterval(checkStorageHealth, 5 * 60 * 1000); // Every 5 minutes
```

### 2. Use Enhanced Query Hooks

```typescript
import { useGetQuery, cacheKeys } from '@musetrip360/query-foundation';

function MuseumList() {
  const { data, isLoading, error } = useGetQuery(
    '/museums',
    cacheKeys.museums.list(),
    { cache: true, offline: true }
  );

  if (isLoading) return <div>Loading museums...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(museum => (
        <div key={museum.id}>{museum.name}</div>
      ))}
    </div>
  );
}
```

### 3. Use Enhanced Mutation Hooks

```typescript
import { usePostMutation, cacheKeys } from '@musetrip360/query-foundation';

function CreateEventForm() {
  const createEvent = usePostMutation('/events', undefined, {
    removeQueries: [cacheKeys.events.all],
    optimisticUpdate: true,
    onSuccess: (data) => {
      console.log('Event created:', data);
    },
  });

  const handleSubmit = (eventData) => {
    createEvent.mutate(eventData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={createEvent.isPending}>
        {createEvent.isPending ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}
```

## API Reference

### Core Exports

#### HTTP Client

- `HTTPClient` - Main HTTP client class
- `httpClient` - Default HTTP client instance (⚠️ deprecated - use `getHttpClient()`)
- `getHttpClient()` - **Recommended**: Lazy-initialized HTTP client

#### Query Client

- `QueryClientManager` - Query client management class
- `queryClientManager` - Default manager instance (⚠️ deprecated - use `getQueryClientManager()`)
- `queryClient` - Default query client instance (⚠️ deprecated - use `getQueryClient()`)
- `getQueryClientManager(cacheConfig?, offlineConfig?, backgroundSyncConfig?)` - **Recommended**: Configurable lazy-initialized query client manager
- `getQueryClient(cacheConfig?, offlineConfig?, backgroundSyncConfig?)` - **Recommended**: Configurable lazy-initialized query client
- `resetQueryClientManager()` - Reset singleton instance for reconfiguration

#### Enhanced Hooks

**Query Hooks:**

- `useQuery` - Enhanced useQuery with custom options
- `useGetQuery` - HTTP GET requests
- `usePaginatedQuery` - Paginated data fetching
- `useSearchQuery` - Search with debouncing
- `useDependentQuery` - Conditional queries
- `useBackgroundQuery` - Background data fetching
- `useOfflineQuery` - Offline-first queries

**Mutation Hooks:**

- `useMutation` - Enhanced useMutation with custom options
- `usePostMutation` - HTTP POST requests
- `usePutMutation` - HTTP PUT requests
- `usePatchMutation` - HTTP PATCH requests
- `useDeleteMutation` - HTTP DELETE requests
- `useUploadMutation` - File uploads with progress
- `useOptimisticMutation` - Optimistic updates with rollback
- `useBulkMutation` - Bulk operations with progress
- `useRetryMutation` - Retry with exponential backoff

#### Cache Management

- `cacheKeys` - Centralized cache key instances
- `getAllCacheKeys()` - Get all cache keys for invalidation
- `createCacheKey()` - Create custom cache keys

### Cache Key Factories

```typescript
import { cacheKeys } from '@musetrip360/query-foundation';

// Museum cache keys
cacheKeys.museums.all; // ['museums']
cacheKeys.museums.list(); // ['museums', 'lists']
cacheKeys.museums.detail(1); // ['museums', 'details', 1]
cacheKeys.museums.featured(); // ['museums', 'featured']
cacheKeys.museums.nearby(40.7, -74.0); // ['museums', 'nearby', {...}]

// Event cache keys
cacheKeys.events.all; // ['events']
cacheKeys.events.upcoming(); // ['events', 'upcoming']
cacheKeys.events.byMuseum(1); // ['events', 'museum', 1]

// User cache keys
cacheKeys.users.profile(); // ['users', 'profile']
cacheKeys.users.favorites(); // ['users', 'favorites']
cacheKeys.users.bookings(); // ['users', 'bookings']

// And more for artifacts, virtual tours, search, etc.
```

### Configuration Options

```typescript
interface QueryFoundationConfig {
  apiBaseURL?: string; // API base URL
  enableOffline?: boolean; // Enable offline functionality
  enableLogging?: boolean; // Enable debug logging
  cacheConfig?: Partial<QueryCacheConfig>; // Query cache configuration
  offlineConfig?: Partial<OfflineQueryConfig>; // Offline functionality config
  backgroundSyncConfig?: Partial<BackgroundSyncConfig>; // Background sync config
}

// Available configuration interfaces:

interface QueryCacheConfig {
  defaultStaleTime: number; // How long data is considered fresh (ms)
  defaultCacheTime: number; // How long inactive data stays in cache (ms)
  maxAge: number; // Maximum age for persisted cache (ms)
  maxQueries: number; // Maximum number of queries to cache
  retryDelay: (attemptIndex: number) => number; // Retry delay function
  retryOnMount: boolean; // Retry failed queries on component mount
  refetchOnMount: boolean; // Refetch on component mount
  refetchOnWindowFocus: boolean; // Refetch when window gains focus
  refetchOnReconnect: boolean; // Refetch when network reconnects
}

interface OfflineQueryConfig {
  enabled: boolean; // Enable offline functionality
  storageQuota: number; // Storage quota in bytes
  maxOfflineQueries: number; // Maximum offline queries to store
  syncOnReconnect: boolean; // Sync when network reconnects
  backgroundSync: boolean; // Enable background synchronization
  conflictResolution: 'client' | 'server' | 'manual'; // Conflict resolution strategy
}

interface BackgroundSyncConfig {
  enabled: boolean; // Enable background sync
  syncInterval: number; // Sync interval in milliseconds
  maxRetries: number; // Maximum retry attempts
  retryDelay: number; // Delay between retries (ms)
  batchSize: number; // Number of queries to sync in each batch
  priorityQueries: string[][]; // High-priority queries to sync first
}
```

### Advanced Usage

#### Custom HTTP Client Configuration

```typescript
import { getHttpClient } from '@musetrip360/query-foundation';

// Update configuration at runtime (lazy initialization)
getHttpClient().updateConfig({
  baseURL: 'https://api.musetrip360.com',
  timeout: 30000,
  retries: 3,
});

// Set authentication token
getHttpClient().setAuth({
  accessToken: 'your-access-token',
  refreshToken: 'your-refresh-token',
  expiresAt: Date.now() + 3600000,
  tokenType: 'Bearer',
});
```

#### Optimistic Updates

```typescript
import { useOptimisticMutation, cacheKeys } from '@musetrip360/query-foundation';

const addToFavorites = useOptimisticMutation(
  (museumId) => httpClient.post(`/favorites/${museumId}`),
  cacheKeys.users.favorites(),
  (oldFavorites, museumId) => [...(oldFavorites || []), { museumId }]
);
```

#### Background Sync

```typescript
import { useBackgroundQuery, cacheKeys } from '@musetrip360/query-foundation';

// Fetches data in background without affecting loading states
const { data } = useBackgroundQuery('/notifications', cacheKeys.users.notifications());
```

## TypeScript Support

This package includes comprehensive TypeScript definitions:

```typescript
import type {
  APIResponse,
  PaginatedResponse,
  APIError,
  CustomQueryOptions,
  CustomMutationOptions,
} from '@musetrip360/query-foundation';

// Use types in your components
interface Museum {
  id: number;
  name: string;
  location: string;
}

const { data } = useGetQuery<APIResponse<Museum[]>>('/museums', cacheKeys.museums.list());
```

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Watch mode for development
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Contributing

This package is part of the MuseTrip360 monorepo. Please follow the established patterns and conventions.

### Guidelines

1. Use the centralized cache keys for consistency
2. Implement proper error handling
3. Add TypeScript types for all new features
4. Include tests for new functionality
5. Update documentation for API changes

## License

MIT
