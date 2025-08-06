/**
 * @fileoverview Virtual Tour React Query Hooks
 *
 * React Query hooks for virtual tour operations.
 */

import {
  useMutation,
  useQuery,
  CustomMutationOptions,
  APIError,
  Pagination,
  useQueryClient,
} from '@musetrip360/query-foundation';

import {
  createVirtualTourForMuseum,
  deleteVirtualTour,
  getVirtualTourById,
  getVirtualToursByMuseum,
  updateVirtualTour,
} from '../endpoints/virtual-tour';
import { IVirtualTour } from '../types';
import { virtualTourCacheKeys } from '../cache';

/**
 * Custom hook to get a paginated list of virtual tours by museum
 * @param museumId - The ID of the museum
 * @param params - Pagination parameters
 * @returns A query function to fetch virtual tours
 */
export function useVirtualTourByMuseum(params: Pagination & { museumId: string }) {
  const { museumId, ...rest } = params;
  return useQuery(virtualTourCacheKeys.listByMuseum(museumId, rest), () => getVirtualToursByMuseum(museumId, rest));
}

/**
 * Custom hook to get details of a specific virtual tour by ID
 * @param virtualTourId - The ID of the virtual tour
 * @returns A query function to fetch virtual tour details
 */
export function useVirtualTourById(virtualTourId?: string) {
  return useQuery(virtualTourCacheKeys.detail(virtualTourId!), () => getVirtualTourById(virtualTourId!), {
    enabled: !!virtualTourId, // Only fetch if virtualTourId is provided
  });
}

/**
 * Custom hook to create a new virtual tour
 * @param options - Custom mutation options
 * @returns Mutation function to create a virtual tour
 */
export function useCreateMuseumVirtualTour(
  museumId: string,
  options?: CustomMutationOptions<IVirtualTour, APIError, IVirtualTour>
) {
  const queryClient = useQueryClient();

  return useMutation<IVirtualTour, APIError, IVirtualTour>(
    (virtualTour) => createVirtualTourForMuseum(museumId, virtualTour),
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: virtualTourCacheKeys.detail(data.id) });
        options?.onSuccess?.(data, variables, context);
      },
    }
  );
}

/**
 * Custom hook to update a existing virtual tour
 * @param options - Custom mutation options
 * @returns Mutation function to update a virtual tour
 */
export function useUpdateVirtualTour(options?: CustomMutationOptions<IVirtualTour, APIError, IVirtualTour>) {
  const queryClient = useQueryClient();

  return useMutation<IVirtualTour, APIError, IVirtualTour>((variables) => updateVirtualTour(variables.id, variables), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: virtualTourCacheKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
/**
 * Custom hook to delete a virtual tour
 * @param options - Custom mutation options
 * @returns Mutation function to delete a virtual tour
 */
export function useDeleteVirtualTour(options?: CustomMutationOptions<void, APIError, string>) {
  const queryClient = useQueryClient();

  return useMutation<void, APIError, string>(deleteVirtualTour, {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: virtualTourCacheKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
