'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { ArrowLeft, Star, Eye, MapPin, Clock, Hammer, Play, Volume2, ExternalLink, X, Pause } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { Badge } from '@musetrip360/ui-core/badge';
import { AspectRatio } from '@musetrip360/ui-core/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@musetrip360/ui-core/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@musetrip360/ui-core/breadcrumb';
import { Artifact } from '@musetrip360/artifact-management/';
import { cn } from '@musetrip360/ui-core/utils';
import { GLTFViewer } from '@musetrip360/virtual-tour/canvas';

interface ArtifactDetailPageProps {
  artifact: Artifact;
  museumId: string;
  museumName: string;
  onBack?: () => void;
}

export function ArtifactDetailPage({ artifact, museumId, museumName, onBack }: ArtifactDetailPageProps) {
  const [isPreview3D, setIsPreview3D] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingVoiceAI, setIsPlayingVoiceAI] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const voiceAIRef = useRef<HTMLAudioElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getArtifactTypeIcon = (type: string) => {
    const icons = {
      Sculpture: '🗿',
      Painting: '🎨',
      Pottery: '🏺',
      Jewelry: '💍',
      Tool: '🔨',
      Weapon: '⚔️',
      Textile: '🧵',
    };
    return icons[type as keyof typeof icons] || '📜';
  };

  const handleAudioPlay = () => {
    if (!audioRef.current) return;

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      // Pause other audio if playing
      if (isPlayingVoiceAI && voiceAIRef.current) {
        voiceAIRef.current.pause();
        setIsPlayingVoiceAI(false);
      }

      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleVoiceAIPlay = () => {
    if (!voiceAIRef.current) return;

    if (isPlayingVoiceAI) {
      voiceAIRef.current.pause();
      setIsPlayingVoiceAI(false);
    } else {
      // Pause other audio if playing
      if (isPlayingAudio && audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }

      voiceAIRef.current.play();
      setIsPlayingVoiceAI(true);
    }
  };

  // Prepare image gallery - main image + additional images from metadata
  const allImages = [
    { url: artifact.imageUrl, alt: artifact.name, isMain: true },
    ...(artifact.metadata?.images?.map((img, index) => ({
      url: img.file as string,
      alt: `${artifact.name} - Ảnh ${index + 2}`,
      isMain: false,
    })) || []),
  ].filter((img) => img.url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/10">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                      Trang chủ
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/museum/${museumId}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {museumName}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium line-clamp-1">{artifact.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Button variant="ghost" size="sm" onClick={onBack} className="transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Image Gallery & 3D Model */}
          <div className="lg:col-span-2 space-y-4">
            {/* Exploratory Image Gallery */}
            <div className="space-y-4">
              {/* Main Featured Image */}
              <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-border/30">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer relative">
                      <AspectRatio
                        ratio={16 / 10}
                        className="bg-gradient-to-br from-muted via-muted/50 to-secondary/20"
                      >
                        <Image
                          src={allImages[0]?.url || artifact.imageUrl}
                          alt={allImages[0]?.alt || artifact.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110"
                          priority
                        />
                        {/* Overlay Effects */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        {/* Discovery Elements */}
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                          <div className="flex gap-2">
                            <Badge className="bg-black/80 text-white border-white/20 backdrop-blur-sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Chi tiết
                            </Badge>
                            <Badge className="bg-primary/90 text-white border-primary/30 backdrop-blur-sm animate-pulse">
                              Khám phá
                            </Badge>
                          </div>
                        </div>

                        {/* Bottom Info Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-all duration-500">
                          <div className="flex items-end justify-between">
                            <div className="text-white">
                              <p className="text-sm opacity-80">Hình ảnh chính</p>
                              <p className="text-lg font-bold">{artifact.name}</p>
                            </div>
                            {allImages.length > 1 && (
                              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                +{allImages.length - 1} ảnh khác
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AspectRatio>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl">
                    <DialogTitle className="sr-only">{allImages[0]?.alt || artifact.name}</DialogTitle>
                    <div className="relative w-full h-[80vh]">
                      <Image
                        src={allImages[0]?.url || artifact.imageUrl}
                        alt={allImages[0]?.alt || artifact.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Thumbnail Gallery Grid */}
              {allImages.length > 1 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-gradient-to-r from-primary/50 via-accent/30 to-transparent flex-1" />
                    <Badge variant="outline" className="text-sm font-medium px-3 py-1">
                      <Eye className="h-3 w-3 mr-2" />
                      Góc nhìn khác
                    </Badge>
                    <div className="h-px bg-gradient-to-l from-primary/50 via-accent/30 to-transparent flex-1" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allImages.slice(1).map((image, index) => (
                      <Dialog key={index + 1}>
                        <DialogTrigger asChild>
                          <div className="group cursor-pointer relative overflow-hidden rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                            <AspectRatio ratio={4 / 3} className="bg-muted/30">
                              <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-110"
                              />
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                              {/* Index Number */}
                              <div className="absolute top-2 left-2 w-6 h-6 bg-black/70 text-white text-xs font-bold rounded-full flex items-center justify-center backdrop-blur-sm">
                                {index + 2}
                              </div>

                              {/* Zoom Icon */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                  <Eye className="h-5 w-5 text-primary" />
                                </div>
                              </div>

                              {/* Discovery Sparkle Effect */}
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                                <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                              </div>
                            </AspectRatio>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl">
                          <DialogTitle className="sr-only">{image.alt}</DialogTitle>
                          <div className="relative w-full h-[80vh]">
                            <Image src={image.url} alt={image.alt} fill className="object-contain" />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}

                    {/* Discover More Placeholder */}
                    {allImages.length < 6 && (
                      <div className="group cursor-pointer relative overflow-hidden rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-muted/30 to-secondary/20">
                        <AspectRatio ratio={4 / 3} className="flex items-center justify-center">
                          <div className="text-center text-muted-foreground group-hover:text-primary transition-colors duration-300">
                            <div className="w-8 h-8 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14m7-7H5" />
                              </svg>
                            </div>
                            <p className="text-xs font-medium">Thêm ảnh</p>
                          </div>
                        </AspectRatio>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3D Model & Audio Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 3D Model Button */}
              {artifact.model3DUrl && (
                <Button size="lg" className="h-16 text-base font-medium" onClick={() => setIsPreview3D(true)}>
                  <ExternalLink className="h-5 w-5 mr-3" />
                  Xem mô hình 3D
                </Button>
              )}

              {/* Audio Controls */}
              {(artifact.metadata?.audio || artifact.metadata?.voiceAI) && (
                <div className="flex gap-2">
                  {artifact.metadata?.audio && (
                    <Button variant="outline" size="lg" className="flex-1 h-16" onClick={handleAudioPlay}>
                      {isPlayingAudio ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                      {isPlayingAudio ? 'Tạm dừng' : 'Audio'}
                    </Button>
                  )}
                  {artifact.metadata?.voiceAI && (
                    <Button variant="outline" size="lg" className="flex-1 h-16" onClick={handleVoiceAIPlay}>
                      {isPlayingVoiceAI ? <Pause className="h-5 w-5 mr-2" /> : <Volume2 className="h-5 w-5 mr-2" />}
                      {isPlayingVoiceAI ? 'Tạm dừng' : 'AI Voice'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sophisticated Info Panel */}
          <div className="lg:col-span-3 space-y-0">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 rounded-t-2xl border border-border/50 shadow-2xl">
              {/* Title & Status */}
              <div className="mb-6">
                <h1 className="text-6xl font-bold leading-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {artifact.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-7 w-7 text-accent fill-accent" />
                    <span className="text-3xl font-bold text-foreground">{artifact.rating.toFixed(1)}</span>
                    <span className="text-xl text-muted-foreground">/5</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-card/80 border border-border/30">
                    <div
                      className={cn(
                        'h-4 w-4 rounded-full',
                        artifact.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                      )}
                    />
                    <span
                      className={cn('text-base font-semibold', artifact.isActive ? 'text-green-600' : 'text-red-600')}
                    >
                      {artifact.isActive ? 'Đang trưng bày' : 'Không trưng bày'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata Showcase */}
              <div className="flex flex-wrap gap-6 mb-6">
                {artifact.metadata?.type && (
                  <div className="flex items-center gap-4 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-50 via-amber-100 to-orange-50 border border-amber-200/50 shadow-lg">
                    <span className="text-3xl">{getArtifactTypeIcon(artifact.metadata.type)}</span>
                    <div>
                      <p className="text-sm text-amber-600 font-medium uppercase tracking-wide">Loại hiện vật</p>
                      <p className="text-xl font-bold text-amber-800">{artifact.metadata.type}</p>
                    </div>
                  </div>
                )}
                {artifact.metadata?.material && (
                  <div className="flex items-center gap-4 px-8 py-4 rounded-xl bg-gradient-to-r from-slate-50 via-slate-100 to-gray-50 border border-slate-200/50 shadow-lg">
                    <Hammer className="h-7 w-7 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium uppercase tracking-wide">Chất liệu</p>
                      <p className="text-xl font-bold text-slate-800">{artifact.metadata.material}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Elegant Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Historical Period */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Thời kỳ lịch sử</h3>
                  </div>
                  <p className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary/20 to-accent/20 px-6 py-4 rounded-lg border border-border/30">
                    {artifact.historicalPeriod}
                  </p>
                </div>

                {/* Discovery Location */}
                {artifact.metadata?.discoveryLocation && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Nơi phát hiện</h3>
                    </div>
                    <p className="text-3xl font-bold text-foreground bg-gradient-to-r from-accent/20 to-primary/20 px-6 py-4 rounded-lg border border-border/30">
                      {artifact.metadata.discoveryLocation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-gradient-to-br from-card via-muted/10 to-secondary/10 p-6 border-x border-border/50 shadow-xl">
              <h3 className="text-3xl font-bold text-foreground mb-5 flex items-center gap-4">
                <div className="h-10 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
                Mô tả
              </h3>
              <p className="text-xl text-foreground/90 leading-relaxed italic">{artifact.description}</p>

              <div className="mt-6 pt-6 border-t border-border/30">
                <p className="text-base text-muted-foreground">
                  <span className="font-medium">Cập nhật lần cuối:</span> {formatDate(artifact.updatedAt)}
                </p>
              </div>
            </div>

            {/* Rich Description Section */}
            {artifact.metadata?.richDescription && (
              <div className="bg-gradient-to-br from-card to-primary/5 p-6 rounded-b-2xl border border-border/50 shadow-2xl">
                <h2 className="text-4xl font-bold text-foreground mb-6 flex items-center gap-4">
                  <div className="h-12 w-2 bg-gradient-to-b from-accent to-primary rounded-full" />
                  Chi tiết
                </h2>
                <div
                  className="prose prose-2xl max-w-none text-foreground/90 leading-relaxed [&>h1]:text-foreground [&>h2]:text-foreground [&>h3]:text-foreground [&>h4]:text-foreground [&>h5]:text-foreground [&>h6]:text-foreground [&>p]:text-foreground/90 [&>li]:text-foreground/90 [&>strong]:text-primary [&>em]:text-accent"
                  dangerouslySetInnerHTML={{ __html: artifact.metadata.richDescription }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Audio Elements */}
      {artifact.metadata?.audio && (
        <audio
          ref={audioRef}
          src={artifact.metadata.audio.file as string}
          onEnded={() => setIsPlayingAudio(false)}
          onPause={() => setIsPlayingAudio(false)}
          onPlay={() => setIsPlayingAudio(true)}
          preload="metadata"
        />
      )}

      {artifact.metadata?.voiceAI && (
        <audio
          ref={voiceAIRef}
          src={artifact.metadata.voiceAI.file as string}
          onEnded={() => setIsPlayingVoiceAI(false)}
          onPause={() => setIsPlayingVoiceAI(false)}
          onPlay={() => setIsPlayingVoiceAI(true)}
          preload="metadata"
        />
      )}

      {/* 3D Model Preview Modal */}
      {isPreview3D && artifact.model3DUrl && (
        <div className="fixed inset-0 z-50 bg-black">
          <Button
            onClick={() => setIsPreview3D(false)}
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 z-50 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:text-white transition-all duration-200 group p-2 h-auto w-auto"
            aria-label="Đóng"
          >
            <X className="size-10 group-hover:scale-110 transition-transform" />
          </Button>

          {/* 3D Model Viewer */}
          <div className="absolute inset-0">
            <GLTFViewer
              modelUrl={artifact.model3DUrl}
              autoRotate={false}
              environmentPreset="studio"
              showShadows={true}
              cameraPosition={[50, 0, 50]}
              animations={{ autoPlay: true, loop: true }}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
