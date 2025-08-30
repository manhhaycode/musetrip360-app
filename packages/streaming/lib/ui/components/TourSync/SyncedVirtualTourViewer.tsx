import React, { useCallback, useMemo } from 'react';
import type { IVirtualTour, CubeMapData } from '@musetrip360/virtual-tour';
import { VirtualTourViewer, VirtualTourViewerProps } from '@musetrip360/virtual-tour/components';
import { useTourActionState, useTourActionReceiver } from '@/state/hooks/useTourActionState';

export type TourMode = 'free-explore' | 'follow-guide';

export interface SyncedVirtualTourViewerProps {
  /** Virtual tour data */
  virtualTour: IVirtualTour;

  /** Tour interaction mode */
  mode: TourMode;

  /** Optional props to override VirtualTourViewer defaults */
  virtualTourProps?: Partial<Omit<VirtualTourViewerProps, 'virtualTour'>>;

  /** Callback when user wants to change tour mode */
  onModeChange?: (mode: TourMode) => void;

  /** Whether mode switching is allowed for this user */
  allowModeSwitch?: boolean;
}

/**
 * Synced Virtual Tour Viewer that integrates with streaming tour actions
 * - Free Explore mode: User has full control, actions may be broadcasted if user is TourGuide
 * - Follow Guide mode: Receives and applies actions from tour guide
 */
export const SyncedVirtualTourViewer: React.FC<SyncedVirtualTourViewerProps> = ({
  virtualTour,
  mode,
  virtualTourProps = {},
}) => {
  // Tour action hooks
  const tourActionState = useTourActionState();
  const tourActionReceiver = useTourActionReceiver();

  // Determine interaction mode and permissions
  const isFreeExploreMode = mode === 'free-explore';

  // Can send actions if in free-explore mode AND user has tour guide role
  const canSendActions = isFreeExploreMode && tourActionState.canSendTourActions;

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

  // Prepare controlled props based on mode
  const controlledProps = useMemo(() => {
    if (isFreeExploreMode) {
      // Free explore mode: user has full control
      return {
        enableUserControls: true,
        useHamburgerMenu: true,
      };
    }

    // Follow guide mode: use controlled props from tour actions
    return {
      enableUserControls: false,
      controlledSceneId: tourActionReceiver.controlledSceneId,
      controlledCameraPosition: tourActionReceiver.controlledCameraPosition,
      controlledArtifactId: tourActionReceiver.controlledArtifactId || undefined,
    };
  }, [isFreeExploreMode, tourActionReceiver]);

  // Prepare event callbacks for free explore mode
  const eventCallbacks = useMemo(() => {
    if (!isFreeExploreMode) {
      // Follow guide mode: no event callbacks needed
      return {};
    }

    // Free explore mode: attach tour action callbacks (if user can send actions)
    return {
      onCameraChange: handleCameraChange,
      onSceneChange: handleSceneChange,
      onPolygonClick: handlePolygonClick,
    };
  }, [isFreeExploreMode, handleCameraChange, handleSceneChange, handlePolygonClick]);

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
          <div className={`w-2 h-2 rounded-full ${isFreeExploreMode ? 'bg-green-400' : 'bg-blue-400'}`} />
          <span>{isFreeExploreMode ? 'Free Explore' : 'Following Guide'}</span>
          {canSendActions && <span className="text-xs text-green-300">(Broadcasting)</span>}
        </div>

        {/* Connection status */}
        {!tourActionState.isServiceAvailable && (
          <div className="text-xs text-red-400 mt-1">⚠️ Tour sync unavailable</div>
        )}
      </div>

      {/* Virtual Tour Viewer with integrated sync */}
      <VirtualTourViewer {...mergedProps} />

      {/* Mode switching button */}
      {/* {allowModeSwitch && onModeChange && (
        <button
          onClick={() => {
            const newMode: TourMode = isFreeExploreMode ? 'follow-guide' : 'free-explore';
            if (newMode === 'follow-guide') {
              // Clear any controlled state when switching to follow guide
              tourActionReceiver.clearControlledState();
            }
            onModeChange(newMode);
          }}
          className="absolute bottom-4 left-4 z-50 bg-purple-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-purple-700 transition-colors"
        >
          Switch to {isFreeExploreMode ? 'Follow Guide' : 'Free Explore'}
        </button>
      )} */}
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
