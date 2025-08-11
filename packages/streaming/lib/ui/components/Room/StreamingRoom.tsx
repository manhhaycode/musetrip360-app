/**
 * @fileoverview Streaming Room Component
 *
 * Complete room interface combining all streaming components
 */

import React from 'react';
import { Card } from '@musetrip360/ui-core/card';
import { cn } from '@musetrip360/ui-core/utils';
import { VideoGrid } from '../Video/VideoGrid';
import { MediaControls } from '../Controls/MediaControls';
import { RoomControls } from '../Controls/RoomControls';
import { useStreamingContext } from '@/contexts/StreamingContext';

interface StreamingRoomProps {
  className?: string;
}

export const StreamingRoom: React.FC<StreamingRoomProps> = ({ className }) => {
  const {
    // Room state
    roomState,
    participants,
    currentRoomId,

    // Media state
    mediaStream: { localStream, mediaState },

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
  const isInRoom = currentRoomId !== null;
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

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  if (!localStream) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-500">No local stream available</span>
      </div>
    );
  }

  if (!isInRoom || !currentRoomId) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-500">Not in a room</span>
      </div>
    );
  }

  return (
    <div className={cn('streaming-room w-full h-full flex flex-col gap-4', className)}>
      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-500')} />
          <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>

        {currentRoomId && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Room: <span className="font-mono">{currentRoomId}</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div
          id="errorMessage" // Matching reference ID
          className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
        >
          {errors[errors.length - 1]?.message}
        </div>
      )}

      <div className="flex-1 flex gap-4">
        {/* Main Video Area */}
        <div className="flex-1">
          <Card className="h-full p-4">
            {isInRoom ? (
              <VideoGrid participants={participantArray} localStream={localStream} className="h-full" />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-xl font-medium mb-2">Ready to stream</div>
                  <div className="text-sm">Join or create a room to start video calling</div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="w-80 space-y-4">
          {/* Room Controls */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Room</h3>
            <RoomControls
              currentRoomId={currentRoomId}
              onJoinRoom={handleJoinRoom}
              onCreateRoom={handleCreateRoom}
              onLeaveRoom={handleLeaveRoom}
              isConnecting={isConnecting}
            />
          </Card>

          {/* Media Controls - Only show when in room */}
          {isInRoom && (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Media</h3>
              <MediaControls
                mediaState={mediaState}
                onToggleVideo={toggleVideo}
                onToggleAudio={toggleAudio}
                onLeaveRoom={handleLeaveRoom}
                disabled={!isConnected}
              />
            </Card>
          )}

          {/* Participants List */}
          {isInRoom && participantArray.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Participants ({participantArray.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {participantArray.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn('w-2 h-2 rounded-full', participant.isLocalUser ? 'bg-blue-500' : 'bg-green-500')}
                      />
                      <span className="text-sm font-medium">
                        {participant.isLocalUser ? 'You' : `User ${participant.peerId}`}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <div
                        className={cn(
                          'w-4 h-4 rounded text-xs flex items-center justify-center',
                          participant.mediaState.video ? 'bg-green-500 text-white' : 'bg-gray-400'
                        )}
                      >
                        📹
                      </div>
                      <div
                        className={cn(
                          'w-4 h-4 rounded text-xs flex items-center justify-center',
                          participant.mediaState.audio ? 'bg-green-500 text-white' : 'bg-gray-400'
                        )}
                      >
                        🎤
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Room Metadata */}
          {isInRoom && roomState && (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Room Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="ml-2">{new Date(roomState.createdAt).toLocaleTimeString()}</span>
                </div>
                {roomState.metadata && Object.keys(roomState.metadata).length > 0 && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Metadata:</span>
                    <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                      {JSON.stringify(roomState.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingRoom;
