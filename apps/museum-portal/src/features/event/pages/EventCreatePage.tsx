import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Button } from '@musetrip360/ui-core/button';
import { ArrowLeft } from 'lucide-react';
import { Event } from '@musetrip360/event-management';
import EventForm from '../EventForm';
import { useMuseumStore } from '@musetrip360/museum-management';

const EventCreatePage = () => {
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
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be associated with a museum to create events.</CardDescription>
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
          <h1 className="text-2xl font-bold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground">Create a new event for your museum with tour online configurations.</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
          <CardDescription>
            Fill in the event details and configure associated tour onlines. You'll need to create the event first, then
            configure the tour onlines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm museumId={museumId} onSuccess={handleEventCreated} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreatePage;
