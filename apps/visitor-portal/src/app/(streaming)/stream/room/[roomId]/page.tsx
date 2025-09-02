'use client';

import { useGetEventById } from '@musetrip360/event-management';
import { useStreamingContext } from '@musetrip360/streaming/contexts';
import { StreamingRoom, TourModeSelector, SyncedVirtualTourViewer, TourMode } from '@musetrip360/streaming/ui';

import { IVirtualTour } from '@musetrip360/virtual-tour';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState, useCallback } from 'react';

interface StreamRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function StreamRoomPage({ params }: StreamRoomPageProps) {
  const { roomId } = use(params);
  const router = useRouter();
  const { isInRoom, currentRoomId, roomState, localParticipant, isTourReady, setTourReady } = useStreamingContext();

  // User's tour mode logic
  const userRole = localParticipant?.participantInfo?.role;
  const isTourGuide = userRole === 'TourGuide';

  // Tour guides always use free-explore mode (broadcasting)
  // Attendees can choose between modes
  const defaultMode: TourMode = isTourGuide ? 'free-explore' : 'follow-guide';
  const [userTourMode, setUserTourMode] = useState<TourMode>(defaultMode);

  // Only attendees can switch modes
  const canSwitchMode = Boolean(isInRoom && localParticipant && !isTourGuide && isTourReady);

  // Force tour guides to stay in free-explore mode
  const effectiveMode: TourMode = isTourGuide ? 'free-explore' : userTourMode;

  // Example logic: Tour guide can start tour when ready
  const handleStartTour = useCallback(() => {
    if (isTourGuide) {
      setTourReady(true);
      console.log('🎯 Tour Guide: Starting tour for all participants');
    }
  }, [isTourGuide, setTourReady]);
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
                virtualTourProps={{ isStreaming: true }}
                mode={effectiveMode}
                virtualTour={event.tourOnlines[0] as IVirtualTour}
                onModeChange={setUserTourMode}
                allowModeSwitch={false} // Disabled - using separate component
                loadingMessage={
                  effectiveMode === 'follow-guide'
                    ? 'Đang đợi hướng dẫn viên bắt đầu tour...'
                    : isTourGuide
                      ? 'Hướng dẫn viên đang chuẩn bị tour...'
                      : undefined
                }
              />

              {/* Tour Guide Control Panel - demo centralized tour control */}
              {isTourGuide && !isTourReady && (
                <div className="absolute top-4 left-4 z-50 bg-blue-600 text-white rounded-lg px-4 py-3">
                  <div className="text-sm font-medium mb-2">Bảng điều khiển hướng dẫn viên</div>
                  <button
                    onClick={handleStartTour}
                    className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    🎯 Bắt đầu tour cho tất cả
                  </button>
                  <div className="text-xs mt-1 opacity-80">Kiểm soát tour tập trung</div>
                </div>
              )}

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
