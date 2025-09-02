import { Badge } from '@/components/core/ui/badge';
import { AIChatRelatedData, Conversation, Message } from '@musetrip360/ai-bot';
import {
  useCreateConversation,
  useCreateMessage,
  useGetConversationMessages,
  useGetUserConversations,
} from '@musetrip360/ai-bot/api';
import { router } from 'expo-router';
import {
  Archive,
  Bot,
  CalendarRange,
  ExternalLink,
  Globe,
  Landmark,
  Loader,
  MessageCircle,
  Plus,
  Send,
  User,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const defaultPrompts = [
  'Tôi muốn tìm hiểu về bảo tàng lịch sử',
  'Làm thế nào để đặt tour ảo?',
  'Có những bảo tàng nào nổi tiếng?',
  'Tính năng VR hoạt động như thế nào?',
];

function AvatarBot() {
  return (
    <View className="w-8 h-8 rounded-full bg-primary justify-center items-center mr-2">
      <Bot size={20} color="#fff" />
    </View>
  );
}

function AvatarUser() {
  return (
    <View className="w-8 h-8 rounded-full bg-muted justify-center items-center ml-2">
      <User size={20} color="#3b82f6" />
    </View>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  return <Text className="text-base text-lucid-foreground">{content}</Text>;
}

function TypingIndicator() {
  const [opacities, setOpacities] = useState([1, 0.5, 0.2]);
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      setOpacities([
        0.2 + 0.8 * Math.abs(Math.sin((tick + 0) * 1.5)),
        0.2 + 0.8 * Math.abs(Math.sin((tick + 1) * 1.5)),
        0.2 + 0.8 * Math.abs(Math.sin((tick + 2) * 1.5)),
      ]);
      tick += 0.3;
    }, 120);
    return () => clearInterval(interval);
  }, []);
  return (
    <View className="flex-row items-center mb-3">
      <AvatarBot />
      <View className="flex-row items-center bg-lucid-muted rounded-xl p-3">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#64748b',
              marginRight: i < 2 ? 2 : 0,
              opacity: opacities[i],
            }}
          />
        ))}
      </View>
    </View>
  );
}

function getTypeIcon(type: string) {
  const iconProps = { size: 16, color: '#6b7280' };
  switch (type) {
    case 'Museum':
      return <Landmark {...iconProps} />;
    case 'Event':
      return <CalendarRange {...iconProps} />;
    case 'Artifact':
      return <Archive {...iconProps} />;
    case 'TourOnline':
      return <Globe {...iconProps} />;
    default:
      return <ExternalLink {...iconProps} />;
  }
}

function getNavigationPath(item: AIChatRelatedData): string {
  switch (item.type) {
    case 'Museum':
      return `/museum/${item.id}`;
    case 'Event':
      return `/event/${item.id}`;
    case 'Artifact':
      return `/artifact/${item.id}`;
    case 'TourOnline':
      return `/tour/${item.id}`;
    default:
      return '';
  }
}

function RelatedDataSuggestions({ relatedData }: { relatedData: AIChatRelatedData[] }) {
  if (!relatedData || relatedData.length === 0) return null;

  const handleItemPress = (item: AIChatRelatedData) => {
    const path = getNavigationPath(item);
    console.log('Navigation debug:', { item, path });

    if (path) {
      try {
        console.log('Attempting to navigate to:', path);

        if (item.type === 'Museum') {
          router.push(`/museum/${item.id}` as any);
        } else if (item.type === 'Event') {
          router.push(`/event/${item.id}` as any);
        } else if (item.type === 'Artifact') {
          router.push(`/artifact/${item.id}` as any);
        } else if (item.type === 'TourOnline') {
          router.push(`/tour/${item.id}` as any);
        } else {
          console.log('Unknown type, trying default navigation');
          router.push(path as any);
        }

        console.log('Navigation completed');
      } catch (error) {
        console.error('Navigation error:', error);
        console.log('Fallback: trying to navigate to home');
        try {
          router.push('/(tabs)/' as any);
        } catch (fallbackError) {
          console.error('Fallback navigation also failed:', fallbackError);
        }
      }
    } else {
      console.log('No valid path found for item:', item);
    }
  };

  return (
    <View className="mt-3 ml-10">
      <Text className="text-xs text-gray-500 mb-2">Gợi ý liên quan:</Text>
      {relatedData.slice(0, 3).map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleItemPress(item)}
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2"
        >
          <View className="flex-row items-start">
            <View className="w-8 h-8 rounded-full bg-gray-200 justify-center items-center mr-3">
              {getTypeIcon(item.type)}
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900 text-sm mb-1" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-gray-600 text-xs mb-2" numberOfLines={2}>
                {item.description}
              </Text>
              {item.similarityScore > 0 && (
                <Text className="text-xs text-gray-500">Độ liên quan: {(item.similarityScore * 100).toFixed(0)}%</Text>
              )}
            </View>
            <ExternalLink size={14} color="#9ca3af" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ChatbotTab() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // API Hooks
  const { mutate: fetchConversations } = useGetUserConversations({
    onSuccess: (response: any) => {
      if (response && Array.isArray(response)) {
        const sortedConversations = response.sort(
          (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setConversations(sortedConversations);

        // Auto-select first conversation if none selected
        if (!selectedConversation && sortedConversations.length > 0) {
          setSelectedConversation(sortedConversations[0].id);
        }
      }
    },
    onError: (error: any) => {
      console.error('Failed to fetch conversations:', error);
    },
  });

  const { mutate: fetchMessages } = useGetConversationMessages({
    onSuccess: (response: any) => {
      const newMessages = response?.messages || [];
      if (Array.isArray(newMessages)) {
        const sortedMessages = newMessages.sort(
          (a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
        setIsTyping(false);
      }
    },
    onError: (error: any) => {
      console.error('Failed to fetch messages:', error);
      setIsTyping(false);
    },
  });

  const { mutate: createConversation } = useCreateConversation({
    onSuccess: (response: any) => {
      if (response) {
        const newConversation = response;
        setConversations((prev) => [newConversation, ...prev]);
        setSelectedConversation(newConversation.id);
        setMessages([]);
      }
    },
    onError: (error: any) => {
      console.error('Failed to create conversation:', error);
    },
  });

  const { mutate: createMessage, isPending: isSendingMessage } = useCreateMessage({
    onSuccess: (response: any) => {
      if (response && selectedConversation) {
        // Fetch messages lại để lấy response của AI
        setTimeout(() => {
          fetchMessages({
            conversationId: selectedConversation,
            Page: 1,
            PageSize: 100,
          });
        }, 1500);
      }
    },
    onError: (error: any) => {
      setIsTyping(false);
      console.error('Failed to create message:', error);
    },
  });

  // Load conversations on component mount
  useEffect(() => {
    fetchConversations(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setMessages([]);
      setIsTyping(false);
      fetchMessages({
        conversationId: selectedConversation,
        Page: 1,
        PageSize: 100,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleCreateConversation = () => {
    createConversation({
      isBot: true,
      name: `Trò chuyện mới ${conversations.length + 1}`,
    });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Create new conversation if none exists
    if (!selectedConversation || conversations.length === 0) {
      handleCreateConversation();
      return;
    }

    // Add typing indicator
    setIsTyping(true);

    // Send message to API
    createMessage({
      conversationId: selectedConversation,
      content: input.trim(),
      isBot: true, // This tells backend to generate AI response
    });

    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => handleSendMessage(), 0);
  };

  const renderMessageItem = useCallback(
    ({ item }: { item: Message }) => (
      <View className={`flex-row items-end mb-3 ${!item.isBot ? 'justify-end' : 'justify-start'}`}>
        {item.isBot && <AvatarBot />}
        <View className="max-w-[75%]">
          <View
            className={`rounded-2xl p-3 shadow-md border border-card ${!item.isBot ? 'bg-primary ml-8' : 'bg-card mr-8'}`}
          >
            {item.isBot ? (
              <MarkdownRenderer content={item.content} />
            ) : (
              <Text className="text-white text-base">{item.content}</Text>
            )}
          </View>
          <Text className={`text-xs text-gray-500 mt-1 ${!item.isBot ? 'text-right' : 'text-left'}`}>
            {formatTime(item.createdAt)}
          </Text>
          {item.isBot && item.metadata?.relatedData && item.metadata.relatedData.length > 0 && (
            <RelatedDataSuggestions relatedData={item.metadata.relatedData} />
          )}
        </View>
        {!item.isBot && <AvatarUser />}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 100, // Estimated height
      offset: 100 * index,
      index,
    }),
    []
  );

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Branding header */}
      <View className="flex-row items-center justify-center mt-6 mb-2">
        <View className="w-14 h-14 rounded-lg bg-primary items-center justify-center mr-3">
          <Globe size={32} color="#fff" />
        </View>
        <View>
          <Text className="text-xl font-bold text-foreground">MuseTrip360</Text>
          <Text className="text-xs text-muted-foreground">Digital Museum Platform</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View className="flex-1 p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <AvatarBot />
              <Text className="text-xl font-bold text-primary ml-2">Trợ lý AI MuseTrip</Text>
              <Badge
                variant={isSendingMessage ? 'secondary' : isTyping ? 'outline' : 'default'}
                className="ml-2 bg-card border border-card"
              >
                <View className="flex-row items-center">
                  {isSendingMessage ? (
                    <Loader size={12} color="#a67c52" />
                  ) : isTyping ? (
                    <Loader size={12} color="#3b82f6" />
                  ) : (
                    <Bot size={12} color="#22c55e" />
                  )}
                  <Text className="text-xs text-gray-700 ml-1">
                    {isSendingMessage ? 'Đang gửi' : isTyping ? 'Đang nhập' : 'Online'}
                  </Text>
                </View>
              </Badge>
            </View>
            <View className="flex-row items-center space-x-2">
              {/* New Conversation Button */}
              <TouchableOpacity onPress={handleCreateConversation} className="p-2 bg-primary rounded-lg">
                <Plus size={16} color="#fff" />
              </TouchableOpacity>

              {/* Conversations Toggle */}
              <TouchableOpacity
                onPress={() => setShowConversations(!showConversations)}
                className="p-2 bg-blue-100 rounded-lg"
              >
                <MessageCircle size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Conversation List */}
          {showConversations && conversations.length > 0 && (
            <View className="mb-4 max-h-40">
              <Text className="text-sm font-medium text-gray-600 mb-2">Cuộc trò chuyện gần đây:</Text>
              <FlatList
                data={conversations.slice(0, 5)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedConversation(item.id);
                      setShowConversations(false);
                    }}
                    className={`mr-3 p-3 rounded-lg border ${
                      selectedConversation === item.id ? 'bg-primary border-primary' : 'bg-card border-border'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedConversation === item.id ? 'text-white' : 'text-foreground'
                      }`}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderMessageItem}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          />

          {messages.length === 0 && (
            <View className="mt-6">
              <Text className="text-center text-gray-400 mb-2">Bắt đầu cuộc trò chuyện với AI Assistant</Text>
              {defaultPrompts.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handlePromptClick(prompt)}
                  className="p-3 border border-card rounded-xl mb-2 bg-card"
                >
                  <Text className="text-primary">{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="flex-row items-center mt-2 bg-card rounded-2xl p-2 shadow-sm border border-card">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border-0 rounded-xl p-2 mr-2 bg-white text-gray-900"
              editable={!isSendingMessage && !isTyping}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={isSendingMessage || isTyping || input.trim() === ''}
              className="bg-primary py-2 px-4 rounded-xl flex-row items-center"
            >
              <Text className="text-white font-bold mr-2">Gửi</Text>
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
