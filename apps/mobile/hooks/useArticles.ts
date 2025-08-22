import { useGetArticlesByMuseum } from '@musetrip360/museum-management/api';

interface ArticleSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
}

export const useArticles = (params?: ArticleSearchParams, options?: { enabled?: boolean }) => {
  console.log('📰 useArticles called with params:', params);
  console.log('📰 useArticles options:', options);

  // Use real API - fix function name
  const apiResult = useGetArticlesByMuseum(
    params?.museumId || '',
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 12,
    },
    {
      enabled: options?.enabled !== false && !!params?.museumId,
      refetchOnWindowFocus: false,
    }
  );

  console.log('📰 useArticles API result:', {
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
