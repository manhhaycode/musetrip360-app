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
  historicalPeriod?: string;
  imageUrl?: string;
  model3DUrl?: string;
  rating?: number;
  isActive: boolean;
  museumId: string;
  museum?: {
    id: string;
    name: string;
    imageUrl?: string;
    address?: string;
  };
  createdBy: string;
  metadata?: {
    type?: string;
    ethnicGroup?: string;
    locationInMuseum?: string;
    material?: string;
    discoveryDate?: string;
    originalLocation?: string;
    discoveryLocation?: string;
    artist?: string;
    dimensions?: string;
    award?: string;
    photographer?: string;
    nationalTreasure?: boolean;
    [key: string]: any;
  };
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

// Review Types
export interface Review {
  id: string;
  targetId: string;
  type: 'Museum' | 'Artifact' | 'Event' | 'Article';
  rating: number;
  comment: string;
  createdBy: string;
  createdByUser: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    phoneNumber?: string;
    birthDate?: string;
    authType: string;
    status: string;
    lastLogin: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  data: {
    list: Review[];
    total: number;
  };
  code: number;
  message: string;
}
