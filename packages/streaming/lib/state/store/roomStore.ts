/**
 * @fileoverview Room Store
 *
 * Zustand store for room-specific state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { RoomState, RoomMetadata } from '@/types';

interface RoomStoreState {
  // Current Room State
  currentRoom: RoomState | null;

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
  updateRoomMetadata: (metadata: Partial<RoomMetadata>) => void;

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
}

type RoomStore = RoomStoreState & RoomStoreActions;

const initialState: RoomStoreState = {
  currentRoom: null,
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
      (set) => ({
        ...initialState,

        // Room Management
        setCurrentRoom: (room) => set({ currentRoom: room }),

        updateRoomMetadata: (metadata) =>
          set(
            (state) => ({
              currentRoom: state.currentRoom
                ? {
                    ...state.currentRoom,
                    Metadata: {},
                  }
                : null,
            }),
            false,
            'updateRoomMetadata'
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
              isCreatingRoom: false,
              isUpdatingRoom: false,
            },
            false,
            'reset'
          ),
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
    roomId: store.currentRoom?.Id || null,
    roomMetadata: store.currentRoom?.Metadata || {},

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
  createRoom: (roomId: string, name: string, metadata?: Partial<RoomMetadata>) => {
    const { setCurrentRoom, addToRecentRooms } = useRoomStore.getState();

    const newRoom: RoomState = {
      Id: roomId,
      Name: name,
      Status: 1, // Active
      Metadata: metadata || {},
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      IsActive: true,
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
    addToRecentRooms(room.Id);

    console.log(`🚪 Joined room: ${room.Id}`);
  },

  /**
   * Leave current room
   */
  leaveRoom: () => {
    const { reset } = useRoomStore.getState();

    console.log('👋 Left room');
    reset();
  },
};
