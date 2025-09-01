/**
 * @fileoverview Room API endpoints
 *
 * API endpoints for room management operations
 */

import { Room, RoomCreateDto, RoomUpdateDto, RoomUpdateMetadataDto } from '@/types';
import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';

export const roomEndpoints = {
  // Room CRUD operations
  getById: (id: string) => `/rooms/${id}`,
  update: (id: string) => `/rooms/${id}`,
  delete: (id: string) => `/rooms/${id}`,
  updateMetadata: (id: string) => `/rooms/${id}/metadata`,

  // Event-specific room operations
  createByEvent: (eventId: string) => `/events/${eventId}/rooms`,
  getByEvent: (eventId: string) => `/events/${eventId}/rooms`,
} as const;

/**
 * Get room by ID
 */
export const getRoomById = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Room>>(roomEndpoints.getById(id));
  return response.data;
};

/**
 * Get room by event ID
 */
export const getRoomByEvent = async (eventId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Room>>(roomEndpoints.getByEvent(eventId));
  return response.data;
};

/**
 * Create room for an event
 */
export const createRoomByEvent = async (eventId: string, data: RoomCreateDto) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Room>>(roomEndpoints.createByEvent(eventId), data);
  return response.data;
};

/**
 * Update room
 */
export const updateRoom = async (roomId: string, data: RoomUpdateDto) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Room>>(roomEndpoints.update(roomId), data);
  return response.data;
};

/**
 * Update room metadata
 */
export const updateRoomMetadata = async (roomId: string, data: RoomUpdateMetadataDto) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Room>>(roomEndpoints.updateMetadata(roomId), data);
  return response.data;
};

/**
 * Delete room
 */
export const deleteRoom = async (roomId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.delete<APIResponse<void>>(roomEndpoints.delete(roomId));
  return response.data;
};
