/* eslint-disable no-undef */
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@musetrip360/ui-core';
import { Message } from '@musetrip360/ai-bot';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RelatedDataPopover } from './RelatedDataPopover';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean; // For initial conversation/messages loading
  isTyping?: boolean; // For AI response typing indicator
  isSending?: boolean; // For user message sending state
  onSendMessage: (content: string) => void;
  selectedConversation: string | null;
}

const defaultPrompts = [
  'Tôi muốn tìm hiểu về bảo tàng lịch sử',
  'Làm thế nào để đặt tour ảo?',
  'Có những bảo tàng nào nổi tiếng?',
];

export function ChatInterface({
  messages,
  isLoading = false,
  isTyping = false,
  isSending = false,
  onSendMessage,
  selectedConversation,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'nearest' });
      return;
    }

    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  const forceScrollToBottom = useCallback(() => {
    scrollToBottom('auto');
    setTimeout(() => scrollToBottom('smooth'), 10);
    setTimeout(() => scrollToBottom('smooth'), 50);
    setTimeout(() => scrollToBottom('smooth'), 100);
  }, [scrollToBottom]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      forceScrollToBottom();
    }
  }, [messages, isTyping, forceScrollToBottom]);

  // Auto-scroll when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setTimeout(() => forceScrollToBottom(), 100);
    }
  }, [selectedConversation, forceScrollToBottom]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => {
      onSendMessage(prompt);
      setInputValue('');
    }, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!selectedConversation) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Chào mừng đến với AI Chat</h3>
            <p className="text-muted-foreground">Chọn cuộc trò chuyện để bắt đầu chat với trợ lý AI của chúng tôi</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Trợ lý AI MuseTrip</CardTitle>
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Đang tải cuộc trò chuyện...</span>
                </>
              ) : isTyping ? (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">AI đang trả lời...</span>
                </>
              ) : isSending ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Đang gửi...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Sẵn sàng</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={messagesContainerRef}>
            <div className="p-4">
              {isLoading && messages.length === 0 ? (
                <div className="space-y-4">
                  {/* Message loading skeletons - only when no messages exist */}
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0"></div>
                      <div className="space-y-2 flex-1">
                        <div className="bg-muted rounded-lg p-3 animate-pulse">
                          <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                        </div>
                        <div className="h-3 bg-muted-foreground/20 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6 py-8">
                  <div className="text-center space-y-2">
                    <h4 className="text-lg font-medium">Bắt đầu cuộc trò chuyện</h4>
                    <p className="text-muted-foreground">
                      Chọn chủ đề bên dưới hoặc hỏi bất kỳ điều gì về bảo tàng và tour du lịch
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                    {defaultPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start h-auto whitespace-normal p-3"
                        onClick={() => handlePromptClick(prompt)}
                        disabled={isLoading || isSending || isTyping}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={cn('flex gap-3', message.isBot ? 'justify-start' : 'justify-end')}>
                      {/* Bot Avatar */}
                      {message.isBot && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div className="flex flex-col gap-2 max-w-[80%]">
                        <div
                          className={cn(
                            'rounded-lg',
                            message.isBot ? 'bg-muted' : 'bg-primary text-primary-foreground ml-auto'
                          )}
                        >
                          {message.isBot ? (
                            <MarkdownRenderer content={message.content} className="p-3" />
                          ) : (
                            <div className="p-3 text-sm">{message.content}</div>
                          )}
                        </div>

                        {/* Related Data */}
                        {message.isBot && message.metadata?.relatedData && (
                          <RelatedDataPopover relatedData={message.metadata.relatedData} />
                        )}

                        {/* Timestamp */}
                        <span
                          className={cn('text-xs text-muted-foreground', message.isBot ? 'text-left' : 'text-right')}
                        >
                          {formatTime(message.createdAt)}
                        </span>
                      </div>

                      {/* User Avatar */}
                      {!message.isBot && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} style={{ height: '1px' }} />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <div className="flex space-x-2">
            <Input
              placeholder="Nhập tin nhắn của bạn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
              disabled={isLoading || isSending || isTyping}
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isSending || isTyping}
            >
              {isSending || isTyping ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
