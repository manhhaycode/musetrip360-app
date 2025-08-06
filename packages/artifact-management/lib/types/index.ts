/**
 * @fileoverview Museum Management Types
 *
 * Type definitions for museum management operations including museums,
 * exhibitions, and devices.
 */

import { Pagination } from '@musetrip360/query-foundation';

// Museum management types
export interface Artifact {
  id: string;
  name: string;
  description: string;
  historicalPeriod: string;
  imageUrl: string;
  model3DUrl: string;
  rating: number;
  isActive: boolean;
  museumId: string;
  createdBy: string;
  metadata: ArtifactMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface ArtifactMetadata {
  type?: string;
  material?: string;
  discoveryLocation?: string;
  images?: string[];
}

/**
 * Artifact request types based on swagger.json
 */
export interface ArtifactCreateDto {
  name: string;
  description: string;
  historicalPeriod: string;
  imageUrl: string;
  model3DUrl: string;
  metadata?: any;
}

export interface ArtifactUpdateDto {
  name?: string;
  description?: string;
  historicalPeriod?: string;
  imageUrl?: string;
  model3DUrl?: string;
  metadata?: any;
}

/**
 * Query parameters for artifact list endpoints
 */
export type ArtifactListParams = Pagination;

export interface ArtifactMuseumSearchParams extends Pagination {
  museumId: string;
  HistoricalPeriods?: string[];
}
