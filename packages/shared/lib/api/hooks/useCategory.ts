import { useQuery } from '@musetrip360/query-foundation';
import { sharedCacheKeys } from '../cache/cacheKeys';
import { getCategories } from '../endpoints';

export function useCategory() {
  return useQuery(
    sharedCacheKeys.category.categories(),
    () => {
      return getCategories();
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}
