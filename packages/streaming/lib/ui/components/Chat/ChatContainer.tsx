import React from 'react';
import { useStreamingContext } from '@/contexts/StreamingContext';
import { useChatState, useChatMessages } from '@/state/hooks';
import { chatService } from '@/api/chat';
import { Chat } from './Chat';
import { Users } from 'lucide-react';

export interface ChatContainerProps {
  className?: string;
}

/**
 * ChatContainer - Handles all chat logic and state management
 * Uses StreamingContext to get current user and room information
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const { roomState, participants } = useStreamingContext();
  const { messages } = useChatState();
  const { addOptimisticMessage } = useChatMessages();

  // Get current user info from participants
  const currentUser = React.useMemo(() => {
    return Array.from(participants.values()).find((p) => p.isLocalUser);
  }, [participants]);

  const currentUserId = currentUser?.userId || '';
  const currentUserName =
    currentUser?.participantInfo?.user?.fullName || currentUser?.participantInfo?.user?.username || 'Anonymous';

  // Handle sending chat messages
  const handleSendMessage = async (messageText: string) => {
    if (!currentUserId || !currentUserName) {
      throw new Error('Cannot send message: user not identified');
    }

    if (!roomState?.Id) {
      throw new Error('Cannot send message: no room context');
    }

    try {
      // Add optimistic message for immediate UI update
      addOptimisticMessage(currentUserId, currentUserName, messageText);

      // Send via chat service (will trigger ReceiveChatMessage event)
      await chatService.sendMessage(roomState.Id, currentUserId, currentUserName, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // Chat availability check
  const isChatAvailable = chatService.isAvailable() && currentUserId && currentUserName;

  return (
    <Chat
      messages={messages}
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      onSendMessage={handleSendMessage}
      disabled={!isChatAvailable}
      className={className}
      emptyState={
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No messages yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            {!isChatAvailable ? 'Join the room to start chatting' : 'Start a conversation'}
          </p>
        </div>
      }
    />
  );
};
