/**
 * @fileoverview Video Grid Component
 *
 * Grid layout for displaying multiple video streams
 */

import React from 'react';
import { cn } from '@musetrip360/ui-core/utils';
import { Badge } from '@musetrip360/ui-core/badge';
import { Participant, VideoGridProps } from '@/types';
import { LocalVideo } from './LocalVideo';
import { RemoteVideo } from './RemoteVideo';
import { Users, Video as VideoIcon } from 'lucide-react';
import { useStreamingContext } from '@/contexts';

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  localStream,
  className,
  maxVideosPerRow = 3,
  ...props
}) => {
  const remoteParticipants = participants.filter((p) => !p.isLocalUser);
  const localParticipant = participants.find((p) => p.isLocalUser);

  const {
    mediaStream: { remoteStreams },
  } = useStreamingContext();

  // Calculate total videos
  const totalVideos = remoteParticipants.length + (localStream ? 1 : 0);

  // Helper function to get stream for a participant
  const getStreamForParticipant = (participant: Participant) => {
    return remoteStreams.get(participant.streamId)?.stream;
  };

  // Main participant (usually the active speaker)
  const mainParticipant = remoteParticipants[0] || localParticipant;
  const thumbnailParticipants =
    remoteParticipants.length > 0 ? [localParticipant, ...remoteParticipants.slice(1)].filter(Boolean) : [];

  return (
    <div className={cn('video-grid w-full h-full relative overflow-hidden rounded-lg', className)} {...props}>
      {totalVideos === 0 ? (
        /* Empty state */
        <div className="flex items-center justify-center h-full bg-muted/20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <VideoIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">No active streams</h3>
              <p className="text-sm text-muted-foreground">Waiting for participants to join</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main Video Area */}
          <div className="w-full h-full relative">
            {mainParticipant ? (
              mainParticipant.isLocalUser ? (
                <LocalVideo stream={localStream} showControls={false} className="w-full h-full" />
              ) : (
                <RemoteVideo
                  participant={mainParticipant}
                  stream={getStreamForParticipant(mainParticipant)}
                  showUserInfo={true}
                  className="w-full h-full"
                />
              )
            ) : null}

            {/* Participant Count Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Users className="w-3 h-3 mr-1" />
                {totalVideos} participant{totalVideos !== 1 ? 's' : ''}
              </Badge>
            </div>

            {/* Thumbnail Videos - Right Side */}
            {thumbnailParticipants.length > 0 && (
              <div className="absolute top-4 right-4 flex flex-col gap-2 max-h-[calc(100%-2rem)] overflow-y-auto">
                {thumbnailParticipants.map((participant) => (
                  <div key={participant?.id} className="w-32 h-24 relative">
                    {participant?.isLocalUser ? (
                      <LocalVideo
                        stream={localStream}
                        showControls={false}
                        className="w-full h-full rounded-lg shadow-lg border border-border"
                      />
                    ) : (
                      <RemoteVideo
                        participant={participant!}
                        stream={getStreamForParticipant(participant!)}
                        showUserInfo={false}
                        className="w-full h-full rounded-lg shadow-lg border border-border"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
