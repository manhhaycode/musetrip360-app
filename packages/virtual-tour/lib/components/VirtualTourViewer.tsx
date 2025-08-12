import React, { useCallback, useMemo, useState } from 'react';
import type { IVirtualTour, IVirtualTourScene } from '@/api/types';
import { InteractiveHotspot } from '@/canvas/InteractiveHotspot';
import { PanoramaSphere } from '@/canvas/PanoramaSphere';
import type { Hotspot } from '@/canvas/types';
import { LoadingErrorDisplay } from '@/ui/ErrorHandling';

export interface VirtualTourViewerProps {
  /** Virtual tour data */
  virtualTour: IVirtualTour;
}

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({ virtualTour }) => {
  // Current scene state
  const [currentSceneId, setCurrentSceneId] = useState<string>(() => {
    return virtualTour.metadata.scenes[0]?.sceneId || '';
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find current scene data
  const currentScene = useMemo(() => {
    const findSceneById = (scenes: IVirtualTourScene[], sceneId: string): IVirtualTourScene | null => {
      for (const scene of scenes) {
        if (scene.sceneId === sceneId) {
          return scene;
        }
        if (scene.subScenes) {
          const foundInSub = findSceneById(scene.subScenes, sceneId);
          if (foundInSub) return foundInSub;
        }
      }
      return null;
    };

    return findSceneById(virtualTour.metadata.scenes, currentSceneId);
  }, [virtualTour.metadata.scenes, currentSceneId]);

  // Handle scene navigation
  const handleSceneNavigation = useCallback(
    (sceneId: string) => {
      if (sceneId === currentSceneId) return;

      setIsLoading(true);
      setError(null);

      try {
        setCurrentSceneId(sceneId);

        // Simulate loading delay for scene transition
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch {
        setError('Failed to navigate to scene');
        setIsLoading(false);
      }
    },
    [currentSceneId]
  );

  // Handle hotspot interactions
  const handleHotspotClick = useCallback(
    (hotspot: Hotspot) => {
      // Handle navigation hotspots
      if (hotspot.type === 'navigation' && hotspot.sceneIdLink) {
        handleSceneNavigation(hotspot.sceneIdLink);
      }
    },
    [handleSceneNavigation]
  );

  // Enhanced hotspots with click handlers
  const enhancedHotspots = useMemo(() => {
    if (!currentScene?.data?.hotspots) return [];

    return currentScene.data.hotspots.map((hotspot) => ({
      ...hotspot,
      onClick: () => handleHotspotClick(hotspot),
    }));
  }, [currentScene?.data?.hotspots, handleHotspotClick]);

  // Error state
  if (error) {
    return (
      <div className="virtual-tour-viewer w-full h-full">
        <LoadingErrorDisplay
          error={{ message: error } as any}
          onRetry={() => {
            setError(null);
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  // No scene data
  if (!currentScene?.data) {
    return (
      <div className="virtual-tour-viewer w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h3 className="text-xl mb-2">No Scene Data</h3>
          <p className="text-gray-400">The selected scene does not have cubemap data available.</p>
        </div>
      </div>
    );
  }

  // Get the first available cubemap level
  const cubeMapLevel = currentScene.data.cubeMaps[0];
  if (!cubeMapLevel) {
    return (
      <div className="virtual-tour-viewer w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h3 className="text-xl mb-2">No Cubemap Data</h3>
          <p className="text-gray-400">This scene does not have any cubemap images loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="virtual-tour-viewer relative w-full h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">Loading scene...</div>
        </div>
      )}

      {/* Panorama sphere with hotspots */}
      <PanoramaSphere cubeMapLevel={cubeMapLevel} enableRotate={true}>
        {/* Interactive hotspots */}
        {enhancedHotspots.map((hotspot) => (
          <InteractiveHotspot key={hotspot.id} hotspot={hotspot} isEditing={false} isDragMode={false} />
        ))}
      </PanoramaSphere>

      {/* Scene info overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-75 text-white rounded-lg p-3 max-w-xs">
        <h3 className="font-semibold text-lg">{currentScene.sceneName}</h3>
        {currentScene.sceneDescription && <p className="text-sm text-gray-300 mt-1">{currentScene.sceneDescription}</p>}
        <p className="text-xs text-gray-400 mt-2">
          Scene {virtualTour.metadata.scenes.findIndex((s) => s.sceneId === currentSceneId) + 1} of{' '}
          {virtualTour.metadata.scenes.length}
        </p>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        {virtualTour.metadata.scenes.map((scene) => (
          <button
            key={scene.sceneId}
            onClick={() => handleSceneNavigation(scene.sceneId)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              scene.sceneId === currentSceneId
                ? 'bg-blue-600 text-white'
                : 'bg-black bg-opacity-75 text-white hover:bg-opacity-90'
            }`}
            disabled={isLoading}
          >
            {scene.sceneName}
          </button>
        ))}
      </div>
    </div>
  );
};
