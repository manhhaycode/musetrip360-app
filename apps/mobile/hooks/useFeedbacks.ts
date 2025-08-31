import type { Feedback, FeedbackSearchParams } from '@musetrip360/shared';
import { useFeedback } from '@musetrip360/shared/api';

export const useFeedbacks = (params: FeedbackSearchParams) => {
  const result = useFeedback(params);
  return {
    data: result.data,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
};

export type { Feedback, FeedbackSearchParams };
