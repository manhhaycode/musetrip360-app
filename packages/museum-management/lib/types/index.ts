/**
 * @fileoverview Museum Management Types
 *
 * Type definitions for museum management operations including museums,
 * exhibitions, and devices.
 */

import type { PaginatedResponse, Pagination } from '@musetrip360/query-foundation';
import { IUser } from 'node_modules/@musetrip360/auth-system/dist/types/types';
import { Category } from '@musetrip360/shared';

// Museum management types
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
  status: MuseumStatus;
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

export enum MuseumStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
  Archived = 'Archived',
  NotVerified = 'NotVerified',
}

export interface MuseumSearchParams extends Pagination {
  Search?: string;
  Status?: string;
  sortList?: string[];
}

export interface MuseumCreateDto {
  name: string;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  metadata: string;
  categoryIds?: string[];
}

export type MuseumSearchResponse = PaginatedResponse<Museum>;

export interface MuseumStore {
  userMuseums: Museum[];
  museums: Museum[];
  selectedMuseum: Museum | null;
  setMuseums: (museums: Museum[]) => void;
  setUserMuseums: (museums: Museum[]) => void;
  setSelectedMuseum: (museum: Museum | null) => void;
  hydrate: () => Promise<boolean>;
  resetStore: () => void;
}

export type MuseumRequest = {
  id: string;
  museumName: string;
  museumDescription: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  submittedAt: string;
  categories?: Category[];
  status: MuseumRequestStatus;
  createdBy: string;
  createdByUser: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    birthDate?: string;
    authType: string;
    status: string;
    lastLogin: string;
  };
  metadata: MuseumRequestMetadata;
  createdAt: string;
  updatedAt: string;
};

export type MuseumRequestMetadata = {
  documents?: string[];
  additionalInfo?: Record<string, any>;
  images?: string[];
  specialty?: string;
  openingHours?: string;
};

export type MuseumCategory = {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export type MuseumRequestCreate = Omit<
  MuseumRequest,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByUser' | 'categories' | 'submittedAt'
> & {
  categoryIds?: string[];
};
export enum MuseumRequestStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface MuseumRequestSearchParams extends Pagination {
  Search?: string;
  Status?: string;
  sortList?: string[];
}

export type MuseumRequestSearchResponse = PaginatedResponse<MuseumRequest>;

export enum PolicyTypeEnum {
  TermsOfService = 'TermsOfService',
  Visitor = 'Visitor',
  Tour = 'Tour',
  Refund = 'Refund',
}

export type MuseumPolicy = {
  id: string;
  title: string;
  content: string;
  policyType: PolicyTypeEnum;
  isActive: boolean;
  zOrder: number;
  museumId: string;
  createdBy: string;
  createdByUser: IUser;
};

export type MuseumPolicyCreate = Omit<MuseumPolicy, 'id' | 'createdByUser' | 'createdBy' | 'isActive'>;
export type MuseumPolicyUpdate = Omit<MuseumPolicy, 'createdByUser' | 'createdBy'>;

export enum ArticleStatusEnum {
  Draft = 'Draft',
  Pending = 'Pending',
  Published = 'Published',
  Archived = 'Archived',
}

export enum DataEntityType {
  Museum = 'Museum',
  Event = 'Event',
  Artifact = 'Artifact',
  TourOnline = 'TourOnline',
}

export interface ArticleMetadata {
  thumbnail?: string;
  additionalInfo?: Record<string, any>;
}

export type Article = {
  id: string;
  title: string;
  content: string;
  status: ArticleStatusEnum;
  publishedAt: string;
  museumId: string;
  createdBy: string;
  dataEntityType: DataEntityType;
  entityId: string;
  metadata?: ArticleMetadata;
  museum?: Museum;
  createdByUser?: IUser;
};

export type ArticleCreate = Omit<Article, 'id' | 'createdBy' | 'museum' | 'createdByUser'>;
export type ArticleUpdate = Partial<Omit<Article, 'createdBy' | 'museum' | 'createdByUser'>> & {
  id: string;
};

export type AnalyticsOverview = {
  totalVisitors: number;
  totalArticles: number;
  totalEvents: number;
  totalTourOnlines: number;
  averageRating: number;
  totalFeedbacks: number;
  totalRevenue: number;
  totalArtifacts: number;
};
