/**
 * @fileoverview Streaming Room Component
 *
 * Complete room interface combining all streaming components
 */

import { useStreamingContext } from '@/contexts/StreamingContext';
import { Avatar, AvatarFallback } from '@musetrip360/ui-core/avatar';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { cn } from '@musetrip360/ui-core/utils';
import { Copy, Mic, MicOff, MoreHorizontal, PhoneOff, Settings, Users, Video, VideoOff } from 'lucide-react';
import React from 'react';
import { VideoGrid } from '../Video/VideoGrid';

interface StreamingRoomProps {
  className?: string;
}

export const StreamingRoom: React.FC<StreamingRoomProps> = ({ className }) => {
  const {
    // Room state
    roomState,
    participants,
    currentRoomId,
    isInRoom,

    // Media state
    mediaStream: { localStream, mediaState, remoteStreams },

    // Actions
    joinRoom,
    createRoom,
    leaveRoom,
    toggleVideo,
    toggleAudio,

    // Connection state
    signalR: { isConnected, connectionState },

    // Errors
    errors,
  } = useStreamingContext();

  const participantArray = Array.from(participants.values());
  console.log(participantArray);

  const isConnecting = connectionState === 'connecting';

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleCreateRoom = async () => {
    try {
      await createRoom();
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

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
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-500' : 'bg-destructive')} />
            <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>

          {/* Room ID */}
          {currentRoomId && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Room:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {currentRoomId}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(currentRoomId)}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {participantArray.length}
          </Badge>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-destructive/15 border-l-4 border-destructive text-destructive px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Error:</span>
            <span className="text-sm">{errors[errors.length - 1]?.message}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Video */}
          <div className="flex-1 p-4">
            <Card className="h-full bg-muted/20">
              <CardContent className="h-full p-0">
                <VideoGrid participants={participantArray} localStream={localStream} className="h-full" />
              </CardContent>
            </Card>
          </div>

          {/* Bottom Toolbar */}
          <div className="p-4 bg-card border-t">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant={mediaState.audio ? 'secondary' : 'destructive'}
                size="lg"
                onClick={toggleAudio}
                disabled={!isConnected}
                className="h-12 w-12 rounded-full p-0"
              >
                {mediaState.audio ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={mediaState.video ? 'secondary' : 'destructive'}
                size="lg"
                onClick={toggleVideo}
                disabled={!isConnected}
                className="h-12 w-12 rounded-full p-0"
              >
                {mediaState.video ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleLeaveRoom}
                disabled={!isConnected}
                className="h-12 w-12 rounded-full p-0"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="lg" className="h-12 w-12 rounded-full p-0">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Participants Sidebar */}
        <div className="w-80 border-l bg-card/50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Participants</h3>
              <Badge variant="secondary" className="text-xs">
                {participantArray.length}
              </Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {participantArray.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {participant.isLocalUser ? 'You' : participant?.peerId?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {participant.isLocalUser ? 'You' : `User ${participant.peerId}`}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className={cn(
                            'w-3 h-3 rounded-full flex items-center justify-center',
                            participant.mediaState.audio ? 'bg-green-500' : 'bg-muted'
                          )}
                        >
                          {participant.mediaState.audio ? (
                            <Mic className="w-2 h-2 text-white" />
                          ) : (
                            <MicOff className="w-2 h-2 text-muted-foreground" />
                          )}
                        </div>
                        <div
                          className={cn(
                            'w-3 h-3 rounded-full flex items-center justify-center',
                            participant.mediaState.video ? 'bg-green-500' : 'bg-muted'
                          )}
                        >
                          {participant.mediaState.video ? (
                            <Video className="w-2 h-2 text-white" />
                          ) : (
                            <VideoOff className="w-2 h-2 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingRoom;
