/**
 * @fileoverview Museum Management Types
 *
 * Type definitions for museum management operations including museums,
 * exhibitions, and devices.
 */

import type { PaginatedResponse, Pagination } from '@musetrip360/query-foundation';
import { IUser } from 'node_modules/@musetrip360/auth-system/dist/types/types';

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
  resetStore: () => void;
}

export type MuseumRequest = {
  id: string;
  museumName: string;
  museumDescription: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  status: MuseumRequestStatus;
  metadata: any; // TODO: add type for this
  createdAt: string;
  updatedAt: string;
};

export type MuseumRequestCreate = Omit<MuseumRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
export enum MuseumRequestStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

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
