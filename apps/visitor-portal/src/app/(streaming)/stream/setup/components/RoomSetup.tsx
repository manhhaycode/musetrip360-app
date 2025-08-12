'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
  Avatar,
  AvatarFallback,
} from '@musetrip360/ui-core';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Users,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStreamingContext } from '@musetrip360/streaming/contexts';
import { ConnectionState } from '@musetrip360/streaming/types';
import { useCurrentProfile } from '@musetrip360/user-management/api';

interface RoomSetupProps {
  roomId: string;
}

interface SetupStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  error?: string;
}

export default function RoomSetup({ roomId }: RoomSetupProps) {
  const router = useRouter();
  const { data: userProfile } = useCurrentProfile();
  const { signalR, mediaStream, joinRoom, toggleVideo, toggleAudio } = useStreamingContext();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    { id: 'signalr', label: 'Đang kết nối đến server', status: 'pending' },
    { id: 'media', label: 'Đang thiết lập camera & microphone', status: 'pending' },
    { id: 'ready', label: 'Sẵn sàng tham gia', status: 'pending' },
  ]);

  const [isJoining, setIsJoining] = useState(false);

  const updateStepStatus = useCallback((stepId: string, status: SetupStep['status'], error?: string) => {
    setSetupSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, error } : step)));
  }, []);

  // Monitor SignalR connection
  useEffect(() => {
    const checkSignalRConnection = () => {
      if (signalR.connectionState === ConnectionState.Connected) {
        updateStepStatus('signalr', 'success');
      } else if (signalR.connectionState === ConnectionState.Connecting) {
        updateStepStatus('signalr', 'loading');
      } else if (signalR.connectionState === ConnectionState.Failed) {
        updateStepStatus('signalr', 'error', 'Không thể kết nối đến server');
      }
    };

    checkSignalRConnection();
  }, [signalR.connectionState, updateStepStatus]);

  // Monitor media stream
  useEffect(() => {
    const checkMediaStream = () => {
      if (mediaStream.isInitialized && mediaStream.localStream) {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream.localStream;
        }
        updateStepStatus('media', 'success');
      } else if (mediaStream.isInitializingMedia) {
        updateStepStatus('media', 'loading');
      } else {
        // Try to initialize media if not already doing so
        if (!mediaStream.isInitializingMedia) {
          updateStepStatus('media', 'loading');
          mediaStream.initializeMedia().catch((error) => {
            updateStepStatus(
              'media',
              'error',
              error.name === 'NotAllowedError'
                ? 'Vui lòng cho phép truy cập camera và microphone'
                : 'Không thể thiết lập camera/microphone'
            );
          });
        }
      }
    };

    checkMediaStream();
  }, [mediaStream.isInitialized, mediaStream.isInitializingMedia, mediaStream.localStream, updateStepStatus]);

  // Check if ready - direct check without refs to fix timing issues
  useEffect(() => {
    const signalrStep = setupSteps.find((s) => s.id === 'signalr');
    const mediaStep = setupSteps.find((s) => s.id === 'media');
    const readyStep = setupSteps.find((s) => s.id === 'ready');

    const signalrReady = signalrStep?.status === 'success';
    const mediaReady = mediaStep?.status === 'success';

    if (signalrReady && mediaReady && readyStep?.status !== 'success') {
      updateStepStatus('ready', 'success');
    }
  }, [setupSteps, updateStepStatus]);

  const handleJoinRoom = async () => {
    if (isJoining) return;

    setIsJoining(true);
    try {
      await joinRoom(roomId);
      router.push(`/stream/room/${roomId}`);
    } catch (error) {
      console.error('Failed to join room:', error);
      setIsJoining(false);
    }
    // TODO: Show error message to user
  };

  const isReadyToJoin = setupSteps.find((s) => s.id === 'ready')?.status === 'success';

  const renderStepIcon = (step: SetupStep) => {
    switch (step.status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const userName = userProfile?.fullName || userProfile?.email || 'Anonymous User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8">
          {/* Camera Preview */}
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Camera Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Preview */}
              <div className="aspect-video bg-accent/20 rounded-lg overflow-hidden relative">
                {mediaStream.localStream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted={mediaStream.mediaState.audio}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Đang thiết lập camera...</p>
                    </div>
                  </div>
                )}

                {/* User Info Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 rounded-lg px-3 py-2 text-white">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userName} (Bạn)</span>
                </div>
              </div>

              {/* Media Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={mediaStream.mediaState.audio ? 'default' : 'destructive'}
                  size="lg"
                  className="rounded-full h-14 w-14 p-0"
                  onClick={toggleAudio}
                  disabled={!mediaStream.localStream}
                >
                  {mediaStream.mediaState.audio ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </Button>

                <Button
                  variant={mediaStream.mediaState.video ? 'default' : 'destructive'}
                  size="lg"
                  className="rounded-full h-14 w-14 p-0"
                  onClick={toggleVideo}
                  disabled={!mediaStream.localStream}
                >
                  {mediaStream.mediaState.video ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </Button>

                <Button variant="outline" size="lg" className="rounded-full h-14 w-14 p-0" disabled>
                  <Settings className="h-6 w-6" />
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {mediaStream.mediaState.audio && mediaStream.mediaState.video && 'Camera và microphone hoạt động tốt'}
                  {!mediaStream.mediaState.audio && mediaStream.mediaState.video && 'Microphone đang tắt'}
                  {mediaStream.mediaState.audio && !mediaStream.mediaState.video && 'Camera đang tắt'}
                  {!mediaStream.mediaState.audio && !mediaStream.mediaState.video && 'Camera và microphone đang tắt'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Room Info & Setup Status */}
          <div className="space-y-6">
            {/* Room Info */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sắp tham gia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Room ID</p>
                    <p className="font-mono text-lg font-semibold">{roomId}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Tham gia với tư cách</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{userName}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Setup Status */}
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Trạng thái thiết lập</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {setupSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      {renderStepIcon(step)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.label}</p>
                        {step.error && <p className="text-xs text-destructive mt-1">{step.error}</p>}
                      </div>
                      {step.status === 'success' && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Hoàn thành
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Join Button */}
            <Button
              onClick={handleJoinRoom}
              disabled={!isReadyToJoin || isJoining}
              size="lg"
              className="w-full h-14 text-lg"
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang tham gia...
                </>
              ) : (
                <>
                  Tham gia ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {!isReadyToJoin && (
              <p className="text-center text-sm text-muted-foreground">Vui lòng đợi quá trình thiết lập hoàn tất</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
