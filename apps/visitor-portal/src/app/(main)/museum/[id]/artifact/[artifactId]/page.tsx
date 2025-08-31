'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useArtifact } from '@musetrip360/artifact-management/api';
import { useGetMuseumById } from '@musetrip360/museum-management/api';
import { ArtifactDetailPage } from '@/components/artifact';
import { Card } from '@musetrip360/ui-core/card';
import { CardContent } from '@musetrip360/ui-core/card';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { AlertTriangle } from 'lucide-react';

interface ArtifactPageProps {
  params: Promise<{
    id: string; // museumId
    artifactId: string;
  }>;
}

export default function ArtifactPage({ params }: ArtifactPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const {
    data: artifactResponse,
    isLoading: artifactLoading,
    error: artifactError,
  } = useArtifact(resolvedParams.artifactId);
  const artifact = artifactResponse?.data;
  const { data: museum, isLoading: museumLoading } = useGetMuseumById(resolvedParams.id, {
    enabled: !!resolvedParams.id,
  });

  const handleBack = () => {
    router.push(`/museum/${resolvedParams.id}`);
  };

  // Loading state
  if (artifactLoading || museumLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header Skeleton */}
        <div className="border-b bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <span className="text-muted-foreground">/</span>
                <Skeleton className="h-4 w-24" />
                <span className="text-muted-foreground">/</span>
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column Skeleton */}
            <div className="space-y-6">
              <Card className="overflow-hidden shadow-xl border-0">
                <CardContent className="p-0">
                  <Skeleton className="w-full aspect-[4/3]" />
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-3/4" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <Skeleton className="h-8 w-32 mb-6" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (artifactError || !artifact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="shadow-xl border-0 max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy hiện vật</h1>
              <p className="text-gray-600">Hiện vật bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  return (
    <ArtifactDetailPage
      artifact={artifact}
      museumId={resolvedParams.id}
      museumName={museum?.name || 'Bảo tàng'}
      onBack={handleBack}
    />
  );
}
