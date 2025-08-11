/**
 * @fileoverview useMediaStream Hook
 *
 * React hook for media stream management
 */

import { useCallback, useEffect, useRef } from 'react';
import { MediaStreamManager } from '@/api/stream';
import { useStreamingStore } from '@/state/store/streamingStore';
import { MediaStreamInfo, StreamConstraints, StreamingErrorCode, UseMediaStreamReturn } from '@/types';

export const useMediaStream = (): UseMediaStreamReturn => {
  const mediaManagerRef = useRef<MediaStreamManager | null>(null);

  // Store selectors
  const {
    localStream,
    remoteStreams,
    mediaState,
    isMediaInitialized,
    setLocalStream,
    setMediaState,
    setMediaInitialized,
    addRemoteStream,
    removeRemoteStream,
    addError,
    setInitializingMedia,
    toggleVideo: storeToggleVideo,
    toggleAudio: storeToggleAudio,
  } = useStreamingStore();

  /**
   * Initialize media manager
   */
  const initializeManager = useCallback(() => {
    if (!mediaManagerRef.current) {
      mediaManagerRef.current = new MediaStreamManager();
      console.log('✅ Media stream manager initialized');
    }
    return mediaManagerRef.current;
  }, []);

  /**
   * Initialize local media stream
   */
  const initializeMedia = useCallback(
    async (constraints: StreamConstraints = { video: true, audio: true }): Promise<MediaStream> => {
      try {
        setInitializingMedia(true);
        const manager = initializeManager();

        // Validate constraints
        if (!MediaStreamManager.validateConstraints(constraints)) {
          throw new Error('Invalid stream constraints');
        }

        console.log('🎥 Initializing media stream...', constraints);
        const stream = await manager.initializeLocalStream(constraints);

        // Update store state
        setLocalStream(stream);
        setMediaState(manager.getMediaState());
        setMediaInitialized(true);

        console.log('✅ Media stream initialized successfully', {
          streamId: stream.id,
          tracks: stream.getTracks().map((track) => ({
            kind: track.kind,
            enabled: track.enabled,
            label: track.label,
          })),
        });
        return stream;
      } catch (error) {
        console.error('❌ Failed to initialize media stream:', error);

        addError({
          code: StreamingErrorCode.MEDIA_ACCESS_DENIED,
          message: 'Failed to initialize media stream',
          details: error,
          timestamp: new Date(),
        });

        setMediaInitialized(false);
        throw error;
      } finally {
        setInitializingMedia(false);
      }
    },
    [initializeManager, setInitializingMedia, setLocalStream, setMediaState, setMediaInitialized, addError]
  );

  /**
   * Toggle video track
   */
  const toggleVideo = useCallback((): void => {
    const manager = mediaManagerRef.current;

    if (!manager) {
      console.warn('⚠️ Media manager not initialized');
      return;
    }

    try {
      const isEnabled = manager.toggleVideo();
      storeToggleVideo();

      console.log(`📹 Video ${isEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Failed to toggle video:', error);

      addError({
        code: StreamingErrorCode.MEDIA_ACCESS_DENIED,
        message: 'Failed to toggle video',
        details: error,
        timestamp: new Date(),
      });
    }
  }, [storeToggleVideo, addError]);

  /**
   * Toggle audio track
   */
  const toggleAudio = useCallback((): void => {
    const manager = mediaManagerRef.current;

    if (!manager) {
      console.warn('⚠️ Media manager not initialized');
      return;
    }

    try {
      const isEnabled = manager.toggleAudio();
      storeToggleAudio();

      console.log(`🎤 Audio ${isEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('❌ Failed to toggle audio:', error);

      addError({
        code: StreamingErrorCode.MEDIA_ACCESS_DENIED,
        message: 'Failed to toggle audio',
        details: error,
        timestamp: new Date(),
      });
    }
  }, [storeToggleAudio, addError]);

  /**
   * Stop local media stream
   */
  const stopStream = useCallback((): void => {
    const manager = mediaManagerRef.current;

    if (!manager) {
      console.warn('⚠️ Media manager not initialized');
      return;
    }

    try {
      manager.stopLocalStream();

      // Update store state
      setLocalStream(null);
      setMediaState({ video: false, audio: false });
      setMediaInitialized(false);

      console.log('🛑 Local stream stopped');
    } catch (error) {
      console.error('❌ Failed to stop stream:', error);
    }
  }, [setLocalStream, setMediaState, setMediaInitialized]);

  /**
   * Add remote stream
   */
  const addRemoteStreamInfo = useCallback(
    (streamInfo: MediaStreamInfo): void => {
      const manager = mediaManagerRef.current;

      if (!manager) {
        console.warn('⚠️ Media manager not initialized');
        return;
      }

      try {
        manager.addRemoteStream(streamInfo);
        addRemoteStream(streamInfo);

        console.log(`📡 Remote stream added: ${streamInfo.streamId} (peer: ${streamInfo.peerId})`);
      } catch (error) {
        console.error('❌ Failed to add remote stream:', error);
      }
    },
    [addRemoteStream]
  );

  /**
   * Remove remote stream
   */
  const removeRemoteStreamInfo = useCallback(
    (streamId: string): void => {
      const manager = mediaManagerRef.current;

      if (!manager) {
        console.warn('⚠️ Media manager not initialized');
        return;
      }

      try {
        manager.removeRemoteStream(streamId);
        removeRemoteStream(streamId);

        console.log(`📡 Remote stream removed: ${streamId}`);
      } catch (error) {
        console.error('❌ Failed to remove remote stream:', error);
      }
    },
    [removeRemoteStream]
  );

  /**
   * Start screen sharing
   */
  const startScreenShare = useCallback(async (): Promise<MediaStream> => {
    const manager = mediaManagerRef.current;

    if (!manager) {
      throw new Error('Media manager not initialized');
    }

    try {
      console.log('🖥️ Starting screen share...');
      const displayStream = await manager.getDisplayMedia();

      // Replace video track with screen share
      if (localStream) {
        const videoTrack = displayStream.getVideoTracks()[0];
        if (videoTrack) {
          await manager.replaceVideoTrack(videoTrack);
          setMediaState({ ...mediaState, screen: true });

          // Handle screen share end
          videoTrack.onended = () => {
            console.log('🖥️ Screen share ended');
            setMediaState({ ...mediaState, screen: false });
          };
        }
      }

      console.log('✅ Screen sharing started');
      return displayStream;
    } catch (error) {
      console.error('❌ Failed to start screen share:', error);

      addError({
        code: StreamingErrorCode.MEDIA_ACCESS_DENIED,
        message: 'Failed to start screen sharing',
        details: error,
        timestamp: new Date(),
      });

      throw error;
    }
  }, [localStream, mediaState, setMediaState, addError]);

  /**
   * Stop screen sharing
   */
  const stopScreenShare = useCallback(async (): Promise<void> => {
    try {
      console.log('🖥️ Stopping screen share...');

      // Re-initialize camera stream
      await initializeMedia({ video: true, audio: mediaState.audio });
      setMediaState({ ...mediaState, screen: false });

      console.log('✅ Screen sharing stopped');
    } catch (error) {
      console.error('❌ Failed to stop screen share:', error);

      addError({
        code: StreamingErrorCode.MEDIA_ACCESS_DENIED,
        message: 'Failed to stop screen sharing',
        details: error,
        timestamp: new Date(),
      });
    }
  }, [initializeMedia, mediaState, setMediaState, addError]);

  /**
   * Get media device information
   */
  const getMediaDevices = useCallback(async (): Promise<{
    hasCamera: boolean;
    hasMicrophone: boolean;
    devices: MediaDeviceInfo[];
  }> => {
    try {
      const deviceInfo = await MediaStreamManager.checkMediaDevices();
      console.log('🎥 Media devices:', deviceInfo);
      return deviceInfo;
    } catch (error) {
      console.error('❌ Failed to get media devices:', error);
      return {
        hasCamera: false,
        hasMicrophone: false,
        devices: [],
      };
    }
  }, []);

  /**
   * Get stream statistics
   */
  const getStreamStats = useCallback(() => {
    const manager = mediaManagerRef.current;

    if (!manager) {
      return {
        localStreamId: null,
        remoteStreamCount: 0,
        totalTracks: 0,
        activeTracks: 0,
      };
    }

    return manager.getStreamStats();
  }, []);

  /**
   * Check if media is supported
   */
  const checkMediaSupport = useCallback(async (): Promise<{
    getUserMedia: boolean;
    getDisplayMedia: boolean;
    supportedConstraints: MediaTrackSupportedConstraints;
  }> => {
    try {
      const supportedConstraints = await MediaStreamManager.getSupportedConstraints();

      return {
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        getDisplayMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia),
        supportedConstraints,
      };
    } catch (error) {
      console.error('Failed to check media support:', error);
      return {
        getUserMedia: false,
        getDisplayMedia: false,
        supportedConstraints: {},
      };
    }
  }, []);

  // Initialize manager on mount
  useEffect(() => {
    initializeManager();
  }, [initializeManager]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaManagerRef.current) {
        mediaManagerRef.current.cleanup();
        mediaManagerRef.current = null;
      }
    };
  }, []);

  // Monitor local stream changes
  useEffect(() => {
    if (localStream && mediaManagerRef.current) {
      const manager = mediaManagerRef.current;
      const currentState = manager.getMediaState();
      setMediaState(currentState);
    }
  }, [localStream, setMediaState]);

  return {
    localStream,
    remoteStreams,
    mediaState,
    isInitialized: isMediaInitialized,
    initializeMedia,
    toggleVideo,
    toggleAudio,
    stopStream,
    addRemoteStream: addRemoteStreamInfo,
    removeRemoteStream: removeRemoteStreamInfo,
    startScreenShare,
    stopScreenShare,
    getMediaDevices,
    getStreamStats,
    checkMediaSupport,
    error: useStreamingStore().lastError,
  };
};
