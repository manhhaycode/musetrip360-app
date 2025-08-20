/**
 * @fileoverview feedback management
 *
 * API endpoints for feedback management.
 */

import { Feedback, FeedbackCreate, FeedbackSearchParams } from '@/types';
import { APIResponse, getHttpClient, PaginatedResponse } from '@musetrip360/query-foundation';

export const feedbackEndpoints = {
  getFeedback: 'feedback',
  createMuseumFeedback: (museumId: string) => `museums/${museumId}/feedback`,
  createArtifactFeedback: (artifactId: string) => `artifacts/${artifactId}/feedback`,
  createTourFeedback: (tourId: string) => `tour-onlines/${tourId}/feedback`,
  createEventFeedback: (eventId: string) => `events/${eventId}/feedback`,
};

export const getFeedback = async (params: FeedbackSearchParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Feedback>>>(feedbackEndpoints.getFeedback, {
    params,
  });

  return response.data;
};

export const createMuseumFeedback = async (feedback: FeedbackCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.patch<APIResponse<Feedback>>(
    feedbackEndpoints.createMuseumFeedback(feedback.targetId),
    feedback
  );

  return response.data;
};

export const createArtifactFeedback = async (feedback: FeedbackCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.patch<APIResponse<Feedback>>(
    feedbackEndpoints.createArtifactFeedback(feedback.targetId),
    feedback
  );

  return response.data;
};

export const createTourFeedback = async (feedback: FeedbackCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.patch<APIResponse<Feedback>>(
    feedbackEndpoints.createTourFeedback(feedback.targetId),
    feedback
  );

  return response.data;
};

export const createEventFeedback = async (feedback: FeedbackCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.patch<APIResponse<Feedback>>(
    feedbackEndpoints.createEventFeedback(feedback.targetId),
    feedback
  );

  return response.data;
};
