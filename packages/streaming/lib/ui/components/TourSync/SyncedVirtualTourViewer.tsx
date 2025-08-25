import React, { useCallback, useMemo } from 'react';
import type { IVirtualTour, CubeMapData } from '@musetrip360/virtual-tour';
import { VirtualTourViewer, VirtualTourViewerProps } from '@musetrip360/virtual-tour/components';
import { useTourActionState, useTourActionReceiver } from '@/state/hooks/useTourActionState';

export interface SyncedVirtualTourViewerProps {
  /** Virtual tour data */
  virtualTour: IVirtualTour;

  /** Tour mode - guide can control, attendee follows */
  mode: 'guide' | 'attendee';

  /** Optional props to override VirtualTourViewer defaults */
  virtualTourProps?: Partial<Omit<VirtualTourViewerProps, 'virtualTour'>>;

  /** Callback when mode-specific events occur */
  onModeChange?: (mode: 'guide' | 'attendee') => void;
}

/**
 * Synced Virtual Tour Viewer that integrates with streaming tour actions
 * - Guide mode: User actions are broadcasted to other participants
 * - Attendee mode: Receives and applies actions from tour guide
 */
export const SyncedVirtualTourViewer: React.FC<SyncedVirtualTourViewerProps> = ({
  virtualTour,
  mode,
  virtualTourProps = {},
  onModeChange,
}) => {
  // Tour action hooks
  const tourActionState = useTourActionState();
  const tourActionReceiver = useTourActionReceiver();

  // Determine if user can send tour actions (is tour guide)
  const isGuideMode = mode === 'guide';
  const canSendActions = isGuideMode && tourActionState.canSendTourActions;

  // Handle camera changes - send to other participants if guide
  const handleCameraChange = useCallback(
    (position: { theta: number; phi: number; fov: number }) => {
      if (canSendActions) {
        tourActionState.sendCameraChange(position);
      }

      // Call original callback if provided
      virtualTourProps.onCameraChange?.(position);
    },
    [canSendActions, tourActionState, virtualTourProps]
  );

  // Handle scene changes - send to other participants if guide
  const handleSceneChange = useCallback(
    (sceneId: string) => {
      if (canSendActions) {
        tourActionState.sendSceneChange(sceneId);
      }

      // Call original callback if provided
      virtualTourProps.onSceneChange?.(sceneId);
    },
    [canSendActions, tourActionState, virtualTourProps]
  );

  // Handle polygon clicks - send artifact preview if guide
  const handlePolygonClick = useCallback(
    (polygon: CubeMapData['polygons'][number]) => {
      if (canSendActions && polygon.artifactIdLink) {
        tourActionState.sendArtifactPreview(polygon.artifactIdLink);
      }

      // Call original callback if provided
      virtualTourProps.onPolygonClick?.(polygon);
    },
    [canSendActions, tourActionState, virtualTourProps]
  );

  // Prepare controlled props for attendee mode
  const controlledProps = useMemo(() => {
    if (isGuideMode) {
      // Guide mode: no controlled props, user has full control
      return {
        enableUserControls: true,
      };
    }

    // Attendee mode: use controlled props from tour actions
    return {
      enableUserControls: false,
      controlledSceneId: tourActionReceiver.controlledSceneId,
      controlledCameraPosition: tourActionReceiver.controlledCameraPosition,
      controlledArtifactId: tourActionReceiver.controlledArtifactId || undefined,
    };
  }, [isGuideMode, tourActionReceiver]);

  // Prepare event callbacks for guide mode
  const eventCallbacks = useMemo(() => {
    if (!isGuideMode) {
      // Attendee mode: no event callbacks needed
      return {};
    }

    // Guide mode: attach tour action callbacks
    return {
      onCameraChange: handleCameraChange,
      onSceneChange: handleSceneChange,
      onPolygonClick: handlePolygonClick,
    };
  }, [isGuideMode, handleCameraChange, handleSceneChange, handlePolygonClick]);

  // Merge all props
  const mergedProps: VirtualTourViewerProps = {
    virtualTour,
    ...virtualTourProps,
    ...controlledProps,
    ...eventCallbacks,
  };

  return (
    <>
      {/* Mode indicator */}
      <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-75 text-white rounded-lg px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isGuideMode ? 'bg-green-400' : 'bg-blue-400'}`} />
          <span>{isGuideMode ? 'Tour Guide' : 'Following Guide'}</span>
        </div>

        {/* Connection status */}
        {!tourActionState.isServiceAvailable && (
          <div className="text-xs text-red-400 mt-1">⚠️ Tour sync unavailable</div>
        )}
      </div>

      {/* Virtual Tour Viewer with integrated sync */}
      <VirtualTourViewer {...mergedProps} />

      {/* Mode switching button (development/admin only) */}
      {process.env.NODE_ENV === 'development' && onModeChange && (
        <button
          onClick={() => {
            const newMode = isGuideMode ? 'attendee' : 'guide';
            if (newMode === 'attendee') {
              // Clear any controlled state when switching to guide
              tourActionReceiver.clearControlledState();
            }
            onModeChange(newMode);
          }}
          className="absolute bottom-4 left-4 z-50 bg-purple-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-purple-700 transition-colors"
        >
          Switch to {isGuideMode ? 'Attendee' : 'Guide'} Mode
        </button>
      )}
    </>
  );
};

/**
 * Hook for managing synced virtual tour state
 * Provides utilities for tour sync management
 */
export const useSyncedVirtualTour = () => {
  const tourActionState = useTourActionState();
  const tourActionReceiver = useTourActionReceiver();

  // Tour guide utilities
  const guideModeUtils = {
    sendCameraChange: tourActionState.sendCameraChange,
    sendSceneChange: tourActionState.sendSceneChange,
    sendArtifactPreview: tourActionState.sendArtifactPreview,
    sendArtifactClose: tourActionState.sendArtifactClose,
    canSendActions: tourActionState.canSendTourActions,
  };

  // Attendee mode utilities
  const attendeeModeUtils = {
    controlledSceneId: tourActionReceiver.controlledSceneId,
    controlledCameraPosition: tourActionReceiver.controlledCameraPosition,
    controlledArtifactId: tourActionReceiver.controlledArtifactId,
    clearControlledState: tourActionReceiver.clearControlledState,
  };

  // Connection info
  const connectionInfo = {
    isConnected: tourActionState.isServiceAvailable,
    connectionStatus: tourActionState.connectionStatus,
    roomId: tourActionState.roomId,
    currentUserId: tourActionState.currentUserId,
  };

  return {
    guideModeUtils,
    attendeeModeUtils,
    connectionInfo,
  };
};
