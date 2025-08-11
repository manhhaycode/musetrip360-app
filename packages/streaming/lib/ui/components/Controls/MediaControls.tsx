/**
 * @fileoverview Media Controls Component
 *
 * Controls for camera, microphone, and room management
 */

import React from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { cn } from '@musetrip360/ui-core/utils';
import { MediaControlsProps } from '@/types';

export const MediaControls: React.FC<MediaControlsProps> = ({
  mediaState,
  onToggleVideo,
  onToggleAudio,
  onLeaveRoom,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Camera Toggle Button */}
      <Button
        id="toggleCameraBtn" // Matching reference ID
        variant={mediaState.video ? 'default' : 'destructive'}
        size="sm"
        onClick={onToggleVideo}
        disabled={disabled}
        className="min-w-32"
        leftIcon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            {mediaState.video ? (
              // Camera on icon
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            ) : (
              // Camera off icon
              <path
                fillRule="evenodd"
                d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.036 10.036 0 009.28 3.66l-1.06 1.06A8.535 8.535 0 0118 10a8.526 8.526 0 01-2.687 4.482L14.249 13.4a6.775 6.775 0 002.313-3.4 6.775 6.775 0 00-7.662-4.909l-.989.989a4.636 4.636 0 014.132 1.911 1.651 1.651 0 010 1.185c-.18.464-.545.896-.998 1.267L9.28 7.28zM6.61 13.685v3.4a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-2.69L3.28 2.22z"
                clipRule="evenodd"
              />
            )}
          </svg>
        }
      >
        {mediaState.video ? 'Turn Off Camera' : 'Turn On Camera'}
      </Button>

      {/* Microphone Toggle Button */}
      <Button
        id="toggleMicBtn" // Matching reference ID
        variant={mediaState.audio ? 'default' : 'destructive'}
        size="sm"
        onClick={onToggleAudio}
        disabled={disabled}
        className="min-w-32"
        leftIcon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            {mediaState.audio ? (
              // Microphone on icon
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            ) : (
              // Microphone off icon
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.05 13.061a1 1 0 01-.383-.816v-4.49a1 1 0 01.383-.816L8.383 3.076zM12 5a1 1 0 011.414 0L15 6.586l1.586-1.586a1 1 0 011.414 1.414L16.414 8l1.586 1.586a1 1 0 01-1.414 1.414L15 9.414l-1.586 1.586a1 1 0 01-1.414-1.414L13.586 8L12 6.414A1 1 0 0112 5z"
                clipRule="evenodd"
              />
            )}
          </svg>
        }
      >
        {mediaState.audio ? 'Mute Mic' : 'Unmute Mic'}
      </Button>

      {/* Leave Room Button */}
      <Button
        variant="destructive"
        size="sm"
        onClick={onLeaveRoom}
        disabled={disabled}
        className="min-w-24"
        leftIcon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
        }
      >
        Leave
      </Button>
    </div>
  );
};

export default MediaControls;
