/**
 * @fileoverview Artifact React Query Hooks
 *
 * React Query hooks for artifact operations including CRUD operations,
 * listing, and status management.
 */

import {
  Artifact,
  ArtifactCreateDto,
  ArtifactListParams,
  ArtifactMuseumSearchParams,
  ArtifactUpdateDto,
} from '@/types';
import {
  APIError,
  APIResponse,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  useMutation,
  useQuery,
  useQueryClient,
} from '@musetrip360/query-foundation';
import { artifactCacheKeys } from '../cache/cacheKeys';
import {
  activateArtifact,
  artifactErrorHandler,
  createArtifactForMuseum,
  deactivateArtifact,
  deleteArtifact,
  getArtifactById,
  getArtifacts,
  getArtifactsAdmin,
  getArtifactsByMuseum,
  updateArtifact,
} from '../endpoints/artifacts';

/**
 * Hook for getting paginated list of active artifacts
 */
export function useArtifacts(params?: ArtifactListParams, options?: CustomQueryOptions<APIResponse<any>, APIError>) {
  return useQuery(artifactCacheKeys.list(params), () => getArtifacts(params), {
    ...options,
  });
}

/**
 * Hook for getting paginated list of all artifacts (admin)
 */
export function useArtifactsAdmin(
  params?: ArtifactListParams,
  options?: CustomQueryOptions<APIResponse<any>, APIError>
) {
  return useQuery(artifactCacheKeys.adminList(params), () => getArtifactsAdmin(params), {
    ...options,
  });
}

/**
 * Hook for getting artifact by ID
 */
export function useArtifact(id: string, options?: CustomQueryOptions<APIResponse<any>, APIError>) {
  return useQuery(artifactCacheKeys.detail(id), () => getArtifactById(id), {
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook for getting artifacts by museum
 */
export function useArtifactsByMuseum(
  params: ArtifactMuseumSearchParams,
  options?: CustomQueryOptions<PaginatedResponse<Artifact>['data'], APIError>
) {
  return useQuery(artifactCacheKeys.byMuseum(params.museumId), () => getArtifactsByMuseum(params), {
    enabled: !!params.museumId,
    placeholderData: (previousData: PaginatedResponse<Artifact>['data'] | undefined) => previousData,
    ...options,
  });
}

/**
 * Hook for creating artifact for museum
 */
export function useCreateArtifact(
  options?: CustomMutationOptions<APIResponse<any>, APIError, { museumId: string; data: ArtifactCreateDto }, unknown>
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...optionMutate } = options || {};

  return useMutation(
    ({ museumId, data }: { museumId: string; data: ArtifactCreateDto }) => createArtifactForMuseum(museumId, data),
    {
      mutationKey: artifactCacheKeys.create(),
      onSuccess: (data, variables, context) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: artifactCacheKeys.list() });
        queryClient.invalidateQueries({ queryKey: artifactCacheKeys.adminList() });
        queryClient.invalidateQueries({ queryKey: artifactCacheKeys.all });

        onSuccess?.(data, variables, context);
      },
      onError: (error: APIError) => {
        console.error('Failed to create artifact:', artifactErrorHandler.handleCreateError(error));
      },
      ...optionMutate,
    }
  );
}

/**
 * Hook for updating artifact
 */
export function useUpdateArtifact(
  options?: CustomMutationOptions<APIResponse<any>, APIError, { id: string; data: ArtifactUpdateDto }, unknown>
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...optionMutate } = options || {};

  return useMutation(({ id, data }: { id: string; data: ArtifactUpdateDto }) => updateArtifact(id, data), {
    mutationKey: artifactCacheKeys.update(),
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.list() });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.all });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.adminList() });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.detail(variables.id) });

      onSuccess?.(data, variables, context);
    },
    onError: (error: APIError) => {
      console.error('Failed to update artifact:', artifactErrorHandler.handleUpdateError(error));
    },
    ...optionMutate,
  });
}

/**
 * Hook for deleting artifact
 */
export function useDeleteArtifact(options?: CustomMutationOptions<APIResponse<any>, APIError, string, unknown>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...optionMutate } = options || {};

  return useMutation((id: string) => deleteArtifact(id), {
    mutationKey: artifactCacheKeys.delete(),
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.list() });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.adminList() });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.detail(variables) });

      onSuccess?.(data, variables, context);
    },
    onError: (error: APIError) => {
      console.error('Failed to delete artifact:', artifactErrorHandler.handleDeleteError(error));
    },
    ...optionMutate,
  });
}

/**
 * Hook for activating artifact
 */
export function useActivateArtifact(options?: CustomMutationOptions<APIResponse<any>, APIError, string, unknown>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...optionMutate } = options || {};

  return useMutation((id: string) => activateArtifact(id), {
    mutationKey: artifactCacheKeys.activate(),
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.list() });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.adminList() });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.detail(variables) });

      onSuccess?.(data, variables, context);
    },
    onError: (error: APIError) => {
      console.error('Failed to activate artifact:', artifactErrorHandler.handleUpdateError(error));
    },
    ...optionMutate,
  });
}

/**
 * Hook for deactivating artifact
 */
export function useDeactivateArtifact(options?: CustomMutationOptions<APIResponse<any>, APIError, string, unknown>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...optionMutate } = options || {};

  return useMutation((id: string) => deactivateArtifact(id), {
    mutationKey: artifactCacheKeys.deactivate(),
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.list() });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.adminList() });
      queryClient.invalidateQueries({ queryKey: artifactCacheKeys.detail(variables) });

      onSuccess?.(data, variables, context);
    },
    onError: (error: APIError) => {
      console.error('Failed to deactivate artifact:', artifactErrorHandler.handleUpdateError(error));
    },
    ...optionMutate,
  });
}
