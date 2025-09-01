import { useArtifact } from '@musetrip360/artifact-management/api';
import { useQuery } from '@tanstack/react-query';

interface ArtifactSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
}

export const useArtifacts = (params?: ArtifactSearchParams, options?: { enabled?: boolean }) => {
  // Tạo cache key riêng bao gồm tất cả pagination parameters để tránh conflict
  const cacheKey = [
    'artifactManagement',
    'artifacts',
    'byMuseum',
    params?.museumId,
    'page',
    params?.Page || 1,
    'pageSize',
    params?.PageSize || 12,
  ];

  const result = useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      if (!params?.museumId) {
        throw new Error('Museum ID is required');
      }

      // Gọi trực tiếp function từ package thay vì hook để tránh cache conflict
      const { getArtifactsByMuseum } = await import('@musetrip360/artifact-management/api');
      return await getArtifactsByMuseum({
        museumId: params.museumId,
        Page: params.Page || 1,
        PageSize: params.PageSize || 12,
      });
    },
    enabled: options?.enabled !== false && !!params?.museumId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Response từ getArtifactsByMuseum đã có structure: { list: T[], data: T[], total: number }
  return {
    data: result.data
      ? {
          list: result.data.list || [],
          total: result.data.total || 0,
          page: params?.Page || 1,
          pageSize: params?.PageSize || 12,
        }
      : null,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
};

// New hook for getting artifact details by ID
export const useArtifactDetail = (artifactId: string, options?: { enabled?: boolean }) => {
  const apiResult = useArtifact(artifactId, {
    enabled: options?.enabled !== false && !!artifactId,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

export type { ArtifactSearchParams };
