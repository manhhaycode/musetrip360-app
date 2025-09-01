'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchPagination } from '@/components/search/SearchPagination';
import { DEFAULT_SEARCH_FILTERS, type SearchFilters as SearchFiltersType } from '../../../types/search';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [paginationData, setPaginationData] = useState({
    totalItems: 0,
    currentPageItems: 0,
    hasResults: false,
  });
  const [filters, setFilters] = useState<SearchFiltersType>(() => {
    // Initialize filters from URL params
    const initialFilters = { ...DEFAULT_SEARCH_FILTERS };

    if (searchParams.get('q')) {
      initialFilters.query = searchParams.get('q') || '';
    }
    if (searchParams.get('type')) {
      initialFilters.type = (searchParams.get('type') as any) || 'All';
    }
    if (searchParams.get('page')) {
      initialFilters.page = parseInt(searchParams.get('page') || '1', 10);
    }
    if (searchParams.get('pageSize')) {
      initialFilters.pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
    }

    return initialFilters;
  });

  // Use real data from SearchResults component
  const totalItems = paginationData.totalItems;
  const totalPages = Math.ceil(totalItems / filters.pageSize);

  // Handle data loaded from SearchResults - use useCallback to prevent infinite re-renders
  const handleDataLoaded = useCallback(
    (data: { totalItems: number; currentPageItems: number; hasResults: boolean }) => {
      setPaginationData(data);
    },
    []
  );

  // Handle filter changes
  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.type !== 'All') params.set('type', newFilters.type);
    if (newFilters.page > 1) params.set('page', newFilters.page.toString());
    if (newFilters.pageSize !== 12) params.set('pageSize', newFilters.pageSize.toString());

    // Update URL without reload
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    handleFiltersChange({ ...filters, page });
  };

  // Simple debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: number;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((newFilters: SearchFiltersType) => {
        handleFiltersChange(newFilters);
      }, 500),
    []
  );

  // Handle search input changes with debouncing
  const handleSearchFiltersChange = (newFilters: SearchFiltersType) => {
    // Immediate update for non-query changes
    if (newFilters.query === filters.query) {
      handleFiltersChange(newFilters);
    } else {
      // Debounced update for query changes
      setFilters(newFilters); // Update local state immediately
      debouncedSearch(newFilters);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <SearchHeader
        filters={filters}
        onFiltersChange={handleSearchFiltersChange}
        resultCount={paginationData.totalItems}
        isLoading={false}
        typeAggregations={{}}
      />

      {/* Main Content */}
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Filters */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFiltersChange}
                typeAggregations={{}}
                isLoading={false}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="space-y-8">
              {/* Search Results */}
              <SearchResults
                searchQuery={filters.query}
                selectedType={filters.type}
                page={filters.page}
                pageSize={filters.pageSize}
                isLoading={false}
                error={null}
                onDataLoaded={handleDataLoaded}
              />

              {/* Pagination */}
              {totalItems > 0 && (
                <SearchPagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={filters.pageSize}
                  onPageChange={handlePageChange}
                  isLoading={false}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal - TODO: Implement if needed */}
      {/* <MobileFiltersModal 
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFiltersChange}
        typeAggregations={searchResponse?.data?.typeAggregations}
        isLoading={isLoading}
      /> */}
    </div>
  );
}
