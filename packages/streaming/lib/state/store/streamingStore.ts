/**
 * @fileoverview Streaming Store
 *
 * Main Zustand store for streaming state management
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { ConnectionState, MediaState, MediaStreamInfo, SignalRConnectionConfig, StreamingError } from '@/types';

interface StreamingState {
  // Connection State
  signalRState: ConnectionState;
  webRTCState: ConnectionState;
  connectionId: string | null;

  // Media State
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStreamInfo>;
  mediaState: MediaState;
  isMediaInitialized: boolean;

  // Configuration
  config: SignalRConnectionConfig | null;

  // Error State
  errors: StreamingError[];
  lastError: StreamingError | null;

  // UI State
  isConnecting: boolean;
  isJoiningRoom: boolean;
  isInitializingMedia: boolean;
}

interface StreamingActions {
  // Connection Actions
  setSignalRState: (state: ConnectionState) => void;
  setWebRTCState: (state: ConnectionState) => void;
  setConnectionId: (id: string | null) => void;
  setConfig: (config: SignalRConnectionConfig) => void;

  // Media Actions
  setLocalStream: (stream: MediaStream | null) => void;
  addRemoteStream: (streamInfo: MediaStreamInfo) => void;
  removeRemoteStream: (streamId: string) => void;
  updateRemoteStream: (streamId: string, updates: Partial<MediaStreamInfo>) => void;
  setMediaState: (state: MediaState) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  setMediaInitialized: (initialized: boolean) => void;

  // Error Actions
  addError: (error: StreamingError) => void;
  removeError: (index: number) => void;
  clearErrors: () => void;
  setLastError: (error: StreamingError | null) => void;

  // UI State Actions
  setConnecting: (connecting: boolean) => void;
  setJoiningRoom: (joining: boolean) => void;
  setInitializingMedia: (initializing: boolean) => void;

  // Utility Actions
  reset: () => void;
  cleanup: () => void;
}

type StreamingStore = StreamingState & StreamingActions;

const initialState: StreamingState = {
  signalRState: ConnectionState.Disconnected,
  webRTCState: ConnectionState.Disconnected,
  connectionId: null,
  localStream: null,
  remoteStreams: new Map(),
  mediaState: { video: true, audio: true },
  isMediaInitialized: false,
  config: null,
  errors: [],
  lastError: null,
  isConnecting: false,
  isJoiningRoom: false,
  isInitializingMedia: false,
};

export const useStreamingStore = create<StreamingStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Connection Actions
      setSignalRState: (state) => set({ signalRState: state }, false, 'setSignalRState'),

      setWebRTCState: (state) => set({ webRTCState: state }, false, 'setWebRTCState'),

      setConnectionId: (id) => set({ connectionId: id }, false, 'setConnectionId'),

      setConfig: (config) => set({ config }, false, 'setConfig'),

      // Media Actions
      setLocalStream: (stream) => set({ localStream: stream }, false, 'setLocalStream'),

      addRemoteStream: (streamInfo) =>
        set(
          (state) => {
            const newRemoteStreams = new Map(state.remoteStreams);
            newRemoteStreams.set(streamInfo.streamId, streamInfo);
            return { remoteStreams: newRemoteStreams };
          },
          false,
          'addRemoteStream'
        ),

      removeRemoteStream: (streamId) =>
        set(
          (state) => {
            const newRemoteStreams = new Map(state.remoteStreams);
            newRemoteStreams.delete(streamId);
            return { remoteStreams: newRemoteStreams };
          },
          false,
          'removeRemoteStream'
        ),

      updateRemoteStream: (streamId, updates) =>
        set(
          (state) => {
            const newRemoteStreams = new Map(state.remoteStreams);
            const existing = newRemoteStreams.get(streamId);
            if (existing) {
              newRemoteStreams.set(streamId, { ...existing, ...updates });
            }
            return { remoteStreams: newRemoteStreams };
          },
          false,
          'updateRemoteStream'
        ),

      setMediaState: (state) => set({ mediaState: state }, false, 'setMediaState'),

      toggleVideo: () =>
        set(
          (state) => ({
            mediaState: { ...state.mediaState, video: !state.mediaState.video },
          }),
          false,
          'toggleVideo'
        ),

      toggleAudio: () =>
        set(
          (state) => ({
            mediaState: { ...state.mediaState, audio: !state.mediaState.audio },
          }),
          false,
          'toggleAudio'
        ),

      setMediaInitialized: (initialized) => set({ isMediaInitialized: initialized }, false, 'setMediaInitialized'),

      // Error Actions
      addError: (error) =>
        set(
          (state) => ({
            errors: [...state.errors, error],
            lastError: error,
          }),
          false,
          'addError'
        ),

      removeError: (index) =>
        set(
          (state) => ({
            errors: state.errors.filter((_, i) => i !== index),
          }),
          false,
          'removeError'
        ),

      clearErrors: () => set({ errors: [], lastError: null }, false, 'clearErrors'),

      setLastError: (error) => set({ lastError: error }, false, 'setLastError'),

      // UI State Actions
      setConnecting: (connecting) => set({ isConnecting: connecting }, false, 'setConnecting'),

      setJoiningRoom: (joining) => set({ isJoiningRoom: joining }, false, 'setJoiningRoom'),

      setInitializingMedia: (initializing) => set({ isInitializingMedia: initializing }, false, 'setInitializingMedia'),

      // Utility Actions
      reset: () => set(initialState, false, 'reset'),

      cleanup: () =>
        set(
          (state) => ({
            ...initialState,
            config: state.config, // Keep config for reconnection
          }),
          false,
          'cleanup'
        ),
    })),
    {
      name: 'streaming-store',
    }
  )
);

// Selectors for derived state
export const useStreamingSelectors = () => {
  const store = useStreamingStore();

  return {
    // Connection selectors
    isConnected: store.signalRState === ConnectionState.Connected && store.webRTCState === ConnectionState.Connected,
    isConnecting: store.isConnecting,
    connectionStatus: store.signalRState,

    // Media selectors
    hasLocalStream: store.localStream !== null,
    remoteStreamCount: store.remoteStreams.size,
    remoteStreamsArray: Array.from(store.remoteStreams.values()),
    isVideoEnabled: store.mediaState.video,
    isAudioEnabled: store.mediaState.audio,

    // Error selectors
    hasErrors: store.errors.length > 0,
    errorCount: store.errors.length,
    lastError: store.lastError,

    // UI selectors
    isJoiningRoom: store.isJoiningRoom,
    isInitializingMedia: store.isInitializingMedia,
  };
};

// Subscription helpers
export const subscribeToConnectionState = (callback: (state: ConnectionState) => void) => {
  return useStreamingStore.subscribe((state) => state.signalRState, callback);
};

export const subscribeToMediaState = (callback: (mediaState: MediaState) => void) => {
  return useStreamingStore.subscribe((state) => state.mediaState, callback, {
    equalityFn: (a, b) => a.video === b.video && a.audio === b.audio,
  });
};

export const subscribeToRemoteStreams = (callback: (streams: MediaStreamInfo[]) => void) => {
  return useStreamingStore.subscribe((state) => Array.from(state.remoteStreams.values()), callback);
};

// Action creators for complex operations
export const streamingActions = {
  /**
   * Connect and initialize streaming
   */
  async connectAndInitialize(config: SignalRConnectionConfig) {
    const { setConfig, setConnecting, addError } = useStreamingStore.getState();

    try {
      setConnecting(true);
      setConfig(config);

      // Hooks will handle connection logic
      console.log('🚀 Initializing streaming with config');
    } catch (error) {
      addError({
        code: 'INITIALIZATION_FAILED',
        message: 'Failed to initialize streaming',
        details: error,
        timestamp: new Date(),
      });
    } finally {
      setConnecting(false);
    }
  },

  /**
   * Join room with error handling
   */
  async joinRoomSafely(roomId: string) {
    const { setJoiningRoom, addError } = useStreamingStore.getState();

    try {
      setJoiningRoom(true);

      // Hooks will handle room joining logic
      console.log(`🚪 Joining room: ${roomId}`);
    } catch (error) {
      addError({
        code: 'ROOM_JOIN_FAILED',
        message: `Failed to join room: ${roomId}`,
        details: error,
        timestamp: new Date(),
      });
    } finally {
      setJoiningRoom(false);
    }
  },

  /**
   * Leave room and cleanup
   */
  async leaveRoomSafely() {
    const { cleanup } = useStreamingStore.getState();

    try {
      // Hooks will handle leave room logic
      console.log('👋 Leaving room');
    } catch (error) {
      console.error('Error leaving room:', error);
    } finally {
      cleanup();
      console.log(useStreamingStore.getState());
    }
  },
};
