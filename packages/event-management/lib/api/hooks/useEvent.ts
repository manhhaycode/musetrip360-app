// Event management hooks
import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import { Event, EventCreateDto, EventSearchParams, EventUpdateDto } from '@/types';

import {
  createEventRequest,
  getEventsByMuseumId,
  updateEvent,
  evaluateEvent,
  submitEvent,
  cancelEvent,
  addEventTourOnlines,
  removeEventTourOnlines,
  getEventById,
} from '../endpoints';

import { eventManagementCacheKeys } from '../cache/cacheKeys';

export function useGetEventsByMuseumId(
  museumId: string,
  params: EventSearchParams,
  options?: CustomQueryOptions<PaginatedResponse<Event>>
) {
  return useQuery(
    [eventManagementCacheKeys.eventsByMuseum(museumId, params)],
    () => getEventsByMuseumId(museumId, params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    }
  );
}

export function useGetEventById(id: string, options?: CustomQueryOptions<Event>) {
  return useQuery(
    [eventManagementCacheKeys.event(id)],
    () => getEventById(id), // Assuming the id is a museumId for this example
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    }
  );
}

export function useCreateEvent(options?: CustomMutationOptions<Event, APIError, EventCreateDto>) {
  return useMutation((data: EventCreateDto) => createEventRequest(data.museumId, data), options);
}

export function useUpdateEvent(options?: CustomMutationOptions<Event, APIError, EventUpdateDto>) {
  return useMutation(
    (
      data: EventUpdateDto & {
        museumId: string;
      }
    ) => updateEvent(data.museumId, data),
    options
  );
}

export function useEvaluateEvent(
  options?: CustomMutationOptions<Event, APIError, { eventId: string; isApproved: boolean }>
) {
  return useMutation(({ eventId, isApproved }) => evaluateEvent(eventId, isApproved), options);
}

export function useSubmitEvent(options?: CustomMutationOptions<Event, APIError, string>) {
  return useMutation((eventId: string) => submitEvent(eventId), options);
}

export function useCancelEvent(options?: CustomMutationOptions<Event, APIError, string>) {
  return useMutation((eventId: string) => cancelEvent(eventId), options);
}

export function useAddEventTourOnlines(
  options?: CustomMutationOptions<Event, APIError, { eventId: string; tourOnlineIds: string[] }>
) {
  return useMutation(({ eventId, tourOnlineIds }) => addEventTourOnlines(eventId, tourOnlineIds), options);
}

export function useRemoveEventTourOnlines(
  options?: CustomMutationOptions<Event, APIError, { eventId: string; tourOnlineIds: string[] }>
) {
  return useMutation(({ eventId, tourOnlineIds }) => removeEventTourOnlines(eventId, tourOnlineIds), options);
}
