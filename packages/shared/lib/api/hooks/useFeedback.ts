import { useMutation, useQuery, getQueryClient } from '@musetrip360/query-foundation';
import { sharedCacheKeys } from '../cache/cacheKeys';
import { FeedbackCreate, FeedbackSearchParams } from '@/types';
import { createFeedback, getFeedback } from '../endpoints';

export function useFeedback(params: FeedbackSearchParams) {
  return useQuery(
    sharedCacheKeys.feedback.feedback(params),
    () => {
      return getFeedback(params);
    },
    {
      retry: 1, // Retry once on failure
      retryDelay: 1000, // Delay between retries
    }
  );
}

export function useCreateFeedback() {
  return useMutation(
    (feedback: FeedbackCreate) => {
      return createFeedback(feedback);
    },
    {
      onSuccess: () => {
        const queryClient = getQueryClient();
        // Invalidate feedback query on success
        queryClient.removeQueries({
          queryKey: sharedCacheKeys.feedback.list(),
        });
      },
    }
  );
}
