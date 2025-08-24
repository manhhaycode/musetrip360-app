/**
 * @fileoverview Museum Management Types
 *
 * Type definitions for museum management operations including museums,
 * exhibitions, and devices.
 */
import { IUser } from '@musetrip360/user-management/types';

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

export type Conversation = {
  id: string;
  name?: string;
  isBot: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  createdUser: IUser;
};

export type Message = {
  id: string;
  createdAt: Date;
  isBot: boolean;
  content: string;
  conversationId: string;
  createdBy: string;
  createdUser: IUser;
  metadata?: MessageMetadata;
};

export type MessageMetadata = {
  relatedData: AIChatRelatedData[];
};

export type CreateConversation = {
  name?: string;
  metadata?: any;
  isBot: boolean;
};

export type UpdateConversation = {
  id: string;
  name?: string;
  metadata?: any;
  isBot: boolean;
};

export type CreateMessage = {
  content: string;
  conversationId: string;
  isBot: boolean;
};
