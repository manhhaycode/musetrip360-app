/**
 * @fileoverview Local Video Component
 *
 * Simple local video component matching reference implementation
 */

import React, { useRef, useEffect } from 'react';
import { cn } from '@musetrip360/ui-core/utils';
import { LocalVideoProps } from '@/types';

export const LocalVideo: React.FC<LocalVideoProps> = ({
  stream,
  muted = true,
  autoPlay = true,
  playsInline = true,
  className,
  showControls = false,
  onError,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !stream) return;

    // Set stream as srcObject
    videoElement.srcObject = stream;

    // Handle video errors
    const handleError = (event: Event) => {
      console.error('Local video error:', event);
      onError?.(new Error('Local video playback error'));
    };

    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('error', handleError);
      // Don't set srcObject to null on cleanup as it's local stream
    };
  }, [stream, onError]);

  if (!stream) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-900 text-white rounded-lg',
          'w-80 h-60', // Default size matching reference (300px -> w-80)
          className
        )}
      >
        <div className="text-center">
          <div className="text-sm opacity-75">No local stream</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative bg-gray-900 rounded-lg overflow-hidden',
        'w-80 h-60', // Default size matching reference
        className
      )}
    >
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        playsInline={playsInline}
        muted={muted}
        controls={showControls}
        className="w-full h-full object-cover"
        {...props}
      />

      {/* Local video label */}
      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">You (Local)</div>

      {/* Muted indicator for local video */}
      {muted && (
        <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded">
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
  );
};

export default LocalVideo;
