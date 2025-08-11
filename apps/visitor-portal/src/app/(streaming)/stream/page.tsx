'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { Hash, Plus, Users, Video } from 'lucide-react';
import { generateRoomId } from '@musetrip360/streaming/utils';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ScrollArea } from '@musetrip360/ui-core';
import Footer from '@/components/layout/Footter';

export default function StreamLobbyPage() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    router.push(`/stream/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/stream/room/${roomId.trim()}`);
    }
  };

  return (
    <ScrollArea className="h-screen *:data-[slot=scroll-area-viewport]:!pr-0">
      <Header />
      <main className="min-h-[calc(100vh-458px)]">
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
          <div className="container mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-primary rounded-2xl">
                  <Video className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-bold text-foreground">MuseTrip360 Streaming</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tham gia phiên stream trực tiếp để khám phá bảo tàng cùng nhau
              </p>
            </div>

            {/* Main Actions */}
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
              {/* Create Room */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground">Tạo phòng mới</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Bắt đầu một phiên stream mới và mời bạn bè tham gia
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={handleCreateRoom}
                    size="lg"
                    className="bg-chart-2 hover:bg-chart-2/80 text-primary-foreground px-8"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Tạo phòng ngay
                  </Button>
                </CardContent>
              </Card>

              {/* Join Room */}
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground">Tham gia phòng</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Nhập mã phòng để tham gia phiên stream có sẵn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Nhập mã phòng"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                      onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                    />
                  </div>
                  <Button
                    onClick={handleJoinRoom}
                    size="lg"
                    disabled={!roomId.trim()}
                    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Tham gia phòng
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground text-center mb-8">Tính năng streaming</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-chart-3 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Video className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Video HD</h3>
                  <p className="text-muted-foreground">Chất lượng video cao độ nét Full HD</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-chart-4 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Nhiều người</h3>
                  <p className="text-muted-foreground">Hỗ trợ nhiều người tham gia cùng lúc</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-chart-5 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Hash className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Chia sẻ dễ dàng</h3>
                  <p className="text-muted-foreground">Chia sẻ mã phòng để mời bạn bè</p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-12">
              <Link href="/" className="text-primary hover:text-primary/80 underline">
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </ScrollArea>
  );
}
