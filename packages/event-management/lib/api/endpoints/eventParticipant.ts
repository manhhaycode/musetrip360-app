/**
 * @fileoverview Event Participant API Endpoints
 *
 * API endpoints for event participant operations.
 */

import { EventParticipant, ParticipantRoleEnum, ParticipantStatus } from '@/types';
import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';

/**
 * Event Participant API endpoints configuration
 */
export const eventParticipantEndpoints = {
  getAll: '/event-participants',
  getById: (id: string) => `/event-participants/${id}`,
  create: '/event-participants',
  update: (id: string) => `/event-participants/${id}`,
  delete: (id: string) => `/event-participants/${id}`,
  getByEvent: (eventId: string) => `/event-participants/event/${eventId}`,
  getByUser: (userId: string) => `/event-participants/user/${userId}`,
  checkUserInEvent: (eventId: string, userId: string) => `/event-participants/event/${eventId}/user/${userId}`,
  clientCreate: '/event-participants/client',
} as const;

/**
 * Event Participant DTOs based on swagger
 */
export interface EventParticipantCreateDto {
  eventId: string;
  userId: string;
  role?: ParticipantRoleEnum;
}

export interface EventParticipantUpdateDto {
  role?: ParticipantRoleEnum;
  status?: ParticipantStatus;
}

/**
 * Get all event participants
 */
export const getAllEventParticipants = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<any>>(eventParticipantEndpoints.getAll);
  return response.data;
};

/**
 * Get event participant by ID
 */
export const getEventParticipantById = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<any>>(eventParticipantEndpoints.getById(id));
  return response.data;
};

/**
 * Create a new event participant
 */
export const createEventParticipant = async (participantData: EventParticipantCreateDto) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<any>>(eventParticipantEndpoints.create, participantData);
  return response.data;
};

/**
 * Update an existing event participant
 */
export const updateEventParticipant = async (id: string, participantData: EventParticipantUpdateDto) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<any>>(eventParticipantEndpoints.update(id), participantData);
  return response.data;
};

/**
 * Delete an event participant
 */
export const deleteEventParticipant = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.delete<APIResponse<any>>(eventParticipantEndpoints.delete(id));
  return response.data;
};

/**
 * Get all participants for a specific event
 */
export const getEventParticipantsByEvent = async (eventId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<EventParticipant[]>>(eventParticipantEndpoints.getByEvent(eventId));
  return response.data;
};

/**
 * Get all events a user is participating in
 */
export const getEventParticipantsByUser = async (userId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<any>>(eventParticipantEndpoints.getByUser(userId));
  return response.data;
};

/**
 * Check if a specific user is participating in a specific event
 */
export const checkUserInEvent = async (eventId: string, userId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<any>>(eventParticipantEndpoints.checkUserInEvent(eventId, userId));
  return response.data;
};

/**
 * Create event participant via client endpoint
 */
export const createEventParticipantClient = async (userId?: string, eventId?: string) => {
  const httpClient = getHttpClient();
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (eventId) params.append('eventId', eventId);

  const response = await httpClient.post<APIResponse<any>>(
    `${eventParticipantEndpoints.clientCreate}?${params.toString()}`
  );
  return response.data;
};

/**
 * Event participant error handler
 */
export const eventParticipantErrorHandler = {
  handleCreateError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid participant data. Please check your input.';
    }
    if (error.response?.status === 409) {
      return 'User is already participating in this event.';
    }
    if (error.response?.status === 500) {
      return 'Server error occurred while creating participant. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  },

  handleUpdateError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'Event participant not found.';
    }
    if (error.response?.status === 400) {
      return 'Invalid participant data. Please check your input.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to update this participant.';
    }
    return 'An error occurred while updating the participant. Please try again.';
  },

  handleDeleteError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'Event participant not found.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to remove this participant.';
    }
    return 'An error occurred while removing the participant. Please try again.';
  },

  handleGetError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'Event participant not found.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to access this information.';
    }
    return 'An error occurred while loading participant data. Please try again.';
  },
};
