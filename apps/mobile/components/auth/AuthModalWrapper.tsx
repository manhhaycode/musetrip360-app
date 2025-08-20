import { useAuthActionContext } from '@musetrip360/auth-system/state';
import { AuthModal } from '@musetrip360/auth-system/ui';
import { X } from 'lucide-react-native';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export function AuthModalWrapper() {
  const { modalControl } = useAuthActionContext();

  if (!modalControl) {
    return null;
  }

  const handleClose = () => {
    if (modalControl?.onOpenChange) {
      modalControl.onOpenChange(false);
    }
  };

  return (
    <Modal
      visible={modalControl.isOpen}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-background">
        {/* Header with close button */}
        <View className="flex-row justify-between items-center p-4 border-b border-border">
          <View />
          <Text className="text-lg font-semibold">MuseTrip360</Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} className="text-foreground" />
          </TouchableOpacity>
        </View>

        {/* Auth Modal Content */}
        <View className="flex-1 p-4">
          <AuthModal />
        </View>
      </View>
    </Modal>
  );
}
