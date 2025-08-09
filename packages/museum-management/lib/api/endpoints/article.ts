/**
 * @fileoverview Museum Article management
 *
 * API endpoints for museum article management.
 */

import { APIResponse, getHttpClient, PaginatedResponse, Pagination } from '@musetrip360/query-foundation';
import { Article, ArticleCreate, ArticleUpdate } from '@/types';

/**
 * Museum Article API endpoints configuration
 */
export const articleEndpoints = {
  getArticlesByMuseum: () => `articles`,
  getAdminArticles: () => `articles/admin`,
  getArticle: (articleId: string) => `articles/${articleId}`,
  createArticle: 'articles',
  updateArticle: (articleId: string) => `articles/${articleId}`,
  deleteArticle: (articleId: string) => `articles/${articleId}`,
} as const;

export const getArticlesByMuseum = async (museumId: string, params: Pagination) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Article>>>(
    articleEndpoints.getArticlesByMuseum(),
    {
      params: {
        ...params,
        MuseumId: museumId,
      },
    }
  );
  return response.data;
};

export const getAdminArticles = async (museumId: string, params: Pagination) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Article>>>(articleEndpoints.getAdminArticles(), {
    params: {
      ...params,
      MuseumId: museumId,
    },
  });
  return response.data;
};

export const getArticle = async (articleId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Article>>(articleEndpoints.getArticle(articleId));
  return response.data;
};

export const createArticle = async (data: ArticleCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Article>>(articleEndpoints.createArticle, data);
  return response.data;
};

export const updateArticle = async (articleId: string, data: ArticleUpdate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Article>>(articleEndpoints.updateArticle(articleId), data);
  return response.data;
};

export const deleteArticle = async (articleId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.delete<APIResponse<Article>>(articleEndpoints.deleteArticle(articleId));
  return response.data;
};
