import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { Button } from '@musetrip360/ui-core/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@musetrip360/ui-core/utils';
import type { ChatMessage as ChatMessageType } from '@/types';
import { ChatMessage } from './ChatMessage';

export interface ChatListProps {
  messages: ChatMessageType[];
  currentUserId?: string;
  className?: string;
  emptyState?: React.ReactNode;
}

export const ChatList: React.FC<ChatListProps> = ({ messages, currentUserId, className, emptyState }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollToBottom(!isNearBottom && messages.length > 0);
    setIsAutoScrolling(isNearBottom);
  };

  const handleScrollToBottomClick = () => {
    setIsAutoScrolling(true);
    scrollToBottom();
  };

  // Auto-scroll on new messages if user is at bottom
  useEffect(() => {
    if (isAutoScrolling && messages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToBottom(false), 50);
    }
  }, [messages, isAutoScrolling]);

  // Sort messages by timestamp
  const sortedMessages = [...messages].sort((a, b) => a.Timestamp - b.Timestamp);

  if (messages.length === 0) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        {emptyState || (
          <div className="text-center text-muted-foreground p-8">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        flex: '1 0 0',
      }}
      className={cn('relative min-h-0 flex', className)}
    >
      <ScrollArea ref={scrollAreaRef} className="flex-1" onScrollCapture={handleScroll}>
        <div className="p-2 space-y-1">
          {sortedMessages.map((message) => (
            <ChatMessage key={message.Id} message={message} isOwnMessage={currentUserId === message.SenderId} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleScrollToBottomClick}
            className="h-8 w-8 rounded-full p-0 shadow-lg"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
