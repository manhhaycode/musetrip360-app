import { IVirtualTour, IVirtualTourScene } from '@/api';
import type { Hotspot } from '@/canvas/types';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

export type SelectionType = 'scene' | 'tour' | 'hotspot' | 'none';

export interface StudioState {
  // Current tour data
  virtualTour: IVirtualTour;
  selectedSceneId: string | null;
  selectedHotspotId: string | null;
  propertiesSelection: SelectionType;
  isDirty: boolean;
  isSyncing?: boolean; // Flag to indicate if syncing is in progress

  // History for undo/redo
  history: {
    past: IVirtualTour[];
    future: IVirtualTour[];
  };

  // UI state
  sidebarCollapsed: boolean;
}

export interface StudioActions {
  // Tour actions
  updateTour: (updates: Partial<IVirtualTour>) => void;
  setVirtualTour: (tour: IVirtualTour) => void;
  setPropertiesSelection: (type: SelectionType) => void;

  // Scene actions
  addScene: (parentScene?: IVirtualTourScene) => void;
  updateScene: (sceneId: string, updates: Partial<IVirtualTourScene>, parentScene?: IVirtualTourScene) => void;
  deleteScene: (sceneId: string, parentSceneId?: string) => void;
  selectScene: (sceneId: string | null) => void;
  reorderScenes: (scenes: IVirtualTourScene[]) => void;

  getSelectedScene: () => IVirtualTourScene | null;

  // Hotspot actions
  addHotspot: (hotspot: Omit<Hotspot, 'id'>) => void;
  updateHotspot: (hotspotId: string, updates: Partial<Hotspot>) => void;
  deleteHotspot: (hotspotId: string) => void;
  getSceneHotspots: (sceneId?: string) => Hotspot[];
  getSelectedHotspot: () => Hotspot | null;
  selectHotspot: (hotspotId: string | null) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  saveToHistory: () => void;
  setIsDirty: (isDirty: boolean) => void;
  setIsSyncing: (isSyncing: boolean) => void;

  // UI actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Utility actions
  reset: () => void;
  markClean: () => void;
}

export type StudioStore = StudioState & StudioActions;

const createInitialState = (tour: IVirtualTour): StudioState => ({
  virtualTour: tour,
  selectedSceneId: null,
  selectedHotspotId: null,
  propertiesSelection: 'tour',
  isDirty: false,
  isSyncing: false,
  history: {
    past: [],
    future: [],
  },
  sidebarCollapsed: false,
});

export const useStudioStore = create<StudioStore>()(
  subscribeWithSelector((set, get) => ({
    ...createInitialState({
      id: '',
      name: '',
      description: '',
      rating: 0,
      isActive: false,
      metadata: { scenes: [] },
      tourContent: [],
    }),

    getSelectedScene: () => {
      const state = get();
      if (!state.selectedSceneId) return null;
      return (
        [
          ...state.virtualTour.metadata.scenes,
          ...state.virtualTour.metadata.scenes.flatMap((s) => s.subScenes || []),
        ].find((scene) => scene.sceneId === state.selectedSceneId) || null
      );
    },

    getSelectedHotspot: () => {
      const state = get();
      if (!state.selectedHotspotId) return null;
      return (
        state.getSelectedScene()?.data?.hotspots?.find((hotspot) => hotspot.id === state.selectedHotspotId) || null
      );
    },

    // Tour actions
    updateTour: (updates) => {
      set((state) => {
        const newTour = { ...state.virtualTour, ...updates };
        return {
          virtualTour: newTour,
          isDirty: true,
        };
      });
      get().saveToHistory();
    },

    setVirtualTour: (tour) => {
      set((state) => ({
        ...state,
        virtualTour: {
          ...tour,
          metadata: {
            ...tour.metadata,
            scenes: tour.metadata.scenes || [],
          },
        },
        selectedSceneId: null,
        isDirty: false,
        history: { past: [], future: [] },
      }));
    },

    // Scene actions
    addScene: (parentScene) => {
      get().saveToHistory();
      set((state) => {
        // Create a new scene with a unique ID

        const newScene: IVirtualTourScene = {
          sceneId: `scene_${uuid()}`,
          sceneName: parentScene?.sceneName
            ? `Sub Scene ${parentScene.subScenes ? parentScene.subScenes.length + 1 : 1}`
            : `Scene ${state.virtualTour.metadata.scenes.length + 1}`,
          ...(parentScene ? { parentId: parentScene.sceneId } : {}),
          sceneDescription: '',
        };
        if (parentScene) {
          // If parentScene is provided, add to its subScenes
          const updatedScenes = state.virtualTour.metadata.scenes.map((s) => {
            if (s.sceneId === parentScene.sceneId) {
              return {
                ...s,
                subScenes: [...(s.subScenes || []), newScene],
              };
            }
            return s;
          });
          return {
            virtualTour: {
              ...state.virtualTour,
              metadata: {
                ...state.virtualTour.metadata,
                scenes: updatedScenes,
              },
            },
            selectedSceneId: newScene.sceneId,
            propertiesSelection: 'scene',
            isDirty: true,
          };
        }
        return {
          virtualTour: {
            ...state.virtualTour,
            metadata: {
              ...state.virtualTour.metadata,
              scenes: [...state.virtualTour.metadata.scenes, newScene],
            },
          },
          selectedSceneId: newScene.sceneId,
          propertiesSelection: 'scene',
          isDirty: true,
        };
      });
    },

    updateScene: (sceneId, updates) => {
      get().saveToHistory();
      set((state) => {
        const selectedScene = state.getSelectedScene();
        const parentId = selectedScene?.parentId;
        if (selectedScene?.parentId) {
          // If parentScene is provided, update its subScenes
          const updatedScenes = state.virtualTour.metadata.scenes.map((scene) => {
            if (scene.sceneId === parentId) {
              return {
                ...scene,
                subScenes: scene.subScenes?.map((subScene) =>
                  subScene.sceneId === sceneId ? { ...subScene, ...updates } : subScene
                ),
              };
            }
            return scene;
          });
          return {
            virtualTour: {
              ...state.virtualTour,
              metadata: {
                ...state.virtualTour.metadata,
                scenes: updatedScenes,
              },
            },
            isDirty: true,
          };
        }
        const newScenes = state.virtualTour.metadata.scenes.map((scene) =>
          scene.sceneId === sceneId ? { ...scene, ...updates } : scene
        );
        return {
          virtualTour: {
            ...state.virtualTour,
            metadata: {
              ...state.virtualTour.metadata,
              scenes: newScenes,
            },
          },
          isDirty: true,
        };
      });
    },

    deleteScene: (sceneId, parentSceneId) => {
      get().saveToHistory();
      set((state) => {
        if (parentSceneId) {
          // If parentSceneId is provided, remove from its subScenes
          const updatedScenes = state.virtualTour.metadata.scenes.map((scene) => {
            if (scene.sceneId === parentSceneId) {
              return {
                ...scene,
                subScenes: scene.subScenes?.filter((subScene) => subScene.sceneId !== sceneId) || [],
              };
            }
            return scene;
          });
          return {
            virtualTour: {
              ...state.virtualTour,
              metadata: {
                ...state.virtualTour.metadata,
                scenes: updatedScenes,
              },
            },
            selectedSceneId: state.selectedSceneId === sceneId ? null : state.selectedSceneId,
            propertiesSelection: state.selectedSceneId === sceneId ? 'tour' : state.propertiesSelection,
            isDirty: true,
          };
        }
        const newScenes = state.virtualTour.metadata.scenes.filter((scene) => scene.sceneId !== sceneId);
        return {
          virtualTour: {
            ...state.virtualTour,
            metadata: {
              ...state.virtualTour.metadata,
              scenes: newScenes,
            },
          },
          selectedSceneId: state.selectedSceneId === sceneId ? null : state.selectedSceneId,
          propertiesSelection: state.selectedSceneId === sceneId ? 'tour' : state.propertiesSelection,
          isDirty: true,
        };
      });
    },

    selectScene: (sceneId) => {
      set({ selectedSceneId: sceneId, propertiesSelection: 'scene' });
    },

    reorderScenes: (scenes) => {
      get().saveToHistory();
      set((state) => ({
        virtualTour: {
          ...state.virtualTour,
          metadata: {
            ...state.virtualTour.metadata,
            scenes,
          },
        },
        isDirty: true,
      }));
    },

    setPropertiesSelection: (type) => {
      set({ propertiesSelection: type });
    },

    // Hotspot actions
    addHotspot: (hotspot) => {
      const selectedScene = get().getSelectedScene();
      if (!selectedScene || !selectedScene.data) return;

      const newHotspot: Hotspot = {
        id: `hotspot_${uuid()}`,
        ...hotspot,
      };

      const currentHotspots = selectedScene.data.hotspots || [];
      const updatedHotspots = [...currentHotspots, newHotspot];

      get().updateScene(selectedScene.sceneId, {
        data: {
          ...selectedScene.data,
          hotspots: updatedHotspots,
        },
      });
      get().selectHotspot(newHotspot.id);
    },

    updateHotspot: (hotspotId, updates) => {
      const selectedScene = get().getSelectedScene();
      if (!selectedScene || !selectedScene.data) return;

      const currentHotspots = selectedScene.data.hotspots || [];
      const updatedHotspots = currentHotspots.map((hotspot) =>
        hotspot.id === hotspotId ? { ...hotspot, ...updates } : hotspot
      );

      get().updateScene(selectedScene.sceneId, {
        data: {
          ...selectedScene.data,
          hotspots: updatedHotspots,
        },
      });
    },

    deleteHotspot: (hotspotId) => {
      const selectedScene = get().getSelectedScene();
      if (!selectedScene || !selectedScene.data) return;

      const currentHotspots = selectedScene.data.hotspots || [];
      const updatedHotspots = currentHotspots.filter((hotspot) => hotspot.id !== hotspotId);

      get().updateScene(selectedScene.sceneId, {
        data: {
          ...selectedScene.data,
          hotspots: updatedHotspots,
        },
      });
    },

    getSceneHotspots: (sceneId?) => {
      if (sceneId) {
        const state = get();
        const allScenes = [
          ...state.virtualTour.metadata.scenes,
          ...state.virtualTour.metadata.scenes.flatMap((s) => s.subScenes || []),
        ];
        const targetScene = allScenes.find((scene) => scene.sceneId === sceneId);
        if (!targetScene || !targetScene.data) return [];
        return targetScene.data.hotspots || [];
      }

      // Default to selected scene
      const selectedScene = get().getSelectedScene();
      if (!selectedScene || !selectedScene.data) return [];
      return selectedScene.data.hotspots || [];
    },

    selectHotspot: (hotspotId) => {
      set({
        selectedHotspotId: hotspotId,
        propertiesSelection: hotspotId ? 'hotspot' : 'none',
      });
    },

    // History actions
    saveToHistory: () => {
      set((state) => {
        const newPast = [...state.history.past, state.virtualTour];
        // Limit history to prevent memory issues (keep last 50 states)
        const limitedPast = newPast.slice(-50);

        return {
          history: {
            past: limitedPast,
            future: [], // Clear future when new action is performed
          },
        };
      });
    },

    undo: () => {
      const state = get();
      if (state.history.past.length === 0) return;

      const previousTour = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      const newFuture = [state.virtualTour, ...state.history.future];

      set({
        virtualTour: previousTour,
        history: {
          past: newPast,
          future: newFuture,
        },
        isDirty: true,
      });
    },

    redo: () => {
      const state = get();
      if (state.history.future.length === 0) return;

      const nextTour = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      const newPast = [...state.history.past, state.virtualTour];

      set({
        virtualTour: nextTour,
        history: {
          past: newPast,
          future: newFuture,
        },
        isDirty: true,
      });
    },

    canUndo: () => get().history.past.length > 0,
    canRedo: () => get().history.future.length > 0,

    clearHistory: () => {
      set(() => ({
        history: { past: [], future: [] },
      }));
    },

    setIsSyncing: (isSyncing) => {
      set({ isSyncing });
    },

    setIsDirty: (isDirty) => {
      set({ isDirty });
    },

    // UI actions
    toggleSidebar: () => {
      set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed,
      }));
    },

    setSidebarCollapsed: (collapsed) => {
      set({ sidebarCollapsed: collapsed });
    },

    // Utility actions
    reset: () => {
      set(() =>
        createInitialState({
          id: '',
          name: '',
          description: '',
          rating: 0,
          isActive: false,
          metadata: { scenes: [] },
          tourContent: [],
        })
      );
    },

    markClean: () => {
      set({ isDirty: false });
    },
  }))
);

// Selector hooks for better performance
export const useVirtualTour = () =>
  useStudioStore((state) => {
    return {
      virtualTour: state.virtualTour,
      setVirtualTour: state.setVirtualTour,
    };
  });
export const useSelectedScene = () => useStudioStore(useShallow((state) => state.getSelectedScene()));
export const useSelectedSceneData = () =>
  useStudioStore(
    useShallow((state) => {
      if (!state.selectedSceneId) return null;
      return state.virtualTour.metadata.scenes.find((scene) => scene.sceneId === state.selectedSceneId) || null;
    })
  );

export const useMainScenes = () => useStudioStore(useShallow((state) => state.virtualTour.metadata.scenes));

export const useScenes = () =>
  useStudioStore(
    useShallow((state) => [
      ...state.virtualTour.metadata.scenes,
      ...state.virtualTour.metadata.scenes.flatMap((scene) => scene.subScenes || []),
    ])
  );
export const useIsDirty = () => useStudioStore((state) => state.isDirty);
export const useHistoryState = () =>
  useStudioStore(
    useShallow((state) => ({
      undo: state.undo,
      redo: state.redo,
      canUndo: state.history.past.length > 0,
      canRedo: state.history.future.length > 0,
    }))
  );
export const useSidebarState = () => useStudioStore((state) => state.sidebarCollapsed);
export const useResetStudioStore = () => useStudioStore((state) => state.reset);
