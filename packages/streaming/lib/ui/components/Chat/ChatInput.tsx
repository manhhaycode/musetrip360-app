import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { cn } from '@musetrip360/ui-core/utils';

export interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
  className,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSendMessage(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    // const maxHeight = 120; // Max 4-5 lines
    // textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
  };

  return (
    <div className={cn('border-t bg-background p-4', className)}>
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className={cn(
              'min-h-[40px] max-h-[120px] resize-none pr-12',
              'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'
            )}
            rows={1}
          />
        </div>

        <Button
          size="sm"
          onClick={handleSend}
          disabled={!message.trim() || isSending || disabled}
          className="flex-shrink-0 h-10 w-10 p-0"
        >
          <Send className={cn('h-4 w-4', isSending && 'animate-pulse')} />
        </Button>
      </div>
    </div>
  );
};
