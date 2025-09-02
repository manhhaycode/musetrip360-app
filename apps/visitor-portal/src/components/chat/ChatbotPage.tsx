/* eslint-disable import/no-extraneous-dependencies */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ConversationSidebar } from './ConversationSidebar';
import { ChatInterface } from './ChatInterface';
import {
  useCreateConversation,
  useDeleteConversation,
  useUpdateConversation,
  useGetUserConversations,
  useGetConversationMessages,
  useCreateMessage,
  Conversation,
  Message,
} from '@musetrip360/ai-bot';
import { toast } from 'sonner';
import get from 'lodash/get';

interface ChatbotPageProps {
  initialConversationId?: string;
}

export function ChatbotPage({ initialConversationId }: ChatbotPageProps = {}) {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialConversationId || null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // API Hooks with memoized callbacks
  const handleConversationsSuccess = useCallback(
    (response: any) => {
      if (response && Array.isArray(response)) {
        const sortedConversations = response.sort(
          (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setConversations(sortedConversations);

        // Auto-select first conversation if none selected and no initial conversation ID
        if (!selectedConversation && !initialConversationId && sortedConversations && sortedConversations.length > 0) {
          const firstConversationId = get(sortedConversations, '[0].id');
          setSelectedConversation(firstConversationId);
          if (firstConversationId) {
            router.replace(`/chatbot/${firstConversationId}`, { scroll: false });
          }
        }

        // If initial conversation ID provided, select it if it exists
        if (initialConversationId && sortedConversations.some((conv: any) => conv.id === initialConversationId)) {
          setSelectedConversation(initialConversationId);
        }
      }
    },
    [selectedConversation, initialConversationId, router]
  );

  const handleConversationsError = useCallback((error: any) => {
    console.error('Failed to fetch conversations:', error);
    toast.error('Không thể tải cuộc trò chuyện');
  }, []);

  const { mutate: fetchConversations, isPending: isLoadingConversations } = useGetUserConversations(
    useMemo(
      () => ({
        onSuccess: handleConversationsSuccess,
        onError: handleConversationsError,
      }),
      [handleConversationsSuccess, handleConversationsError]
    )
  );

  const handleMessagesSuccess = useCallback((response: any) => {
    const newMessages = get(response, 'messages', []) as Message[];
    if (Array.isArray(newMessages)) {
      const sortedMessages = newMessages.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Replace all temporary messages with real messages from server
      setMessages(sortedMessages);
      setIsTyping(false); // Stop typing indicator when real messages are loaded
    }
  }, []);

  const handleMessagesError = useCallback((error: any) => {
    console.error('Failed to fetch messages:', error);
    toast.error('Không thể tải tin nhắn');
    setIsTyping(false); // Reset typing state on error
  }, []);

  const { mutate: fetchMessages, isPending: isLoadingMessages } = useGetConversationMessages(
    useMemo(
      () => ({
        onSuccess: handleMessagesSuccess,
        onError: handleMessagesError,
      }),
      [handleMessagesSuccess, handleMessagesError]
    )
  );

  const handleCreateConversationSuccess = useCallback(
    (response: any) => {
      if (response) {
        const newConversation = response;
        setConversations((prev) => [newConversation, ...prev]);
        setSelectedConversation(newConversation.id);
        setMessages([]);
        router.push(`/chatbot/${newConversation.id}`, { scroll: false });
        toast.success('Đã tạo cuộc trò chuyện mới');
      }
    },
    [router]
  );

  const handleCreateConversationError = useCallback((error: any) => {
    console.error('Failed to create conversation:', error);
    toast.error('Không thể tạo cuộc trò chuyện');
  }, []);

  const { mutate: createConversation, isPending: isCreatingConversation } = useCreateConversation({
    onSuccess: handleCreateConversationSuccess,
    onError: handleCreateConversationError,
  });

  const handleDeleteConversationSuccess = useCallback(
    (_: unknown, conversationId: string) => {
      setConversations((prev) => {
        const filtered = prev.filter((conv) => conv.id !== conversationId);

        // Handle navigation logic only if deleting current conversation
        if (selectedConversation === conversationId) {
          if (filtered && filtered.length > 0) {
            const nextConversationId = get(filtered, '[0].id');
            setSelectedConversation(nextConversationId);
            if (nextConversationId) {
              router.replace(`/chatbot/${nextConversationId}`, { scroll: false });
            }
          } else {
            setSelectedConversation(null);
            router.replace('/chatbot', { scroll: false });
          }
        }

        return filtered;
      });
      toast.success('Đã xóa cuộc trò chuyện');
    },
    [selectedConversation, router]
  );

  const handleDeleteConversationError = useCallback((error: any) => {
    console.error('Failed to delete conversation:', error);
    toast.error('Không thể xóa cuộc trò chuyện');
  }, []);

  const { mutate: deleteConversation } = useDeleteConversation({
    onSuccess: handleDeleteConversationSuccess,
    onError: handleDeleteConversationError,
  });

  const handleCreateMessageSuccess = useCallback(
    (response: any) => {
      if (response) {
        // Since API call has isBot: true, the response will contain both user and AI messages
        // We need to keep our mocked user message and wait for the real AI response
        setMessages((prev) => {
          // Just wait for the polling to fetch real messages
          // Keep our temporary messages until real ones arrive
          return prev;
        });

        // Always wait for AI response when message is sent
        if (selectedConversation) {
          // Keep typing indicator active - will be turned off when real messages arrive
          setTimeout(() => {
            fetchMessages({
              conversationId: selectedConversation,
              Page: 1,
              PageSize: 100,
            });
          }, 1500);
        }
      }
    },
    [selectedConversation, fetchMessages]
  );

  const handleCreateMessageError = useCallback((error: any) => {
    setIsTyping(false);
    console.error('Failed to create message:', error);
    toast.error('Không thể gửi tin nhắn');
  }, []);

  const { mutate: createMessage, isPending: isSendingMessage } = useCreateMessage({
    onSuccess: handleCreateMessageSuccess,
    onError: handleCreateMessageError,
  });

  // Load conversations on component mount (only once)
  useEffect(() => {
    fetchConversations(null);
  }, [fetchConversations]); // Include fetchConversations in dependencies

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setMessages([]); // Clear messages immediately
      setIsTyping(false); // Reset typing state when switching conversations
      fetchMessages({
        conversationId: selectedConversation,
        Page: 1,
        PageSize: 100,
      });
    }
  }, [selectedConversation, fetchMessages]); // Include fetchMessages in dependencies

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      if (conversationId === selectedConversation) return; // Prevent unnecessary updates

      setSelectedConversation(conversationId);
      router.push(`/chatbot/${conversationId}`, { scroll: false });
    },
    [selectedConversation, router]
  );

  const handleCreateConversation = useCallback(() => {
    createConversation({
      isBot: true, // Always true for AI conversations
      name: `Trò chuyện mới ${conversations.length + 1}`,
    });
  }, [createConversation, conversations.length]);

  const handleDeleteConversation = useCallback(
    (conversationId: string) => {
      if (conversations.length <= 1) {
        toast.error('Không thể xóa cuộc trò chuyện cuối cùng');
        return;
      }
      deleteConversation(conversationId);
    },
    [conversations.length, deleteConversation]
  );

  const handleUpdateConversationSuccess = useCallback((response: any) => {
    if (response) {
      const updatedConversation = response;
      setConversations((prev) => prev.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)));
      toast.success('Đã cập nhật tên cuộc trò chuyện');
    }
  }, []);

  const handleUpdateConversationError = useCallback((error: any) => {
    console.error('Failed to update conversation:', error);
    toast.error('Không thể cập nhật tên cuộc trò chuyện');
  }, []);

  const { mutate: updateConversation } = useUpdateConversation({
    onSuccess: handleUpdateConversationSuccess,
    onError: handleUpdateConversationError,
  });

  const handleUpdateConversation = useCallback(
    (conversationId: string, name: string) => {
      updateConversation({
        id: conversationId,
        name,
        isBot: true,
      });
    },
    [updateConversation]
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedConversation) {
        toast.error('Vui lòng chọn hoặc tạo cuộc trò chuyện trước');
        return;
      }

      if (isSendingMessage) {
        toast.error('Vui lòng đợi tin nhắn trước được gửi');
        return;
      }

      // 1. Add only AI placeholder message with loading animation
      const tempAiMessage: Message = {
        id: `temp-ai-${Date.now()}`,
        conversationId: selectedConversation,
        content: '...', // Will be replaced by real response
        isBot: true,
        createdAt: new Date(),
        createdBy: 'ai-bot',
        createdUser: { id: 'ai-bot', name: 'AI Assistant' } as any,
      };

      // 2. Update UI with only AI loading placeholder
      setMessages((prev) => [...prev, tempAiMessage]);
      setIsTyping(true);

      // 4. Send to API with isBot: true to trigger AI response
      createMessage({
        conversationId: selectedConversation,
        content,
        isBot: true, // ✅ CORRECT: This tells backend to generate AI response
      });
    },
    [selectedConversation, isSendingMessage, createMessage]
  );

  // Memoize loading states for better performance
  const chatLoadingStates = useMemo(
    () => ({
      isLoading: isLoadingMessages,
      isTyping: isTyping,
      isSending: isSendingMessage,
    }),
    [isLoadingMessages, isTyping, isSendingMessage]
  );

  return (
    <div className="h-[calc(100vh-80px)] flex gap-4 p-4">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <ConversationSidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
          onUpdateConversation={handleUpdateConversation}
          isLoading={isLoadingConversations}
          isCreatingConversation={isCreatingConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatInterface
          messages={messages}
          isLoading={chatLoadingStates.isLoading}
          isTyping={chatLoadingStates.isTyping}
          isSending={chatLoadingStates.isSending}
          onSendMessage={handleSendMessage}
          selectedConversation={selectedConversation}
        />
      </div>
    </div>
  );
}
