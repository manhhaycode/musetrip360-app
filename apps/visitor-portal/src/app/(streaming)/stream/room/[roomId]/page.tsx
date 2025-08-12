'use client';

import { useStreamingContext } from '@musetrip360/streaming/contexts';
import { StreamingRoom } from '@musetrip360/streaming/ui';

import { useVirtualTourById, VirtualTourViewer } from '@musetrip360/virtual-tour';
import { use, useEffect } from 'react';

interface StreamRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function StreamRoomPage({ params }: StreamRoomPageProps) {
  const { roomId } = use(params);
  const { joinRoom } = useStreamingContext();
  const { data: virtualTour, isLoading } = useVirtualTourById('6821e06e-7195-4986-becc-ed571619d160');

  useEffect(() => {
    joinRoom(roomId);
  }, [roomId]);

  return (
    <StreamingRoom>
      {isLoading || !virtualTour ? (
        <div className="flex items-center justify-center h-full text-primary">Loading...</div>
      ) : (
        <VirtualTourViewer virtualTour={virtualTour} />
      )}
    </StreamingRoom>
  );
}
