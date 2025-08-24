/**
 * @fileoverview Participant Thumbnail Component
 *
 * Small video thumbnail for header display
 */

import type { MediaStreamInfo, Participant } from '@/types';
import { ScrollArea, ScrollBar } from '@musetrip360/ui-core/scroll-area';
import React from 'react';
import { LocalVideo } from './LocalVideo';
import { RemoteVideo } from './RemoteVideo';

interface ParticipantThumbnailProps {
  participants: Participant[];
  localStream?: MediaStream | null;
  remoteStreams?: Map<string, MediaStreamInfo>;
  className?: string;
}

export const ParticipantsVideo: React.FC<ParticipantThumbnailProps> = ({
  participants,
  remoteStreams,
  localStream,
}) => {
  return (
    <div className="px-4 flex-1 min-w-0">
      <div className="flex-1 justify-center overflow-y-auto padding">
        <div className="flex gap-3">
          {participants.map((participant, index) => {
            if (participant.isLocalUser) {
              return (
                <LocalVideo
                  muted={participant.mediaState.audio}
                  key={participant.id}
                  participant={participant}
                  stream={localStream!}
                  className="w-40 h-30 rounded-lg border-2 border-primary shrink-0"
                  showControls={true}
                />
              );
            } else {
              const mediaStreamInfo = remoteStreams?.get(participant.streamId);
              if (!mediaStreamInfo?.stream) return null;
              return (
                <RemoteVideo
                  key={participant.id + index}
                  stream={mediaStreamInfo.stream}
                  participant={participant}
                  className="w-40 h-30 rounded-lg shrink-0"
                  showUserInfo={true}
                />
              );
            }
          })}

          {/* Add more placeholder thumbnails if needed */}
          {participants.length === 0 && (
            <div className="w-32 h-24 rounded-lg bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center shrink-0">
              <p className="text-xs text-muted-foreground">No participants</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
