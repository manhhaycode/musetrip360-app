/**
 * @fileoverview Event Management Cache Keys
 *
 * Cache key definitions for event management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { EventSearchParams } from '@/types';
import { BaseCacheKeyFactory, QueryKey } from '@musetrip360/query-foundation';

/**
 * Event Management cache keys
 */
export class EventManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('eventManagement');
  }

  // Museum management keys
  events(): QueryKey {
    return [this.prefix, 'events'];
  }

  event(id: string): QueryKey {
    return [this.prefix, 'event', id];
  }

  eventsByMuseum(museumId: string, params: EventSearchParams): QueryKey {
    return [this.prefix, 'events', 'byMuseum', museumId, params.Page, params.PageSize, params.startDate, params.status];
  }

  eventRooms(eventId: string): QueryKey {
    return [this.prefix, 'eventRooms', eventId];
  }

  eventParticipants(eventId: string): QueryKey {
    return [this.prefix, 'eventParticipants', eventId];
  }

  userEventParticipants(userId: string): QueryKey {
    return [this.prefix, 'userEventParticipants', userId];
  }

  // EventParticipant management keys
  allEventParticipants(): QueryKey {
    return [this.prefix, 'allEventParticipants'];
  }

  eventParticipant(id: string): QueryKey {
    return [this.prefix, 'eventParticipant', id];
  }

  eventParticipantsByEvent(eventId: string): QueryKey {
    return [this.prefix, 'eventParticipants', 'byEvent', eventId];
  }

  eventParticipantsByUser(userId: string): QueryKey {
    return [this.prefix, 'eventParticipants', 'byUser', userId];
  }

  userInEvent(eventId: string, userId: string): QueryKey {
    return [this.prefix, 'userInEvent', eventId, userId];
  }

  // Room management keys
  rooms(): QueryKey {
    return [this.prefix, 'rooms'];
  }

  room(id: string): QueryKey {
    return [this.prefix, 'room', id];
  }

  roomsByEvent(eventId: string): QueryKey {
    return [this.prefix, 'rooms', 'byEvent', eventId];
  }
}

/**
 * Default cache keys instance
 */
export const eventManagementCacheKeys = new EventManagementCacheKeys();

/**
 * Room-specific cache keys helper
 */
export const roomCacheKeys = {
  all: eventManagementCacheKeys.rooms(),
  room: (id: string) => eventManagementCacheKeys.room(id),
  byEvent: (eventId: string) => eventManagementCacheKeys.roomsByEvent(eventId),
};
