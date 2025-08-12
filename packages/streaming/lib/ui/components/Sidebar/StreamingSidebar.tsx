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
import { Mic, MicOff, Plus, Users, Video, VideoOff } from 'lucide-react';
import React from 'react';
import type { Participant } from '@/types';

interface StreamingSidebarProps {
  participants: Participant[];
  onAddParticipant?: () => void;
  className?: string;
}

export const StreamingSidebar: React.FC<StreamingSidebarProps> = ({ participants, onAddParticipant, className }) => {
  return (
    <div className={cn('w-80 border-l bg-gradient-to-b from-muted/30 to-background flex flex-col', className)}>
      <Tabs defaultValue="participants" className="flex-1 flex flex-col">
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
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Participants Tab */}
        <TabsContent value="participants" className="flex-1 p-4 pt-2 mt-0">
          <div className="flex items-center justify-between mb-3">
            <Button variant="outline" size="sm" className="w-full h-8" onClick={onAddParticipant}>
              <Plus className="h-3 w-3 mr-1" />
              Add Participant
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-1">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/30 group">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-muted">
                        {participant.isLocalUser ? 'You' : participant?.peerId?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {participant.isLocalUser ? 'You' : `User ${participant.peerId}`}
                      </p>
                      {participant.isLocalUser && (
                        <Badge variant="outline" className="text-xs h-4 px-1">
                          You
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
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chats" className="flex-1 p-4 pt-2 mt-0">
          <div className="flex flex-col h-[calc(100vh-280px)]">
            {/* Chat Messages Area */}
            <div className="flex-1 mb-4">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {/* Placeholder for chat messages */}
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start a conversation</p>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type Something..."
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled
                />
              </div>
              <Button size="sm" className="px-3" disabled>
                <span className="text-xs">→</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StreamingSidebar;
