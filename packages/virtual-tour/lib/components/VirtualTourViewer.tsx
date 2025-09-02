import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IVirtualTour, IVirtualTourScene } from '@/api/types';
import { InteractiveHotspot } from '@/canvas/InteractiveHotspot';
import { PanoramaSphere } from '@/canvas/PanoramaSphere';
import { PolygonSelector } from '@/canvas/PolygonSelect';
import type { Hotspot, Polygon } from '@/canvas/types';
import { PreviewArtifact } from './PreviewArtifact';
import { SceneNavigationMenu } from './SceneNavigationMenu';
import { Button } from '@musetrip360/ui-core/button';
import { Volume2, VolumeX, RotateCw, Square } from 'lucide-react';

export interface VirtualTourViewerProps {
  /** Virtual tour data */
  virtualTour: IVirtualTour;

  // NEW: External control props
  /** Controlled scene ID - overrides internal scene state */
  controlledSceneId?: string;
  /** Controlled camera position in spherical coordinates */
  controlledCameraPosition?: { theta: number; phi: number; fov?: number };
  /** Controlled artifact ID to show preview */
  controlledArtifactId?: string;
  /** Controlled audio muted state */
  controlledAudioMuted?: boolean;
  /** Controlled auto-rotate state */
  controlledAutoRotate?: boolean;

  // NEW: Event callbacks for capturing user actions
  /** Called when user navigates to a different scene */
  onSceneChange?: (sceneId: string) => void;
  /** Called when user changes camera position */
  onCameraChange?: (position: { theta: number; phi: number; fov: number }) => void;
  /** Called when user clicks on a polygon */
  onPolygonClick?: (polygon: Polygon) => void;
  /** Called when audio mute state changes */
  onAudioMuteChange?: (isMuted: boolean) => void;
  /** Called when auto-rotate state changes */
  onAutoRotateChange?: (isAutoRotating: boolean) => void;

  // NEW: Control mode
  /** Enable/disable user controls - false for attendee mode */
  enableUserControls?: boolean;

  // NEW: Navigation style
  /** Use hamburger menu instead of button stack */
  useHamburgerMenu?: boolean;
  initialSceneId?: string | null;
}

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  virtualTour,
  // Control props
  controlledSceneId,
  controlledCameraPosition,
  controlledArtifactId,
  controlledAudioMuted,
  controlledAutoRotate,
  // Event callbacks
  onSceneChange,
  onCameraChange,
  onPolygonClick,
  onAudioMuteChange,
  onAutoRotateChange,
  // Control mode
  enableUserControls = true,
  // Navigation style
  useHamburgerMenu = false,
  initialSceneId,
}) => {
  // Current scene state
  const [currentSceneId, setCurrentSceneId] = useState<string>(() => {
    return initialSceneId || virtualTour.metadata.scenes[0]?.sceneId || '';
  });

  const [error, setError] = useState<string | null>(null);

  // PreviewArtifact state
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Audio state for dual audio support
  const voiceAIRef = useRef<HTMLAudioElement | null>(null);
  const audioCommentaryRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);

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

  // Flatten all scenes for easier processing
  const allScenes = useMemo(() => {
    const flattenScenes = (scenes: IVirtualTourScene[], depth = 0): Array<IVirtualTourScene & { depth: number }> => {
      const result: Array<IVirtualTourScene & { depth: number }> = [];

      scenes.forEach((scene) => {
        result.push({ ...scene, depth });

        if (scene.subScenes && scene.subScenes.length > 0) {
          result.push(...flattenScenes(scene.subScenes, depth + 1));
        }
      });

      return result;
    };

    return flattenScenes(virtualTour.metadata.scenes);
  }, [virtualTour.metadata.scenes]);

  // Handle scene navigation
  const handleSceneNavigation = useCallback(
    (sceneId: string) => {
      if (sceneId === currentSceneId) return;
      setError(null);
      try {
        setCurrentSceneId(sceneId);

        // Notify parent component of scene change
        onSceneChange?.(sceneId);
      } catch {
        setError('Failed to navigate to scene');
      }
    },
    [currentSceneId, onSceneChange]
  );

  // Sync with controlled scene ID
  useEffect(() => {
    if (controlledSceneId && controlledSceneId !== currentSceneId) {
      setCurrentSceneId(controlledSceneId);
    }
  }, [controlledSceneId, currentSceneId]);

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

  // Handle polygon click to open artifact preview
  const handlePolygonClick = useCallback(
    (polygon: Polygon) => {
      setSelectedArtifactId(polygon.artifactIdLink);
      setShowPreview(true);

      // Notify parent component of polygon click
      onPolygonClick?.(polygon);
    },
    [onPolygonClick]
  );

  // Sync with controlled artifact ID
  useEffect(() => {
    if (controlledArtifactId) {
      setSelectedArtifactId(controlledArtifactId);
      setShowPreview(true);
    } else if (controlledArtifactId === null) {
      setSelectedArtifactId(null);
      setShowPreview(false);
    }
  }, [controlledArtifactId]);

  // Sync with controlled audio muted state
  useEffect(() => {
    if (controlledAudioMuted !== undefined) {
      setIsMuted(controlledAudioMuted);
    }
  }, [controlledAudioMuted]);

  // Sync with controlled auto rotate state
  useEffect(() => {
    if (controlledAutoRotate !== undefined) {
      setIsAutoRotate(controlledAutoRotate);
    }
  }, [controlledAutoRotate]);

  // Get both audio sources from current scene
  const voiceAIData = useMemo(() => {
    if (!currentScene || !currentScene.isUseVoiceAI || !currentScene.voiceAI?.file) {
      return null;
    }
    return currentScene.voiceAI;
  }, [currentScene]);

  const audioCommentaryData = useMemo(() => {
    if (!currentScene || !currentScene.audio?.file) {
      return null;
    }
    return currentScene.audio;
  }, [currentScene]);

  // Extract audio options for each source
  const voiceAIOptions = useMemo(
    () => ({
      autoPlay: voiceAIData?.audioOptions?.autoPlay ?? true,
      volume: voiceAIData?.audioOptions?.volume ?? 0.8,
      loop: voiceAIData?.audioOptions?.loop ?? true,
    }),
    [voiceAIData]
  );

  const audioCommentaryOptions = useMemo(
    () => ({
      autoPlay: audioCommentaryData?.audioOptions?.autoPlay ?? true,
      volume: audioCommentaryData?.audioOptions?.volume ?? 0.6,
      loop: audioCommentaryData?.audioOptions?.loop ?? true,
    }),
    [audioCommentaryData]
  );

  // Check if any audio is available
  const hasAnyAudio = !!(voiceAIData || audioCommentaryData);

  // Handle Voice AI audio loading and playback
  useEffect(() => {
    if (!voiceAIRef.current) return;

    const audio = voiceAIRef.current;

    if (voiceAIData?.file) {
      audio.src = voiceAIData.file as string;
      audio.loop = voiceAIOptions.loop;
      audio.volume = voiceAIOptions.volume;
      audio.muted = isMuted;

      // Auto-play voice AI if enabled
      if (enableUserControls && voiceAIOptions.autoPlay) {
        audio.play().catch(() => {
          console.log('Voice AI auto-play prevented by browser policy');
        });
      }
    } else {
      audio.pause();
      audio.src = '';
    }
  }, [voiceAIData, enableUserControls, isMuted, voiceAIOptions]);

  // Handle Audio Commentary loading and playback
  useEffect(() => {
    if (!audioCommentaryRef.current) return;

    const audio = audioCommentaryRef.current;

    if (audioCommentaryData?.file) {
      audio.src = audioCommentaryData.file as string;
      audio.loop = audioCommentaryOptions.loop;
      audio.volume = audioCommentaryOptions.volume;
      audio.muted = isMuted;

      // Auto-play audio commentary if enabled
      if (enableUserControls && audioCommentaryOptions.autoPlay) {
        audio.play().catch(() => {
          console.log('Audio commentary auto-play prevented by browser policy');
        });
      }
    } else {
      audio.pause();
      audio.src = '';
    }
  }, [audioCommentaryData, enableUserControls, isMuted, audioCommentaryOptions]);

  // Update audio loaded state
  useEffect(() => {
    setIsAudioLoaded(hasAnyAudio);
  }, [hasAnyAudio]);

  // Toggle audio mute state for both audio sources
  const toggleAudioMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // Notify parent component of audio mute change
    onAudioMuteChange?.(newMutedState);

    // Mute/unmute Voice AI audio
    if (voiceAIRef.current) {
      voiceAIRef.current.muted = newMutedState;

      // If unmuting and audio is paused, try to play
      if (!newMutedState && voiceAIRef.current.paused && voiceAIData?.file) {
        voiceAIRef.current.play().catch(() => {
          console.log('Voice AI play failed');
        });
      }
    }

    // Mute/unmute Audio Commentary
    if (audioCommentaryRef.current) {
      audioCommentaryRef.current.muted = newMutedState;

      // If unmuting and audio is paused, try to play
      if (!newMutedState && audioCommentaryRef.current.paused && audioCommentaryData?.file) {
        audioCommentaryRef.current.play().catch(() => {
          console.log('Audio commentary play failed');
        });
      }
    }
  }, [isMuted, voiceAIData, audioCommentaryData, onAudioMuteChange]);

  // Toggle auto-rotate for camera
  const toggleAutoRotate = useCallback(() => {
    const newAutoRotateState = !isAutoRotate;
    setIsAutoRotate(newAutoRotateState);

    // Notify parent component of auto-rotate change
    onAutoRotateChange?.(newAutoRotateState);
  }, [isAutoRotate, onAutoRotateChange]);

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
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">{error}</p>
        </div>
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
      {/* Hidden audio elements for dual audio support */}
      <audio ref={voiceAIRef} preload="auto" />
      <audio ref={audioCommentaryRef} preload="auto" />

      {/* Panorama sphere with hotspots */}
      <PanoramaSphere
        cubeMapLevel={cubeMapLevel}
        enableRotate={enableUserControls}
        autoRotate={isAutoRotate}
        controlledCameraPosition={controlledCameraPosition}
        onCameraChange={onCameraChange}
        enableUserControls={enableUserControls}
      >
        {/* Interactive hotspots */}
        {enhancedHotspots.map((hotspot) => (
          <InteractiveHotspot key={hotspot.id} hotspot={hotspot} isEditing={false} isDragMode={false} />
        ))}

        {/* Polygon selector for completed polygons */}
        <PolygonSelector
          completedPolygons={currentScene?.data?.polygons || []}
          onPolygonClick={enableUserControls ? handlePolygonClick : undefined}
        />
      </PanoramaSphere>

      {/* Hamburger Menu or Scene Info Overlay */}
      <div className="absolute top-4 left-4 z-20">
        {enableUserControls && useHamburgerMenu ? (
          <SceneNavigationMenu
            virtualTour={virtualTour}
            currentSceneId={currentSceneId}
            onSceneSelect={handleSceneNavigation}
            enableSearch={true}
            showStats={true}
          />
        ) : (
          <div className="bg-black bg-opacity-75 text-white rounded-lg p-3 max-w-xs">
            <h3 className="font-semibold text-lg">{currentScene.sceneName}</h3>
            {currentScene.sceneDescription && (
              <p className="text-sm text-gray-300 mt-1">{currentScene.sceneDescription}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Scene {allScenes.findIndex((s) => s.sceneId === currentSceneId) + 1} of {allScenes.length}
            </p>
          </div>
        )}
      </div>

      {/* Audio Control Buttons - Vertical Stack */}
      {enableUserControls && (
        <div className="absolute top-20 left-4 z-20 flex flex-col gap-2">
          {/* Mute/Unmute Button */}
          {isAudioLoaded && (
            <Button
              variant="default"
              size="sm"
              onClick={toggleAudioMute}
              className="backdrop-blur-sm transition-all duration-200 hover:scale-105"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          )}

          {/* Auto-Rotate Button */}
          <Button
            variant="default"
            size="sm"
            onClick={toggleAutoRotate}
            className="backdrop-blur-sm transition-all duration-200 hover:scale-105"
            title={isAutoRotate ? 'Tắt tự động xoay' : 'Bật tự động xoay'}
          >
            {isAutoRotate ? <Square className="h-4 w-4" /> : <RotateCw className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* PreviewArtifact Modal */}
      {selectedArtifactId && (
        <PreviewArtifact
          artifactId={selectedArtifactId}
          isOpen={showPreview}
          onClose={() => {
            setShowPreview(false);
            setSelectedArtifactId(null);
          }}
        />
      )}
    </div>
  );
};
