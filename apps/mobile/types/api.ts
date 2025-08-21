/**
 * @fileoverview API Types for Mobile
 * Types for API responses matching visitor-portal structure
 */

// Museum Types
export interface Museum {
  id: string;
  name: string;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  latitude: number;
  longitude: number;
  createdBy: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Archived' | 'NotVerified';
  createdAt: string;
  updatedAt: string;
  metadata?: MuseumMetadata;
  categories?: Category[];
  categoryIds?: string[];
}

export interface MuseumMetadata {
  logoUrl?: string;
  coverImageUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  contentHomePage?: string;
  detail?: string;
  images?: string[];
  additionalInfo?: Record<string, any>;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Artifact Types
export interface Artifact {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  period?: string;
  material?: string;
  origin?: string;
  museumId: string;
  museum?: Pick<Museum, 'id' | 'name'>;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity?: number;
  availableSlots?: number;
  ticketPrice?: number;
  museumId: string;
  museum?: Pick<Museum, 'id' | 'name'>;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

// Tour Types
export interface Tour {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration?: number;
  price?: number;
  museumId: string;
  museum?: Pick<Museum, 'id' | 'name'>;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

// Search Types
export interface SearchResultItem {
  id: string;
  title: string;
  type: 'Museum' | 'Artifact' | 'Event' | 'TourOnline';
  thumbnail?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  location?: string;
}

export interface SearchResponse {
  data: {
    items: SearchResultItem[];
    total: number;
    page: number;
    pageSize: number;
    typeAggregations: Record<string, number>;
  };
  code: number;
  message: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Search Filters
export interface SearchFilters {
  query: string;
  type: 'All' | 'Museum' | 'Artifact' | 'Event' | 'TourOnline';
  page: number;
  pageSize: number;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  query: '',
  type: 'All',
  page: 1,
  pageSize: 12,
};
