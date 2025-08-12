/**
 * @fileoverview useWebRTC Hook
 *
 * React hook for WebRTC peer connection management
 */

import { useCallback, useEffect, useRef } from 'react';
import { PeerConnectionManager } from '@/api/peer';
import { useStreamingStore } from '@/state/store/streamingStore';
import { useStreamingEvents } from '@/utils/eventBus';
import { ConnectionState, MediaStreamInfo, StreamingErrorCode, UseWebRTCReturn } from '@/types';

export const useWebRTC = (): UseWebRTCReturn => {
  const peerManagerRef = useRef<PeerConnectionManager | null>(null);

  // Store selectors
  const { webRTCState, config, localStream, setWebRTCState, addError, addRemoteStream, removeRemoteStream } =
    useStreamingStore();

  // Event bus integration
  const { on, emit } = useStreamingEvents();

  /**
   * Initialize PeerConnection manager
   */
  const initializePeerManager = useCallback(() => {
    if (!config) {
      throw new Error('TURN server config required for WebRTC initialization');
    }

    if (!peerManagerRef.current) {
      peerManagerRef.current = new PeerConnectionManager(config.turnServerUrl, config.turnCredentials);

      // Setup callbacks - emit events instead of direct SignalR calls
      peerManagerRef.current.setOnIceCandidate(async (candidate, isPub) => {
        emit('webrtc:ice-candidate', { candidate, isPub });
        console.log(`🧊 ICE candidate emitted (${isPub ? 'publisher' : 'subscriber'})`);
      });

      peerManagerRef.current.setOnRemoteStream(async (stream) => {
        console.log('📡 Remote stream received:', stream.id);

        // Emit remote stream event with stream info
        const streamInfo: MediaStreamInfo = {
          streamId: stream.id,
          peerId: '', // Will be resolved by coordinator
          stream,
          type: 'remote',
          mediaState: {
            video: stream.getVideoTracks().some((track) => track.enabled),
            audio: stream.getAudioTracks().some((track) => track.enabled),
          },
        };

        emit('webrtc:remote-stream', { stream, peerId: streamInfo.peerId });
        addRemoteStream(streamInfo);
      });

      console.log('✅ PeerConnection manager initialized');
    }

    return peerManagerRef.current;
  }, [config, emit, addRemoteStream]);

  /**
   * Create publisher connection
   */
  const createPublisherConnection = useCallback(
    (stream: MediaStream): RTCPeerConnection => {
      const manager = initializePeerManager();

      try {
        setWebRTCState(ConnectionState.Connecting);
        const pc = manager.createPublisherConnection(stream);
        setWebRTCState(ConnectionState.Connected);

        console.log('✅ Publisher connection created');
        return pc;
      } catch (error) {
        setWebRTCState(ConnectionState.Failed);

        addError({
          code: StreamingErrorCode.PEER_CONNECTION_FAILED,
          message: 'Failed to create publisher connection',
          details: error,
          timestamp: new Date(),
        });

        throw error;
      }
    },
    [initializePeerManager, setWebRTCState, addError]
  );

  /**
   * Create subscriber connection
   */
  const createSubscriberConnection = useCallback((): RTCPeerConnection => {
    const manager = initializePeerManager();

    try {
      const pc = manager.createSubscriberConnection();
      console.log('✅ Subscriber connection created');
      return pc;
    } catch (error) {
      addError({
        code: StreamingErrorCode.PEER_CONNECTION_FAILED,
        message: 'Failed to create subscriber connection',
        details: error,
        timestamp: new Date(),
      });

      throw error;
    }
  }, [initializePeerManager, addError]);

  /**
   * Handle offer from SFU
   */
  const handleOffer = useCallback(
    async (offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
      const manager = peerManagerRef.current;

      if (!manager) {
        throw new Error('PeerConnection manager not initialized');
      }

      try {
        console.log('🔄 Processing offer from SFU...');
        const answer = await manager.handleOffer(offer);
        console.log('✅ Answer created successfully');
        return answer;
      } catch (error) {
        console.error('❌ Error processing offer:', error);

        addError({
          code: StreamingErrorCode.PEER_CONNECTION_FAILED,
          message: 'Failed to process offer from SFU',
          details: error,
          timestamp: new Date(),
        });

        throw error;
      }
    },
    [addError]
  );

  /**
   * Handle answer from SFU
   */
  const handleAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit): Promise<void> => {
      const manager = peerManagerRef.current;

      if (!manager) {
        throw new Error('PeerConnection manager not initialized');
      }

      try {
        console.log('📥 Processing answer from SFU...');
        await manager.handleAnswer(answer);
        console.log('✅ Answer processed successfully');
      } catch (error) {
        console.error('❌ Error processing answer:', error);

        addError({
          code: StreamingErrorCode.PEER_CONNECTION_FAILED,
          message: 'Failed to process answer from SFU',
          details: error,
          timestamp: new Date(),
        });

        throw error;
      }
    },
    [addError]
  );

  /**
   * Handle ICE candidate from SFU
   */
  const handleIceCandidate = useCallback(
    async (candidate: RTCIceCandidateInit, isPub: boolean): Promise<void> => {
      const manager = peerManagerRef.current;

      if (!manager) {
        console.warn('⚠️ PeerConnection manager not initialized for ICE candidate');
        return;
      }

      try {
        await manager.handleIceCandidate(candidate, isPub);
        console.log(`🧊 ICE candidate processed (${isPub ? 'publisher' : 'subscriber'})`);
      } catch (error) {
        console.error('❌ Error processing ICE candidate:', error);

        addError({
          code: StreamingErrorCode.ICE_CANDIDATE_ERROR,
          message: 'Failed to process ICE candidate',
          details: error,
          timestamp: new Date(),
        });
      }
    },
    [addError]
  );

  /**
   * Create offer for joining room
   */
  const createOffer = useCallback(async (): Promise<RTCSessionDescriptionInit> => {
    const manager = peerManagerRef.current;

    if (!manager) {
      throw new Error('PeerConnection manager not initialized');
    }

    if (!localStream) {
      throw new Error('Local stream required to create offer');
    }

    try {
      // Ensure publisher connection exists
      // createPublisherConnection(localStream);

      const offer = await manager.createOffer();
      console.log('📤 Offer created successfully');

      // Emit offer created event
      emit('webrtc:offer-created', { offer });

      return offer;
    } catch (error) {
      console.error('❌ Failed to create offer:', error);

      emit('webrtc:error', { error: error as Error, context: 'createOffer' });

      addError({
        code: StreamingErrorCode.PEER_CONNECTION_FAILED,
        message: 'Failed to create offer',
        details: error,
        timestamp: new Date(),
      });

      throw error;
    }
  }, [localStream, createPublisherConnection, addError, emit]);

  /**
   * Cleanup peer connections
   */
  const cleanup = useCallback((): void => {
    if (peerManagerRef.current) {
      peerManagerRef.current.cleanup();
      peerManagerRef.current = null;
      setWebRTCState(ConnectionState.Disconnected);
      console.log('🧹 WebRTC connections cleaned up');
    }
  }, [setWebRTCState]);

  /**
   * Get connection statistics
   */
  const getStats = useCallback(async (): Promise<{
    publisher: RTCStatsReport | null;
    subscriber: RTCStatsReport | null;
  }> => {
    const manager = peerManagerRef.current;

    if (!manager) {
      return { publisher: null, subscriber: null };
    }

    const connections = manager.getPeerConnections();

    try {
      const [publisherStats, subscriberStats] = await Promise.all([
        connections.publisher?.getStats() || null,
        connections.subscriber?.getStats() || null,
      ]);

      return {
        publisher: publisherStats,
        subscriber: subscriberStats,
      };
    } catch (error) {
      console.error('Failed to get connection stats:', error);
      return { publisher: null, subscriber: null };
    }
  }, []);

  // Setup event handlers for SignalR messages
  useEffect(() => {
    // Handle offers from SignalR
    const unsubscribeOffer = on('signalr:offer-received', async ({ offer, connectionId }) => {
      try {
        console.log('📥 Processing offer from SignalR...');
        const answer = await handleOffer(offer);
        emit('webrtc:answer-created', { answer });
      } catch (error) {
        console.error('Failed to handle offer:', error);
        emit('webrtc:error', { error: error as Error, context: 'handleOffer' });
      }
    });

    // Handle answers from SignalR
    const unsubscribeAnswer = on('signalr:answer-received', async ({ answer, connectionId }) => {
      try {
        console.log('📥 Processing answer from SignalR...');
        await handleAnswer(answer);
      } catch (error) {
        console.error('Failed to handle answer:', error);
        emit('webrtc:error', { error: error as Error, context: 'handleAnswer' });
      }
    });

    // Handle ICE candidates from SignalR
    const unsubscribeIce = on('signalr:ice-candidate-received', async ({ candidate, isPub, connectionId }) => {
      try {
        await handleIceCandidate(candidate, isPub);
        console.log(`🧊 ICE candidate processed (${isPub ? 'publisher' : 'subscriber'})`);
      } catch (error) {
        console.error('Failed to handle ICE candidate:', error);
        emit('webrtc:error', { error: error as Error, context: 'handleIceCandidate' });
      }
    });

    // Cleanup function
    return () => {
      unsubscribeOffer();
      unsubscribeAnswer();
      unsubscribeIce();
    };
  }, [on, emit, handleOffer, handleAnswer, handleIceCandidate]);

  // Cleanup on unmounting
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    peerConnections: peerManagerRef.current?.getPeerConnections() || { publisher: null, subscriber: null },
    createPublisherConnection,
    createSubscriberConnection,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    createOffer,
    cleanup,
    getStats,
    error: useStreamingStore().lastError,
  };
};
