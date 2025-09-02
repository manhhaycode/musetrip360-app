import { Tabs, TabsContent, TabsList, TabsTrigger } from '@musetrip360/ui-core/tabs';
import { EventBasicInfoForm } from './EventBasicInfoForm';
import { Event } from '@/types';
import { EventTourOnlineForm } from './EventTourOnlineForm';
import { EventParticipants } from './EventParticipants';
import { BulkUploadProvider } from '@musetrip360/shared';
import { PERMISSION_EVENT_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';

export function EventDetailManagement({ event, onUpdated }: { event: Event; onUpdated?: () => void }) {
  const { hasPermission } = useRolebaseStore();
  const disabled = !hasPermission(event.museumId, PERMISSION_EVENT_MANAGEMENT);
  return (
    <BulkUploadProvider>
      <Tabs className="flex flex-1" defaultValue="basic-info">
        <TabsList>
          <TabsTrigger value="basic-info">Thông tin chung</TabsTrigger>
          <TabsTrigger value="virtual-tour">Liên kết tour ảo</TabsTrigger>
          <TabsTrigger value="participants">Người tham dự</TabsTrigger>
        </TabsList>
        <TabsContent style={{ flex: '1 0 0' }} className="flex min-h-0" value="basic-info">
          <EventBasicInfoForm museumId={event.museumId} event={event} onSuccess={onUpdated} />
        </TabsContent>
        <TabsContent style={{ flex: '1 0 0' }} className="flex min-h-0" value="virtual-tour">
          <EventTourOnlineForm disabled={disabled} className="flex-1 flex" event={event} onUpdated={onUpdated} />
        </TabsContent>
        <TabsContent style={{ flex: '1 0 0' }} className="flex min-h-0" value="participants">
          <EventParticipants event={event} onUpdated={onUpdated} />
        </TabsContent>
      </Tabs>
    </BulkUploadProvider>
  );
}
