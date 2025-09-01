import React, { useCallback, useMemo, useEffect } from 'react';
import type { IVirtualTour, CubeMapData } from '@musetrip360/virtual-tour';
import { VirtualTourViewer, VirtualTourViewerProps } from '@musetrip360/virtual-tour/components';
import { useTourActionState, useTourActionReceiver } from '@/state/hooks/useTourActionState';
import { useStreamingContext } from '@/contexts/StreamingContext';
import { Users, WifiOff, Loader2 } from 'lucide-react';

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

  /** Whether the tour should be rendered. If false, shows loading screen. */
  shouldRenderTour?: boolean;

  /** Custom loading message when tour is not rendered */
  loadingMessage?: string;
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
  shouldRenderTour,
  loadingMessage,
}) => {
  // Tour action hooks
  const tourActionState = useTourActionState();
  const tourActionReceiver = useTourActionReceiver();

  // Streaming context for centralized tour control
  const { isTourReady, setTourReady } = useStreamingContext();

  // Determine interaction mode and permissions
  const isFreeExploreMode = mode === 'free-explore';

  // Can send actions if in free-explore mode AND user has tour guide role
  const canSendActions = isFreeExploreMode && tourActionState.canSendTourActions;

  // Auto-update tour readiness based on mode and first action received
  useEffect(() => {
    if (isFreeExploreMode && !canSendActions) {
      // Free explore mode for non-tour guides: always ready
      setTourReady(true);
    } else if (tourActionReceiver.hasReceivedFirstAction && !isTourReady) {
      // Follow guide mode: ready when first action received
      setTourReady(true);
      console.log('🎯 Tour ready: First guide action received');
    }
    // Note: Tour guides (canSendActions=true) in free-explore mode do NOT auto-start
    // They must manually trigger tour start through external controls
  }, [isFreeExploreMode, canSendActions, tourActionReceiver.hasReceivedFirstAction, isTourReady, setTourReady]);

  // Determine if tour should be rendered
  const shouldShowTour = useMemo(() => {
    // If explicit shouldRenderTour prop is provided, use it (override centralized state)
    if (shouldRenderTour !== undefined) {
      return shouldRenderTour;
    }

    // Use centralized tour ready state from context
    return isTourReady;
  }, [shouldRenderTour, isTourReady]);

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

  // Loading Screen Component
  const LoadingScreen = useCallback(() => {
    const isConnected = tourActionState.isServiceAvailable;
    let defaultMessage = 'Preparing tour...';

    if (!isFreeExploreMode) {
      defaultMessage = 'Waiting for tour guide to start...';
    } else if (canSendActions) {
      defaultMessage = 'Tour guide preparing...';
    }

    const message = loadingMessage || defaultMessage;

    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center text-white px-6">
          {isConnected ? (
            <>
              <div className="mb-6">
                <Users className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Follow Guide</h3>
              <p className="text-slate-300 mb-4">{message}</p>
              <div className="flex items-center justify-center text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Connected • Listening for guide actions</span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-400">Connection Issue</h3>
              <p className="text-slate-300">Unable to connect to tour session</p>
              <div className="text-sm text-slate-400 mt-2">Please check your connection and try again</div>
            </>
          )}
        </div>
      </div>
    );
  }, [tourActionState.isServiceAvailable, isFreeExploreMode, canSendActions, loadingMessage]);

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

  // Conditional rendering based on shouldShowTour
  if (!shouldShowTour) {
    return <LoadingScreen />;
  }

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
  const { isTourReady, setTourReady } = useStreamingContext();

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
    hasReceivedFirstAction: tourActionReceiver.hasReceivedFirstAction,
    clearControlledState: tourActionReceiver.clearControlledState,
  };

  // Connection info
  const connectionInfo = {
    isConnected: tourActionState.isServiceAvailable,
    connectionStatus: tourActionState.connectionStatus,
    roomId: tourActionState.roomId,
    currentUserId: tourActionState.currentUserId,
  };

  // Tour control utilities
  const tourControlUtils = {
    isTourReady,
    setTourReady,
  };

  return {
    guideModeUtils,
    attendeeModeUtils,
    connectionInfo,
    tourControlUtils,
  };
};
