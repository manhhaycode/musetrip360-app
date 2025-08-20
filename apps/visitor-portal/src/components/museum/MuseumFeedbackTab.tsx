'use client';

import { useState } from 'react';
import { FeedbackList, FeedbackForm } from '../feedback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@musetrip360/ui-core/tabs';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { MessageSquare, PenTool } from 'lucide-react';

interface MuseumFeedbackTabProps {
  museumId: string;
  museumName?: string;
}

export function MuseumFeedbackTab({ museumId, museumName }: MuseumFeedbackTabProps) {
  const [activeTab, setActiveTab] = useState('view');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFeedbackSuccess = () => {
    // Switch to view tab and refresh feedback list
    setActiveTab('view');
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Xem đánh giá
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Viết đánh giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="mt-6">
            <FeedbackList key={refreshKey} targetId={museumId} targetType="museum" />
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <FeedbackForm
              targetId={museumId}
              targetType="museum"
              targetName={museumName}
              onSuccess={handleFeedbackSuccess}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
