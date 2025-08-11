import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
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
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    }
  );
}

export function useGetArticle(articleId: string, options?: CustomQueryOptions<Article>) {
  return useQuery([museumArticleManagementCacheKeys.article(articleId)], () => getArticle(articleId), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useCreateArticle(options?: CustomMutationOptions<Article, APIError, ArticleCreate>) {
  return useMutation((data: ArticleCreate) => createArticle(data), options);
}

export function useUpdateArticle(options?: CustomMutationOptions<Article, APIError, ArticleUpdate>) {
  return useMutation((data: ArticleUpdate) => updateArticle(data.id, data), options);
}

export function useDeleteArticle(options?: CustomMutationOptions<Article, APIError, string>) {
  return useMutation((id: string) => deleteArticle(id), options);
}
