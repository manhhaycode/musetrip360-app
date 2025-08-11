/**
 * @fileoverview Category management
 *
 * API endpoints for category management.
 */

import { Category } from '@/types';
import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';

export const categoryEndpoints = {
  getCategories: 'categories',
};

export const getCategories = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Category[]>>(categoryEndpoints.getCategories);

  return response.data;
};
