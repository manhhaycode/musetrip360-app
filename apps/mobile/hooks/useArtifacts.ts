import { useArtifactsByMuseum } from '@musetrip360/artifact-management/api';

interface ArtifactSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
  HistoricalPeriods?: string[];
}

export const useArtifacts = (params?: ArtifactSearchParams, options?: { enabled?: boolean }) => {
  console.log('🏺 useArtifacts called with params:', params);
  console.log('🏺 useArtifacts options:', options);

  // Use real API exactly like visitor-portal - fix parameters
  const apiResult = useArtifactsByMuseum(
    {
      museumId: params?.museumId || '',
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 12,
      HistoricalPeriods: params?.HistoricalPeriods,
    },
    {
      enabled: options?.enabled !== false && !!params?.museumId,
      refetchOnWindowFocus: false,
    }
  );

  console.log('🏺 useArtifacts API result:', {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};
