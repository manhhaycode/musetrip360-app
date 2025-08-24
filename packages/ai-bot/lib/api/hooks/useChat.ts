import {
  APIError,
  CustomMutationOptions,
  PaginatedResponse,
  Pagination,
  useMutation,
} from '@musetrip360/query-foundation';

import { CreateMessage, CreateConversation, Message, Conversation, UpdateConversation } from '@/types';
import {
  createUserConversation,
  createUserMessage,
  deleteUserConversation,
  getConversationMessages,
  updateUserConversation,
  getUserConversations,
} from '../endpoints';

export function useCreateMessage(options?: CustomMutationOptions<Message, APIError, CreateMessage>) {
  return useMutation((data: CreateMessage) => createUserMessage(data), options);
}

export function useCreateConversation(options?: CustomMutationOptions<Conversation, APIError, CreateConversation>) {
  return useMutation((data: CreateConversation) => createUserConversation(data), options);
}

export function useUpdateConversation(options?: CustomMutationOptions<Conversation, APIError, UpdateConversation>) {
  return useMutation((data: UpdateConversation) => updateUserConversation(data), options);
}

export function useDeleteConversation(options?: CustomMutationOptions<void, APIError, string>) {
  return useMutation((conversationId: string) => deleteUserConversation(conversationId), options);
}

export function useGetConversationMessages(
  options?: CustomMutationOptions<PaginatedResponse<Message>, APIError, { conversationId: string } & Pagination>
) {
  return useMutation((data: { conversationId: string } & Pagination) => getConversationMessages(data), options);
}

export function useGetUserConversations(options?: CustomMutationOptions<Conversation[], APIError, null>) {
  return useMutation(() => getUserConversations(), options);
}
