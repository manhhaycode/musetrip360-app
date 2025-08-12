/**
 * @fileoverview TourGuide API Endpoints
 *
 * API endpoint definitions for user management operations.
 * Integrates with the MuseTrip360 backend API as defined in swagger.json
 */
import { getHttpClient, Pagination } from '@musetrip360/query-foundation';

import type { TourGuideCreateDto, TourGuideUpdateDto, PaginatedResponse, TourGuide, ApiResponse } from '@/types';

export const tourGuideEndpoints = {
  getMuseumTourGuides: async (
    museumId: string,
    params: Pagination
  ): Promise<ApiResponse<PaginatedResponse<TourGuide>>> => {
    const client = getHttpClient();
    const response = await client.get<ApiResponse<PaginatedResponse<TourGuide>>>(`/museums/${museumId}/tour-guides`, {
      params: {
        Page: params.Page,
        PageSize: params.PageSize,
        IsActive: params.IsActive,
        Search: params.Search,
        sortList: params.sortList,
      },
    });
    return response;
  },

  getTourGuideById: async (id: string): Promise<ApiResponse<TourGuide>> => {
    const client = getHttpClient();
    const response = await client.get<ApiResponse<TourGuide>>(`/tour-guides/${id}`);
    return response;
  },
  createTourGuide: async (tourGuideData: TourGuideCreateDto): Promise<ApiResponse<TourGuide>> => {
    const client = getHttpClient();
    const response = await client.post<ApiResponse<TourGuide>>(
      `/museums/${tourGuideData.museumId}/tour-guides`,
      tourGuideData
    );
    return response;
  },
  updateTourGuide: async (id: string, tourGuideData: TourGuideUpdateDto): Promise<ApiResponse<TourGuide>> => {
    const client = getHttpClient();
    const response = await client.put<ApiResponse<TourGuide>>(`/tour-guides/${id}`, tourGuideData);
    return response;
  },
};
