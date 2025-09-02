import { getHttpClient } from '@musetrip360/query-foundation';
import { useQuery } from '@tanstack/react-query';

interface FeedbackSearchParams {
  targetId?: string;
  targetType?: string;
  Page?: number;
  PageSize?: number;
}

export const useFeedbacks = (params: FeedbackSearchParams) => {
  const queryResult = useQuery({
    queryKey: ['feedbacks', params],
    queryFn: async () => {
      const httpClient = getHttpClient();
      const response = await httpClient.get('/feedbacks', { params });
      return response.data;
    },
    enabled: !!params.targetId,
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};

export type { FeedbackSearchParams };
