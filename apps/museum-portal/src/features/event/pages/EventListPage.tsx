'use client';

import { useNavigate } from 'react-router';
import { Card, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Event } from '@musetrip360/event-management';
import EventDataTable from '../EventDataTable';
import { useMuseumStore } from '@musetrip360/museum-management';
import withPermission from '@/hocs/withPermission';
import { PERMISSION_EVENT_MANAGEMENT, PERMISSION_EVENT_VIEW } from '@musetrip360/rolebase-management';

const EventListPage = withPermission(() => {
  const { selectedMuseum } = useMuseumStore();
  const museumId = selectedMuseum?.id || '';

  const navigate = useNavigate();

  const handleViewEvent = (event: Event) => {
    console.log('View event:', event);
    // Navigate to event details page when implemented
  };

  const handleEditEvent = (event: Event) => {
    navigate(`/event/edit/${event.id}`);
  };

  const handleDeleteEvent = (event: Event) => {
    console.log('Delete event:', event);
    // Handle delete logic
  };

  const handleAddEvent = () => {
    navigate('/event/create');
  };

  const handleSubmitEvent = (event: Event) => {
    console.log('Submit event:', event);
  };

  const handleCancelEvent = (event: Event) => {
    console.log('Cancel event:', event);
  };

  if (!museumId) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Truy cập bị từ chối</CardTitle>
            <CardDescription>Bạn cần được liên kết với một bảo tàng để quản lý sự kiện.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <EventDataTable
      museumId={museumId}
      onView={handleEditEvent}
      onEdit={handleEditEvent}
      onDelete={handleDeleteEvent}
      onAdd={handleAddEvent}
      onSubmit={handleSubmitEvent}
      onCancel={handleCancelEvent}
    />
  );
}, [PERMISSION_EVENT_VIEW, PERMISSION_EVENT_MANAGEMENT]);

export default EventListPage;
