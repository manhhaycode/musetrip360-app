/**
 * @fileoverview Museum Management Types
 *
 * Type definitions for museum management operations including museums,
 * exhibitions, and devices.
 */

import type { PaginatedResponse, Pagination } from '@musetrip360/query-foundation';

// Museum management types
export interface Museum {
  id: string;
  name: string;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  createdBy: string;
  status: MuseumStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: MuseumMetadata;
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
  additionalInfo?: Record<string, any>;
}

export enum MuseumStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
  Archived = 'Archived',
}

export interface MuseumSearchParams extends Pagination {
  sortBy: 'name' | 'rating' | 'createdAt';
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
}

export type MuseumRequest = {
  id: string;
  museumName: string;
  museumDescription: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  metadata: any; // TODO: add type for this
  createdAt: string;
  updatedAt: string;
};

export type MuseumRequestCreate = Omit<MuseumRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
