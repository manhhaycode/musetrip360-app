/**
 * @fileoverview Museum Management Types
 *
 * Type definitions for museum management operations including museums,
 * exhibitions, and devices.
 */
import { Pagination } from '@musetrip360/query-foundation';
import { IUser } from '@musetrip360/user-management/types';

export type Event = {
  id: string;
  title: string;
  description: string;
  eventType: EventTypeEnum;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  location: string;
  capacity: number;
  availableSlots: number;
  bookingDeadline: string; // ISO date string
  price: number;
  museumId: string;
  createdBy?: string;
  status: EventStatusEnum;
  metadata?: EventMetadata;
  createdByUser?: IUser;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  tourOnlines?: {
    id: string;
    name: string;
    description: string;
  }[];
  artifacts?: {
    id: string;
    name: string;
    description: string;
    historicalPeriod: string;
    imageUrl: string;
  }[];
};

export type EventMetadata = {
  images?: string[];
  price?: number;
  roomCreateType?: 'AUTO' | 'NOW' | 'NONE';
  thumbnail?: string;
  richDescription?: string;
};

export enum EventTypeEnum {
  Exhibition = 'Exhibition',
  Workshop = 'Workshop',
  Lecture = 'Lecture',
  SpecialEvent = 'SpecialEvent',
  HolidayEvent = 'HolidayEvent',
  Other = 'Other',
}

export enum EventStatusEnum {
  Draft = 'Draft',
  Pending = 'Pending',
  Published = 'Published',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
}

export type EventSearchParams = {
  museumId?: string;
  eventType?: EventTypeEnum;
  status?: EventStatusEnum;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  startBookingDeadline?: string; // ISO date string
  endBookingDeadline?: string; // ISO date string
} & Pagination;

export type EventCreateDto = {
  museumId: string;
  title: string;
  description: string;
  eventType: EventTypeEnum;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  price: number;
  availableSlots: number;
  bookingDeadline: string;
  metadata?: EventMetadata;
};

export type EventUpdateDto = {
  title?: string;
  description?: string;
  eventType?: EventTypeEnum;
  startTime?: string;
  endTime?: string;
  location?: string;
  capacity?: number;
  availableSlots?: number;
  bookingDeadline?: string;
  metadata?: EventMetadata;
  status?: EventStatusEnum;
};

export type EventRoom = {
  id: string;
  name: string;
  description: string;
  status: string;
  eventId: string;
};

export type EventRoomCreateDto = {
  name: string;
  description?: string;
  status?: string;
};

// Room types based on swagger API
export enum RoomStatusEnum {
  Active = 'Active',
  Inactive = 'Inactive',
  PreMeeting = 'PreMeeting',
}

export type Room = {
  id: string;
  name: string;
  description?: string;
  status: RoomStatusEnum;
  eventId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type RoomCreateDto = {
  name: string;
  description?: string;
  status?: RoomStatusEnum;
};

export type RoomUpdateDto = {
  name?: string;
  description?: string;
  status?: RoomStatusEnum;
};

export type RoomUpdateMetadataDto = {
  metadata?: Record<string, any>;
};

export type EventParticipant = {
  id: string;
  eventId: string;
  userId: string;
  joinedAt: string; // ISO date string
  role: ParticipantRoleEnum;
  status: string;
  user?: IUser;
  event?: Event;
};

export enum ParticipantRoleEnum {
  Attendee = 'Attendee',
  Organizer = 'Organizer',
  TourGuide = 'TourGuide',
  Guest = 'Guest',
}
