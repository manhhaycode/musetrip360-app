import withPermission from '@/hocs/withPermission';
import { EventBasicInfoForm } from '@musetrip360/event-management';
import { useMuseumStore } from '@musetrip360/museum-management';
import { PERMISSION_EVENT_CREATE, PERMISSION_EVENT_MANAGEMENT } from '@musetrip360/rolebase-management';
import { BulkUploadProvider } from '@musetrip360/shared';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { toast } from '@musetrip360/ui-core/sonner';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const EventCreatePage = withPermission(() => {
  const navigate = useNavigate();
  const { selectedMuseum } = useMuseumStore();
  const museumId = selectedMuseum?.id || '';

  const handleEventCreated = () => {
    toast.success('Sự kiện đã được tạo thành công!');
    navigate('/event');
  };

  const handleCancel = () => {
    navigate('/event');
  };

  if (!museumId) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Truy cập bị từ chối</CardTitle>
            <CardDescription>Bạn cần được liên kết với một bảo tàng để tạo sự kiện.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/events')} variant="outline" className="w-full">
              Quay lại Sự kiện
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="shrink-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại Sự kiện
        </Button>

        <div className="border-l border-gray-200 pl-4">
          <h1 className="text-2xl font-bold tracking-tight">Tạo Sự kiện Mới</h1>
        </div>
      </div>

      {/* Form Card */}
      <BulkUploadProvider>
        <EventBasicInfoForm
          onSuccess={handleEventCreated}
          className="flex-1"
          museumId={museumId}
          onCancel={handleCancel}
        />
      </BulkUploadProvider>
    </div>
  );
}, [PERMISSION_EVENT_CREATE, PERMISSION_EVENT_MANAGEMENT]);

export default EventCreatePage;
