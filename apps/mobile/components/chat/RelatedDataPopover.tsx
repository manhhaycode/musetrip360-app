import { Ionicons } from '@expo/vector-icons';
import { AIChatRelatedData } from '@musetrip360/ai-bot';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RelatedDataItem } from './RelatedDataItem';

interface RelatedDataPopoverProps {
  relatedData: AIChatRelatedData[];
}

export function RelatedDataPopover({ relatedData }: RelatedDataPopoverProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!relatedData || relatedData.length === 0) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="h-6 w-6 items-center justify-center ml-2 opacity-60"
      >
        <Ionicons name="information-circle-outline" size={16} color="#a3a3a3" />
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="slide" onRequestClose={() => setIsVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-[#fff6ed] rounded-t-3xl max-h-[80%]"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-[#f5f5f4]">
              <Text className="text-lg font-semibold text-[#2d1f13]">Thông tin liên quan</Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f4]"
              >
                <Ionicons name="close" size={20} color="#2d1f13" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="max-h-96 px-4 py-2" showsVerticalScrollIndicator={false}>
              {relatedData.map((item, index) => (
                <RelatedDataItem key={`${item.id}-${index}`} item={item} onPress={() => setIsVisible(false)} />
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
