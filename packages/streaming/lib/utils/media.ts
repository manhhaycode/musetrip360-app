/**
 * @fileoverview Media Utilities
 *
 * Simple media utilities matching the reference implementation
 */

/**
 * Get user media with default constraints
 */
export async function getUserMedia(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: true,
    });
  } catch (err) {
    console.error('Failed to access camera/microphone:', err);
    throw new Error('Cannot access camera or microphone. Please check permissions.');
  }
}

/**
 * Toggle video track
 */
export function toggleVideoTrack(stream: MediaStream, enabled: boolean): boolean {
  const videoTrack = stream.getVideoTracks()[0];
  if (videoTrack) {
    videoTrack.enabled = enabled;
    console.log('Camera', enabled ? 'on' : 'off');
    return videoTrack.enabled;
  }
  return false;
}

/**
 * Toggle audio track
 */
export function toggleAudioTrack(stream: MediaStream, enabled: boolean): boolean {
  const audioTrack = stream.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = enabled;
    console.log('Mic', enabled ? 'on' : 'off');
    return audioTrack.enabled;
  }
  return false;
}

/**
 * Stop all tracks in stream
 */
export function stopStream(stream: MediaStream): void {
  stream.getTracks().forEach((track) => {
    track.stop();
    console.log(`🛑 ${track.kind} track stopped`);
  });
}
