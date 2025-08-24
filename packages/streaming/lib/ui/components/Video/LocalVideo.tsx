/**
 * @fileoverview Local Video Component
 *
 * Simple local video component matching reference implementation
 */

import React, { useRef, useEffect } from 'react';
import { cn } from '@musetrip360/ui-core/utils';
import { Badge } from '@musetrip360/ui-core/badge';
import { LocalVideoProps, Participant } from '@/types';
import { Crown, Target, User, MicOff } from 'lucide-react';

interface LocalVideoComponentProps extends LocalVideoProps {
  participant?: Participant;
}

export const LocalVideo: React.FC<LocalVideoComponentProps> = ({
  stream,
  muted = true,
  autoPlay = true,
  playsInline = true,
  className,
  showControls = false,
  participant,
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

  // Enhanced local user info
  const userInfo = participant?.participantInfo;
  const displayName = userInfo?.user ? userInfo.user.fullName || userInfo.user.username : 'You';
  const userRole = userInfo?.role;

  if (!stream) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted rounded-lg border',
          'w-80 h-60', // Default size matching reference
          className
        )}
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-sm text-muted-foreground">No camera</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative bg-muted rounded-lg overflow-hidden border',
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

      {/* Enhanced local video labels */}
      <div className="absolute bottom-2 max-w-full gap-1 px-1 flex">
        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs shrink justify-start">
          <span className="truncate">{displayName}</span>
        </Badge>
        {userRole && (
          <Badge
            variant={userRole === 'TourGuide' ? 'default' : 'outline'}
            className="bg-background/80 backdrop-blur-sm text-xs px-2 py-0.5 flex items-center gap-1 shrink-0"
          >
            {userRole === 'TourGuide' ? (
              <Target className="w-3 h-3" />
            ) : userRole === 'Organizer' ? (
              <Crown className="w-3 h-3" />
            ) : userRole === 'Attendee' ? (
              <User className="w-3 h-3" />
            ) : (
              userRole
            )}
          </Badge>
        )}
      </div>

      {/* Muted indicator for local video */}
      {muted && (
        <div className="absolute top-2 right-2">
          <Badge variant="destructive" className="p-1">
            <MicOff className="w-3 h-3" />
          </Badge>
        </div>
      )}
    </div>
  );
};
