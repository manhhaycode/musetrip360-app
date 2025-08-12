/**
 * @fileoverview Room Controls Component
 *
 * Controls for joining, creating, and managing rooms
 */

import React, { useState } from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { cn } from '@musetrip360/ui-core/utils';
import { RoomControlsProps } from '@/types';
import { generateRoomId } from '@/utils/webrtc';

export const RoomControls: React.FC<RoomControlsProps> = ({
  currentRoomId,
  onJoinRoom,
  onCreateRoom,
  onLeaveRoom,
  isConnecting = false,
  className,
}) => {
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = async () => {
    const trimmedRoomId = roomId.trim();
    if (!trimmedRoomId) {
      // Show error - could be enhanced with proper error handling
      console.error('Please enter a room ID');
      return;
    }

    await onJoinRoom(trimmedRoomId);
  };

  const handleCreateRoom = async () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    await onCreateRoom();
  };

  const handleLeaveRoom = async () => {
    await onLeaveRoom();
    setRoomId('');
  };

  // If already in a room, show different UI
  if (currentRoomId) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Room</div>
          <div className="font-mono text-lg font-medium bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded border">
            {currentRoomId}
          </div>
        </div>

        <Button variant="destructive" onClick={handleLeaveRoom} disabled={isConnecting} className="w-full">
          Leave Room
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Room ID Input */}
      <div className="space-y-2">
        <label htmlFor="roomId" className="text-sm font-medium">
          Room ID
        </label>
        <Input
          id="roomId" // Matching reference ID
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          disabled={isConnecting}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isConnecting && roomId.trim()) {
              handleJoinRoom();
            }
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          id="joinRoomBtn" // Matching reference ID
          onClick={handleJoinRoom}
          disabled={isConnecting || !roomId.trim()}
          className="flex-1"
        >
          {isConnecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Joining...
            </>
          ) : (
            'Join Room'
          )}
        </Button>

        <Button variant="outline" onClick={handleCreateRoom} disabled={isConnecting} className="flex-1">
          Create Room
        </Button>
      </div>

      {/* Helper text */}
      <div className="text-xs text-gray-500 text-center">Create a new room or enter an existing room ID to join</div>
    </div>
  );
};
