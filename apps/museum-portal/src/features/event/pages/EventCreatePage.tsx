import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Button } from '@musetrip360/ui-core/button';
import { ArrowLeft } from 'lucide-react';
import { Event } from '@musetrip360/event-management';
import EventForm from '../EventForm';
import { useMuseumStore } from '@musetrip360/museum-management';
import withPermission from '@/hocs/withPermission';
import { PERMISSION_EVENT_CREATE, PERMISSION_EVENT_MANAGEMENT } from '@musetrip360/rolebase-management';

const EventCreatePage = withPermission(() => {
  const navigate = useNavigate();
  const { selectedMuseum } = useMuseumStore();
  const museumId = selectedMuseum?.id || '';

  const handleEventCreated = (event: Event) => {
    console.log('Event created:', event);
    navigate(-1);
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="shrink-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại Sự kiện
        </Button>

        <div className="border-l border-gray-200 pl-4">
          <h1 className="text-2xl font-bold tracking-tight">Tạo Sự kiện Mới</h1>
          <p className="text-muted-foreground">
            Tạo một sự kiện mới cho bảo tàng của bạn với cấu hình tour trực tuyến.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <EventForm museumId={museumId} onSuccess={handleEventCreated} onCancel={handleCancel} />
    </div>
  );
}, [PERMISSION_EVENT_CREATE, PERMISSION_EVENT_MANAGEMENT]);

export default EventCreatePage;
