import { useGetArticlesByMuseum } from '@musetrip360/museum-management/api';

interface ArticleSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
}

export const useArticles = (params?: ArticleSearchParams) => {
  // Use real API exactly like visitor-portal
  const apiResult = useGetArticlesByMuseum(
    params?.museumId || '',
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 10,
    },
    {
      enabled: !!params?.museumId,
    }
  );

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};
