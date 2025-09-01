/**
 * @fileoverview Streaming Sidebar Component
 *
 * Sidebar with Participants and Chat tabs
 */

import { Avatar, AvatarFallback } from '@musetrip360/ui-core/avatar';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@musetrip360/ui-core/tabs';
import { cn } from '@musetrip360/ui-core/utils';
import { Crown, Mic, MicOff, Plus, Target, User, Video, VideoOff } from 'lucide-react';
import React from 'react';
import type { Participant } from '@/types';
import { ChatContainer } from '../Chat';
import { useChatState } from '@/state/hooks';

interface StreamingSidebarProps {
  participants: Participant[];
  className?: string;
}

export const StreamingSidebar: React.FC<StreamingSidebarProps> = ({ participants, className }) => {
  const { unreadCount, markAsRead } = useChatState();

  // Handle tab change to mark messages as read when switching to chats
  const handleTabChange = (value: string) => {
    if (value === 'chats' && unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <div className={cn('w-80 border-l bg-gradient-to-b from-muted/30 to-background flex flex-col', className)}>
      <Tabs defaultValue="participants" className="flex-1 flex flex-col" onValueChange={handleTabChange}>
        <div className="p-4 pb-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="participants" className="text-xs">
              Participants
              <Badge variant="secondary" className="ml-2 text-xs h-4 px-1">
                {participants.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="chats" className="text-xs">
              Chats
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs h-4 px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Participants Tab */}
        <TabsContent value="participants" className="flex-1 flex flex-col p-4 pt-2 mt-0 h-[calc(100vh-160px)]">
          <div style={{ flex: '1 0 0' }} className="space-y-1 min-h-0 overflow-y-auto -mr-4 pr-4">
            {participants.map((participant) => {
              const userInfo = participant.participantInfo;
              const displayName = participant.isLocalUser
                ? 'You'
                : userInfo?.user
                  ? userInfo.user.fullName || userInfo.user.username
                  : 'Anonymous User';
              const userRole = userInfo?.role;
              const userAvatar = userInfo?.user?.avatarUrl;

              return (
                <div key={participant.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 group">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      {userAvatar && !participant.isLocalUser ? (
                        <img src={userAvatar} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback className="text-xs bg-muted">
                          {participant.isLocalUser
                            ? 'You'
                            : displayName === 'Anonymous User'
                              ? 'AU'
                              : displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          participant.mediaState.audio ? 'bg-green-500' : 'bg-red-500'
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{displayName}</p>

                      {userRole && (
                        <Badge
                          variant={userRole === 'TourGuide' ? 'default' : 'outline'}
                          className="text-xs h-5 px-2 py-0.5 flex items-center gap-1"
                        >
                          {userRole === 'TourGuide' ? (
                            <>
                              <Target className="w-3 h-3" />
                              Guide
                            </>
                          ) : userRole === 'Organizer' ? (
                            <>
                              <Crown className="w-3 h-3" />
                              Host
                            </>
                          ) : userRole === 'Attendee' ? (
                            <>
                              <User className="w-3 h-3" />
                              Guest
                            </>
                          ) : (
                            userRole
                          )}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {participant.mediaState.video ? 'Camera on' : 'Camera off'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                      className={cn(
                        'w-5 h-5 rounded flex items-center justify-center',
                        participant.mediaState.audio ? 'text-green-600' : 'text-muted-foreground'
                      )}
                    >
                      {participant.mediaState.audio ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                    </div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded flex items-center justify-center',
                        participant.mediaState.video ? 'text-green-600' : 'text-muted-foreground'
                      )}
                    >
                      {participant.mediaState.video ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chats" className="flex-1 pt-2 mt-0 h-[calc(100vh-160px)]">
          <ChatContainer className="h-full" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
