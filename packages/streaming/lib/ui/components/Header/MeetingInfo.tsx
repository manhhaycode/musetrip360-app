/**
 * @fileoverview Meeting Info Component
 *
 * Displays meeting information including title, date/time, room ID and connection status
 */

import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { cn } from '@musetrip360/ui-core/utils';
import { Calendar, Clock, Copy, Users, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MeetingInfoProps {
  meetingTitle?: string;
  meetingDate?: string;
  meetingTime?: string;
  currentRoomId?: string;
  isConnected: boolean;
  onCopyRoomId: () => void;
  duration?: number; // Duration in minutes since meeting started
  participantCount?: number;
  meetingType?: 'internal' | 'external' | 'presentation';
  className?: string;
}

export const MeetingInfo: React.FC<MeetingInfoProps> = ({
  meetingTitle = '[Internal] Weekly Report Marketing + Sales',
  meetingDate = 'June 21st, 2024',
  meetingTime = '11:00 AM',
  currentRoomId,
  isConnected,
  onCopyRoomId,
  duration = 0,
  participantCount = 0,
  meetingType = 'internal',
  className,
}) => {
  const [liveDuration, setLiveDuration] = useState(duration);

  // Update live duration every minute if connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setLiveDuration((prev) => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDateTime = () => {
    if (meetingDate && meetingTime) {
      return `${meetingDate} | ${meetingTime}`;
    }
    // Fallback to current date/time
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${date} | ${time}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getMeetingTypeConfig = (type: typeof meetingType) => {
    switch (type) {
      case 'internal':
        return { label: 'Internal', variant: 'secondary' as const, color: 'text-blue-600' };
      case 'external':
        return { label: 'External', variant: 'outline' as const, color: 'text-green-600' };
      case 'presentation':
        return { label: 'Presentation', variant: 'default' as const, color: 'text-purple-600' };
      default:
        return { label: 'Meeting', variant: 'secondary' as const, color: 'text-gray-600' };
    }
  };

  const meetingConfig = getMeetingTypeConfig(meetingType);

  return (
    <div className={cn('flex items-center gap-3 max-w-[320px]', className)}>
      {/* Meeting Icon & Status */}
      <div className="flex items-center gap-2 shrink-0">
        <Video className="h-5 w-5 text-primary" />
        <div
          className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-500 animate-pulse' : 'bg-destructive')}
          title={isConnected ? 'Connected' : 'Disconnected'}
        />
      </div>

      {/* Meeting Info */}
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-foreground truncate" title={meetingTitle}>
            {meetingTitle}
          </h1>
          <Badge variant={meetingConfig.variant} className="text-xs px-1.5 py-0.5 shrink-0">
            {meetingConfig.label}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDateTime()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(liveDuration)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participantCount}
          </span>
        </div>
        {/* Room ID */}
        {currentRoomId && (
          <div className="flex flex-1 items-center gap-1">
            <Badge variant="outline" className="font-mono text-xs h-6 flex-1" title={`Room ID: ${currentRoomId}`}>
              <span className="truncate">{currentRoomId}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyRoomId}
              className="h-6 w-6 p-0 flex-skrink-0"
              title="Copy Room ID"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
