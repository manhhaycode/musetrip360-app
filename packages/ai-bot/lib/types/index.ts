/**
 * @fileoverview Museum Management Types
 *
 * Type definitions for museum management operations including museums,
 * exhibitions, and devices.
 */

export type AIChatReq = {
  prompt: string;
  isVector?: true;
  entityType?: DataEntityType;
};

export type AIChatResp = {
  data: string;
  relatedData: {
    id: string;
    type: DataEntityType;
    name: string;
    description: string;
    similarityScore: number;
  }[];
};

export type DataEntityType = 'Artifact' | 'Event' | 'Museum' | 'TourOnline';
