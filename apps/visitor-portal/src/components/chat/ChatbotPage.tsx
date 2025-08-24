/* eslint-disable import/no-extraneous-dependencies */
'use client';

import React, { useState, useEffect } from 'react';
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

  // API Hooks
  const { mutate: fetchConversations, isPending: isLoadingConversations } = useGetUserConversations({
    onSuccess: (response) => {
      if (response && Array.isArray(response)) {
        const sortedConversations = response.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
        if (initialConversationId && sortedConversations.some((conv) => conv.id === initialConversationId)) {
          setSelectedConversation(initialConversationId);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to fetch conversations:', error);
      toast.error('Không thể tải cuộc trò chuyện');
    },
  });

  const { mutate: fetchMessages, isPending: isLoadingMessages } = useGetConversationMessages({
    onSuccess: (response) => {
      const messages = get(response, 'messages', []) as Message[];
      if (Array.isArray(messages)) {
        const sortedMessages = messages.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
      }
    },
    onError: (error) => {
      console.error('Failed to fetch messages:', error);
      toast.error('Không thể tải tin nhắn');
    },
  });

  const { mutate: createConversation, isPending: isCreatingConversation } = useCreateConversation({
    onSuccess: (response) => {
      if (response) {
        const newConversation = response;
        setConversations((prev) => [newConversation, ...prev]);
        setSelectedConversation(newConversation.id);
        setMessages([]);
        router.push(`/chatbot/${newConversation.id}`, { scroll: false });
        toast.success('Đã tạo cuộc trò chuyện mới');
      }
    },
    onError: (error) => {
      console.error('Failed to create conversation:', error);
      toast.error('Không thể tạo cuộc trò chuyện');
    },
  });

  const { mutate: deleteConversation } = useDeleteConversation({
    onSuccess: (_, conversationId) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
      if (selectedConversation === conversationId) {
        const remaining = conversations.filter((conv) => conv.id !== conversationId);
        if (remaining && remaining.length > 0) {
          const nextConversationId = get(remaining, '[0].id');
          setSelectedConversation(nextConversationId);
          if (nextConversationId) {
            router.replace(`/chatbot/${nextConversationId}`, { scroll: false });
          }
        } else {
          setSelectedConversation(null);
          router.replace('/chatbot', { scroll: false });
        }
      }
      toast.success('Đã xóa cuộc trò chuyện');
    },
    onError: (error) => {
      console.error('Failed to delete conversation:', error);
      toast.error('Không thể xóa cuộc trò chuyện');
    },
  });

  const { mutate: createMessage, isPending: isSendingMessage } = useCreateMessage({
    onSuccess: (response) => {
      if (response) {
        const newMessage = response;
        setMessages((prev) => [...prev, newMessage]);

        // If this was a user message, refetch messages to get AI response
        if (!newMessage.isBot && selectedConversation) {
          setIsTyping(true);
          // Refetch messages after a short delay to get AI response
          setTimeout(() => {
            fetchMessages({
              conversationId: selectedConversation,
              Page: 1,
              PageSize: 100,
            });
          }, 1000);
        } else if (newMessage.isBot) {
          setIsTyping(false);
        }
      }
    },
    onError: (error) => {
      setIsTyping(false);
      console.error('Failed to create message:', error);
      toast.error('Không thể gửi tin nhắn');
    },
  });

  // Load conversations on component mount
  useEffect(() => {
    fetchConversations(null);
  }, [fetchConversations]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages({
        conversationId: selectedConversation,
        Page: 1,
        PageSize: 100,
      });
    }
  }, [selectedConversation, fetchMessages]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setMessages([]); // Clear messages while loading
    router.push(`/chatbot/${conversationId}`, { scroll: false });
  };

  const handleCreateConversation = () => {
    createConversation({
      isBot: true, // Always true for AI conversations
      name: `Trò chuyện mới ${conversations.length + 1}`,
    });
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (conversations.length <= 1) {
      toast.error('Không thể xóa cuộc trò chuyện cuối cùng');
      return;
    }
    deleteConversation(conversationId);
  };

  const { mutate: updateConversation } = useUpdateConversation({
    onSuccess: (response) => {
      if (response) {
        const updatedConversation = response;
        setConversations((prev) =>
          prev.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv))
        );
        toast.success('Đã cập nhật tên cuộc trò chuyện');
      }
    },
    onError: (error) => {
      console.error('Failed to update conversation:', error);
      toast.error('Không thể cập nhật tên cuộc trò chuyện');
    },
  });

  const handleUpdateConversation = (conversationId: string, name: string) => {
    updateConversation({
      id: conversationId,
      name,
      isBot: true,
    });
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) {
      toast.error('Vui lòng chọn hoặc tạo cuộc trò chuyện trước');
      return;
    }

    if (isSendingMessage) {
      toast.error('Vui lòng đợi tin nhắn trước được gửi');
      return;
    }

    createMessage({
      conversationId: selectedConversation,
      content,
      isBot: true,
    });
  };

  // Combine different loading states for typing indicator
  const isAnyLoading = isSendingMessage || isTyping;

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
          isLoading={isLoadingMessages}
          isTyping={isAnyLoading}
          onSendMessage={handleSendMessage}
          selectedConversation={selectedConversation}
        />
      </div>
    </div>
  );
}
