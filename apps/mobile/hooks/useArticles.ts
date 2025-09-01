import { useGetArticle, useGetArticlesByMuseum } from '@musetrip360/museum-management/api';

interface ArticleSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
}

export const useArticles = (params?: ArticleSearchParams, options?: { enabled?: boolean }) => {
  // Use real API
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

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

// New hook for getting article details by ID
export const useArticleDetail = (articleId: string, options?: { enabled?: boolean }) => {
  const apiResult = useGetArticle(articleId, {
    enabled: options?.enabled !== false && !!articleId,
    refetchOnWindowFocus: false,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

export type { ArticleSearchParams };
