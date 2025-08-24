'use client';

import { useGetEventById } from '@musetrip360/event-management';
import { useStreamingContext } from '@musetrip360/streaming/contexts';
import { StreamingRoom } from '@musetrip360/streaming/ui';

import { IVirtualTour } from '@musetrip360/virtual-tour';
import { useRouter } from 'next/navigation';
import { Suspense, use, useEffect } from 'react';

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
      {isLoading || !event?.tourOnlines ? (
        <div className="flex items-center justify-center h-full text-primary">Loading...</div>
      ) : (
        <Suspense
          fallback={<div className="flex items-center justify-center h-full text-primary">Loading Virtual Tour...</div>}
        >
          <SyncedVirtualTourViewer
            mode={localParticipant?.participantInfo?.role === 'TourGuide' ? 'guide' : 'attendee'}
            virtualTour={event.tourOnlines[0] as IVirtualTour}
          />
        </Suspense>
      )}
    </StreamingRoom>
  );
}
