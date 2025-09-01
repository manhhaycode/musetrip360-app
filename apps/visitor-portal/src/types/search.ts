/**
 * @fileoverview Search API Types
 * Types for unified search functionality across different entity types
 */

/**
 * Unified search result item from API
 */
export interface SearchResultItem {
  id: string;
  title: string;
  type: 'Museum' | 'Artifact' | 'Event' | 'TourOnline';
  thumbnail?: string;
  description: string;
  latitude: number;
  longitude: number;
  location?: string; // Address field - may not be available in search response
}

/**
 * Search API request parameters
 */
export interface SearchParams {
  Search?: string;
  Type?: 'Museum' | 'Artifact' | 'Event' | 'TourOnline' | 'All';
  Location?: string;
  RadiusKm?: number;
  Latitude?: number;
  Longitude?: number;
  Status?: string;
  Page?: number;
  PageSize?: number;
}

/**
 * Search API response structure
 */
export interface SearchResponse {
  data: {
    items: SearchResultItem[];
    total: number;
    page: number;
    pageSize: number;
    typeAggregations: Record<string, number>;
    locationAggregations: Record<string, number>;
  };
  code: number;
  message: string;
}

/**
 * Search filters state
 */
export interface SearchFilters {
  query: string;
  type: 'All' | 'Museum' | 'Artifact' | 'Event' | 'TourOnline';
  page: number;
  pageSize: number;
}

/**
 * Default search filters
 */
export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  query: '',
  type: 'All',
  page: 1,
  pageSize: 12,
};

/**
 * Status options for filtering
 */
export const STATUS_OPTIONS = [
  { value: 'Active', label: 'Hoạt động' },
  { value: 'Inactive', label: 'Không hoạt động' },
  { value: 'Pending', label: 'Chờ duyệt' },
  { value: 'All', label: 'Tất cả' },
] as const;

/**
 * Type options for filtering
 */
export const TYPE_OPTIONS = [
  { value: 'All', label: 'Tất cả', icon: 'search' },
  { value: 'Museum', label: 'Bảo tàng', icon: 'building-2' },
  { value: 'Artifact', label: 'Hiện vật', icon: 'palette' },
  { value: 'Event', label: 'Sự kiện', icon: 'calendar' },
  { value: 'TourOnline', label: 'Tour ảo', icon: 'globe' },
] as const;
