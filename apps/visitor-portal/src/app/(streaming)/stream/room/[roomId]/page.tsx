'use client';

import { useGetEventById } from '@musetrip360/event-management';
import { useStreamingContext } from '@musetrip360/streaming/contexts';
import { StreamingRoom } from '@musetrip360/streaming/ui';

import { IVirtualTour } from '@musetrip360/virtual-tour';
import { useRouter } from 'next/navigation';
import React, { use, useEffect } from 'react';

const SyncedVirtualTourViewer = await import('@musetrip360/streaming/ui').then((mod) => mod.SyncedVirtualTourViewer);

interface StreamRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function StreamRoomPage({ params }: StreamRoomPageProps) {
  const { roomId } = use(params);
  const router = useRouter();
  const { isInRoom, currentRoomId, roomState, localParticipant } = useStreamingContext();
  const { data: event, isLoading } = useGetEventById(roomState?.EventId!, {
    enabled: !!roomState?.EventId,
  });

  // Redirect to setup if not in room or wrong room
  useEffect(() => {
    console.log('Checking room status...');
    console.log(`isInRoom: ${isInRoom}, currentRoomId: ${currentRoomId}, roomId: ${roomId}`);
    if (!isInRoom || currentRoomId !== roomId) {
      router.replace(`/stream/setup/${roomId}`);
    }
  }, [isInRoom, currentRoomId, roomId]);

  return (
    <StreamingRoom>
      {isLoading || !event?.tourOnlines || !localParticipant?.participantInfo?.role ? (
        <div className="flex items-center justify-center h-full text-primary">Loading...</div>
      ) : (
        <div className="absolute inset-0 border overflow-hidden bg-gray-100">
          <React.Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            }
          >
            <SyncedVirtualTourViewer
              mode={localParticipant?.participantInfo?.role === 'TourGuide' ? 'guide' : 'attendee'}
              virtualTour={event.tourOnlines[0] as IVirtualTour}
            />
          </React.Suspense>
        </div>
      )}
    </StreamingRoom>
  );
}
