import type { TourActions } from '@/types';
import type { SignalRClient } from '../signaling/SignalRClient';

/**
 * Service for managing tour action synchronization via SignalR
 * Handles sending and receiving tour actions (camera movements, scene changes, artifact interactions)
 */
export class TourActionService {
  private signalRClient: SignalRClient | null = null;

  constructor(signalRClient?: SignalRClient) {
    this.signalRClient = signalRClient || null;
  }

  /**
   * Set the SignalR client instance
   */
  setSignalRClient(client: SignalRClient): void {
    this.signalRClient = client;
  }

  /**
   * Get the SignalR client instance
   */
  getSignalRClient(): SignalRClient | null {
    return this.signalRClient;
  }

  /**
   * Send a tour action to room (broadcast to all other participants)
   */
  async sendTourAction(
    roomId: string,
    actionType: TourActions['ActionType'],
    actionData: TourActions['ActionData'],
    performedBy: string
  ): Promise<TourActions> {
    if (!this.signalRClient) {
      throw new Error('SignalR client not initialized');
    }

    if (!roomId || !actionType || !performedBy) {
      throw new Error('Missing required parameters');
    }

    try {
      // Create tour action object
      const tourAction: TourActions = {
        Id: `${performedBy}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        ActionType: actionType,
        ActionData: actionData,
        PerformedBy: performedBy,
        Timestamp: Date.now(),
      };

      // Send via SignalR - this will trigger ReceiveTourAction event for others
      const actionJson = JSON.stringify(tourAction);
      await this.signalRClient.sendTourActionToRoom(roomId, actionJson);

      return tourAction;
    } catch (error) {
      console.error('Failed to send tour action:', error);
      throw error;
    }
  }

  /**
   * Send camera change action
   */
  async sendCameraChange(
    roomId: string,
    cameraPosition: { theta: number; phi: number; fov: number },
    performedBy: string
  ): Promise<TourActions> {
    return this.sendTourAction(roomId, 'camera_change', { CameraPosition: cameraPosition }, performedBy);
  }

  /**
   * Send scene change action
   */
  async sendSceneChange(roomId: string, sceneId: string, performedBy: string): Promise<TourActions> {
    return this.sendTourAction(roomId, 'scene_change', { SceneId: sceneId }, performedBy);
  }

  /**
   * Send artifact preview action
   */
  async sendArtifactPreview(roomId: string, artifactId: string, performedBy: string): Promise<TourActions> {
    return this.sendTourAction(roomId, 'artifact_preview', { ArtifactId: artifactId }, performedBy);
  }

  /**
   * Send artifact close action
   */
  async sendArtifactClose(roomId: string, performedBy: string): Promise<TourActions> {
    return this.sendTourAction(roomId, 'artifact_close', {}, performedBy);
  }

  /**
   * Send audio mute action
   */
  async sendAudioMute(roomId: string, performedBy: string): Promise<TourActions> {
    return this.sendTourAction(roomId, 'audio_mute', { AudioState: { isMuted: true } }, performedBy);
  }

  /**
   * Send audio unmute action
   */
  async sendAudioUnmute(roomId: string, performedBy: string): Promise<TourActions> {
    return this.sendTourAction(roomId, 'audio_unmute', { AudioState: { isMuted: false } }, performedBy);
  }

  /**
   * Send auto rotate start action
   */
  async sendAutoRotateStart(roomId: string, performedBy: string): Promise<TourActions> {
    return this.sendTourAction(roomId, 'auto_rotate_start', { RotationState: { isAutoRotating: true } }, performedBy);
  }

  /**
   * Send auto rotate stop action
   */
  async sendAutoRotateStop(roomId: string, performedBy: string): Promise<TourActions> {
    return this.sendTourAction(roomId, 'auto_rotate_stop', { RotationState: { isAutoRotating: false } }, performedBy);
  }

  /**
   * Check if tour action service is available
   */
  isAvailable(): boolean {
    return this.signalRClient?.isConnected() ?? false;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): string {
    if (!this.signalRClient) return 'not_initialized';
    return this.signalRClient.getConnectionState();
  }
}

// Create singleton instance
export const tourActionService = new TourActionService();
