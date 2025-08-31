import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  getQueryClient,
  PaginatedResponse,
  Pagination,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';
import { Article, ArticleCreate, ArticleUpdate } from '@/types';
import {
  createArticle,
  deleteArticle,
  getAdminArticles,
  getArticle,
  getArticlesByMuseum,
  updateArticle,
} from '../endpoints';
import { museumArticleManagementCacheKeys } from '../cache/cacheKeys';

export function useGetArticlesByMuseum(
  museumId: string,
  params: Pagination,
  options?: CustomQueryOptions<PaginatedResponse<Article>>
) {
  return useQuery(
    [museumArticleManagementCacheKeys.museumArticles(museumId, params)],
    () => getArticlesByMuseum(museumId, params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    }
  );
}

export function useGetAdminArticlesByMuseum(
  museumId: string,
  params: Pagination,
  options?: CustomQueryOptions<PaginatedResponse<Article>>
) {
  return useQuery(
    [museumArticleManagementCacheKeys.museumArticles(museumId, params)],
    () => getAdminArticles(museumId, params),
    {
      ...options,
    }
  );
}

export function useGetArticle(articleId: string, options?: CustomQueryOptions<Article>) {
  return useQuery([museumArticleManagementCacheKeys.article(articleId)], () => getArticle(articleId), {
    ...options,
  });
}

export function useCreateArticle(options?: CustomMutationOptions<Article, APIError, ArticleCreate>) {
  const queryClient = getQueryClient();
  const { onSuccess, ...optionMutate } = options || {};

  return useMutation((data: ArticleCreate) => createArticle(data), {
    ...optionMutate,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['museumArticleManagement', 'museumArticles'],
      });
      queryClient.removeQueries({
        queryKey: ['museumArticleManagement', 'museumArticles'],
      });
      onSuccess?.(data, variables, context);
    },
  });
}

export function useUpdateArticle(options?: CustomMutationOptions<Article, APIError, ArticleUpdate>) {
  const queryClient = getQueryClient();
  const { onSuccess, ...optionMutate } = options || {};
  return useMutation((data: ArticleUpdate) => updateArticle(data.id, data), {
    ...optionMutate,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['museumArticleManagement', 'museumArticles'],
      });
      queryClient.removeQueries({
        queryKey: ['museumArticleManagement', 'museumArticles'],
      });
      onSuccess?.(data, variables, context);
    },
  });
}

export function useDeleteArticle(options?: CustomMutationOptions<Article, APIError, string>) {
  const queryClient = getQueryClient();
  const { onSuccess, ...optionMutate } = options || {};

  return useMutation((id: string) => deleteArticle(id), {
    ...optionMutate,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['museumArticleManagement', 'museumArticles'],
      });
      queryClient.removeQueries({
        queryKey: ['museumArticleManagement', 'museumArticles'],
      });
      onSuccess?.(data, variables, context);
    },
  });
}
