'use client';

import { useStreamingContext } from '@musetrip360/streaming/contexts';
import { StreamingRoom } from '@musetrip360/streaming/ui';

import { useVirtualTourById } from '@musetrip360/virtual-tour';
import { useRouter } from 'next/navigation';
import { Suspense, use, useEffect } from 'react';

const VirtualTourViewer = await import('@musetrip360/virtual-tour').then((mod) => mod.VirtualTourViewer);

interface StreamRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function StreamRoomPage({ params }: StreamRoomPageProps) {
  const { roomId } = use(params);
  const router = useRouter();
  const { isInRoom, currentRoomId } = useStreamingContext();
  const { data: virtualTour, isLoading } = useVirtualTourById('6821e06e-7195-4986-becc-ed571619d160');

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
      {isLoading || !virtualTour ? (
        <div className="flex items-center justify-center h-full text-primary">Loading...</div>
      ) : (
        <Suspense
          fallback={<div className="flex items-center justify-center h-full text-primary">Loading Virtual Tour...</div>}
        >
          <VirtualTourViewer virtualTour={virtualTour} />
        </Suspense>
      )}
    </StreamingRoom>
  );
}
