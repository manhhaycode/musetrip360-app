import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { ChatMessage } from '@/types';
import { useShallow } from 'zustand/shallow';

// Chat Store State
interface ChatStoreState {
  // Messages from current room
  messages: ChatMessage[];

  // UI State
  unreadCount: number;
  lastSeenMessageId: string | null;

  // Input State
  currentMessage: string;
  isSendingMessage: boolean;
}

// Chat Store Actions
interface ChatStoreActions {
  // Message Management
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;

  // Unread Management
  markAsRead: () => void;
  incrementUnread: () => void;
  setUnreadCount: (count: number) => void;

  // Input Management
  setCurrentMessage: (message: string) => void;
  setSendingMessage: (isSending: boolean) => void;

  // Real-time Message Handling
  handleReceivedMessage: (messageJson: string, currentUserId?: string) => void;

  // Utilities
  reset: () => void;
}

type ChatStore = ChatStoreState & ChatStoreActions;

// Initial State
const initialState: ChatStoreState = {
  messages: [],
  unreadCount: 0,
  lastSeenMessageId: null,
  currentMessage: '',
  isSendingMessage: false,
};

// Store Implementation
export const useChatStore = create<ChatStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Message Management
      setMessages: (messages) => set({ messages }, false, 'setMessages'),

      addMessage: (message) =>
        set(
          (state) => {
            const exists = state.messages.some((msg) => msg.Id === message.Id);
            if (exists) return state;

            return {
              messages: [...state.messages, message].sort((a, b) => a.Timestamp - b.Timestamp),
            };
          },
          false,
          'addMessage'
        ),

      clearMessages: () => set({ messages: [] }, false, 'clearMessages'),

      // Unread Management
      markAsRead: () => {
        const { messages } = get();
        const lastMessage = messages[messages.length - 1];
        set(
          {
            unreadCount: 0,
            lastSeenMessageId: lastMessage?.Id || null,
          },
          false,
          'markAsRead'
        );
      },

      incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 }), false, 'incrementUnread'),

      setUnreadCount: (count) => set({ unreadCount: count }, false, 'setUnreadCount'),

      // Input Management
      setCurrentMessage: (message) => set({ currentMessage: message }, false, 'setCurrentMessage'),

      setSendingMessage: (isSending) => set({ isSendingMessage: isSending }, false, 'setSendingMessage'),

      // Real-time Message Handling
      handleReceivedMessage: (messageJson, currentUserId) => {
        try {
          const message: ChatMessage = JSON.parse(messageJson);
          const currentMessages = get().messages;

          // Check if message already exists (avoid duplicates)
          const exists = currentMessages.some((msg) => msg.Id === message.Id);
          if (!exists) {
            // Check if message is from another user to increment unread count
            const isFromOtherUser = currentUserId && message.SenderId !== currentUserId;

            set(
              (state) => ({
                messages: [...state.messages, message].sort((a, b) => a.Timestamp - b.Timestamp),
                // Increment unread count only for messages from other users
                unreadCount: isFromOtherUser ? state.unreadCount + 1 : state.unreadCount,
              }),
              false,
              'handleReceivedMessage'
            );
          }
        } catch (error) {
          console.error('Failed to parse received chat message:', error);
        }
      },

      // Utilities
      reset: () => set(initialState, false, 'reset'),
    })),
    {
      name: 'chat-store',
    }
  )
);

// Selectors for optimized subscriptions
export const useChatSelectors = () => {
  const messages = useChatStore((state) => state.messages);
  const unreadCount = useChatStore((state) => state.unreadCount);
  const currentMessage = useChatStore((state) => state.currentMessage);
  const isSendingMessage = useChatStore((state) => state.isSendingMessage);

  return {
    messages,
    unreadCount,
    currentMessage,
    isSendingMessage,
  };
};

// Actions selector
export const useChatActions = () => {
  return useChatStore(
    useShallow((state) => ({
      setMessages: state.setMessages,
      addMessage: state.addMessage,
      clearMessages: state.clearMessages,
      markAsRead: state.markAsRead,
      incrementUnread: state.incrementUnread,
      setUnreadCount: state.setUnreadCount,
      setCurrentMessage: state.setCurrentMessage,
      setSendingMessage: state.setSendingMessage,
      handleReceivedMessage: state.handleReceivedMessage,
      reset: state.reset,
    }))
  );
};

// Computed values
export const useChatComputed = () => {
  const messages = useChatStore((state) => state.messages);

  return {
    // Get latest message
    latestMessage: messages[messages.length - 1] || null,

    // Message count
    messageCount: messages.length,

    // Has messages
    hasMessages: messages.length > 0,
  };
};
