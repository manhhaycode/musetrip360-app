/**
 * @fileoverview Video Grid Component
 *
 * Grid layout for displaying multiple video streams
 */

import React from 'react';
import { cn } from '@musetrip360/ui-core/utils';
import { VideoGridProps } from '@/types';
import { LocalVideo } from './LocalVideo';
import { RemoteVideo } from './RemoteVideo';

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  localStream,
  className,
  maxVideosPerRow = 3,
  ...props
}) => {
  const remoteParticipants = participants.filter((p) => !p.isLocalUser);
  const localParticipant = participants.find((p) => p.isLocalUser);

  // Calculate grid layout based on total participants
  const totalVideos = remoteParticipants.length + (localStream ? 1 : 0);
  const gridCols = Math.min(totalVideos, maxVideosPerRow);

  // Grid classes based on number of columns
  const getGridCols = (cols: number) => {
    switch (cols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      default:
        return 'grid-cols-3';
    }
  };

  return (
    <div className={cn('video-grid w-full h-full overflow-auto', className)} {...props}>
      {/* Main video container matching reference implementation */}
      <div
        id="remoteVideos" // Matching reference ID
        className={cn('grid gap-4 p-4 place-items-center', getGridCols(gridCols))}
      >
        {/* Local video */}
        {localStream && (
          <div className="video-item">
            <LocalVideo stream={localStream} showControls={false} className="w-full max-w-sm" />
          </div>
        )}

        {/* Remote videos */}
        {remoteParticipants.map((participant) => (
          <div key={participant.id} className="video-item">
            <RemoteVideo
              participant={participant}
              stream={
                participant.streamId
                  ? // In real implementation, you'd get stream from streamId
                    undefined
                  : undefined
              }
              showUserInfo={true}
              className="w-full max-w-sm"
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {totalVideos === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">No active streams</div>
            <div className="text-sm">Join a room to start video streaming</div>
          </div>
        </div>
      )}

      {/* Participants count */}
      {totalVideos > 0 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {totalVideos} participant{totalVideos > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
