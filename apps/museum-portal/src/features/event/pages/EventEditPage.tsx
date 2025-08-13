import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Button } from '@musetrip360/ui-core/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Event, useGetEventById } from '@musetrip360/event-management';
import EventForm from '../EventForm';
import { useMuseumStore } from '@musetrip360/museum-management';

const EventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedMuseum } = useMuseumStore();
  const museumId = selectedMuseum?.id || '';

  const {
    data: event,
    isLoading,
    isError: error,
    refetch,
  } = useGetEventById(id || '', {
    enabled: !!id && !!museumId,
  });

  const handleEventUpdated = (updatedEvent: Event) => {
    console.log('Event updated:', updatedEvent);
    refetch(); // Refresh the event data after update
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!museumId) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Truy cập bị từ chối</CardTitle>
            <CardDescription>Bạn cần được liên kết với một bảo tàng để chỉnh sửa sự kiện.</CardDescription>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải sự kiện...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
            <CardDescription>{error || 'Không tìm thấy sự kiện'}</CardDescription>
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="shrink-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="border-l border-gray-200 pl-4">
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa Sự kiện</h1>
          <p className="text-muted-foreground">Cập nhật thông tin sự kiện và cấu hình tour trực tuyến.</p>
        </div>
      </div>

      {/* Form Card */}
      <EventForm event={event} museumId={museumId} onSuccess={handleEventUpdated} onCancel={handleCancel} />
    </div>
  );
};

export default EventEditPage;
