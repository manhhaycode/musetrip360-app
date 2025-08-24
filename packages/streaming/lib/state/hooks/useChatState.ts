import { useEffect } from 'react';
import { useRoomStore } from '../store/roomStore';
import { useChatSelectors, useChatActions, useChatComputed } from '../store/chatStore';
import { chatService } from '@/api/chat';
import type { ChatMessage } from '@/types';

/**
 * Chat state hook that integrates with room state
 * Automatically syncs messages from room metadata and provides chat actions
 */
export const useChatState = () => {
  const chatActions = useChatActions();
  const chatSelectors = useChatSelectors();
  const chatComputed = useChatComputed();

  // Get current room state
  const currentRoom = useRoomStore((state) => state.currentRoom);

  // Note: Room metadata sync disabled in favor of real-time events
  // const roomMetadata = currentRoom?.Metadata;
  // useEffect(() => {
  //   chatActions.syncWithRoomMetadata(roomMetadata);
  // }, [roomMetadata, chatActions]);

  // Reset chat when room changes
  useEffect(() => {
    if (!currentRoom) {
      chatActions.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom?.Id, chatActions]); // Use stable chatActions reference

  // Setup SignalR event listener for real-time chat messages
  useEffect(() => {
    const client = chatService.getSignalRClient();
    if (!client) return;

    // Listen to ReceiveChatMessage events
    const handleChatMessage = (messageJson: string) => {
      chatActions.handleReceivedMessage(messageJson);
    };

    client.on('ReceiveChatMessage', handleChatMessage);

    return () => {
      client.off('ReceiveChatMessage');
    };
  }, [chatActions]);

  return {
    // State
    ...chatSelectors,
    ...chatComputed,

    // Room context
    currentRoom,
    roomId: currentRoom?.Id || null,

    // Actions
    ...chatActions,
  };
};

/**
 * Hook for chat message operations
 * Provides utilities for sending messages and managing chat state
 */
export const useChatMessages = () => {
  const { messages, addMessage, setSendingMessage, isSendingMessage } = useChatState();

  /**
   * Add a new message optimistically (before server confirmation)
   */
  const addOptimisticMessage = (
    senderId: string,
    senderName: string,
    messageText: string,
    messageType: 'text' | 'system' = 'text'
  ): ChatMessage => {
    const optimisticMessage: ChatMessage = {
      Id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`, // Use substring instead of deprecated substr
      SenderId: senderId,
      SenderName: senderName,
      Message: messageText,
      Timestamp: Date.now(),
      MessageType: messageType,
    };

    addMessage(optimisticMessage);
    return optimisticMessage;
  };

  /**
   * Create a system message (announcements, join/leave notifications)
   */
  const addSystemMessage = (messageText: string): ChatMessage => {
    const systemMessage: ChatMessage = {
      Id: `system-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`, // Use substring instead of deprecated substr
      SenderId: 'system',
      SenderName: 'System',
      Message: messageText,
      Timestamp: Date.now(),
      MessageType: 'system',
    };

    addMessage(systemMessage);
    return systemMessage;
  };

  return {
    messages,
    addOptimisticMessage,
    addSystemMessage,
    setSendingMessage,
    isSendingMessage,
    messageCount: messages.length,
    hasMessages: messages.length > 0,
    latestMessage: messages[messages.length - 1] || null,
  };
};

/**
 * Hook for typing indicators
 */
export const useTypingIndicators = () => {
  const { isTyping, setUserTyping, clearTypingIndicators } = useChatState();

  /**
   * Set typing indicator for a user with automatic timeout
   */
  const setTyping = (userId: string, _userName: string, isTypingNow: boolean) => {
    // Prefix unused param with underscore
    setUserTyping(userId, isTypingNow);

    // Clear typing indicator after 3 seconds of inactivity
    if (isTypingNow) {
      setTimeout(() => {
        setUserTyping(userId, false);
      }, 3000);
    }
  };

  /**
   * Get formatted typing indicator text
   */
  const getTypingText = (): string | null => {
    const typingUsers = Object.entries(isTyping)
      .filter(([, typing]) => typing) // Don't need userId in filter, so don't destructure
      .map(([userId]) => userId);

    if (typingUsers.length === 0) return null;

    if (typingUsers.length === 1) {
      return `Someone is typing...`;
    } else if (typingUsers.length === 2) {
      return `2 people are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return {
    isTyping,
    setTyping,
    clearTypingIndicators,
    getTypingText,
    typingCount: Object.values(isTyping).filter(Boolean).length,
  };
};
