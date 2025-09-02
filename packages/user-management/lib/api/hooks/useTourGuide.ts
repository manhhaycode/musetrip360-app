/**
 * @fileoverview Tour Guide Management React Query Hooks
 *
 * React Query hooks for user management operations including queries and mutations.
 * Integrates with the query-foundation package for consistent caching and offline support.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  CustomMutationOptions,
  APIError,
  Pagination,
} from '@musetrip360/query-foundation';
import { tourGuideEndpoints } from '../endpoints/tourguide';
import { TourGuideCreateDto, TourGuideUpdateDto } from '@/types';

export function useTourGuides(museumId: string, params: Pagination) {
  return useQuery(['tourGuides', museumId, params], () => tourGuideEndpoints.getMuseumTourGuides(museumId, params));
}

export function useTourGuide(id: string) {
  return useQuery(['tourGuide', id], () => tourGuideEndpoints.getTourGuideById(id));
}

export function useCreateTourGuide(options?: CustomMutationOptions<unknown, APIError, TourGuideCreateDto>) {
  const queryClient = useQueryClient();

  return useMutation((tourGuideData: TourGuideCreateDto) => tourGuideEndpoints.createTourGuide(tourGuideData), {
    onSuccess: (data, variables, context) => {
      if (options) {
        options.onSuccess?.(data, variables, context);
      }

      queryClient.invalidateQueries({ queryKey: ['tourGuides'] });
    },
    onError: (error: APIError) => {
      console.error('Failed to create tour guide:', error);
    },
  });
}

export function useUpdateTourGuide(options?: CustomMutationOptions<unknown, APIError, TourGuideUpdateDto>) {
  const queryClient = useQueryClient();

  return useMutation(
    (tourGuideData: TourGuideUpdateDto) => tourGuideEndpoints.updateTourGuide(tourGuideData.id, tourGuideData),
    {
      onSuccess: (data, variables, context) => {
        if (options) {
          options.onSuccess?.(data, variables, context);
        }
        // Invalidate the specific tour guide query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ['tourGuides'] });
      },
      onError: (error: APIError) => {
        console.error('Failed to update tour guide:', error);
      },
    }
  );
}

export function useDeleteTourGuide(options?: CustomMutationOptions<unknown, APIError, string>) {
  const queryClient = useQueryClient();

  return useMutation((id: string) => tourGuideEndpoints.deleteTourGuide(id), {
    onSuccess: (data, variables, context) => {
      if (options) {
        options.onSuccess?.(data, variables, context);
      }
      // Invalidate the specific tour guide query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['tourGuides'] });
    },
    onError: (error: APIError) => {
      console.error('Failed to delete tour guide:', error);
    },
  });
}
