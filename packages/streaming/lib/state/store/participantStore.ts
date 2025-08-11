/**
 * @fileoverview Participant Store
 *
 * Specialized Zustand store for participant management and media states
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MediaState, MediaStreamInfo, Participant } from '@/types';

interface ParticipantStoreState {
  // Participant tracking
  participants: Map<string, Participant>;
  localParticipant: Participant | null;

  // Stream mapping
  streamToParticipant: Map<string, string>; // streamId -> participantId
  participantToStream: Map<string, string>; // participantId -> streamId

  // Speaking detection
  speakingParticipants: Set<string>; // participantIds currently speaking
  dominantSpeaker: string | null;

  // Network quality tracking
  networkQuality: Map<
    string,
    {
      participantId: string;
      quality: 'excellent' | 'good' | 'poor' | 'unknown';
      bitrate: number;
      packetLoss: number;
      latency: number;
      lastUpdated: Date;
    }
  >;

  // Spotlight/Pin functionality
  pinnedParticipant: string | null;
  spotlightParticipant: string | null;

  // UI preferences
  participantOrder: string[]; // Custom ordering for UI
  showParticipantNames: boolean;
  showParticipantStats: boolean;
}

interface ParticipantStoreActions {
  // Participant management
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  setLocalParticipant: (participant: Participant | null) => void;

  // Media state management
  updateParticipantMediaState: (participantId: string, mediaState: Partial<MediaState>) => void;
  toggleParticipantVideo: (participantId: string) => void;
  toggleParticipantAudio: (participantId: string) => void;

  // Stream mapping
  mapStreamToParticipant: (streamId: string, participantId: string) => void;
  unmapStream: (streamId: string) => void;
  getParticipantByStreamId: (streamId: string) => Participant | null;
  getStreamIdByParticipantId: (participantId: string) => string | null;

  // Speaking detection
  setSpeaking: (participantId: string, speaking: boolean) => void;
  setDominantSpeaker: (participantId: string | null) => void;
  clearSpeaking: () => void;

  // Network quality
  updateNetworkQuality: (
    participantId: string,
    quality: {
      participantId: string;
      quality: 'excellent' | 'good' | 'poor' | 'unknown';
      bitrate: number;
      packetLoss: number;
      latency: number;
      lastUpdated: Date;
    }
  ) => void;
  clearNetworkQuality: () => void;

  // Spotlight/Pin
  pinParticipant: (participantId: string | null) => void;
  setSpotlightParticipant: (participantId: string | null) => void;

  // UI preferences
  setParticipantOrder: (order: string[]) => void;
  moveParticipantUp: (participantId: string) => void;
  moveParticipantDown: (participantId: string) => void;
  setShowParticipantNames: (show: boolean) => void;
  setShowParticipantStats: (show: boolean) => void;

  // Utility
  reset: () => void;
  getParticipantArray: () => Participant[];
  getRemoteParticipants: () => Participant[];
  getParticipantCount: () => number;
  getActiveParticipants: () => Participant[]; // Participants with active media
}

type ParticipantStore = ParticipantStoreState & ParticipantStoreActions;

const initialState: ParticipantStoreState = {
  participants: new Map(),
  localParticipant: null,
  streamToParticipant: new Map(),
  participantToStream: new Map(),
  speakingParticipants: new Set(),
  dominantSpeaker: null,
  networkQuality: new Map(),
  pinnedParticipant: null,
  spotlightParticipant: null,
  participantOrder: [],
  showParticipantNames: true,
  showParticipantStats: false,
};

export const useParticipantStore = create<ParticipantStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Participant management
      addParticipant: (participant) =>
        set(
          (state) => {
            const newParticipants = new Map(state.participants);
            newParticipants.set(participant.id, participant);

            // Update stream mapping
            const newParticipantToStream = new Map(state.participantToStream);
            const newStreamToParticipant = new Map(state.streamToParticipant);

            newParticipantToStream.set(participant.id, participant.streamId);
            newStreamToParticipant.set(participant.streamId, participant.id);

            // Update participant order
            const newOrder = state.participantOrder.includes(participant.id)
              ? state.participantOrder
              : [...state.participantOrder, participant.id];

            return {
              participants: newParticipants,
              participantToStream: newParticipantToStream,
              streamToParticipant: newStreamToParticipant,
              participantOrder: newOrder,
              localParticipant: participant.isLocalUser ? participant : state.localParticipant,
            };
          },
          false,
          'addParticipant'
        ),

      removeParticipant: (participantId) =>
        set(
          (state) => {
            const newParticipants = new Map(state.participants);
            const participant = newParticipants.get(participantId);

            if (!participant) return state;

            newParticipants.delete(participantId);

            // Clean up stream mappings
            const newParticipantToStream = new Map(state.participantToStream);
            const newStreamToParticipant = new Map(state.streamToParticipant);

            newParticipantToStream.delete(participantId);
            newStreamToParticipant.delete(participant.streamId);

            // Clean up speaking state
            const newSpeakingParticipants = new Set(state.speakingParticipants);
            newSpeakingParticipants.delete(participantId);

            // Clean up network quality
            const newNetworkQuality = new Map(state.networkQuality);
            newNetworkQuality.delete(participantId);

            // Update participant order
            const newOrder = state.participantOrder.filter((id) => id !== participantId);

            return {
              ...state,
              participants: newParticipants,
              participantToStream: newParticipantToStream,
              streamToParticipant: newStreamToParticipant,
              speakingParticipants: newSpeakingParticipants,
              networkQuality: newNetworkQuality,
              participantOrder: newOrder,
              localParticipant: participant.isLocalUser ? null : state.localParticipant,
              dominantSpeaker: state.dominantSpeaker === participantId ? null : state.dominantSpeaker,
              pinnedParticipant: state.pinnedParticipant === participantId ? null : state.pinnedParticipant,
              spotlightParticipant: state.spotlightParticipant === participantId ? null : state.spotlightParticipant,
            };
          },
          false,
          'removeParticipant'
        ),

      updateParticipant: (participantId, updates) =>
        set(
          (state) => {
            const newParticipants = new Map(state.participants);
            const existing = newParticipants.get(participantId);

            if (!existing) return state;

            const updated = { ...existing, ...updates };
            newParticipants.set(participantId, updated);

            return {
              participants: newParticipants,
              localParticipant: updated.isLocalUser ? updated : state.localParticipant,
            };
          },
          false,
          'updateParticipant'
        ),

      setLocalParticipant: (participant) => set({ localParticipant: participant }, false, 'setLocalParticipant'),

      // Media state management
      updateParticipantMediaState: (participantId, mediaState) =>
        set(
          (state) => {
            const newParticipants = new Map(state.participants);
            const existing = newParticipants.get(participantId);

            if (!existing) return state;

            const updated = {
              ...existing,
              mediaState: { ...existing.mediaState, ...mediaState },
            };

            newParticipants.set(participantId, updated);

            return {
              participants: newParticipants,
              localParticipant: updated.isLocalUser ? updated : state.localParticipant,
            };
          },
          false,
          'updateParticipantMediaState'
        ),

      toggleParticipantVideo: (participantId) =>
        set(
          (state) => {
            const participant = state.participants.get(participantId);
            if (!participant) return state;

            const newMediaState = { ...participant.mediaState, video: !participant.mediaState.video };
            get().updateParticipantMediaState(participantId, newMediaState);

            return state;
          },
          false,
          'toggleParticipantVideo'
        ),

      toggleParticipantAudio: (participantId) =>
        set(
          (state) => {
            const participant = state.participants.get(participantId);
            if (!participant) return state;

            const newMediaState = { ...participant.mediaState, audio: !participant.mediaState.audio };
            get().updateParticipantMediaState(participantId, newMediaState);

            return state;
          },
          false,
          'toggleParticipantAudio'
        ),

      // Stream mapping
      mapStreamToParticipant: (streamId, participantId) =>
        set(
          (state) => ({
            streamToParticipant: new Map(state.streamToParticipant).set(streamId, participantId),
            participantToStream: new Map(state.participantToStream).set(participantId, streamId),
          }),
          false,
          'mapStreamToParticipant'
        ),

      unmapStream: (streamId) =>
        set(
          (state) => {
            const participantId = state.streamToParticipant.get(streamId);
            if (!participantId) return state;

            const newStreamToParticipant = new Map(state.streamToParticipant);
            const newParticipantToStream = new Map(state.participantToStream);

            newStreamToParticipant.delete(streamId);
            newParticipantToStream.delete(participantId);

            return {
              streamToParticipant: newStreamToParticipant,
              participantToStream: newParticipantToStream,
            };
          },
          false,
          'unmapStream'
        ),

      getParticipantByStreamId: (streamId) => {
        const participantId = get().streamToParticipant.get(streamId);
        return participantId ? get().participants.get(participantId) || null : null;
      },

      getStreamIdByParticipantId: (participantId) => {
        return get().participantToStream.get(participantId) || null;
      },

      // Speaking detection
      setSpeaking: (participantId, speaking) =>
        set(
          (state) => {
            const newSpeakingParticipants = new Set(state.speakingParticipants);

            if (speaking) {
              newSpeakingParticipants.add(participantId);
            } else {
              newSpeakingParticipants.delete(participantId);
            }

            return { speakingParticipants: newSpeakingParticipants };
          },
          false,
          'setSpeaking'
        ),

      setDominantSpeaker: (participantId) => set({ dominantSpeaker: participantId }, false, 'setDominantSpeaker'),

      clearSpeaking: () => set({ speakingParticipants: new Set(), dominantSpeaker: null }, false, 'clearSpeaking'),

      // Network quality
      updateNetworkQuality: (participantId, quality) =>
        set(
          (state) => {
            const newNetworkQuality = new Map(state.networkQuality);
            newNetworkQuality.set(participantId, quality);
            return { networkQuality: newNetworkQuality };
          },
          false,
          'updateNetworkQuality'
        ),

      clearNetworkQuality: () => set({ networkQuality: new Map() }, false, 'clearNetworkQuality'),

      // Spotlight/Pin
      pinParticipant: (participantId) => set({ pinnedParticipant: participantId }, false, 'pinParticipant'),

      setSpotlightParticipant: (participantId) =>
        set({ spotlightParticipant: participantId }, false, 'setSpotlightParticipant'),

      // UI preferences
      setParticipantOrder: (order) => set({ participantOrder: order }, false, 'setParticipantOrder'),

      moveParticipantUp: (participantId) =>
        set(
          (state) => {
            const currentIndex = state.participantOrder.indexOf(participantId);
            if (currentIndex <= 0) return state;

            const newOrder = [...state.participantOrder];
            const currentItem = newOrder[currentIndex];
            const prevItem = newOrder[currentIndex - 1];
            if (currentItem && prevItem) {
              [newOrder[currentIndex - 1], newOrder[currentIndex]] = [currentItem, prevItem];
            }

            return { participantOrder: newOrder };
          },
          false,
          'moveParticipantUp'
        ),

      moveParticipantDown: (participantId) =>
        set(
          (state) => {
            const currentIndex = state.participantOrder.indexOf(participantId);
            if (currentIndex === -1 || currentIndex >= state.participantOrder.length - 1) return state;

            const newOrder = [...state.participantOrder];
            const currentItem = newOrder[currentIndex];
            const nextItem = newOrder[currentIndex + 1];
            if (currentItem && nextItem) {
              [newOrder[currentIndex], newOrder[currentIndex + 1]] = [nextItem, currentItem];
            }

            return { participantOrder: newOrder };
          },
          false,
          'moveParticipantDown'
        ),

      setShowParticipantNames: (show) => set({ showParticipantNames: show }, false, 'setShowParticipantNames'),

      setShowParticipantStats: (show) => set({ showParticipantStats: show }, false, 'setShowParticipantStats'),

      // Utility
      reset: () =>
        set(
          {
            participants: new Map(),
            localParticipant: null,
            streamToParticipant: new Map(),
            participantToStream: new Map(),
            speakingParticipants: new Set(),
            dominantSpeaker: null,
            networkQuality: new Map(),
            pinnedParticipant: null,
            spotlightParticipant: null,
            participantOrder: [],
            showParticipantNames: true,
            showParticipantStats: false,
          },
          false,
          'reset'
        ),

      getParticipantArray: () => Array.from(get().participants.values()),

      getRemoteParticipants: () => Array.from(get().participants.values()).filter((p) => !p.isLocalUser),

      getParticipantCount: () => get().participants.size,

      getActiveParticipants: () =>
        Array.from(get().participants.values()).filter((p) => p.mediaState.video || p.mediaState.audio),
    }),
    {
      name: 'participant-store',
    }
  )
);

// Selectors
export const useParticipantSelectors = () => {
  const store = useParticipantStore();

  return {
    // Participant selectors
    participants: store.getParticipantArray(),
    remoteParticipants: store.getRemoteParticipants(),
    localParticipant: store.localParticipant,
    participantCount: store.getParticipantCount(),
    activeParticipants: store.getActiveParticipants(),

    // Speaking selectors
    speakingParticipants: Array.from(store.speakingParticipants),
    dominantSpeaker: store.dominantSpeaker,
    hasSpeakingParticipants: store.speakingParticipants.size > 0,

    // UI selectors
    pinnedParticipant: store.pinnedParticipant,
    spotlightParticipant: store.spotlightParticipant,
    participantOrder: store.participantOrder,
    showParticipantNames: store.showParticipantNames,
    showParticipantStats: store.showParticipantStats,

    // Network quality selectors
    networkQuality: Object.fromEntries(store.networkQuality),
  };
};

// Action creators for complex operations
export const participantActions = {
  /**
   * Add participant with automatic stream mapping
   */
  addParticipantWithStream: (participant: Participant, streamInfo?: MediaStreamInfo) => {
    const { addParticipant, mapStreamToParticipant } = useParticipantStore.getState();

    addParticipant(participant);

    if (streamInfo) {
      mapStreamToParticipant(streamInfo.streamId, participant.id);
    }

    console.log(`👥 Participant added: ${participant.id} (${participant.isLocalUser ? 'local' : 'remote'})`);
  },

  /**
   * Remove participant and cleanup all associated data
   */
  removeParticipantWithCleanup: (participantId: string) => {
    const { participants, removeParticipant } = useParticipantStore.getState();
    const participant = participants.get(participantId);

    if (!participant) {
      console.warn(`Participant not found: ${participantId}`);
      return;
    }

    removeParticipant(participantId);
    console.log(`👋 Participant removed: ${participantId}`);
  },

  /**
   * Update participant media state with logging
   */
  updateMediaStateWithLog: (participantId: string, mediaState: Partial<MediaState>) => {
    const { updateParticipantMediaState, participants } = useParticipantStore.getState();
    const participant = participants.get(participantId);

    if (!participant) return;

    updateParticipantMediaState(participantId, mediaState);

    console.log(`📱 Media state updated for ${participantId}:`, {
      video: mediaState.video !== undefined ? mediaState.video : participant.mediaState.video,
      audio: mediaState.audio !== undefined ? mediaState.audio : participant.mediaState.audio,
    });
  },
};

export default useParticipantStore;
