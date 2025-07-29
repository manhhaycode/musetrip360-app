import { useMutation as useReactMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { getHttpClient } from '../client/httpClient';
import type { CustomMutationOptions, APIError } from '../types/query-types';
import type { RequestConfig, UploadProgress } from '../types/api-types';

/**
 * Enhanced useMutation hook with custom configuration
 */
export function useMutation<TData = unknown, TError = APIError, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: CustomMutationOptions<TData, TError, TVariables, TContext>
) {
  const queryClient = useQueryClient();
  const {
    optimisticUpdate = false,
    invalidateQueries = [],
    revalidateQueries = [],
    ...reactMutationOptions
  } = options || {};

  return useReactMutation({
    ...reactMutationOptions,
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });

      // Revalidate specified queries
      revalidateQueries.forEach((queryKey) => {
        queryClient.refetchQueries({ queryKey });
      });

      // Call custom onSuccess
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates if they exist
      if (optimisticUpdate && context) {
        // Handle rollback logic here
      }

      // Call custom onError
      options?.onError?.(error, variables, context);
    },
  });
}

/**
 * Hook for HTTP POST mutations
 */
export function usePostMutation<TData = unknown, TVariables = unknown>(
  url: string,
  requestConfig?: RequestConfig,
  options?: Omit<CustomMutationOptions<TData, APIError, TVariables>, 'requestConfig'>
) {
  return useMutation((variables: TVariables) => getHttpClient().post<TData>(url, variables), {
    ...options,
    requestConfig,
  });
}

/**
 * Hook for HTTP PUT mutations
 */
export function usePutMutation<TData = unknown, TVariables = unknown>(
  url: string,
  requestConfig?: RequestConfig,
  options?: Omit<CustomMutationOptions<TData, APIError, TVariables>, 'requestConfig'>
) {
  return useMutation((variables: TVariables) => getHttpClient().put<TData>(url, variables), {
    ...options,
    requestConfig,
  });
}

/**
 * Hook for HTTP PATCH mutations
 */
export function usePatchMutation<TData = unknown, TVariables = unknown>(
  url: string,
  requestConfig?: RequestConfig,
  options?: Omit<CustomMutationOptions<TData, APIError, TVariables>, 'requestConfig'>
) {
  return useMutation((variables: TVariables) => getHttpClient().patch<TData>(url, variables), {
    ...options,
    requestConfig,
  });
}

/**
 * Hook for HTTP DELETE mutations
 */
export function useDeleteMutation<TData = unknown>(
  url: string,
  requestConfig?: RequestConfig,
  options?: Omit<CustomMutationOptions<TData, APIError, void>, 'requestConfig'>
) {
  return useMutation(() => getHttpClient().delete<TData>(url), {
    ...options,
    requestConfig,
  });
}

/**
 * Hook for file upload mutations
 */
export function useUploadMutation<TData = unknown>(
  url: string,
  onProgress?: (progress: UploadProgress) => void,
  requestConfig?: RequestConfig,
  options?: Omit<CustomMutationOptions<TData, APIError, File>, 'requestConfig'>
) {
  return useMutation((file: File) => getHttpClient().upload<TData>(url, file, { onProgress }), {
    ...options,
    requestConfig,
  });
}

/**
 * Hook for optimistic mutations with automatic rollback
 */
export function useOptimisticMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  queryKey: QueryKey,
  optimisticUpdater: (oldData: any, variables: TVariables) => any,
  options?: Omit<CustomMutationOptions<TData, APIError, TVariables>, 'optimisticUpdate'>
) {
  const queryClient = useQueryClient();

  return useMutation(mutationFn, {
    ...options,
    optimisticUpdate: true,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update cache
      queryClient.setQueryData(queryKey, (oldData: any) => optimisticUpdater(oldData, variables));

      // Return context with snapshot
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback to previous data
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      // Call custom onError
      options?.onError?.(err, variables, context);
    },
    onSettled: () => {
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey });

      // Call custom onSettled if it doesn't require parameters
      // Note: onSettled in this context doesn't have access to mutation data
      if (options?.onSettled && options.onSettled.length === 0) {
        (options.onSettled as () => void)();
      }
    },
  });
}

/**
 * Hook for bulk mutations with progress tracking
 */
export function useBulkMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  onProgress?: (completed: number, total: number) => void,
  options?: Omit<CustomMutationOptions<TData[], APIError, TVariables[]>, 'mutationFn'>
) {
  return useMutation(async (variablesArray: TVariables[]) => {
    const results: TData[] = [];
    const total = variablesArray.length;

    for (let i = 0; i < total; i++) {
      const variables = variablesArray[i];
      if (variables !== undefined) {
        const result = await mutationFn(variables);
        results.push(result);
        onProgress?.(i + 1, total);
      }
    }

    return results;
  }, options);
}

/**
 * Hook for retry mutations with exponential backoff
 */
export function useRetryMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  maxRetries: number = 3,
  retryDelay: number = 1000,
  options?: Omit<CustomMutationOptions<TData, APIError, TVariables>, 'retry'>
) {
  return useMutation(mutationFn, {
    ...options,
    retry: (failureCount, error) => {
      // Don't retry for client errors (4xx)
      if (error?.statusCode >= 400 && error?.statusCode < 500) {
        return false;
      }
      return failureCount < maxRetries;
    },
    retryDelay: (attemptIndex) => Math.min(retryDelay * Math.pow(2, attemptIndex), 30000),
  });
}
