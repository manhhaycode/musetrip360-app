/**
 * @fileoverview Room API hooks
 *
 * React Query hooks for room management operations
 */

import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import { Room, RoomCreateDto, RoomUpdateDto, RoomUpdateMetadataDto } from '@/types';

import {
  getRoomById,
  getRoomByEvent,
  createRoomByEvent,
  updateRoom,
  updateRoomMetadata,
  deleteRoom,
} from '../endpoints/rooms';

import { eventManagementCacheKeys } from '../cache/cacheKeys';

/**
 * Hook to get room by ID
 */
export function useGetRoom(roomId: string, options?: CustomQueryOptions<Room>) {
  return useQuery([eventManagementCacheKeys.room(roomId)], () => getRoomById(roomId), {
    enabled: !!roomId,
    ...options,
  });
}

/**
 * Hook to get room by event ID
 */
export function useGetRoomByEvent(eventId: string, options?: CustomQueryOptions<Room>) {
  return useQuery([eventManagementCacheKeys.roomsByEvent(eventId)], () => getRoomByEvent(eventId), {
    enabled: !!eventId,
    ...options,
  });
}

/**
 * Hook to create room for an event
 */
export function useCreateRoom(
  options?: CustomMutationOptions<Room, APIError, { eventId: string; data: RoomCreateDto }>
) {
  return useMutation(
    ({ eventId, data }: { eventId: string; data: RoomCreateDto }) => createRoomByEvent(eventId, data),
    options
  );
}

/**
 * Hook to update room
 */
export function useUpdateRoom(
  options?: CustomMutationOptions<Room, APIError, { roomId: string; data: RoomUpdateDto }>
) {
  return useMutation(({ roomId, data }: { roomId: string; data: RoomUpdateDto }) => updateRoom(roomId, data), options);
}

/**
 * Hook to update room metadata
 */
export function useUpdateRoomMetadata(
  options?: CustomMutationOptions<Room, APIError, { roomId: string; data: RoomUpdateMetadataDto }>
) {
  return useMutation(
    ({ roomId, data }: { roomId: string; data: RoomUpdateMetadataDto }) => updateRoomMetadata(roomId, data),
    options
  );
}

/**
 * Hook to delete room
 */
export function useDeleteRoom(options?: CustomMutationOptions<void, APIError, string>) {
  return useMutation((roomId: string) => deleteRoom(roomId), options);
}
