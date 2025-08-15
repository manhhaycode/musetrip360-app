/**
 * @fileoverview SignalR Client Wrapper
 *
 * Wraps Microsoft SignalR client for WebRTC streaming
 */

import * as signalR from '@microsoft/signalr';
import { ConnectionState, SignalRConnectionConfig, SignalREvents, StreamingError, StreamingErrorCode } from '@/types';

export class SignalRClient {
  private connection: signalR.HubConnection | null = null;
  private connectionState: ConnectionState = ConnectionState.Disconnected;
  private connectionId: string | null = null;
  private config: SignalRConnectionConfig | null = null;
  private eventHandlers: Partial<SignalREvents> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.setupEventHandlers();
  }

  /**
   * Connect to SignalR hub
   */
  async connect(config: SignalRConnectionConfig): Promise<void> {
    try {
      this.config = config;
      this.connectionState = ConnectionState.Connecting;

      // Create new connection
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(config.serverUrl, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => config.accessToken || '',
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext: any) => {
            if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
            }
            return null; // Stop retrying
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.setupConnectionEvents();
      this.setupHubEvents();

      await this.connection.start();

      this.connectionState = ConnectionState.Connected;
      this.reconnectAttempts = 0;

      console.log('✅ SignalR Connected!');
    } catch (error) {
      this.connectionState = ConnectionState.Failed;
      throw this.createError(StreamingErrorCode.SIGNALR_CONNECTION_FAILED, 'Failed to connect to SignalR hub', error);
    }
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.connection = null;
        this.connectionState = ConnectionState.Disconnected;
        this.connectionId = null;
        console.log('🔌 SignalR Disconnected');
      } catch (error) {
        console.error('Error disconnecting from SignalR:', error);
      }
    }
  }

  /**
   * Join a streaming room
   */
  async joinRoom(roomId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.connection || this.connectionState !== ConnectionState.Connected) {
      throw this.createError(StreamingErrorCode.SIGNALR_CONNECTION_FAILED, 'SignalR not connected');
    }

    try {
      await this.connection.invoke('Join', roomId, JSON.stringify(offer));
      console.log(`🚪 Joined room: ${roomId}`);
    } catch (error) {
      throw this.createError(StreamingErrorCode.ROOM_JOIN_FAILED, `Failed to join room: ${roomId}`, error);
    }
  }

  /**
   * Send answer to SFU
   */
  async sendAnswer(answer: string): Promise<void> {
    if (!this.connection || this.connectionState !== ConnectionState.Connected) {
      throw this.createError(StreamingErrorCode.SIGNALR_CONNECTION_FAILED, 'SignalR not connected');
    }

    try {
      await this.connection.invoke('Answer', answer);
      console.log('📤 Answer sent to SFU');
    } catch (error) {
      throw this.createError(StreamingErrorCode.SIGNALR_CONNECTION_FAILED, 'Failed to send answer', error);
    }
  }

  /**
   * Send ICE candidate
   */
  async sendIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.connection || this.connectionState !== ConnectionState.Connected) {
      throw this.createError(StreamingErrorCode.SIGNALR_CONNECTION_FAILED, 'SignalR not connected');
    }

    try {
      await this.connection.invoke('Trickle', JSON.stringify(candidate));
      console.log('🧊 ICE candidate sent');
    } catch (error) {
      throw this.createError(StreamingErrorCode.ICE_CANDIDATE_ERROR, 'Failed to send ICE candidate', error);
    }
  }

  /**
   * Update room state with metadata
   */
  async updateRoomState(metadata: Record<string, any>): Promise<void> {
    if (!this.connection || this.connectionState !== ConnectionState.Connected) {
      throw this.createError(StreamingErrorCode.SIGNALR_CONNECTION_FAILED, 'SignalR not connected');
    }

    try {
      await this.connection.invoke('UpdateRoomState', JSON.stringify(metadata));
      console.log('📤 Room state updated');
    } catch (error) {
      console.error('Failed to update room state:', error);
    }
  }

  /**
   * Set stream peer ID for tracking
   */
  async setStreamPeerId(streamId: string): Promise<void> {
    if (!this.connection || this.connectionState !== ConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke('SetStreamPeerId', streamId);
      console.log(`🎬 Stream peer ID set: ${streamId}`);
    } catch (error) {
      console.error('Failed to set stream peer ID:', error);
    }
  }

  /**
   * Get peer ID by stream ID
   */
  async getPeerIdByStreamId(streamId: string): Promise<string> {
    if (!this.connection || this.connectionState !== ConnectionState.Connected) {
      throw this.createError(StreamingErrorCode.SIGNALR_CONNECTION_FAILED, 'SignalR not connected');
    }

    try {
      return await this.connection.invoke('GetPeerIdByStreamId', streamId);
    } catch (error) {
      console.error('Failed to get peer ID by stream ID:', error);
      return 'Unknown';
    }
  }

  /**
   * Get stream ID by peer ID
   */
  async getStreamIdByPeerId(peerId: string): Promise<string> {
    if (!this.connection || this.connectionState !== ConnectionState.Connected) {
      throw this.createError(StreamingErrorCode.SIGNALR_CONNECTION_FAILED, 'SignalR not connected');
    }

    try {
      return await this.connection.invoke('GetStreamIdByPeerId', peerId);
    } catch (error) {
      console.error('Failed to get stream ID by peer ID:', error);
      return '';
    }
  }

  /**
   * Register event handler
   */
  on<K extends keyof SignalREvents>(event: K, handler: SignalREvents[K]): void {
    this.eventHandlers[event] = handler;
  }

  /**
   * Remove event handler
   */
  off<K extends keyof SignalREvents>(event: K): void {
    delete this.eventHandlers[event];
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Get connection ID
   */
  getConnectionId(): string | null {
    return this.connectionId;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return (
      this.connectionState === ConnectionState.Connected &&
      this.connection?.state === signalR.HubConnectionState.Connected
    );
  }

  /**
   * Setup connection-level event handlers
   */
  private setupConnectionEvents(): void {
    if (!this.connection) return;

    this.connection.onclose((error?: Error) => {
      console.log('🔌 SignalR connection closed', error);
      this.connectionState = ConnectionState.Disconnected;
      this.connectionId = null;
    });

    this.connection.onreconnecting((error?: Error) => {
      console.log('🔄 SignalR reconnecting...', error);
      this.connectionState = ConnectionState.Reconnecting;
      this.reconnectAttempts++;
    });

    this.connection.onreconnected((connectionId?: string) => {
      console.log('✅ SignalR reconnected', connectionId);
      this.connectionState = ConnectionState.Connected;
      this.connectionId = connectionId || null;
      this.reconnectAttempts = 0;
    });
  }

  /**
   * Setup SignalR hub event handlers
   */
  private setupHubEvents(): void {
    if (!this.connection) return;

    // Receive connection ID from server
    this.connection.on('ReceiveConnectionId', (connectionId: string) => {
      this.connectionId = connectionId;
      console.log(`🆔 Connection ID received: ${connectionId}`);
      this.eventHandlers.ReceiveConnectionId?.(connectionId);
    });

    // Handle peer joined
    this.connection.on('PeerJoined', (userId: string, peerId: string) => {
      console.log(`👥 Peer joined: ${peerId}`);
      this.eventHandlers.PeerJoined?.('', userId);
    });

    // Handle peer disconnected
    this.connection.on('PeerDisconnected', (userId: string, peerId: string, streamId: string) => {
      console.log(`👋 Peer disconnected: ${peerId}`);
      this.eventHandlers.PeerDisconnected?.(userId, peerId, streamId);
    });

    // Handle offers from SFU
    this.connection.on('ReceiveOffer', (connectionId: string, offerData: string) => {
      console.log('📥 Received offer from SFU');
      this.eventHandlers.ReceiveOffer?.(connectionId, offerData);
    });

    // Handle answers from SFU
    this.connection.on('ReceiveAnswer', (connectionId: string, answerData: string) => {
      console.log('📥 Received answer from SFU');
      this.eventHandlers.ReceiveAnswer?.(connectionId, answerData);
    });

    // Handle ICE candidates
    this.connection.on('ReceiveIceCandidate', (connectionId: string, candidateData: string, isPub: boolean) => {
      console.log('📥 Received ICE candidate from SFU');
      this.eventHandlers.ReceiveIceCandidate?.(connectionId, candidateData, isPub);
    });

    // Handle room state updates
    this.connection.on('ReceiveRoomState', (roomState: any) => {
      console.log('📥 Received room state update', roomState);
      this.eventHandlers.ReceiveRoomState?.(roomState);
    });
  }

  /**
   * Setup default event handlers
   */
  private setupEventHandlers(): void {
    // Default handlers can be set here if needed
  }

  /**
   * Create standardized error object
   */
  private createError(code: StreamingErrorCode, message: string, details?: any): StreamingError {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }
}
