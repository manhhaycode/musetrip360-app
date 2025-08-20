import { useMutation, useQuery, getQueryClient } from '@musetrip360/query-foundation';
import { sharedCacheKeys } from '../cache/cacheKeys';
import { FeedbackCreate, FeedbackSearchParams } from '@/types';
import {
  createArtifactFeedback,
  createEventFeedback,
  createMuseumFeedback,
  createTourFeedback,
  getFeedback,
} from '../endpoints';

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
      switch (feedback.targetType) {
        case 'museum':
          return createMuseumFeedback(feedback);
        case 'artifact':
          return createArtifactFeedback(feedback);
        case 'tour':
          return createTourFeedback(feedback);
        case 'event':
          return createEventFeedback(feedback);
        default:
          throw new Error('Invalid target type');
      }
    },
    {
      onSuccess: () => {
        const queryClient = getQueryClient();
        // Invalidate feedback query on success
        queryClient.invalidateQueries({
          queryKey: sharedCacheKeys.feedback.list(),
        });
      },
    }
  );
}
