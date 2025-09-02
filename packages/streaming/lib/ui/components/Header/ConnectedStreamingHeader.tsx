/**
 * @fileoverview Connected Streaming Header Component
 *
 * Enhanced version of StreamingHeader that connects to real streaming data
 * and provides actual room and host information instead of mock data
 */

import React, { useMemo } from 'react';
import { useStreamingContext } from '@/contexts/StreamingContext';
import { useParticipantStore } from '@/state/store/participantStore';
import { ParticipantRoleEnum } from '@musetrip360/event-management/types';
import { StreamingHeader } from './StreamingHeader';

interface ConnectedStreamingHeaderProps {
  onCopyRoomId?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

export const ConnectedStreamingHeader: React.FC<ConnectedStreamingHeaderProps> = ({
  onCopyRoomId,
  onMenuClick,
  className,
}) => {
  const { roomState, participants, currentRoomId, mediaStream } = useStreamingContext();

  const { participantInfos } = useParticipantStore();

  // Calculate real participant count
  const participantCount = useMemo(() => {
    return participants.size;
  }, [participants]);

  // Find host information from participants
  const hostInfo = useMemo(() => {
    const participantArray = Array.from(participants.values());

    // Look for organizer or tour guide first
    const host = participantArray.find((participant) => {
      const participantInfo =
        participant.participantInfo || (participant.userId ? participantInfos.get(participant.userId) : null);

      return (
        participantInfo?.role === ParticipantRoleEnum.Organizer ||
        participantInfo?.role === ParticipantRoleEnum.TourGuide
      );
    });

    if (host?.participantInfo?.user) {
      const user = host.participantInfo.user;
      return {
        hostName: user.fullName,
        hostTitle: host.participantInfo.role === ParticipantRoleEnum.Organizer ? 'Organizer' : 'Tour Guide',
        hostAvatar: user.avatarUrl || undefined,
        isLive: roomState?.Metadata?.CurrentTourState?.IsLive || true,
        viewerCount: participantCount,
      };
    }

    return {
      hostName: undefined,
      hostTitle: undefined,
      hostAvatar: undefined,
      isLive: roomState?.Metadata?.CurrentTourState?.IsLive || false,
      viewerCount: participantCount,
    };
  }, [participants, participantInfos, roomState, participantCount]);

  // Generate meeting information from room data
  const meetingInfo = useMemo(() => {
    if (!roomState) {
      return {
        meetingTitle: undefined,
        meetingDate: undefined,
        meetingTime: undefined,
        meetingType: 'presentation' as const,
      };
    }

    // Format room name as meeting title
    const meetingTitle = roomState.Name || 'Virtual Tour Session';

    // Use room creation date for meeting date/time
    const createdDate = new Date(roomState.CreatedAt);
    const meetingDate = createdDate.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
    });
    const meetingTime = createdDate.toLocaleTimeString('vi-VN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return {
      meetingTitle,
      meetingDate,
      meetingTime,
      meetingType: 'presentation' as const, // Virtual tours are presentation-type meetings
    };
  }, [roomState]);

  // Calculate session duration
  const duration = useMemo(() => {
    if (!roomState?.CreatedAt) return 0;

    const startTime = new Date(roomState.CreatedAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));

    return Math.max(0, diffInMinutes);
  }, [roomState]);

  // Connection status
  const isConnected = useMemo(() => {
    return !!currentRoomId && participants.size > 0;
  }, [currentRoomId, participants]);

  // Handle copy room ID with fallback
  const handleCopyRoomId = () => {
    if (currentRoomId && navigator.clipboard) {
      navigator.clipboard.writeText(currentRoomId).catch(console.error);
    }
    onCopyRoomId?.();
  };

  // Prepare participants array and remote streams
  const participantsArray = useMemo(() => {
    return Array.from(participants.values());
  }, [participants]);

  const remoteStreams = useMemo(() => {
    return mediaStream.remoteStreams;
  }, [mediaStream.remoteStreams]);

  return (
    <StreamingHeader
      // Meeting info
      meetingTitle={meetingInfo.meetingTitle}
      meetingDate={meetingInfo.meetingDate}
      meetingTime={meetingInfo.meetingTime}
      currentRoomId={currentRoomId!}
      isConnected={isConnected}
      onCopyRoomId={handleCopyRoomId}
      duration={duration}
      participantCount={participantCount}
      meetingType={meetingInfo.meetingType}
      // Participants
      participants={participantsArray}
      localStream={mediaStream.localStream}
      remoteStreams={remoteStreams}
      // Host info
      hostName={hostInfo.hostName}
      hostTitle={hostInfo.hostTitle}
      hostAvatar={hostInfo.hostAvatar}
      isLive={hostInfo.isLive}
      viewerCount={hostInfo.viewerCount}
      onMenuClick={onMenuClick}
      className={className}
    />
  );
};
