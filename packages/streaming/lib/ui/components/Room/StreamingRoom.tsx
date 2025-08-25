/**
 * @fileoverview Streaming Room Component
 *
 * Complete room interface combining all streaming components
 */

import { useStreamingContext } from '@/contexts/StreamingContext';
import { Button } from '@musetrip360/ui-core/button';
import { cn } from '@musetrip360/ui-core/utils';
import { Mic, MicOff, MoreHorizontal, PhoneOff, Settings, Users, Video, VideoOff } from 'lucide-react';
import React from 'react';
import { StreamingHeader } from '../Header/StreamingHeader';
import { StreamingSidebar } from '../Sidebar/StreamingSidebar';

interface StreamingRoomProps {
  className?: string;
  children: React.ReactNode;
}

export const StreamingRoom: React.FC<StreamingRoomProps> = ({ className, children }) => {
  const {
    participants,
    currentRoomId,
    isInRoom,

    // Media state
    mediaStream: { localStream, mediaState, remoteStreams },

    leaveRoom,
    toggleVideo,
    toggleAudio,

    // Connection state
    signalR: { isConnected },

    // Errors
    errors,
  } = useStreamingContext();

  const participantArray = Array.from(participants.values());

  const handleCopyRoomId = () => {
    if (currentRoomId) {
      navigator.clipboard.writeText(currentRoomId);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  if (!localStream) {
    return (
      <div className="flex items-center justify-center h-full bg-background rounded-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Video className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">Camera not available</h3>
            <p className="text-sm text-muted-foreground">Please allow camera access to start streaming</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInRoom || !currentRoomId) {
    return (
      <div className="flex items-center justify-center h-full bg-background rounded-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">Join a room to start</h3>
            <p className="text-sm text-muted-foreground">Create or join a room to begin video calling</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('streaming-room w-full h-full flex flex-col bg-background', className)}>
      {/* Header */}
      <StreamingHeader
        // Meeting info props
        meetingTitle="[Internal] Weekly Report Marketing + Sales"
        meetingDate="June 21st, 2024"
        meetingTime="11:00 AM"
        currentRoomId={currentRoomId}
        isConnected={isConnected}
        onCopyRoomId={handleCopyRoomId}
        duration={25} // Example: 25 minutes into the meeting
        participantCount={participantArray.length}
        meetingType="internal"
        // Participants props
        participants={participantArray}
        localStream={localStream}
        remoteStreams={remoteStreams}
        // Host info props
        hostName="Adam Joseph"
        hostTitle="Manager"
        isLive={true}
        viewerCount={participantArray.length}
        onMenuClick={() => console.log('Menu clicked')}
      />

      {/* Error Display */}
      {/* {errors.length > 0 && (
        <div className="bg-destructive/15 border-l-4 border-destructive text-destructive px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Error:</span>
            <span className="text-sm">{errors[errors.length - 1]?.message}</span>
          </div>
        </div>
      )} */}

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col bg-black/95 relative">
          {/* Main Video Container */}
          <div className="flex-1 relative overflow-hidden">{children}</div>

          {/* Bottom Toolbar */}
          <div className="p-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 z-20">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={mediaState.audio ? 'secondary' : 'destructive'}
                size="lg"
                onClick={toggleAudio}
                disabled={!isConnected}
                className="h-12 w-12 rounded-full p-0 shadow-lg"
              >
                {mediaState.audio ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={mediaState.video ? 'secondary' : 'destructive'}
                size="lg"
                onClick={toggleVideo}
                disabled={!isConnected}
                className="h-12 w-12 rounded-full p-0 shadow-lg"
              >
                {mediaState.video ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant="outline"
                size="lg"
                disabled={!isConnected}
                className="h-12 w-12 rounded-full p-0 border-white/30 bg-white/10 hover:bg-white/20 shadow-lg"
              >
                <Settings className="h-5 w-5 text-white" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                disabled={!isConnected}
                className="h-12 w-12 rounded-full p-0 border-white/30 bg-white/10 hover:bg-white/20 shadow-lg"
              >
                <MoreHorizontal className="h-5 w-5 text-white" />
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleLeaveRoom}
                disabled={!isConnected}
                className="h-12 px-6 rounded-full shadow-lg font-medium"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Call
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <StreamingSidebar participants={participantArray} onAddParticipant={() => {}} />
      </div>
    </div>
  );
};
