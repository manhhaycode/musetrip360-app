import { Ionicons } from '@expo/vector-icons';
import { Conversation } from '@musetrip360/ai-bot';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onUpdateConversation?: (conversationId: string, name: string) => void;
  isLoading?: boolean;
  isCreatingConversation?: boolean;
  isVisible: boolean;
  onClose: () => void;
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
  isVisible,
  onClose,
}: ConversationSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return d.toLocaleDateString('vi-VN');
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    (conversation.name || 'Cuộc trò chuyện mới').toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDeleteConversation = (conversationId: string) => {
    Alert.alert('Xóa cuộc trò chuyện', 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => onDeleteConversation(conversationId),
      },
    ]);
  };

  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId);
    onClose();
  };

  const renderConversationItem = ({ item: conversation }: { item: Conversation }) => (
    <TouchableOpacity
      onPress={() => handleSelectConversation(conversation.id)}
      className={`p-4 border border-[#f5f5f4] rounded-2xl mb-2 ${
        selectedConversation === conversation.id ? 'bg-[#fff2e6] border-[#ff914d]' : 'bg-white'
      }`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center space-x-2 mb-1">
            <Ionicons name="chatbubble-outline" size={16} color="#737373" />
            {editingId === conversation.id ? (
              <View className="flex-1 flex-row items-center space-x-2">
                <TextInput
                  value={editingName}
                  onChangeText={setEditingName}
                  className="flex-1 text-sm font-medium text-[#2d1f13] bg-[#f5f5f4] px-2 py-1 rounded"
                  onSubmitEditing={() => handleSaveEdit(conversation.id)}
                  autoFocus
                />
                <TouchableOpacity onPress={() => handleSaveEdit(conversation.id)}>
                  <Ionicons name="checkmark" size={16} color="#22c55e" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Ionicons name="close" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text className="text-sm font-medium text-[#2d1f13] flex-1" numberOfLines={1}>
                {conversation.name || 'Cuộc trò chuyện mới'}
              </Text>
            )}
          </View>
          <Text className="text-xs text-[#737373] mb-2">Trợ lý AI • {formatDate(conversation.updatedAt)}</Text>
        </View>

        {editingId !== conversation.id && (
          <View className="flex-row items-center space-x-2 ml-2">
            <Text className="text-xs text-[#737373]">{formatDate(conversation.updatedAt)}</Text>
            {onUpdateConversation && (
              <TouchableOpacity
                onPress={() => handleStartEdit(conversation)}
                className="h-6 w-6 items-center justify-center"
              >
                <Ionicons name="pencil" size={12} color="#737373" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => handleDeleteConversation(conversation.id)}
              className="h-6 w-6 items-center justify-center"
            >
              <Ionicons name="trash" size={12} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-[#fff6ed] rounded-t-3xl max-h-[85%]"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-[#f5f5f4]">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="chatbubbles" size={20} color="#ff914d" />
              <Text className="text-lg font-semibold text-[#2d1f13]">Trò chuyện AI</Text>
            </View>
            <TouchableOpacity
              onPress={onCreateConversation}
              disabled={isLoading || isCreatingConversation}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#ff914d]"
            >
              {isCreatingConversation ? (
                <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Ionicons name="add" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="p-4 border-b border-[#f5f5f4]">
            <View className="flex-row items-center bg-white rounded-xl px-3 py-2 border border-[#f5f5f4]">
              <Ionicons name="search" size={16} color="#737373" />
              <TextInput
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="flex-1 ml-2 text-[#2d1f13]"
              />
            </View>
          </View>

          {/* Content */}
          <View className="flex-1 px-4 py-2">
            {isLoading ? (
              <View className="items-center py-8">
                <View className="w-6 h-6 border-2 border-[#ff914d] border-t-transparent rounded-full animate-spin mb-3" />
                <Text className="text-sm text-[#737373]">Đang tải cuộc trò chuyện...</Text>
              </View>
            ) : filteredConversations.length === 0 ? (
              <View className="items-center py-8">
                <Ionicons name="chatbubbles-outline" size={48} color="#d4d4d8" />
                <Text className="text-center text-[#737373] mt-4 mb-2">
                  {searchTerm ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có cuộc trò chuyện nào'}
                </Text>
                {!searchTerm && (
                  <TouchableOpacity
                    onPress={() => {
                      onCreateConversation();
                      onClose();
                    }}
                    disabled={isCreatingConversation}
                    className="bg-[#ff914d] px-4 py-2 rounded-xl flex-row items-center mt-2"
                  >
                    {isCreatingConversation ? (
                      <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Ionicons name="add" size={16} color="white" />
                    )}
                    <Text className="text-white font-medium ml-2">Bắt đầu trò chuyện</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <FlatList
                data={filteredConversations}
                renderItem={renderConversationItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>

          {/* Close button */}
          <View className="p-4 border-t border-[#f5f5f4]">
            <TouchableOpacity onPress={onClose} className="bg-[#f5f5f4] py-3 rounded-xl items-center">
              <Text className="text-[#2d1f13] font-medium">Đóng</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
