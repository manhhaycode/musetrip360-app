// Search Types
export interface SearchResultItem {
  id: string;
  title: string;
  type: 'Museum' | 'Artifact' | 'Event' | 'Article' | 'TourOnline';
  thumbnail?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  location?: string;
}

export interface SearchParams {
  Search?: string;
  Type?: 'Museum' | 'Artifact' | 'Event' | 'Article' | 'TourOnline' | 'All';
  Location?: string;
  RadiusKm?: number;
  Latitude?: number;
  Longitude?: number;
  Status?: string;
  Page?: number;
  PageSize?: number;
}

export interface SearchResponse {
  data: {
    items: SearchResultItem[];
    total: number;
    page: number;
    pageSize: number;
    typeAggregations: Record<string, number>;
    locationAggregations?: Record<string, number>;
  };
  code: number;
  message: string;
}

// Search Filters
export interface SearchFilters {
  query: string;
  type: 'All' | 'Museum' | 'Artifact' | 'Event' | 'Article' | 'TourOnline';
  page: number;
  pageSize: number;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  query: '',
  type: 'All',
  page: 1,
  pageSize: 12,
};
