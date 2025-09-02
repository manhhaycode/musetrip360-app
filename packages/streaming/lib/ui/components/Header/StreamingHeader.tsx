/**
 * @fileoverview Streaming Header Component
 *
 * Header with meeting info, participant thumbnails and host info
 */

import type { MediaStreamInfo, Participant } from '@/types';
import { cn } from '@musetrip360/ui-core/utils';
import React from 'react';
import { ParticipantsVideo } from '../Video';
import { HostInfo } from './HostInfo';
import { MeetingInfo } from './MeetingInfo';

interface StreamingHeaderProps {
  // Meeting info props
  meetingTitle?: string;
  meetingDate?: string;
  meetingTime?: string;
  currentRoomId?: string;
  isConnected: boolean;
  onCopyRoomId: () => void;
  duration?: number;
  participantCount?: number;
  meetingType?: 'internal' | 'external' | 'presentation';

  // Participants props
  participants: Participant[];
  localStream?: MediaStream | null;
  remoteStreams?: Map<string, MediaStreamInfo>;

  // Host info props
  hostName?: string;
  hostTitle?: string;
  hostAvatar?: string;
  isLive?: boolean;
  viewerCount?: number;
  onMenuClick?: () => void;

  className?: string;
}

export const StreamingHeader: React.FC<StreamingHeaderProps> = ({
  // Meeting info props
  meetingTitle,
  meetingDate,
  meetingTime,
  currentRoomId,
  isConnected,
  onCopyRoomId,
  duration,
  participantCount,
  meetingType,

  // Participants props
  participants,
  localStream,
  remoteStreams,

  // Host info props
  hostName,
  hostTitle,
  hostAvatar,
  isLive,
  viewerCount,
  onMenuClick,

  className,
}) => {
  return (
    <div className={cn('border-b bg-gradient-to-b from-muted/30 to-background', className)}>
      <div className="flex items-center justify-between p-4 gap-4">
        {/* Meeting Info Section */}
        <MeetingInfo
          meetingTitle={meetingTitle}
          meetingDate={meetingDate}
          meetingTime={meetingTime}
          currentRoomId={currentRoomId}
          isConnected={isConnected}
          onCopyRoomId={onCopyRoomId}
          duration={duration}
          participantCount={participantCount}
          meetingType={meetingType}
          className="flex-shrink-0"
        />

        {/* Participants Video Section */}
        <ParticipantsVideo
          participants={participants}
          localStream={localStream}
          remoteStreams={remoteStreams}
          className="flex-1"
        />

        {/* Host Info Section */}
        <HostInfo
          hostName={hostName}
          hostTitle={hostTitle}
          hostAvatar={hostAvatar}
          isLive={isLive}
          viewerCount={viewerCount}
          className="flex-shrink-0 w-76"
        />
      </div>
    </div>
  );
};
