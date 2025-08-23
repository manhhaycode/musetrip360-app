/**
 * @fileoverview feedback management
 *
 * API endpoints for feedback management.
 */

import { Feedback, FeedbackCreate, FeedbackSearchParams } from '@/types';
import { APIResponse, getHttpClient, PaginatedResponse } from '@musetrip360/query-foundation';

export const feedbackEndpoints = {
  getFeedback: 'feedbacks',
  createFeedback: 'feedbacks',
};

export const getFeedback = async (params: FeedbackSearchParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Feedback>>>(feedbackEndpoints.getFeedback, {
    params,
  });

  return response.data;
};

export const createFeedback = async (feedback: FeedbackCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Feedback>>(feedbackEndpoints.createFeedback, feedback);

  return response.data;
};
