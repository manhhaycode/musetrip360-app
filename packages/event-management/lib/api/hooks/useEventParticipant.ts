// Event participant management hooks
import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import {
  EventParticipantCreateDto,
  EventParticipantUpdateDto,
  getAllEventParticipants,
  getEventParticipantById,
  createEventParticipant,
  updateEventParticipant,
  deleteEventParticipant,
  getEventParticipantsByEvent,
  getEventParticipantsByUser,
  checkUserInEvent,
  createEventParticipantClient,
} from '../endpoints/eventParticipant';

import { eventManagementCacheKeys } from '../cache/cacheKeys';
import { EventParticipant } from '@/types';

/**
 * Get all event participants
 */
export function useGetAllEventParticipants(options?: CustomQueryOptions<any>) {
  return useQuery(eventManagementCacheKeys.allEventParticipants(), () => getAllEventParticipants(), {
    ...options,
  });
}

/**
 * Get event participant by ID
 */
export function useGetEventParticipantById(id: string, options?: CustomQueryOptions<any>) {
  return useQuery(eventManagementCacheKeys.eventParticipant(id), () => getEventParticipantById(id), {
    enabled: !!id,
    ...options,
  });
}

/**
 * Create event participant
 */
export function useCreateEventParticipant(options?: CustomMutationOptions<any, APIError, EventParticipantCreateDto>) {
  return useMutation((data: EventParticipantCreateDto) => createEventParticipant(data), options);
}

/**
 * Update event participant
 */
export function useUpdateEventParticipant(
  options?: CustomMutationOptions<any, APIError, EventParticipantUpdateDto & { id: string }>
) {
  return useMutation(
    (data: EventParticipantUpdateDto & { id: string }) => updateEventParticipant(data.id, data),
    options
  );
}

/**
 * Delete event participant
 */
export function useDeleteEventParticipant(options?: CustomMutationOptions<any, APIError, string>) {
  return useMutation((id: string) => deleteEventParticipant(id), options);
}

/**
 * Get event participants by event ID
 */
export function useGetEventParticipantsByEvent(eventId: string, options?: CustomQueryOptions<EventParticipant[]>) {
  return useQuery(
    eventManagementCacheKeys.eventParticipantsByEvent(eventId),
    () => getEventParticipantsByEvent(eventId),
    {
      enabled: !!eventId,
      ...options,
    }
  );
}

/**
 * Get event participants by user ID
 */
export function useGetEventParticipantsByUser(userId: string, options?: CustomQueryOptions<any>) {
  return useQuery(eventManagementCacheKeys.eventParticipantsByUser(userId), () => getEventParticipantsByUser(userId), {
    enabled: !!userId,
    ...options,
  });
}

/**
 * Check if user is in event
 */
export function useCheckUserInEvent(eventId: string, userId: string, options?: CustomQueryOptions<any>) {
  return useQuery(eventManagementCacheKeys.userInEvent(eventId, userId), () => checkUserInEvent(eventId, userId), {
    enabled: !!eventId && !!userId,
    ...options,
  });
}

/**
 * Create event participant via client endpoint
 */
export function useCreateEventParticipantClient(
  options?: CustomMutationOptions<any, APIError, { userId?: string; eventId?: string }>
) {
  return useMutation(
    ({ userId, eventId }: { userId?: string; eventId?: string }) => createEventParticipantClient(userId, eventId),
    options
  );
}
