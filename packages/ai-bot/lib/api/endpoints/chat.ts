/**
 * @fileoverview Museum AI Chat Endpoints
 *
 * API endpoints for museum chat operations.
 */

import { APIResponse, getHttpClient, PaginatedResponse, Pagination } from '@musetrip360/query-foundation';

import { Message, Conversation, CreateConversation, CreateMessage, UpdateConversation } from '@/types';

export const chatEndpoints = {
  conversations: '/messaging/conversations',
  conversationById: (conversationId: string) => `/messaging/conversations/${conversationId}`,
  conversationMessages: (conversationId: string) => `/messaging/conversations/${conversationId}/messages`,
  messages: '/messaging/messages',
};

export const getUserConversations = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Conversation[]>>(chatEndpoints.conversations);
  return response.data;
};

export const createUserConversation = async (data: CreateConversation) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Conversation>>(chatEndpoints.conversations, data);
  return response.data;
};

export const updateUserConversation = async (data: UpdateConversation) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Conversation>>(chatEndpoints.conversationById(data.id), data);
  return response.data;
};

export const deleteUserConversation = async (conversationId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.delete<APIResponse<void>>(chatEndpoints.conversationById(conversationId));
  return response.data;
};

export const createUserMessage = async (data: CreateMessage) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Message>>(chatEndpoints.messages, data);
  return response.data;
};

export const getConversationMessages = async ({
  conversationId,
  Page,
  PageSize,
}: Pagination & { conversationId: string }) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Message>>>(
    chatEndpoints.conversationMessages(conversationId),
    {
      params: {
        Page,
        PageSize,
      },
    }
  );
  return response.data;
};
