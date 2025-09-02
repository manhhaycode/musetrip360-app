import { useArtifact, useArtifacts as useArtifactsAPI, useArtifactsByMuseum } from '@musetrip360/artifact-management/api';

interface ArtifactSearchParams {
  Page?: number;
  PageSize?: number;
  Search?: string;
  museumId?: string;
}

export const useArtifacts = (params?: ArtifactSearchParams, options?: { enabled?: boolean }) => {
  const apiResult = useArtifactsAPI({
    Page: params?.Page || 1,
    PageSize: params?.PageSize || 12,
    Search: params?.Search,
  }, {
    enabled: options?.enabled !== false,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

// New hook specifically for museum artifacts
export const useMuseumArtifacts = (museumId: string, params?: Omit<ArtifactSearchParams, 'museumId'>, options?: { enabled?: boolean }) => {
  const apiResult = useArtifactsByMuseum({
    museumId,
    Page: params?.Page || 1,
    PageSize: params?.PageSize || 12,
    Search: params?.Search,
  }, {
    enabled: options?.enabled !== false,
  });

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

