import type { Review, ReviewsResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

// Placeholder cho reviews - sẽ implement khi có API backend
interface ReviewSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
  targetId?: string;
  type?: 'Museum' | 'Artifact' | 'Event' | 'Article';
}

export const useReviews = (
  targetId?: string,
  type?: 'Museum' | 'Artifact' | 'Event' | 'Article',
  params?: ReviewSearchParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['reviews', targetId, type, params?.Page, params?.PageSize],
    queryFn: async (): Promise<ReviewsResponse> => {
      if (!targetId || !type) {
        throw new Error('Target ID and type are required');
      }

      const queryParams = new URLSearchParams({
        TargetId: targetId,
        Type: type,
        Page: (params?.Page || 1).toString(),
        PageSize: (params?.PageSize || 50).toString(),
      });

      const response = await fetch(`https://api.musetrip360.site/api/v1/reviews?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải đánh giá');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false && !!targetId && !!type,
  });
};

export type { Review, ReviewSearchParams };
