import { getHttpClient } from '@musetrip360/query-foundation';
import { useQuery } from '@tanstack/react-query';

interface EntityImageParams {
  id: string;
  type: 'Museum' | 'Artifact' | 'Event' | 'TourOnline';
  enabled?: boolean;
}

/**
 * Hook để lấy ảnh thực tế của entity từ API detail
 * Sử dụng khi unified search API không trả về thumbnail đầy đủ
 */
export function useEntityImage({ id, type, enabled = true }: EntityImageParams) {
  return useQuery({
    queryKey: ['entityImage', type, id],
    queryFn: async () => {
      const httpClient = getHttpClient();

      switch (type) {
        case 'Museum': {
          const response = await httpClient.get(`/museums/${id}`);
          const museum = response.data;
          // Theo logic visitor-portal MuseumCard
          return museum.metadata?.images?.[0] || museum.metadata?.logoUrl || null;
        }

        case 'Artifact': {
          const response = await httpClient.get(`/artifacts/${id}`);
          const artifact = response.data;
          // Theo logic visitor-portal ArtifactCard
          return artifact.imageUrl || null;
        }

        case 'Event': {
          const response = await httpClient.get(`/events/${id}`);
          const event = response.data;
          // Event có thể có coverImage hoặc images trong metadata
          return event.metadata?.coverImage || event.metadata?.images?.[0] || null;
        }

        case 'TourOnline': {
          const response = await httpClient.get(`/tour-onlines/${id}`);
          const tour = response.data;
          // Theo logic visitor-portal VirtualTourCard
          if (tour.metadata?.images && tour.metadata.images.length > 0) {
            return tour.metadata.images[0]?.file || null;
          }
          if (tour.metadata?.scenes && tour.metadata.scenes.length > 0) {
            const firstScene = tour.metadata.scenes[0];
            if (firstScene && typeof firstScene.thumbnail === 'string') {
              return firstScene.thumbnail;
            }
          }
          return null;
        }

        default:
          return null;
      }
    },
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes - ảnh ít thay đổi
    retry: 1, // Chỉ retry 1 lần vì là feature không quan trọng
    retryDelay: 1000,
  });
}
