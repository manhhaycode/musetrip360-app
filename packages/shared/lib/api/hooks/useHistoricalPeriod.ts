import { useQuery } from '@musetrip360/query-foundation';
import { sharedCacheKeys } from '../cache/cacheKeys';

import { getHistoricalPeriods } from '../endpoints';

export function useHistoricalPeriod() {
  return useQuery(
    sharedCacheKeys.historicalPeriod.periods(),
    () => {
      return getHistoricalPeriods();
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Disable refetching on window focus
      refetchOnReconnect: false, // Disable refetching on reconnect
      retry: 1, // Retry once on failure
      retryDelay: 1000, // Delay between retries
    }
  );
}
