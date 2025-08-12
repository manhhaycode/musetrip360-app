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
  } = useGetEventById(id || '', {
    enabled: !!id && !!museumId,
  });

  const handleEventUpdated = (updatedEvent: Event) => {
    console.log('Event updated:', updatedEvent);
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
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be associated with a museum to edit events.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/events')} variant="outline" className="w-full">
              Back to Events
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
          <span>Loading event...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'Event not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/events')} variant="outline" className="w-full">
              Back to Events
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground">Update event information and tour online configurations.</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
          <CardDescription>Update the event details and configure associated tour onlines.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm event={event} museumId={museumId} onSuccess={handleEventUpdated} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventEditPage;
