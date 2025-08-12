'use client';

import React, { use, useEffect } from 'react';
import { StreamingRoom } from '@musetrip360/streaming/ui';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Button } from '@musetrip360/ui-core/button';
import { ArrowLeft, Copy, Users } from 'lucide-react';
import Link from 'next/link';
import { useStreamingContext } from '@musetrip360/streaming/contexts';

interface StreamRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function StreamRoomPage({ params }: StreamRoomPageProps) {
  const { roomId } = use(params);
  const { joinRoom } = useStreamingContext();

  useEffect(() => {
    joinRoom(roomId);
  }, [roomId]);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/stream">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Phòng: {roomId}</h1>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyRoomId}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Copy className="h-4 w-4 mr-2" />
            Sao chép mã phòng
          </Button>
        </div>

        {/* Streaming Room */}
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <StreamingRoom />
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Chia sẻ mã phòng <span className="font-mono bg-muted px-2 py-1 rounded text-primary">{roomId}</span> để mời
            bạn bè tham gia
          </p>
        </div>
      </div>
    </div>
  );
}
