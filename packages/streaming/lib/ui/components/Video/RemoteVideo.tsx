/**
 * @fileoverview Remote Video Component
 *
 * Simple remote video component matching reference implementation
 */

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@musetrip360/ui-core/utils';
import { RemoteVideoProps } from '@/types';

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
  stream,
  participant,
  muted = false, // Remote videos should have audio enabled by default
  autoPlay = true,
  playsInline = true,
  className,
  showUserInfo = true,
  onError,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !stream) return;

    // Set stream as srcObject
    videoElement.srcObject = stream;

    // Handle video ready
    const handleLoadedMetadata = () => {
      setIsVideoReady(true);
      console.log(`✅ Remote video ready for stream: ${stream.id}`);
    };

    // Handle video errors
    const handleError = (event: Event) => {
      console.error('Remote video error:', event);
      onError?.(new Error('Remote video playback error'));
      setIsVideoReady(false);
    };

    // Handle play promise rejection
    const handlePlay = () => {
      videoElement.play().catch((err) => {
        console.warn('⚠️ Remote video replay error:', err);
      });
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('canplay', handlePlay);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('canplay', handlePlay);

      // Clean up stream
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
    };
  }, [stream, onError]);

  if (!stream) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-800 text-white rounded-lg border-2 border-gray-600',
          'w-80 h-60', // Default size matching reference
          className
        )}
      >
        <div className="text-center">
          <div className="text-sm opacity-75">No stream</div>
          {showUserInfo && participant && <div className="text-xs opacity-50 mt-1">{participant.peerId}</div>}
        </div>
      </div>
    );
  }

  const streamId = stream.id;
  const displayName = participant ? `User ${participant.peerId}` : 'Remote User';
  const isVideoEnabled = participant?.mediaState?.video ?? true;
  const isAudioEnabled = participant?.mediaState?.audio ?? true;

  return (
    <div
      id={`wrapper-${streamId}`}
      className={cn(
        'relative bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600',
        'inline-block m-2', // Matching reference styling
        'w-80 h-60', // Default size matching reference (300px width, 200px height)
        className
      )}
    >
      <video
        ref={videoRef}
        id={`remoteVideo-${streamId}`}
        autoPlay={autoPlay}
        playsInline={playsInline}
        muted={muted}
        className="w-full h-full object-cover"
        style={{ display: isVideoReady && isVideoEnabled ? 'block' : 'none' }}
        {...props}
      />

      {/* Video disabled or loading state */}
      {(!isVideoReady || !isVideoEnabled) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            {!isVideoReady ? (
              <div className="text-sm">Loading video...</div>
            ) : (
              <div className="text-sm">Video disabled</div>
            )}
          </div>
        </div>
      )}

      {/* User info label - matching reference implementation */}
      {showUserInfo && (
        <div
          className={cn(
            'absolute bottom-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs',
            'video-label' // Matching reference class name
          )}
        >
          {displayName}
        </div>
      )}

      {/* Media state indicators */}
      <div className="absolute top-2 right-2 flex gap-1">
        {/* Video off indicator */}
        {!isVideoEnabled && (
          <div className="bg-red-600 text-white p-1 rounded" title="Video disabled">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.036 10.036 0 009.28 3.66l-1.06 1.06A8.535 8.535 0 0118 10a8.526 8.526 0 01-2.687 4.482L14.249 13.4a6.775 6.775 0 002.313-3.4 6.775 6.775 0 00-7.662-4.909l-.989.989a4.636 4.636 0 014.132 1.911 1.651 1.651 0 010 1.185c-.18.464-.545.896-.998 1.267L9.28 7.28zM6.61 13.685v3.4a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-2.69L3.28 2.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Audio off indicator */}
        {!isAudioEnabled && (
          <div className="bg-red-600 text-white p-1 rounded" title="Audio muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.05 13.061a1 1 0 01-.383-.816v-4.49a1 1 0 01.383-.816L8.383 3.076zM12 5a1 1 0 011.414 0L15 6.586l1.586-1.586a1 1 0 011.414 1.414L16.414 8l1.586 1.586a1 1 0 01-1.414 1.414L15 9.414l-1.586 1.586a1 1 0 01-1.414-1.414L13.586 8L12 6.414A1 1 0 0112 5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoteVideo;
