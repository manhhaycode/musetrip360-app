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
  relatedData: AIChatRelatedData[];
};

export type DataEntityType = 'Artifact' | 'Event' | 'Museum' | 'TourOnline';

export type AIChatRelatedData = {
  id: string;
  type: DataEntityType;
  title: string;
  description: string;
  similarityScore: number;
};
