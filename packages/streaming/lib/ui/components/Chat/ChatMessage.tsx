import React from 'react';
import { Avatar, AvatarFallback } from '@musetrip360/ui-core/avatar';
import { Badge } from '@musetrip360/ui-core/badge';
import { cn } from '@musetrip360/ui-core/utils';
import type { ChatMessage as ChatMessageType } from '@/types';

export interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage = false, className }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Enhanced message rendering với URL detection
  const renderMessageContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'underline hover:no-underline transition-colors break-all',
              isOwnMessage
                ? 'text-primary-foreground/80 hover:text-primary-foreground'
                : 'text-primary hover:text-primary/80'
            )}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  if (message.MessageType === 'system') {
    return (
      <div className={cn('flex justify-center my-2', className)}>
        <Badge variant="secondary" className="text-xs px-2 py-1">
          {message.Message}
        </Badge>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-full gap-3 p-3 rounded-lg group hover:bg-muted/30 transition-colors',
        'overflow-hidden', // Prevent container overflow
        isOwnMessage ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-muted">{getInitials(message.SenderName)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={cn('flex-1 min-w-0 max-w-full', isOwnMessage ? 'text-right' : 'text-left')}>
        {/* Header */}
        <div
          className={cn('flex items-baseline gap-2 mb-1', isOwnMessage ? 'flex-row-reverse justify-start' : 'flex-row')}
        >
          <span
            style={{
              maxWidth: '150px',
            }}
            className="font-medium text-sm truncate"
          >
            {isOwnMessage ? 'You' : message.SenderName}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(message.Timestamp)}</span>
        </div>

        {/* Message Text */}
        <div
          className={cn(
            'p-3 rounded-lg text-sm max-w-full',
            'break-words hyphens-auto overflow-hidden',
            isOwnMessage ? 'bg-primary text-primary-foreground ml-8' : 'bg-muted mr-8'
          )}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          <div className="leading-relaxed max-w-full whitespace-pre-wrap">{renderMessageContent(message.Message)}</div>
        </div>
      </div>
    </div>
  );
};
