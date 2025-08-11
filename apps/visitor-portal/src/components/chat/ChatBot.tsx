'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { cn } from '@musetrip360/ui-core';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const defaultPrompts = [
  'Tôi muốn tìm hiểu về bảo tàng lịch sử',
  'Làm thế nào để đặt tour ảo?',
  'Có những bảo tàng nào nổi tiếng?',
  'Tính năng VR hoạt động như thế nào?',
];

const botResponses = {
  greeting:
    'Chào bạn! Tôi là trợ lý AI của MuseTrip360, một hệ thống quản lý bảo tàng hiện đại, có khả năng mở rộng. MuseTrip360 là một hệ thống quản lý bảo tàng hiện đại, được thiết kế để tối ưu hóa hoạt động và nâng cao trải nghiệm của du khách. Nền tảng này hỗ trợ nhân viên bảo tàng quản lý hiện vật, sự kiện, vé và các chuyến tham quan ảo, đồng thời giúp du khách dễ dàng tiếp cận nội dung bảo tàng cùng với các đề xuất cá nhân hóa. Tôi có thể giúp bạn khám phá các bảo tàng và trải nghiệm tour ảo. Bạn cần hỗ trợ gì hôm nay?',
  museums:
    'MuseTrip360 có hơn 200+ bảo tàng từ khắp nơi trên thế giới, bao gồm Louvre, British Museum, Metropolitan Museum, và nhiều bảo tàng Việt Nam như Bảo tàng Lịch sử Quốc gia, Bảo tàng Dân tộc học...',
  booking:
    'Để đặt tour ảo rất đơn giản! Bạn chỉ cần: 1) Chọn bảo tàng yêu thích, 2) Chọn thời gian phù hợp, 3) Bắt đầu trải nghiệm ngay lập tức. Tour ảo hoàn toàn miễn phí!',
  vr: 'Tính năng VR của chúng tôi sử dụng công nghệ 360° tiên tiến, cho phép bạn khám phá bảo tàng như thể đang có mặt tại đó. Bạn có thể sử dụng kính VR hoặc xem trực tiếp trên máy tính/điện thoại.',
  default:
    'Cảm ơn bạn đã hỏi! Tôi đang học hỏi thêm để có thể hỗ trợ bạn tốt hơn. Hiện tại, bạn có thể khám phá các bảo tàng trên trang chủ hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi.',
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting when chat opens
      setTimeout(() => {
        addBotMessage(botResponses.greeting);
      }, 500);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (content: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(
      () => {
        addMessage(content, 'bot');
        setIsTyping(false);
      },
      1000 + Math.random() * 1000
    ); // Random delay between 1-2 seconds
  };

  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();

    if (message.includes('bảo tàng') || message.includes('museum')) {
      return botResponses.museums;
    }
    if (message.includes('đặt') || message.includes('tour') || message.includes('booking')) {
      return botResponses.booking;
    }
    if (message.includes('vr') || message.includes('thực tế ảo')) {
      return botResponses.vr;
    }
    if (message.includes('xin chào') || message.includes('hello') || message.includes('hi')) {
      return botResponses.greeting;
    }

    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, 'user');

    // Get bot response
    const response = getBotResponse(inputValue);
    addBotMessage(response);

    setInputValue('');
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-4 w-96 h-[600px] shadow-2xl border-2 z-50 flex flex-col">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm">MuseTrip AI Assistant</CardTitle>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col overflow-y-auto">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col justify-end p-4 space-y-3">
                  <div className="text-center text-sm text-muted-foreground">
                    Bắt đầu cuộc trò chuyện với AI Assistant
                  </div>
                  <div className="space-y-2">
                    {defaultPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start h-auto whitespace-normal p-2"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn('flex gap-2', message.sender === 'user' ? 'justify-end' : 'justify-start')}
                      >
                        {message.sender === 'bot' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'max-w-[80%] p-3 rounded-lg text-sm',
                            message.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                          )}
                        >
                          {message.content}
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-gray-600" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-2 justify-start">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-sm">
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
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendMessage} disabled={!inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Float Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          'fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 z-40',
          'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          </>
        )}
      </Button>
    </>
  );
}
