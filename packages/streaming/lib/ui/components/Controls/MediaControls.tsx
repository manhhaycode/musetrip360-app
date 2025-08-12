/**
 * @fileoverview Media Controls Component
 *
 * Controls for camera, microphone, and room management
 */

import React from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@musetrip360/ui-core/tooltip';
import { cn } from '@musetrip360/ui-core/utils';
import { MediaControlsProps } from '@/types';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MoreHorizontal } from 'lucide-react';

export const MediaControls: React.FC<MediaControlsProps> = ({
  mediaState,
  onToggleVideo,
  onToggleAudio,
  onLeaveRoom,
  disabled = false,
  className,
}) => {
  return (
    <TooltipProvider>
      <div className={cn('flex items-center justify-center gap-2', className)}>
        {/* Microphone Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="toggleMicBtn"
              variant={mediaState.audio ? 'secondary' : 'destructive'}
              size="lg"
              onClick={onToggleAudio}
              disabled={disabled}
              className="h-12 w-12 rounded-full p-0"
            >
              {mediaState.audio ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{mediaState.audio ? 'Mute microphone' : 'Unmute microphone'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Camera Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="toggleCameraBtn"
              variant={mediaState.video ? 'secondary' : 'destructive'}
              size="lg"
              onClick={onToggleVideo}
              disabled={disabled}
              className="h-12 w-12 rounded-full p-0"
            >
              {mediaState.video ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{mediaState.video ? 'Turn off camera' : 'Turn on camera'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Leave Room */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="lg"
              onClick={onLeaveRoom}
              disabled={disabled}
              className="h-12 w-12 rounded-full p-0"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Leave room</p>
          </TooltipContent>
        </Tooltip>

        {/* More Options */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="lg" disabled={disabled} className="h-12 w-12 rounded-full p-0">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>More options</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
