import React from 'react';
import { cn } from '@musetrip360/ui-core/utils';
import type { ChatMessage as ChatMessageType } from '@/types';
import { ChatList } from './ChatList';
import { ChatInput } from './ChatInput';

export interface ChatProps {
  messages: ChatMessageType[];
  currentUserId?: string;
  currentUserName?: string;
  onSendMessage: (message: string) => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  emptyState?: React.ReactNode;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  currentUserId,
  currentUserName,
  onSendMessage,
  disabled = false,
  className,
  emptyState,
}) => {
  const handleSendMessage = async (messageText: string) => {
    if (!currentUserId || !currentUserName) {
      console.warn('Cannot send message: currentUserId or currentUserName is missing');
      return;
    }

    await onSendMessage(messageText);
  };

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Chat Messages */}
      <ChatList messages={messages} currentUserId={currentUserId} emptyState={emptyState} className="flex-1 min-h-0" />

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={disabled || !currentUserId || !currentUserName}
        placeholder={!currentUserId || !currentUserName ? 'Join the room to send messages...' : 'Type a message...'}
      />
    </div>
  );
};
