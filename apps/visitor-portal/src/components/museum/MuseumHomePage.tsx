import { useState } from 'react';
import { useGetMuseumById } from '@musetrip360/museum-management';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@musetrip360/ui-core/tabs';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { AlertCircle } from 'lucide-react';
import { cn } from '@musetrip360/ui-core/utils';
import { MuseumIntroTab } from './MuseumIntroTab';
import { MuseumArtifactsTab } from './MuseumArtifactsTab';
import { MuseumEventsTab } from './MuseumEventsTab';
import { MuseumFeedbackTab } from './MuseumFeedbackTab';

interface MuseumHomePageProps {
  museumId: string;
  className?: string;
}

export function MuseumHomePage({ museumId, className }: MuseumHomePageProps) {
  const [activeTab, setActiveTab] = useState('intro');

  const { data: museum, isLoading, error } = useGetMuseumById(museumId);

  if (isLoading) {
    return (
      <div className={cn('container mx-auto px-4 py-8', className)}>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton className="w-full h-64 rounded-lg bg-accent/20" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4 bg-accent/20" />
                  <Skeleton className="h-6 w-1/2 bg-accent/20" />
                  <Skeleton className="h-4 w-full bg-accent/20" />
                  <Skeleton className="h-4 w-full bg-accent/20" />
                  <Skeleton className="h-4 w-2/3 bg-accent/20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 bg-accent/20" />
                    <Skeleton className="h-10 w-24 bg-accent/20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full bg-accent/20" />
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4 bg-accent/20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-accent/20" />
                  <Skeleton className="h-4 w-full bg-accent/20" />
                  <Skeleton className="h-4 w-3/4 bg-accent/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className={cn('container mx-auto px-4 py-8', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Không thể tải thông tin bảo tàng. Vui lòng thử lại sau.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      <div className="space-y-6">
        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="intro" className="text-sm">
              Giới thiệu
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="text-sm">
              Hiện vật
            </TabsTrigger>
            <TabsTrigger value="events" className="text-sm">
              Sự kiện
            </TabsTrigger>
            <TabsTrigger value="tours" className="text-sm">
              Tour ảo
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-sm">
              Đánh giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intro" className="mt-6">
            <MuseumIntroTab museum={museum} />
          </TabsContent>

          <TabsContent value="artifacts" className="mt-6">
            <MuseumArtifactsTab museumId={museumId} />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <MuseumEventsTab museumId={museumId} />
          </TabsContent>

          <TabsContent value="tours" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">Tour ảo</h3>
                  <p className="text-muted-foreground">Tour ảo 3D sẽ được hiển thị ở đây</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="mt-6">
            <MuseumFeedbackTab museumId={museumId} museumName={museum.name} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
