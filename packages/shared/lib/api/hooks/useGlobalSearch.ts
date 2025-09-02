import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { GlobalSearchParams, getSearchSuggestions, globalSearch } from '../endpoints/globalSearch';

/**
 * Hook for global search with full results
 */
export function useGlobalSearch(params: GlobalSearchParams, enabled: boolean = true) {
  return useQuery({
    queryKey: ['globalSearch', params],
    queryFn: () => globalSearch(params),
    enabled: enabled && !!params.search && params.search.length >= 2,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for search autocomplete suggestions with debouncing
 */
export function useSearchSuggestions(searchTerm: string, delay: number = 300) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return useQuery({
    queryKey: ['searchSuggestions', debouncedSearchTerm],
    queryFn: () => getSearchSuggestions(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm && debouncedSearchTerm.length >= 2,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on failure for autocomplete
  });
}
