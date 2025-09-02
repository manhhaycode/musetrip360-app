import { useEffect, useMemo, useCallback, useState } from 'react';
import { useRoomStore } from '../store/roomStore';
import { tourActionService } from '@/api/tour/TourActionService';
import { useStreamingContext } from '@/contexts/StreamingContext';
import type { TourActions } from '@/types';

/**
 * Hook for managing tour action synchronization
 * Handles sending tour actions to other participants and receiving actions from tour guide
 */
export const useTourActionState = () => {
  // Get current room state and streaming context
  const currentRoom = useRoomStore((state) => state.currentRoom);
  const { participants } = useStreamingContext();

  // Get current user ID from participants
  const currentUserId = useMemo(() => {
    return Array.from(participants.values()).find((p) => p.isLocalUser)?.userId || null;
  }, [participants]);

  // Get current user name
  const currentUserName = useMemo(() => {
    return Array.from(participants.values()).find((p) => p.isLocalUser)?.userId || 'Unknown';
  }, [participants]);

  // Get current user role from participants
  const currentUserRole = useMemo(() => {
    return Array.from(participants.values()).find((p) => p.isLocalUser)?.participantInfo?.role || null;
  }, [participants]);

  /**
   * Send camera change action to other participants
   */
  const sendCameraChange = useCallback(
    async (cameraPosition: { theta: number; phi: number; fov: number }) => {
      if (!currentRoom?.Id || !currentUserId) {
        console.warn('Cannot send camera change: Missing room or user ID');
        return;
      }

      try {
        await tourActionService.sendCameraChange(currentRoom.Id, cameraPosition, currentUserId);
        console.log('📸 Camera change sent:', cameraPosition);
      } catch (error) {
        console.error('Failed to send camera change:', error);
      }
    },
    [currentRoom?.Id, currentUserId]
  );

  /**
   * Send scene change action to other participants
   */
  const sendSceneChange = useCallback(
    async (sceneId: string) => {
      if (!currentRoom?.Id || !currentUserId) {
        console.warn('Cannot send scene change: Missing room or user ID');
        return;
      }

      try {
        await tourActionService.sendSceneChange(currentRoom.Id, sceneId, currentUserId);
        console.log('🎬 Scene change sent:', sceneId);
      } catch (error) {
        console.error('Failed to send scene change:', error);
      }
    },
    [currentRoom?.Id, currentUserId]
  );

  /**
   * Send artifact preview action to other participants
   */
  const sendArtifactPreview = useCallback(
    async (artifactId: string) => {
      if (!currentRoom?.Id || !currentUserId) {
        console.warn('Cannot send artifact preview: Missing room or user ID');
        return;
      }

      try {
        await tourActionService.sendArtifactPreview(currentRoom.Id, artifactId, currentUserId);
        console.log('🏺 Artifact preview sent:', artifactId);
      } catch (error) {
        console.error('Failed to send artifact preview:', error);
      }
    },
    [currentRoom?.Id, currentUserId]
  );

  /**
   * Send artifact close action to other participants
   */
  const sendArtifactClose = useCallback(async () => {
    if (!currentRoom?.Id || !currentUserId) {
      console.warn('Cannot send artifact close: Missing room or user ID');
      return;
    }

    try {
      await tourActionService.sendArtifactClose(currentRoom.Id, currentUserId);
      console.log('❌ Artifact close sent');
    } catch (error) {
      console.error('Failed to send artifact close:', error);
    }
  }, [currentRoom?.Id, currentUserId]);

  /**
   * Send audio mute action to other participants
   */
  const sendAudioMute = useCallback(async () => {
    if (!currentRoom?.Id || !currentUserId) {
      console.warn('Cannot send audio mute: Missing room or user ID');
      return;
    }

    try {
      await tourActionService.sendAudioMute(currentRoom.Id, currentUserId);
      console.log('🔇 Audio mute sent');
    } catch (error) {
      console.error('Failed to send audio mute:', error);
    }
  }, [currentRoom?.Id, currentUserId]);

  /**
   * Send audio unmute action to other participants
   */
  const sendAudioUnmute = useCallback(async () => {
    if (!currentRoom?.Id || !currentUserId) {
      console.warn('Cannot send audio unmute: Missing room or user ID');
      return;
    }

    try {
      await tourActionService.sendAudioUnmute(currentRoom.Id, currentUserId);
      console.log('🔊 Audio unmute sent');
    } catch (error) {
      console.error('Failed to send audio unmute:', error);
    }
  }, [currentRoom?.Id, currentUserId]);

  /**
   * Send auto rotate start action to other participants
   */
  const sendAutoRotateStart = useCallback(async () => {
    if (!currentRoom?.Id || !currentUserId) {
      console.warn('Cannot send auto rotate start: Missing room or user ID');
      return;
    }

    try {
      await tourActionService.sendAutoRotateStart(currentRoom.Id, currentUserId);
      console.log('🔄 Auto rotate start sent');
    } catch (error) {
      console.error('Failed to send auto rotate start:', error);
    }
  }, [currentRoom?.Id, currentUserId]);

  /**
   * Send auto rotate stop action to other participants
   */
  const sendAutoRotateStop = useCallback(async () => {
    if (!currentRoom?.Id || !currentUserId) {
      console.warn('Cannot send auto rotate stop: Missing room or user ID');
      return;
    }

    try {
      await tourActionService.sendAutoRotateStop(currentRoom.Id, currentUserId);
      console.log('⏹️ Auto rotate stop sent');
    } catch (error) {
      console.error('Failed to send auto rotate stop:', error);
    }
  }, [currentRoom?.Id, currentUserId]);

  /**
   * Check if user can send tour actions (is tour guide or has guide permissions)
   */
  const canSendTourActions = useMemo(() => {
    // Must have room, user ID, and service available
    if (!currentRoom || !currentUserId || !tourActionService.isAvailable()) {
      return false;
    }

    // Check if user has tour guide role
    return currentUserRole === 'TourGuide';
  }, [currentRoom, currentUserId, currentUserRole]);

  return {
    // State
    currentRoom,
    roomId: currentRoom?.Id || null,
    currentUserId,
    currentUserName,
    currentUserRole,
    canSendTourActions,

    // Actions for sending tour actions (tour guide)
    sendCameraChange,
    sendSceneChange,
    sendArtifactPreview,
    sendArtifactClose,
    sendAudioMute,
    sendAudioUnmute,
    sendAutoRotateStart,
    sendAutoRotateStop,

    // Service status
    isServiceAvailable: tourActionService.isAvailable(),
    connectionStatus: tourActionService.getConnectionStatus(),
  };
};

/**
 * Hook for receiving and handling tour actions from other participants
 * This provides controlled props for VirtualTourViewer in attendee mode
 */
export const useTourActionReceiver = () => {
  // State to store received tour actions
  const [currentCameraPosition, setCurrentCameraPosition] = useState<
    { theta: number; phi: number; fov: number } | undefined
  >(undefined);

  // Store guide's actual camera position (always updated, even during auto-rotate)
  const [guideCameraPosition, setGuideCameraPosition] = useState<
    { theta: number; phi: number; fov: number } | undefined
  >(undefined);
  const [currentSceneId, setCurrentSceneId] = useState<string | undefined>(undefined);
  const [currentArtifactId, setCurrentArtifactId] = useState<string | null>(null);
  const [currentAudioMuted, setCurrentAudioMuted] = useState<boolean | undefined>(undefined);
  const [currentAutoRotate, setCurrentAutoRotate] = useState<boolean | undefined>(undefined);

  // Track if user has received first tour action (for deferred initialization)
  const [hasReceivedFirstAction, setHasReceivedFirstAction] = useState<boolean>(false);

  // Setup SignalR event listener for receiving tour actions
  useEffect(() => {
    const client = tourActionService.getSignalRClient();
    if (!client) return;

    // Listen to ReceiveTourAction events
    const handleTourAction = (actionJson: string) => {
      try {
        const tourAction: TourActions = JSON.parse(actionJson);

        console.log('🎭 Received tour action:', tourAction);

        // Mark that we've received first tour action (for deferred initialization)
        if (!hasReceivedFirstAction) {
          setHasReceivedFirstAction(true);
          console.log('✅ First tour action received - enabling tour display');
        }

        // Handle different action types
        switch (tourAction.ActionType) {
          case 'camera_change':
            if (tourAction.ActionData.CameraPosition) {
              // Always store guide's actual position for later sync
              setGuideCameraPosition(tourAction.ActionData.CameraPosition);

              // If currently auto-rotating, only update FOV (zoom), ignore position
              if (currentAutoRotate) {
                setCurrentCameraPosition((prevPosition) => ({
                  theta: prevPosition?.theta ?? 0,
                  phi: prevPosition?.phi ?? 0,
                  fov: tourAction.ActionData.CameraPosition!.fov,
                }));
                console.log('🔄 Auto-rotate active: Only updating FOV, storing guide position for later');
              } else {
                setCurrentCameraPosition(tourAction.ActionData.CameraPosition);
              }
            }
            break;

          case 'scene_change':
            if (tourAction.ActionData.SceneId) {
              setCurrentSceneId(tourAction.ActionData.SceneId);
            }
            break;

          case 'artifact_preview':
            if (tourAction.ActionData.ArtifactId) {
              setCurrentArtifactId(tourAction.ActionData.ArtifactId);
            }
            break;

          case 'artifact_close':
            setCurrentArtifactId(null);
            break;

          case 'audio_mute':
            if (tourAction.ActionData.AudioState) {
              setCurrentAudioMuted(tourAction.ActionData.AudioState.isMuted);
            }
            break;

          case 'audio_unmute':
            if (tourAction.ActionData.AudioState) {
              setCurrentAudioMuted(tourAction.ActionData.AudioState.isMuted);
            }
            break;

          case 'auto_rotate_start':
            if (tourAction.ActionData.RotationState) {
              setCurrentAutoRotate(tourAction.ActionData.RotationState.isAutoRotating);
            }
            break;

          case 'auto_rotate_stop':
            if (tourAction.ActionData.RotationState) {
              setCurrentAutoRotate(tourAction.ActionData.RotationState.isAutoRotating);

              // When auto-rotate stops, sync to guide's current position
              if (!tourAction.ActionData.RotationState.isAutoRotating && guideCameraPosition) {
                setCurrentCameraPosition(guideCameraPosition);
                console.log('⏹️ Auto-rotate stopped: Syncing to guide position', guideCameraPosition);
              }
            }
            break;

          default:
            console.warn('Unknown tour action type:', tourAction.ActionType);
        }
      } catch (error) {
        console.error('Failed to parse tour action:', error);
      }
    };

    client.on('ReceiveTourAction', handleTourAction);

    return () => {
      client.off('ReceiveTourAction');
    };
  }, [currentAutoRotate, guideCameraPosition, hasReceivedFirstAction]);

  return {
    // Controlled props for VirtualTourViewer
    controlledCameraPosition: currentCameraPosition,
    controlledSceneId: currentSceneId,
    controlledArtifactId: currentArtifactId,
    controlledAudioMuted: currentAudioMuted,
    controlledAutoRotate: currentAutoRotate,

    // State flags
    hasReceivedFirstAction,

    // Actions to clear controlled state (when switching to guide mode)
    clearControlledState: useCallback(() => {
      setCurrentCameraPosition(undefined);
      setGuideCameraPosition(undefined);
      setCurrentSceneId(undefined);
      setCurrentArtifactId(null);
      setCurrentAudioMuted(undefined);
      setCurrentAutoRotate(undefined);
      setHasReceivedFirstAction(false);
    }, []),
  };
};
