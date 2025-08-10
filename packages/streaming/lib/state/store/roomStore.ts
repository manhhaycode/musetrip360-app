/**
 * @fileoverview Room Store
 *
 * Zustand store for room-specific state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { RoomState, Participant } from '../../types';

interface RoomStoreState {
  // Current Room State
  currentRoom: RoomState | null;
  participants: Map<string, Participant>;

  // Room History (persisted)
  recentRooms: string[];

  // Room UI State
  isCreatingRoom: boolean;
  isUpdatingRoom: boolean;

  // Room Settings
  roomSettings: {
    autoJoinAudio: boolean;
    autoJoinVideo: boolean;
    maxParticipants: number;
    allowScreenShare: boolean;
  };
}

interface RoomStoreActions {
  // Room Management
  setCurrentRoom: (room: RoomState | null) => void;
  updateRoomMetadata: (metadata: Record<string, any>) => void;

  // Participant Management
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  updateParticipantMediaState: (participantId: string, mediaState: Partial<Participant['mediaState']>) => void;

  // Room History
  addToRecentRooms: (roomId: string) => void;
  removeFromRecentRooms: (roomId: string) => void;
  clearRecentRooms: () => void;

  // UI State
  setCreatingRoom: (creating: boolean) => void;
  setUpdatingRoom: (updating: boolean) => void;

  // Room Settings
  updateRoomSettings: (settings: Partial<RoomStoreState['roomSettings']>) => void;

  // Utility
  reset: () => void;
  getParticipantArray: () => Participant[];
  getParticipantCount: () => number;
  getLocalParticipant: () => Participant | null;
  getRemoteParticipants: () => Participant[];
}

type RoomStore = RoomStoreState & RoomStoreActions;

const initialState: RoomStoreState = {
  currentRoom: null,
  participants: new Map(),
  recentRooms: [],
  isCreatingRoom: false,
  isUpdatingRoom: false,
  roomSettings: {
    autoJoinAudio: true,
    autoJoinVideo: true,
    maxParticipants: 8,
    allowScreenShare: true,
  },
};

export const useRoomStore = create<RoomStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Room Management
        setCurrentRoom: (room) => set({ currentRoom: room }, false, 'setCurrentRoom'),

        updateRoomMetadata: (metadata) =>
          set(
            (state) => ({
              currentRoom: state.currentRoom
                ? {
                    ...state.currentRoom,
                    metadata: { ...state.currentRoom.metadata, ...metadata },
                  }
                : null,
            }),
            false,
            'updateRoomMetadata'
          ),

        // Participant Management
        addParticipant: (participant) =>
          set(
            (state) => {
              const newParticipants = new Map(state.participants);
              newParticipants.set(participant.id, participant);

              // Also update current room participants if room exists
              const updatedRoom = state.currentRoom
                ? {
                    ...state.currentRoom,
                    participants: Array.from(newParticipants.values()),
                  }
                : null;

              return {
                participants: newParticipants,
                currentRoom: updatedRoom,
              };
            },
            false,
            'addParticipant'
          ),

        removeParticipant: (participantId) =>
          set(
            (state) => {
              const newParticipants = new Map(state.participants);
              newParticipants.delete(participantId);

              // Also update current room participants if room exists
              const updatedRoom = state.currentRoom
                ? {
                    ...state.currentRoom,
                    participants: Array.from(newParticipants.values()),
                  }
                : null;

              return {
                participants: newParticipants,
                currentRoom: updatedRoom,
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

              if (existing) {
                const updated = { ...existing, ...updates };
                newParticipants.set(participantId, updated);

                // Also update current room participants if room exists
                const updatedRoom = state.currentRoom
                  ? {
                      ...state.currentRoom,
                      participants: Array.from(newParticipants.values()),
                    }
                  : null;

                return {
                  participants: newParticipants,
                  currentRoom: updatedRoom,
                };
              }

              return state;
            },
            false,
            'updateParticipant'
          ),

        updateParticipantMediaState: (participantId, mediaState) =>
          set(
            (state) => {
              const newParticipants = new Map(state.participants);
              const existing = newParticipants.get(participantId);

              if (existing) {
                const updated = {
                  ...existing,
                  mediaState: { ...existing.mediaState, ...mediaState },
                };
                newParticipants.set(participantId, updated);

                // Also update current room participants if room exists
                const updatedRoom = state.currentRoom
                  ? {
                      ...state.currentRoom,
                      participants: Array.from(newParticipants.values()),
                    }
                  : null;

                return {
                  participants: newParticipants,
                  currentRoom: updatedRoom,
                };
              }

              return state;
            },
            false,
            'updateParticipantMediaState'
          ),

        // Room History
        addToRecentRooms: (roomId) =>
          set(
            (state) => {
              const recentRooms = [roomId, ...state.recentRooms.filter((id) => id !== roomId)].slice(0, 10);
              return { recentRooms };
            },
            false,
            'addToRecentRooms'
          ),

        removeFromRecentRooms: (roomId) =>
          set(
            (state) => ({
              recentRooms: state.recentRooms.filter((id) => id !== roomId),
            }),
            false,
            'removeFromRecentRooms'
          ),

        clearRecentRooms: () => set({ recentRooms: [] }, false, 'clearRecentRooms'),

        // UI State
        setCreatingRoom: (creating) => set({ isCreatingRoom: creating }, false, 'setCreatingRoom'),

        setUpdatingRoom: (updating) => set({ isUpdatingRoom: updating }, false, 'setUpdatingRoom'),

        // Room Settings
        updateRoomSettings: (settings) =>
          set(
            (state) => ({
              roomSettings: { ...state.roomSettings, ...settings },
            }),
            false,
            'updateRoomSettings'
          ),

        // Utility
        reset: () =>
          set(
            {
              currentRoom: null,
              participants: new Map(),
              isCreatingRoom: false,
              isUpdatingRoom: false,
            },
            false,
            'reset'
          ),

        getParticipantArray: () => Array.from(get().participants.values()),

        getParticipantCount: () => get().participants.size,

        getLocalParticipant: () => {
          const participants = Array.from(get().participants.values());
          return participants.find((p) => p.isLocalUser) || null;
        },

        getRemoteParticipants: () => {
          const participants = Array.from(get().participants.values());
          return participants.filter((p) => !p.isLocalUser);
        },
      }),
      {
        name: 'room-store',
        partialize: (state) => ({
          recentRooms: state.recentRooms,
          roomSettings: state.roomSettings,
        }),
      }
    ),
    {
      name: 'room-store',
    }
  )
);

// Selectors
export const useRoomSelectors = () => {
  const store = useRoomStore();

  return {
    // Room selectors
    currentRoom: store.currentRoom,
    hasCurrentRoom: store.currentRoom !== null,
    roomId: store.currentRoom?.roomId || null,
    roomMetadata: store.currentRoom?.metadata || {},

    // Participant selectors
    participantCount: store.getParticipantCount(),
    participants: store.getParticipantArray(),
    localParticipant: store.getLocalParticipant(),
    remoteParticipants: store.getRemoteParticipants(),

    // History selectors
    recentRooms: store.recentRooms,
    hasRecentRooms: store.recentRooms.length > 0,

    // UI selectors
    isCreatingRoom: store.isCreatingRoom,
    isUpdatingRoom: store.isUpdatingRoom,

    // Settings selectors
    roomSettings: store.roomSettings,
  };
};

// Action creators for complex operations
export const roomActions = {
  /**
   * Create a new room with default settings
   */
  createRoom: (roomId: string, metadata?: Record<string, any>) => {
    const { setCurrentRoom, addToRecentRooms, roomSettings } = useRoomStore.getState();

    const newRoom: RoomState = {
      roomId,
      participants: [],
      metadata: {
        ...metadata,
        createdBy: 'current-user', // This should come from auth context
        maxParticipants: roomSettings.maxParticipants,
        allowScreenShare: roomSettings.allowScreenShare,
      },
      createdAt: new Date(),
      isActive: true,
    };

    setCurrentRoom(newRoom);
    addToRecentRooms(roomId);

    console.log(`🏠 Room created: ${roomId}`);
    return newRoom;
  },

  /**
   * Join existing room
   */
  joinRoom: (room: RoomState) => {
    const { setCurrentRoom, addToRecentRooms } = useRoomStore.getState();

    setCurrentRoom(room);
    addToRecentRooms(room.roomId);

    console.log(`🚪 Joined room: ${room.roomId}`);
  },

  /**
   * Leave current room
   */
  leaveRoom: () => {
    const { reset } = useRoomStore.getState();

    console.log('👋 Left room');
    reset();
  },

  /**
   * Add local participant
   */
  addLocalParticipant: (userId: string, streamId: string, connectionId: string) => {
    const { addParticipant, roomSettings } = useRoomStore.getState();

    const localParticipant: Participant = {
      id: userId,
      peerId: userId,
      streamId,
      connectionId,
      isLocalUser: true,
      mediaState: {
        video: roomSettings.autoJoinVideo,
        audio: roomSettings.autoJoinAudio,
      },
      joinedAt: new Date(),
    };

    addParticipant(localParticipant);
    console.log('👤 Local participant added');
    return localParticipant;
  },

  /**
   * Add remote participant
   */
  addRemoteParticipant: (
    userId: string,
    peerId: string,
    streamId: string,
    connectionId: string,
    metadata?: Record<string, any>
  ) => {
    const { addParticipant } = useRoomStore.getState();

    const remoteParticipant: Participant = {
      id: userId,
      peerId,
      streamId,
      connectionId,
      metadata,
      isLocalUser: false,
      mediaState: {
        video: true, // Assume remote participants join with media enabled
        audio: true,
      },
      joinedAt: new Date(),
    };

    addParticipant(remoteParticipant);
    console.log(`👥 Remote participant added: ${peerId}`);
    return remoteParticipant;
  },
};

export default useRoomStore;
