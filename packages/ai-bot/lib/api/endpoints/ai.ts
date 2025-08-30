/**
 * @fileoverview Museum AI Chat Endpoints
 *
 * API endpoints for museum search operations.
 */

import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';
import { AIChatResp, AIChatReq, AIAudioRes } from '@/types';

/**
 * AI API endpoints configuration
 */
export const aiEndpoints = {
  chat: '/ai/chat',
  audio: '/ai/audio',
} as const;

export const chatWithAi = async (data: AIChatReq) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<AIChatResp>>(aiEndpoints.chat, data);
  return response.data;
};

export const generateAudio = async (prompt: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<AIAudioRes>>(aiEndpoints.audio, { prompt });
  return response.data;
};

/**
 * AI search error handler
 */
export const aiErrorHandler = {
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
