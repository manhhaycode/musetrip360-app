import { useArtifact, useArtifactsByMuseum } from '@musetrip360/artifact-management/api';

interface ArtifactSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
}

export const useArtifacts = (params?: ArtifactSearchParams, options?: { enabled?: boolean }) => {
  // Use real API - fix function name
  const apiResult = useArtifactsByMuseum(
    {
      museumId: params?.museumId || '',
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 12,
    },
    {
      enabled: options?.enabled !== false && !!params?.museumId,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
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
