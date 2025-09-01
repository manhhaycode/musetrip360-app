// Event management hooks
import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  getQueryClient,
  PaginatedResponse,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import { Event, EventCreateDto, EventParticipant, EventRoom, EventSearchParams, EventUpdateDto } from '@/types';

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
  getEventRooms,
  createEventRoom,
  getEventParticipants,
  getUserEventParticipants,
  searchEvents,
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
      ...options,
    }
  );
}

export function useSearchEvents(
  params: EventSearchParams,
  options?: CustomQueryOptions<PaginatedResponse<Event>['data']>
) {
  return useQuery([eventManagementCacheKeys.events(), params], () => searchEvents(params), {
    ...options,
  });
}

export function useGetEventById(id: string, options?: CustomQueryOptions<Event>) {
  return useQuery(
    [eventManagementCacheKeys.event(id)],
    () => getEventById(id), // Assuming the id is a museumId for this example
    {
      ...options,
    }
  );
}

export function useCreateEvent(options?: CustomMutationOptions<Event, APIError, EventCreateDto>) {
  const { onSuccess, ...optionMutate } = options || {};

  return useMutation((data: EventCreateDto) => createEventRequest(data.museumId, data), {
    onSuccess: (data, variables, context) => {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({ queryKey: eventManagementCacheKeys.lists() });
      onSuccess?.(data, variables, context);
    },
    ...optionMutate,
  });
}

export function useUpdateEvent(options?: CustomMutationOptions<Event, APIError, EventUpdateDto>) {
  const { onSuccess, ...optionMutate } = options || {};
  return useMutation(
    (
      data: EventUpdateDto & {
        eventId: string;
      }
    ) => updateEvent(data.eventId, data),
    {
      onSuccess: (data, variables, context) => {
        const queryClient = getQueryClient();
        queryClient.invalidateQueries({ queryKey: eventManagementCacheKeys.lists() });
        queryClient.invalidateQueries({ queryKey: eventManagementCacheKeys.event(variables.eventId) });
        onSuccess?.(data, variables, context);
      },
      ...optionMutate,
    }
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

export function useGetEventRooms(eventId: string, options?: CustomQueryOptions<EventRoom[]>) {
  return useQuery([eventManagementCacheKeys.eventRooms(eventId)], () => getEventRooms(eventId), {
    ...options,
  });
}

export function useCreateEventRoom(
  options?: CustomMutationOptions<
    EventRoom,
    APIError,
    { name: string; description?: string; status?: string; eventId: string }
  >
) {
  return useMutation(
    (data: { name: string; description?: string; status?: string; eventId: string }) =>
      createEventRoom(data.eventId, data),
    options
  );
}

export function useGetEventParticipants(eventId: string, options?: CustomQueryOptions<EventParticipant[]>) {
  return useQuery([eventManagementCacheKeys.eventParticipants(eventId)], () => getEventParticipants(eventId), {
    ...options,
  });
}

export function useGetUserEventParticipants(userId: string, options?: CustomQueryOptions<EventParticipant[]>) {
  return useQuery([eventManagementCacheKeys.userEventParticipants(userId)], () => getUserEventParticipants(userId), {
    ...options,
  });
}
