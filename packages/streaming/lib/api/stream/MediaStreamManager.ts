/**
 * @fileoverview Media Stream Manager
 *
 * Manages local and remote media streams for WebRTC
 */

import { MediaStreamInfo, StreamConstraints, MediaState, StreamingError, StreamingErrorCode } from '../../types';

export class MediaStreamManager {
  private localStream: MediaStream | null = null;
  private remoteStreams: Map<string, MediaStreamInfo> = new Map();
  private mediaState: MediaState = { video: true, audio: true };

  /**
   * Initialize local media stream
   */
  async initializeLocalStream(constraints: StreamConstraints = { video: true, audio: true }): Promise<MediaStream> {
    try {
      // Default constraints for high quality video
      const defaultConstraints: MediaStreamConstraints = {
        video:
          constraints.video === true
            ? {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
              }
            : constraints.video,
        audio:
          constraints.audio === true
            ? {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 48000,
              }
            : constraints.audio,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(defaultConstraints);

      // Set initial media state based on enabled tracks
      const videoTrack = this.localStream.getVideoTracks()[0];
      const audioTrack = this.localStream.getAudioTracks()[0];

      this.mediaState = {
        video: videoTrack ? videoTrack.enabled : false,
        audio: audioTrack ? audioTrack.enabled : false,
      };

      console.log('✅ Local stream initialized', {
        videoEnabled: this.mediaState.video,
        audioEnabled: this.mediaState.audio,
        streamId: this.localStream.id,
      });

      return this.localStream;
    } catch (error) {
      console.error('❌ Failed to access camera/microphone:', error);
      throw this.createError(
        StreamingErrorCode.MEDIA_ACCESS_DENIED,
        'Cannot access camera or microphone. Please check permissions.',
        error
      );
    }
  }

  /**
   * Toggle video track on/off
   */
  toggleVideo(): boolean {
    if (!this.localStream) {
      console.warn('⚠️ No local stream available');
      return false;
    }

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      this.mediaState.video = videoTrack.enabled;

      console.log(`📹 Video ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
      return videoTrack.enabled;
    }

    return false;
  }

  /**
   * Toggle audio track on/off
   */
  toggleAudio(): boolean {
    if (!this.localStream) {
      console.warn('⚠️ No local stream available');
      return false;
    }

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.mediaState.audio = audioTrack.enabled;

      console.log(`🎤 Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
      return audioTrack.enabled;
    }

    return false;
  }

  /**
   * Stop local stream and release resources
   */
  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`🛑 ${track.kind} track stopped`);
      });

      this.localStream = null;
      this.mediaState = { video: false, audio: false };
      console.log('🛑 Local stream stopped');
    }
  }

  /**
   * Add remote stream
   */
  addRemoteStream(streamInfo: MediaStreamInfo): void {
    this.remoteStreams.set(streamInfo.streamId, streamInfo);
    console.log(`📡 Remote stream added: ${streamInfo.streamId} (peer: ${streamInfo.peerId})`);
  }

  /**
   * Remove remote stream
   */
  removeRemoteStream(streamId: string): void {
    const streamInfo = this.remoteStreams.get(streamId);
    if (streamInfo) {
      // Stop all tracks in the remote stream
      streamInfo.stream.getTracks().forEach((track) => track.stop());
      this.remoteStreams.delete(streamId);
      console.log(`📡 Remote stream removed: ${streamId}`);
    }
  }

  /**
   * Update remote stream media state
   */
  updateRemoteStreamState(streamId: string, mediaState: Partial<MediaState>): void {
    const streamInfo = this.remoteStreams.get(streamId);
    if (streamInfo) {
      streamInfo.mediaState = { ...streamInfo.mediaState, ...mediaState };
      console.log(`📡 Remote stream state updated: ${streamId}`, streamInfo.mediaState);
    }
  }

  /**
   * Get local stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Get remote streams
   */
  getRemoteStreams(): Map<string, MediaStreamInfo> {
    return this.remoteStreams;
  }

  /**
   * Get remote stream by ID
   */
  getRemoteStream(streamId: string): MediaStreamInfo | undefined {
    return this.remoteStreams.get(streamId);
  }

  /**
   * Get current media state
   */
  getMediaState(): MediaState {
    return { ...this.mediaState };
  }

  /**
   * Get all remote streams as array
   */
  getRemoteStreamsArray(): MediaStreamInfo[] {
    return Array.from(this.remoteStreams.values());
  }

  /**
   * Check if local stream is initialized
   */
  isLocalStreamInitialized(): boolean {
    return this.localStream !== null;
  }

  /**
   * Get stream statistics
   */
  getStreamStats(): {
    localStreamId: string | null;
    remoteStreamCount: number;
    totalTracks: number;
    activeTracks: number;
  } {
    const localStreamId = this.localStream?.id || null;
    const remoteStreamCount = this.remoteStreams.size;

    let totalTracks = 0;
    let activeTracks = 0;

    // Count local tracks
    if (this.localStream) {
      const localTracks = this.localStream.getTracks();
      totalTracks += localTracks.length;
      activeTracks += localTracks.filter((track) => track.enabled).length;
    }

    // Count remote tracks
    this.remoteStreams.forEach((streamInfo) => {
      const remoteTracks = streamInfo.stream.getTracks();
      totalTracks += remoteTracks.length;
      activeTracks += remoteTracks.filter((track) => track.enabled).length;
    });

    return {
      localStreamId,
      remoteStreamCount,
      totalTracks,
      activeTracks,
    };
  }

  /**
   * Replace video track (for screen sharing)
   */
  async replaceVideoTrack(newTrack: MediaStreamTrack): Promise<void> {
    if (!this.localStream) {
      throw this.createError(StreamingErrorCode.MEDIA_ACCESS_DENIED, 'No local stream available to replace track');
    }

    try {
      const oldVideoTrack = this.localStream.getVideoTracks()[0];

      if (oldVideoTrack) {
        oldVideoTrack.stop();
        this.localStream.removeTrack(oldVideoTrack);
      }

      this.localStream.addTrack(newTrack);
      this.mediaState.video = newTrack.enabled;

      console.log('🔄 Video track replaced');
    } catch (error) {
      throw this.createError(StreamingErrorCode.MEDIA_ACCESS_DENIED, 'Failed to replace video track', error);
    }
  }

  /**
   * Get display media for screen sharing
   */
  async getDisplayMedia(): Promise<MediaStream> {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      });

      console.log('🖥️ Display media stream obtained');
      return displayStream;
    } catch (error) {
      throw this.createError(
        StreamingErrorCode.MEDIA_ACCESS_DENIED,
        'Failed to get display media for screen sharing',
        error
      );
    }
  }

  /**
   * Cleanup all streams
   */
  cleanup(): void {
    // Stop local stream
    this.stopLocalStream();

    // Stop all remote streams
    this.remoteStreams.forEach((streamInfo, streamId) => {
      this.removeRemoteStream(streamId);
    });

    this.remoteStreams.clear();
    console.log('🧹 All streams cleaned up');
  }

  /**
   * Create standardized error object
   */
  private createError(code: StreamingErrorCode, message: string, details?: any): StreamingError {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }

  /**
   * Generate random room ID
   */
  static generateRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Validate stream constraints
   */
  static validateConstraints(constraints: StreamConstraints): boolean {
    try {
      // Basic validation - ensure video and audio are boolean or object
      if (typeof constraints.video !== 'boolean' && typeof constraints.video !== 'object') {
        return false;
      }

      if (typeof constraints.audio !== 'boolean' && typeof constraints.audio !== 'object') {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get supported media constraints
   */
  static async getSupportedConstraints(): Promise<MediaTrackSupportedConstraints> {
    return navigator.mediaDevices.getSupportedConstraints();
  }

  /**
   * Check if media devices are available
   */
  static async checkMediaDevices(): Promise<{
    hasCamera: boolean;
    hasMicrophone: boolean;
    devices: MediaDeviceInfo[];
  }> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const hasCamera = devices.some((device) => device.kind === 'videoinput');
      const hasMicrophone = devices.some((device) => device.kind === 'audioinput');

      return {
        hasCamera,
        hasMicrophone,
        devices,
      };
    } catch (error) {
      console.error('Failed to enumerate media devices:', error);
      return {
        hasCamera: false,
        hasMicrophone: false,
        devices: [],
      };
    }
  }
}
