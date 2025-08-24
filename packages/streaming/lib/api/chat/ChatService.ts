import type { SignalRClient } from '../signaling/SignalRClient';
import type { RoomMetadata, ChatMessage } from '@/types';

/**
 * Chat Service - High-level interface for chat operations
 * Integrates SignalR client with chat functionality
 */
export class ChatService {
  private signalRClient: SignalRClient | null = null;

  constructor(signalRClient?: SignalRClient) {
    this.signalRClient = signalRClient || null;
  }

  /**
   * Set the SignalR client instance
   */
  setSignalRClient(client: SignalRClient): void {
    this.signalRClient = client;
  }

  /**
   * Get the SignalR client instance
   */
  getSignalRClient(): SignalRClient | null {
    return this.signalRClient;
  }

  /**
   * Send a chat message to room
   */
  async sendMessage(roomId: string, senderId: string, senderName: string, messageText: string): Promise<ChatMessage> {
    if (!this.signalRClient) {
      throw new Error('SignalR client not initialized');
    }

    if (!messageText.trim()) {
      throw new Error('Message cannot be empty');
    }

    if (messageText.length > 1000) {
      throw new Error('Message too long (max 1000 characters)');
    }

    try {
      // Send via dedicated SignalR method - this will trigger ReceiveChatMessage event
      await this.signalRClient.sendChatMessageToRoom(roomId, senderId, senderName, messageText);

      // Return the message that was sent (for optimistic UI updates)
      const sentMessage: ChatMessage = {
        Id: `${senderId}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        SenderId: senderId,
        SenderName: senderName,
        Message: messageText.trim(),
        Timestamp: Date.now(),
        MessageType: 'text',
      };

      return sentMessage;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      throw error;
    }
  }

  /**
   * Send a system message (e.g., user joined, left)
   */
  async sendSystemMessage(roomId: string, messageText: string): Promise<ChatMessage> {
    return this.sendMessage(roomId, 'system', 'System', messageText);
  }

  /**
   * Check if chat is available
   */
  isAvailable(): boolean {
    return this.signalRClient?.isConnected() ?? false;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): string {
    if (!this.signalRClient) return 'not_initialized';
    return this.signalRClient.getConnectionState();
  }
}

// Singleton instance
export const chatService = new ChatService();
