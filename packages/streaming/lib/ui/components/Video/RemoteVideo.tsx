/**
 * @fileoverview Remote Video Component
 *
 * Simple remote video component matching reference implementation
 */

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@musetrip360/ui-core/utils';
import { Badge } from '@musetrip360/ui-core/badge';
import { Avatar, AvatarFallback } from '@musetrip360/ui-core/avatar';
import { RemoteVideoProps } from '@/types';
import { User, VideoOff, MicOff } from 'lucide-react';

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
          'flex items-center justify-center bg-muted rounded-lg border',
          'w-80 h-60', // Default size matching reference
          className
        )}
      >
        <div className="text-center space-y-3">
          <Avatar className="w-16 h-16 mx-auto">
            <AvatarFallback className="bg-muted-foreground/20">
              <User className="w-8 h-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Connecting...</div>
            {showUserInfo && participant && <div className="text-xs text-muted-foreground">{participant.peerId}</div>}
          </div>
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
        'relative bg-muted rounded-lg overflow-hidden border',
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
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-3">
            <Avatar className="w-12 h-12 mx-auto">
              <AvatarFallback className="bg-muted-foreground/20">
                {!isVideoReady ? (
                  <User className="w-6 h-6 text-muted-foreground animate-pulse" />
                ) : (
                  <VideoOff className="w-6 h-6 text-muted-foreground" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">{!isVideoReady ? 'Connecting...' : 'Camera off'}</div>
          </div>
        </div>
      )}

      {/* User info label */}
      {showUserInfo && (
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
            {displayName}
          </Badge>
        </div>
      )}

      {/* Media state indicators */}
      <div className="absolute top-2 right-2 flex gap-1">
        {/* Video off indicator */}
        {!isVideoEnabled && (
          <Badge variant="destructive" className="p-1" title="Video disabled">
            <VideoOff className="w-3 h-3" />
          </Badge>
        )}

        {/* Audio off indicator */}
        {!isAudioEnabled && (
          <Badge variant="destructive" className="p-1" title="Audio muted">
            <MicOff className="w-3 h-3" />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default RemoteVideo;
