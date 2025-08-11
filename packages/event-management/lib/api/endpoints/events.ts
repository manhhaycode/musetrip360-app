/**
 * @fileoverview Museum Search API Endpoints
 *
 * API endpoints for museum search operations.
 */

import { APIResponse, getHttpClient, PaginatedResponse } from '@musetrip360/query-foundation';
import { Event, EventSearchParams, EventCreateDto, EventUpdateDto } from '@/types';

/**
 * Event API endpoints configuration
 */
export const eventEndpoints = {
  search: '/api/v1/events',
  getById: (id: string) => `/api/v1/events/${id}`,
  getByMuseumId: (museumId: string) => `/api/v1/museums/${museumId}/events`,
  createEventRequest: (museumId: string) => `/api/v1/museums/${museumId}/events/request`,
  addEventTourOnlines: (eventId: string) => `/api/v1/events/${eventId}/add-tour-onlines`,
  removeEventTourOnlines: (eventId: string) => `/api/v1/events/${eventId}/remove-tour-onlines`,
  submitEvent: (eventId: string) => `/api/v1/events/${eventId}/submit`,
  cancelEvent: (eventId: string) => `/api/v1/events/${eventId}/cancel`,
  evaluateEvent: (eventId: string, isApproved: boolean) =>
    `/api/v1/events/${eventId}/evaluate?isApproved=${isApproved}`,
} as const;

/**
 * Get event by ID
 */
export const getMuseumById = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Event>>(eventEndpoints.getById(id));
  return response.data;
};

export const getEventsByMuseumId = async (museumId: string, params: EventSearchParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Event>>>(eventEndpoints.getByMuseumId(museumId), {
    params,
  });
  return response.data;
};

export const searchEvents = async (params: EventSearchParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Event>>>(eventEndpoints.search, {
    params,
  });
  return response.data;
};

/**
 * Create a new event request
 */
export const createEventRequest = async (museumId: string, eventData: EventCreateDto) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Event>>(eventEndpoints.createEventRequest(museumId), eventData);
  return response.data;
};

/**
 * Update an existing event
 */
export const updateEvent = async (eventId: string, eventData: EventUpdateDto) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Event>>(eventEndpoints.getById(eventId), eventData);
  return response.data;
};

/**
 * Add tour online to an event
 */
export const addEventTourOnlines = async (eventId: string, tourOnlineIds: string[]) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Event>>(eventEndpoints.addEventTourOnlines(eventId), tourOnlineIds);
  return response.data;
};

/**
 * Remove tour online from an event
 */
export const removeEventTourOnlines = async (eventId: string, tourOnlineIds: string[]) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Event>>(
    eventEndpoints.removeEventTourOnlines(eventId),
    tourOnlineIds
  );
  return response.data;
};

/**
 * Submit an event for review
 */
export const submitEvent = async (eventId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.patch<APIResponse<Event>>(eventEndpoints.submitEvent(eventId));
  return response.data;
};
/**
 * Cancel an event
 */
export const cancelEvent = async (eventId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.patch<APIResponse<Event>>(eventEndpoints.cancelEvent(eventId));
  return response.data;
};

/**
 * Evaluate an event (approve or reject)
 */
export const evaluateEvent = async (eventId: string, isApproved: boolean) => {
  const httpClient = getHttpClient();
  const response = await httpClient.patch<APIResponse<Event>>(eventEndpoints.evaluateEvent(eventId, isApproved));
  return response.data;
};

/**
 * Event search error handler
 */
export const eventErrorHandler = {
  handleSearchError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid search parameters. Please check your input.';
    }
    if (error.response?.status === 404) {
      return 'No museums found matching your criteria.';
    }
    if (error.response?.status === 500) {
      return 'Server error occurred while searching museums. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  },

  handleGetError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'Museum not found.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to access this museum.';
    }
    return 'An error occurred while loading the museum. Please try again.';
  },
};
