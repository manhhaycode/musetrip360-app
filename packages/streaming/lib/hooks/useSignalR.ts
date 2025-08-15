/**
 * @fileoverview useSignalR Hook
 *
 * React hook for SignalR connection management
 */

import { useCallback, useEffect, useRef } from 'react';
import { SignalRClient } from '@/api/signaling';
import { PeerConnectionManager } from '@/api/peer';
import { useStreamingStore } from '@/state/store/streamingStore';
import { roomActions, useRoomStore } from '@/state/store/roomStore';
import { useStreamingEvents } from '@/utils/eventBus';
import { ConnectionState, SignalRConnectionConfig, StreamingErrorCode, UseSignalRReturn } from '@/types';

export const useSignalR = (): UseSignalRReturn => {
  const signalRClientRef = useRef<SignalRClient | null>(null);

  // Store selectors
  const { signalRState, connectionId, config, setSignalRState, setConnectionId, setConfig, addError, setConnecting } =
    useStreamingStore();

  const { setCurrentRoom } = useRoomStore();

  // Event bus integration
  const { on, emit } = useStreamingEvents();

  /**
   * Initialize SignalR client
   */

  /**
   * Setup SignalR event handlers
   */
  const setupEventHandlers = useCallback(() => {
    const client = signalRClientRef.current;
    if (!client) return;

    // Connection ID received
    client.on('ReceiveConnectionId', (receivedConnectionId) => {
      setConnectionId(receivedConnectionId);
      console.log(`🆔 Connection ID: ${receivedConnectionId}`);
    });

    // Peer joined room - emit event instead of direct handling
    client.on('PeerJoined', async (userId, peerId) => {
      console.log(`👥 Peer joined: ${peerId}`);
      emit('signalr:peer-joined', { userId, peerId });
    });

    // Peer disconnected - emit event instead of direct handling
    client.on('PeerDisconnected', async (userId, peerId, streamId) => {
      console.log(`👋 Peer disconnected: ${peerId}`);
      emit('signalr:peer-disconnected', { userId, peerId, streamId });
    });

    // WebRTC signaling events - emit to WebRTC hook
    client.on('ReceiveOffer', async (connectionId: string, offerData: string) => {
      try {
        const offer = JSON.parse(offerData);
        emit('signalr:offer-received', { offer, connectionId });
      } catch (error) {
        console.error('Failed to parse offer:', error);
      }
    });

    client.on('ReceiveAnswer', async (connectionId: string, answerData: string) => {
      try {
        const answer = JSON.parse(answerData);
        emit('signalr:answer-received', { answer, connectionId });
      } catch (error) {
        console.error('Failed to parse answer:', error);
      }
    });

    client.on('ReceiveIceCandidate', async (connectionId: string, candidateData: string, isPub: boolean) => {
      try {
        const candidate = PeerConnectionManager.parseCandidate(candidateData);
        if (candidate) {
          emit('signalr:ice-candidate-received', { candidate, isPub, connectionId });
        }
      } catch (error) {
        console.error('Failed to parse ICE candidate:', error);
      }
    });

    // Room state updates
    client.on('ReceiveRoomState', (roomState) => {
      console.log('📥 Room state update:', roomState);
      setCurrentRoom(roomState);
    });
  }, [setConnectionId, setCurrentRoom, emit]);

  const initializeClient = useCallback(() => {
    if (!signalRClientRef.current) {
      signalRClientRef.current = new SignalRClient();
      setupEventHandlers();
    }
  }, [setupEventHandlers]);

  /**
   * Connect to SignalR hub
   */
  const connect = useCallback(
    async (connectionConfig: SignalRConnectionConfig): Promise<void> => {
      try {
        setConnecting(true);
        setConfig(connectionConfig);

        initializeClient();

        if (!signalRClientRef.current) {
          throw new Error('Failed to initialize SignalR client');
        }

        setSignalRState(ConnectionState.Connecting);
        await signalRClientRef.current.connect(connectionConfig);
        setSignalRState(ConnectionState.Connected);

        console.log('✅ SignalR connected successfully');
      } catch (error) {
        console.error('❌ SignalR connection failed:', error);
        setSignalRState(ConnectionState.Failed);

        addError({
          code: StreamingErrorCode.SIGNALR_CONNECTION_FAILED,
          message: 'Failed to connect to SignalR hub',
          details: error,
          timestamp: new Date(),
        });

        throw error;
      } finally {
        setConnecting(false);
      }
    },
    [setConnecting, setConfig, initializeClient, setSignalRState, addError]
  );

  /**
   * Disconnect from SignalR hub
   */
  const disconnect = useCallback(async (): Promise<void> => {
    try {
      if (signalRClientRef.current) {
        await signalRClientRef.current.disconnect();
        signalRClientRef.current = null;
      }

      setSignalRState(ConnectionState.Disconnected);
      setConnectionId(null);

      console.log('🔌 SignalR disconnected');
    } catch (error) {
      console.error('❌ SignalR disconnect error:', error);

      addError({
        code: StreamingErrorCode.SIGNALR_CONNECTION_FAILED,
        message: 'Error during SignalR disconnect',
        details: error,
        timestamp: new Date(),
      });
    }
  }, [setSignalRState, setConnectionId, addError]);

  /**
   * Join streaming room
   */
  const joinRoom = useCallback(
    async (roomId: string, offer?: RTCSessionDescriptionInit): Promise<void> => {
      if (!signalRClientRef.current || !signalRClientRef.current.isConnected()) {
        throw new Error('SignalR not connected');
      }

      if (!offer) {
        throw new Error('Offer is required to join room');
      }

      try {
        await signalRClientRef.current.joinRoom(roomId, offer);
        console.log(`🚪 Joined room: ${roomId}`);
      } catch (error) {
        console.error(`❌ Failed to join room ${roomId}:`, error);

        addError({
          code: StreamingErrorCode.ROOM_JOIN_FAILED,
          message: `Failed to join room: ${roomId}`,
          details: error,
          timestamp: new Date(),
        });

        throw error;
      }
    },
    [addError]
  );

  /**
   * Leave the current room
   */
  const leaveRoom = useCallback(async (): Promise<void> => {
    try {
      // Cleanup room state
      roomActions.leaveRoom();
      console.log('👋 Left room');
    } catch (error) {
      console.error('❌ Error leaving room:', error);

      addError({
        code: StreamingErrorCode.ROOM_JOIN_FAILED,
        message: 'Error leaving room',
        details: error,
        timestamp: new Date(),
      });
    }
  }, [addError]);

  /**
   * Update room state with metadata
   */
  const updateRoomState = useCallback(
    async (metadata: Record<string, any>): Promise<void> => {
      if (!signalRClientRef.current || !signalRClientRef.current.isConnected()) {
        console.warn('⚠️ SignalR not connected, cannot update room state');
        return;
      }

      try {
        await signalRClientRef.current.updateRoomState(metadata);
        console.log('📤 Room state updated');
      } catch (error) {
        console.error('❌ Failed to update room state:', error);

        addError({
          code: StreamingErrorCode.SIGNALR_CONNECTION_FAILED,
          message: 'Failed to update room state',
          details: error,
          timestamp: new Date(),
        });
      }
    },
    [addError]
  );

  /**
   * Get SignalR client for advanced operations
   */
  const getClient = useCallback((): SignalRClient | null => {
    return signalRClientRef.current;
  }, []);

  // Cleanup on unmounting
  useEffect(() => {
    return () => {
      if (signalRClientRef.current) {
        signalRClientRef.current.disconnect().catch(console.error);
        signalRClientRef.current = null;
      }
    };
  }, []);

  // Listen to WebRTC events and forward to SignalR
  useEffect(() => {
    const client = signalRClientRef.current;
    if (!client || !client.isConnected()) return;

    // Handle ICE candidates from WebRTC
    const unsubscribeIceCandidate = on('webrtc:ice-candidate', async ({ candidate, isPub }) => {
      try {
        await client.sendIceCandidate(candidate);
        console.log(`🧊 ICE candidate sent via SignalR (${isPub ? 'publisher' : 'subscriber'})`);
      } catch (error) {
        console.error('❌ Failed to send ICE candidate via SignalR:', error);
        emit('signalr:error', { error: error as Error, context: 'sendIceCandidate' });
      }
    });

    // Handle answers from WebRTC
    const unsubscribeAnswerCreated = on('webrtc:answer-created', async ({ answer }) => {
      try {
        await client.sendAnswer(answer.sdp || '');
        console.log('📤 Answer sent via SignalR');
      } catch (error) {
        console.error('❌ Failed to send answer via SignalR:', error);
        emit('signalr:error', { error: error as Error, context: 'sendAnswer' });
      }
    });

    return () => {
      // Cleanup event listeners
      unsubscribeIceCandidate();
      unsubscribeAnswerCreated();
    };
  }, [signalRState, on, emit]);

  // Auto-reconnect logic
  useEffect(() => {
    if (signalRState === ConnectionState.Failed && config) {
      const timeoutId = setTimeout(() => {
        console.log('🔄 Attempting to reconnect...');
        connect(config).catch(console.error);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [signalRState, config, connect]);

  return {
    connection: signalRClientRef.current,
    connectionState: signalRState,
    connectionId,
    isConnected: signalRState === ConnectionState.Connected,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    updateRoomState,
    error: useStreamingStore().lastError,
    // Advanced operations
    getClient,
  };
};
