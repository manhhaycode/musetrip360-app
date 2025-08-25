/**
 * @fileoverview Streaming Context
 *
 * Main context provider orchestrating all streaming functionality
 */

import { chatService, tourActionService } from '@/api';
import { useSignalR } from '@/hooks';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useWebRTC } from '@/hooks/useWebRTC';
import { participantActions, useParticipantStore } from '@/state/store/participantStore';
import { roomActions, useRoomStore } from '@/state/store/roomStore';
import { streamingActions, useStreamingStore } from '@/state/store/streamingStore';
import { SignalRConnectionConfig, StreamingContextValue, StreamingErrorCode } from '@/types';
import { useStreamingEvents } from '@/utils/eventBus';
import { generateRoomId } from '@/utils/webrtc';
import { useGetEventParticipants } from '@musetrip360/event-management/api';
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';

const StreamingContext = createContext<StreamingContextValue | null>(null);

interface StreamingProviderProps {
  children: React.ReactNode;
  config: SignalRConnectionConfig;
  autoConnect?: boolean;
  autoInitializeMedia?: boolean;
}

export const StreamingProvider: React.FC<StreamingProviderProps> = ({
  children,
  config,
  autoConnect = true,
  autoInitializeMedia = true,
}) => {
  const isInitializedRef = useRef(false);

  // Hooks
  const webRTC = useWebRTC();
  const signalR = useSignalR();
  const mediaStream = useMediaStream();

  // Event coordination
  const { on } = useStreamingEvents();

  // Store selectors
  const { errors, clearErrors } = useStreamingStore();

  const { currentRoom: roomState } = useRoomStore();

  // Derived state from RoomStore (single source of truth)
  const currentRoomId = roomState?.Id || null;
  const isInRoom = roomState !== null;

  const { participants: participantMap, localParticipant } = useParticipantStore();

  const { data: eventParticipants } = useGetEventParticipants(roomState?.EventId || '', {
    enabled: !!roomState?.EventId,
    staleTime: 0.5 * 60 * 1000, // 30 seconds
    gcTime: 0.5 * 60 * 1000, // 30 seconds
  });

  /**
   * Initialize a streaming system
   */
  const initialize = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      console.log('🚀 Initializing streaming system...');

      // Initialize media first if auto-initialize is enabled
      if (autoInitializeMedia) {
        try {
          await mediaStream.initializeMedia();
        } catch (error) {
          console.warn('⚠️ Media initialization failed, continuing without media:', error);
        }
      }

      // Connect to SignalR if auto-connect is enabled
      if (autoConnect) {
        await signalR.connect(config);
      }

      isInitializedRef.current = true;
      console.log('✅ Streaming system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize streaming system:', error);
      useStreamingStore.getState().addError({
        code: StreamingErrorCode.SIGNALR_CONNECTION_FAILED,
        message: 'Failed to initialize streaming system',
        details: error,
        timestamp: new Date(),
      });
    }
  }, [config, autoConnect, autoInitializeMedia, signalR, mediaStream]);

  /**
   * Join streaming room
   */
  const joinRoom = useCallback(
    async (roomId: string): Promise<void> => {
      try {
        console.log(`🚪 Joining room: ${roomId}`);
        let localStream = mediaStream.localStream;
        // Ensure we have local stream
        if (!localStream) {
          localStream = await mediaStream.initializeMedia();
        }

        webRTC.createPublisherConnection(localStream);

        // Create offer using WebRTC
        const offer = await webRTC.createOffer();

        // Join room via SignalR
        await signalR.joinRoom(roomId, offer);

        chatService.setSignalRClient(signalR.getClient()!);
        tourActionService.setSignalRClient(signalR.getClient()!);

        // Add local participant
        const connectionId = signalR.connectionId;
        if (connectionId && mediaStream.localStream) {
          let userId = '';
          // Set stream peer ID for tracking
          const client = signalR.getClient();
          if (client) {
            await client.setStreamPeerId(mediaStream.localStream.id);
            userId = (await client.getParticipantInfoByStreamId(mediaStream.localStream.id)) || '';
          }

          participantActions.addParticipantWithStream({
            id: uuid(),
            peerId: connectionId,
            streamId: mediaStream.localStream.id,
            connectionId,
            isLocalUser: true,
            mediaState: mediaStream.mediaState,
            joinedAt: new Date(),
            userId: userId,
          });
        }

        console.log(`✅ Successfully joined room: ${roomId}`);
      } catch (error) {
        console.error(`❌ Failed to join room ${roomId}:`, error);
        throw error;
      }
    },
    [mediaStream, webRTC, signalR]
  );

  /**
   * Create new room
   */
  const createRoom = useCallback(async (): Promise<string> => {
    const roomId = generateRoomId();
    await joinRoom(roomId);
    return roomId;
  }, [joinRoom]);

  /**
   * Leave current room
   */
  const leaveRoom = useCallback(async (): Promise<void> => {
    try {
      console.log('👋 Leaving room...');

      // Leave room via SignalR
      await signalR.leaveRoom();

      // Clean up WebRTC connections
      webRTC.cleanup();

      // Cleanup room state
      roomActions.leaveRoom();

      // Clean up participants
      useParticipantStore.getState().reset();

      streamingActions.leaveRoomSafely();

      isInitializedRef.current = false;

      console.log('✅ Successfully left room');
    } catch (error) {
      console.error('❌ Failed to leave room:', error);
      throw error;
    }
  }, [signalR, webRTC]);

  /**
   * Toggle video
   */
  const toggleVideo = useCallback((): void => {
    mediaStream.toggleVideo();

    // Update local participant state
    const localParticipant = Array.from(participantMap.values()).find((p) => p.isLocalUser);
    if (localParticipant) {
      participantActions.updateMediaStateWithLog(localParticipant.id, {
        video: mediaStream.mediaState.video,
      });
    }
  }, [mediaStream, participantMap]);

  /**
   * Toggle audio
   */
  const toggleAudio = useCallback((): void => {
    mediaStream.toggleAudio();

    // Update local participant state
    const localParticipant = Array.from(participantMap.values()).find((p) => p.isLocalUser);
    if (localParticipant) {
      participantActions.updateMediaStateWithLog(localParticipant.id, {
        audio: mediaStream.mediaState.audio,
      });
    }
  }, [mediaStream, participantMap]);

  // Auto-initialize on mount
  useEffect(() => {
    initialize().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Coordinate participant management via events
  useEffect(() => {
    // Handle peer joined from SignalR
    const unsubscribePeerJoined = on('signalr:peer-joined', async ({ userId }) => {
      try {
        console.log(`✅ Participant ${userId} added via event coordination`);
      } catch (error) {
        console.error('Failed to handle peer joined:', error);
      }
    });

    // Handle peer disconnected from SignalR
    const unsubscribePeerDisconnected = on('signalr:peer-disconnected', async ({ userId, peerId, streamId }) => {
      try {
        participantActions.removeParticipantWithCleanup(peerId);
        mediaStream.removeRemoteStream(streamId);
        console.log(`✅ Participant ${userId} removed via event coordination`);
      } catch (error) {
        console.error('Failed to cleanup disconnected peer:', error);
      }
    });

    // Handle remote streams from WebRTC with peer ID resolution
    const unsubscribeRemoteStream = on('webrtc:remote-stream', async ({ stream, peerId }) => {
      try {
        // Resolve actual peer ID from SignalR
        const client = signalR.getClient();
        let userId = '';
        let resolvedPeerId = peerId;

        if (client) {
          try {
            resolvedPeerId = await client.getPeerIdByStreamId(stream.id);
            userId = (await client.getParticipantInfoByStreamId(stream.id)) || '';
          } catch {
            console.warn('Failed to resolve peer ID for stream:', stream.id);
          }
        }

        // Update participant media state
        const participants = useParticipantStore.getState().participants;
        const participant = Array.from(participants.values()).find((p) => p.peerId === resolvedPeerId);

        if (participant) {
          participantActions.updateMediaStateWithLog(participant.id, {
            video: stream.getVideoTracks().some((track) => track.enabled),
            audio: stream.getAudioTracks().some((track) => track.enabled),
          });
        } else {
          participantActions.addParticipantWithStream({
            id: resolvedPeerId,
            peerId: resolvedPeerId,
            streamId: stream.id,
            connectionId: client!.getConnectionId() || '',
            isLocalUser: false,
            mediaState: { video: true, audio: true },
            joinedAt: new Date(),
            userId: userId,
          });
        }

        console.log(`✅ Remote stream coordinated for peer ${resolvedPeerId}`);
      } catch (error) {
        console.error('Failed to coordinate remote stream:', error);
      }
    });
    return () => {
      unsubscribeRemoteStream();
      unsubscribePeerJoined();
      unsubscribePeerDisconnected();
    };
  }, [on, signalR, mediaStream]);

  // Handle remote stream events
  useEffect(() => {
    // This would be enhanced to handle actual remote stream events from WebRTC
    // For now, it's a placeholder for the integration
  }, [webRTC, mediaStream]);

  useEffect(() => {
    if (eventParticipants) {
      setTimeout(() => participantActions.syncParticipantInfo(eventParticipants));
    }
  }, [eventParticipants]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Get fresh room state at cleanup time (avoid stale closure)
      const { currentRoom } = useRoomStore.getState();
      if (currentRoom) {
        leaveRoom().catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array = only run cleanup on unmount

  const contextValue: StreamingContextValue = {
    // Connection State
    signalR,
    webRTC,
    mediaStream,

    initialize,

    // Room State
    roomState,
    participants: participantMap,
    localParticipant,
    currentRoomId,
    isInRoom,

    // Actions
    joinRoom,
    createRoom,
    leaveRoom,

    // Media Controls
    toggleVideo,
    toggleAudio,

    // Error State
    errors,
    clearErrors,
  };

  return <StreamingContext.Provider value={contextValue}>{children}</StreamingContext.Provider>;
};

/**
 * Hook to use streaming context
 */
export const useStreamingContext = (): StreamingContextValue => {
  const context = useContext(StreamingContext);

  if (!context) {
    throw new Error('useStreamingContext must be used within a StreamingProvider');
  }

  return context;
};
