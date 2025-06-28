# @musetrip360/query-foundation

A comprehensive React Query foundation with API client setup, caching strategies, and offline functionality for the MuseTrip360 museum platform.

## Features

- 🚀 **Enhanced TanStack Query** - Extended hooks with custom configuration
- 🔄 **HTTP Client** - Axios-based client with automatic retries and token refresh
- 📦 **Centralized Cache Management** - Organized cache keys for consistent invalidation
- 🔄 **Offline-First** - Background sync and offline query strategies
- ⚡ **Optimistic Updates** - Automatic rollback on errors
- 📱 **Cross-Platform** - Works with web and React Native
- 🎯 **TypeScript** - Comprehensive type definitions

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
import { initializeQueryFoundation, QueryClientProvider, queryClient } from '@musetrip360/query-foundation';

// Initialize with your API configuration
initializeQueryFoundation({
  apiBaseURL: 'https://api.musetrip360.com',
  enableOffline: true,
  enableLogging: true,
});

// Wrap your app with QueryClientProvider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
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
    invalidateQueries: [cacheKeys.events.all],
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
- `httpClient` - Default HTTP client instance

#### Query Client

- `QueryClientManager` - Query client management class
- `queryClientManager` - Default manager instance
- `queryClient` - Default query client instance

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
  customCacheConfig?: object; // Custom cache configuration
}
```

### Advanced Usage

#### Custom HTTP Client Configuration

```typescript
import { httpClient } from '@musetrip360/query-foundation';

// Update configuration at runtime
httpClient.updateConfig({
  baseURL: 'https://api.musetrip360.com',
  timeout: 30000,
  retries: 3,
});

// Set authentication token
httpClient.setAuth({
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
