import { useMutation, useQuery, getQueryClient, CustomMutationOptions, APIError } from '@musetrip360/query-foundation';

import { NotificationSearchParams, UpdateReadNotification, Notification } from '@/types';
import { getNotifications, updateReadNotification, deleteNotification } from '../endpoints';

export function useNotifications(params: NotificationSearchParams) {
  return useQuery(
    ['notifications', params],
    () => {
      return getNotifications(params);
    },
    {
      retry: 1, // Retry once on failure
      retryDelay: 1000, // Delay between retries
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 60 * 1, // 1 minute
    }
  );
}

export function useMarkAsRead(options: CustomMutationOptions<Notification, APIError, UpdateReadNotification>) {
  return useMutation((data: UpdateReadNotification) => updateReadNotification(data), {
    ...options,
    onSuccess: (data: Notification, variables: UpdateReadNotification, context: unknown) => {
      options.onSuccess?.(data, variables, context);
      const queryClient = getQueryClient();

      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
}

export function useDeleteNotification(options: CustomMutationOptions<void, APIError, string>) {
  return useMutation((id: string) => deleteNotification(id), {
    ...options,
    onSuccess: (data: void, variables: string, context: unknown) => {
      options.onSuccess?.(data, variables, context);
      const queryClient = getQueryClient();

      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
}
