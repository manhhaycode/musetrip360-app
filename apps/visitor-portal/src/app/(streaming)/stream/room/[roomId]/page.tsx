'use client';

import { useGetEventById } from '@musetrip360/event-management';
import { useStreamingContext } from '@musetrip360/streaming/contexts';
import { StreamingRoom, TourModeSelector } from '@musetrip360/streaming/ui';

import { IVirtualTour } from '@musetrip360/virtual-tour';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';

const SyncedVirtualTourViewer = await import('@musetrip360/streaming/ui').then((mod) => mod.SyncedVirtualTourViewer);
type TourMode = 'free-explore' | 'follow-guide';

interface StreamRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function StreamRoomPage({ params }: StreamRoomPageProps) {
  const { roomId } = use(params);
  const router = useRouter();
  const { isInRoom, currentRoomId, roomState, localParticipant } = useStreamingContext();

  // User's tour mode logic
  const userRole = localParticipant?.participantInfo?.role;
  const isTourGuide = userRole === 'TourGuide';

  // Tour guides always use free-explore mode (broadcasting)
  // Attendees can choose between modes
  const defaultMode: TourMode = isTourGuide ? 'free-explore' : 'follow-guide';
  const [userTourMode, setUserTourMode] = useState<TourMode>(defaultMode);

  // Only attendees can switch modes
  const canSwitchMode = Boolean(isInRoom && localParticipant && !isTourGuide);

  // Force tour guides to stay in free-explore mode
  const effectiveMode: TourMode = isTourGuide ? 'free-explore' : userTourMode;
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
            <div className="relative h-full">
              <SyncedVirtualTourViewer
                mode={effectiveMode}
                virtualTour={event.tourOnlines[0] as IVirtualTour}
                onModeChange={setUserTourMode}
                allowModeSwitch={false} // Disabled - using separate component
              />

              {/* Tour Mode Selector - only show for attendees, positioned bottom-right */}
              {!isTourGuide && canSwitchMode && (
                <div className="absolute bottom-4 right-4 z-50">
                  <TourModeSelector
                    currentMode={userTourMode}
                    onModeChange={setUserTourMode}
                    disabled={false}
                    userRole={userRole || null}
                    isConnected={isInRoom}
                  />
                </div>
              )}
            </div>
          </React.Suspense>
        </div>
      )}
    </StreamingRoom>
  );
}
