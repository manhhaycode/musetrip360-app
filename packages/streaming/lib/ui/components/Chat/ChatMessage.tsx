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
        'flex gap-3 p-3 rounded-lg group hover:bg-muted/30 transition-colors',
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
      <div className={cn('flex-1 min-w-0', isOwnMessage ? 'text-right' : 'text-left')}>
        {/* Header */}
        <div
          className={cn('flex items-baseline gap-2 mb-1', isOwnMessage ? 'flex-row-reverse justify-start' : 'flex-row')}
        >
          <span className="font-medium text-sm truncate">{isOwnMessage ? 'You' : message.SenderName}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(message.Timestamp)}</span>
        </div>

        {/* Message Text */}
        <div
          className={cn(
            'p-2 rounded-md text-sm break-words',
            isOwnMessage ? 'bg-primary text-primary-foreground ml-8' : 'bg-muted mr-8'
          )}
        >
          <p className="leading-relaxed whitespace-pre-wrap">{message.Message}</p>
        </div>
      </div>
    </div>
  );
};
