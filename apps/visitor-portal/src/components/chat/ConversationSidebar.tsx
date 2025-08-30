'use client';

import React from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Card } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { Plus, MessageCircle, Search, Trash2, Bot, Edit2, Check, X } from 'lucide-react';
import { cn } from '@musetrip360/ui-core';
import { Conversation } from '@musetrip360/ai-bot';

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onUpdateConversation?: (conversationId: string, name: string) => void;
  isLoading?: boolean;
  isCreatingConversation?: boolean;
}

export function ConversationSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onUpdateConversation,
  isLoading = false,
  isCreatingConversation = false,
}: ConversationSidebarProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      'Cuộc trò chuyện mới'.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return new Date(date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' });
    } else {
      return new Date(date).toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditingName(conversation.name || 'Cuộc trò chuyện mới');
  };

  const handleSaveEdit = (conversationId: string) => {
    if (onUpdateConversation && editingName.trim()) {
      onUpdateConversation(conversationId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, conversationId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(conversationId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Trò chuyện AI</h2>
          </div>
          <Button
            onClick={onCreateConversation}
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLoading || isCreatingConversation}
          >
            {isCreatingConversation ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            // Enhanced loading state
            <div className="space-y-1">
              <div className="text-center text-muted-foreground py-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Đang tải cuộc trò chuyện...</span>
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="p-3 rounded-lg border animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-muted"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                      <div className="h-3 bg-muted rounded w-1/2 ml-6"></div>
                    </div>
                    <div className="h-3 bg-muted rounded w-12 ml-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchTerm ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có cuộc trò chuyện nào'}
              </p>
              {!searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateConversation}
                  className="mt-2"
                  disabled={isCreatingConversation}
                >
                  {isCreatingConversation ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Bắt đầu trò chuyện
                </Button>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-accent group',
                  selectedConversation === conversation.id
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'hover:border-border'
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      {editingId === conversation.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => handleEditKeyPress(e, conversation.id)}
                          className="text-sm h-6 py-1 px-2 flex-1"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <p className="text-sm font-medium truncate">{conversation.name || 'Cuộc trò chuyện mới'}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Trợ lý AI • {formatDate(conversation.updatedAt)}</p>
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(conversation.updatedAt)}
                    </span>
                    {editingId === conversation.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveEdit(conversation.id);
                          }}
                        >
                          <Check className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelEdit();
                          }}
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {onUpdateConversation && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(conversation);
                            }}
                          >
                            <Edit2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
