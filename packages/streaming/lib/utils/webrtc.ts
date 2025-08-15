/**
 * @fileoverview WebRTC Utilities
 *
 * Simple utilities matching the reference implementation
 */

/**
 * Generate random room ID
 */
export function generateRoomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Parse ICE candidate data from SignalR
 */
export function parseCandidate(candidateData: string | any): RTCIceCandidateInit | null {
  try {
    const parsed = typeof candidateData === 'string' ? JSON.parse(candidateData) : candidateData;

    // Some SFU send in format: { candidate: { candidate: "candidate:..." } }
    if (parsed.candidate && typeof parsed.candidate === 'object') {
      return parsed.candidate;
    }

    return parsed.candidate || parsed;
  } catch (err) {
    console.error('❌ Failed to parse ICE candidate:', err);
    return null;
  }
}

/**
 * Create WebRTC configuration
 */
export function createRTCConfiguration(turnServerUrl: string): RTCConfiguration {
  return {
    iceServers: [
      {
        urls: [turnServerUrl],
        username: 'webrtc',
        credential: 'supersecret',
      },
      { urls: 'stun:stun.l.google.com:19302' },
    ],
  };
}

/**
 * Default video constraints
 */
export const DEFAULT_VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
};

/**
 * Default audio constraints
 */
export const DEFAULT_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
};
