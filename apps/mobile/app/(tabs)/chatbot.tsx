import { Badge } from '@/components/core/ui/badge';
import { useChatWithAI } from '@musetrip360/ai-bot/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bot, Globe, Loader, Send, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Sử dụng className với nativewind, bảng màu tailwind, theme lucid đã được define

const defaultPrompts = [
  'Tôi muốn tìm hiểu về bảo tàng lịch sử',
  'Làm thế nào để đặt tour ảo?',
  'Có những bảo tàng nào nổi tiếng?',
  'Tính năng VR hoạt động như thế nào?',
];

// Định nghĩa kiểu dữ liệu tin nhắn
export type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
};

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
  // TODO: Sử dụng react-native-markdown-display nếu cần render markdown phức tạp
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

export default function ChatbotTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { mutate: chatWithAI, isPending } = useChatWithAI({
    onSuccess: (response: { data?: string }) => {
      const botMsg: ChatMessage = {
        id: Date.now().toString(),
        content: response?.data || 'Bot không trả lời được.',
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      saveMessages([...messages, botMsg]);
    },
    onError: () => {
      const botMsg: ChatMessage = {
        id: Date.now().toString(),
        content: 'Bot gặp lỗi, vui lòng thử lại.',
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    },
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const saveMessages = async (msgs: ChatMessage[]) => {
    await AsyncStorage.setItem('chatbot-messages', JSON.stringify(msgs));
  };
  const loadMessages = async () => {
    const raw = await AsyncStorage.getItem('chatbot-messages');
    if (raw) setMessages(JSON.parse(raw));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    saveMessages([...messages, userMsg]);
    setIsTyping(true);
    chatWithAI({ prompt: input, isVector: true });
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => handleSend(), 0);
  };

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
          <View className="flex-row items-center mb-3">
            <AvatarBot />
            <Text className="text-xl font-bold text-primary ml-2">Trợ lý AI MuseTrip</Text>
            <Badge
              variant={isPending ? 'secondary' : isTyping ? 'outline' : 'default'}
              className="ml-2 bg-card border border-card"
            >
              <View className="flex-row items-center">
                {isPending ? (
                  <Loader size={12} color="#a67c52" />
                ) : isTyping ? (
                  <Loader size={12} color="#3b82f6" />
                ) : (
                  <Bot size={12} color="#22c55e" />
                )}
                <Text className="text-xs text-gray-700 ml-1">
                  {isPending ? 'Đang tải' : isTyping ? 'Đang nhập' : 'Online'}
                </Text>
              </View>
            </Badge>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className={`flex-row items-end mb-3 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {item.sender === 'bot' && <AvatarBot />}
                <View className="max-w-[75%]">
                  <View
                    className={`rounded-2xl p-3 shadow-md border border-card ${item.sender === 'user' ? 'bg-primary ml-8' : 'bg-card mr-8'}`}
                  >
                    {item.sender === 'bot' ? (
                      <MarkdownRenderer content={item.content} />
                    ) : (
                      <Text className="text-white text-base">{item.content}</Text>
                    )}
                  </View>
                  <Text className={`text-xs text-gray-500 mt-1 ${item.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(item.timestamp)}
                  </Text>
                </View>
                {item.sender === 'user' && <AvatarUser />}
              </View>
            )}
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
              editable={!isPending && !isTyping}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={isPending || isTyping || input.trim() === ''}
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
