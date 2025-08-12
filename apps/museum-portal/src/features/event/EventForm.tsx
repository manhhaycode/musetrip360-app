import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@musetrip360/ui-core/tabs';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { toast } from '@musetrip360/ui-core/sonner';
import { Save } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import {
  Event,
  EventCreateDto,
  EventTypeEnum,
  useCreateEvent,
  useUpdateEvent,
  useAddEventTourOnlines,
} from '@musetrip360/event-management';
import { useFileUpload, MediaType, DropZoneWithPreview } from '@musetrip360/shared';
import { useVirtualTourByMuseum } from '@musetrip360/virtual-tour/api';
import get from 'lodash.get';

const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().min(1, 'Description is required'),
  eventType: z.nativeEnum(EventTypeEnum, {
    required_error: 'Event type is required',
  }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().min(1, 'Location is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  bookingDeadline: z.string().min(1, 'Booking deadline is required'),
  imageUrls: z.array(z.string()).optional(),
  selectedTourOnlineIds: z.array(z.string()).optional(),
  mainImageUpload: z.any().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event?: Event;
  museumId: string;
  onSuccess?: (event: Event) => void;
  onCancel?: () => void;
  className?: string;
}

const EventForm = ({ event, museumId, onSuccess, onCancel, className }: EventFormProps) => {
  const isEditing = !!event;
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [currentTab, setCurrentTab] = useState('event-info');
  const [createdEventId, setCreatedEventId] = useState<string | null>(event?.id || null);

  const { data } = useVirtualTourByMuseum({
    museumId,
    Page: 1,
    PageSize: 100,
    IsActive: true,
  });

  const availableTourOnlines = get(data, 'list', []);

  const uploadFileMutation = useFileUpload();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      eventType: event?.eventType || EventTypeEnum.Other,
      startTime: event?.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '',
      endTime: event?.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
      location: event?.location || '',
      capacity: event?.capacity || 50,
      bookingDeadline: event?.bookingDeadline ? new Date(event.bookingDeadline).toISOString().slice(0, 16) : '',
      imageUrls: event?.metadata?.images || [],
      selectedTourOnlineIds: event?.tourOnlines?.map((tour) => tour.id) || [],
      mainImageUpload: null,
    },
  });

  const mainImageUpload = useWatch({ control: form.control, name: 'mainImageUpload' });
  const selectedTourOnlineIds = useWatch({ control: form.control, name: 'selectedTourOnlineIds' });

  const { mutate: createEvent, isPending: isCreating } = useCreateEvent({
    onSuccess: (data) => {
      toast.success('Event created successfully');
      setCreatedEventId(data.id);
      // Move to tour configuration tab after creating event
      setCurrentTab('tour-config');
    },
    onError: (error) => {
      toast.error('Failed to create event');
      console.error('Create event error:', error);
    },
  });

  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent({
    onSuccess: (data) => {
      toast.success('Event updated successfully');
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error('Failed to update event');
      console.error('Update event error:', error);
    },
  });

  const { mutate: addEventTourOnlines, isPending: isAddingTours } = useAddEventTourOnlines({
    onSuccess: (data) => {
      toast.success('Tour configurations added successfully');
      onSuccess?.(data);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to add tour configurations');
      console.error('Add event tour onlines error:', error);
    },
  });

  const onSubmitEventInfo = async (data: EventFormData) => {
    try {
      setIsUploadingImages(true);

      let finalImageUrls = data.imageUrls || [];
      if (data.mainImageUpload?.file && data.mainImageUpload.file instanceof File) {
        const mainImageResult = await uploadFileMutation.mutateAsync(data.mainImageUpload.file);
        finalImageUrls = [mainImageResult.data.url, ...finalImageUrls];
      }

      const eventData = {
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        location: data.location,
        capacity: data.capacity,
        availableSlots: data.capacity, // Initially all slots are available
        bookingDeadline: new Date(data.bookingDeadline).toISOString(),
        metadata: {
          images: finalImageUrls,
        },
      };

      if (isEditing && event) {
        updateEvent({
          ...eventData,
          museumId,
        });
      } else {
        createEvent({
          ...eventData,
          museumId,
        } as EventCreateDto);
      }
    } catch (error) {
      toast.error('Failed to upload images. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const onSubmitTourConfig = (data: EventFormData) => {
    if (!createdEventId) {
      toast.error('Please create the event first');
      return;
    }

    if (!data.selectedTourOnlineIds || data.selectedTourOnlineIds.length === 0) {
      toast.error('Please select at least one tour online');
      return;
    }

    addEventTourOnlines({
      eventId: createdEventId,
      tourOnlineIds: data.selectedTourOnlineIds,
    });
  };

  const handleSaveEventInfo = () => {
    form.handleSubmit(onSubmitEventInfo)();
  };

  const handleSaveTourConfig = () => {
    form.handleSubmit(onSubmitTourConfig)();
  };

  const toggleTourOnlineSelection = (tourOnlineId: string) => {
    const current = selectedTourOnlineIds || [];
    const isSelected = current.includes(tourOnlineId);

    if (isSelected) {
      form.setValue(
        'selectedTourOnlineIds',
        current.filter((id) => id !== tourOnlineId)
      );
    } else {
      form.setValue('selectedTourOnlineIds', [...current, tourOnlineId]);
    }
  };

  const isPending = isCreating || isUpdating || isUploadingImages || isAddingTours;
  const canAccessTourConfig = isEditing || createdEventId;

  return (
    <div className={className}>
      <Form {...form}>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="event-info">Event Information</TabsTrigger>
            <TabsTrigger value="tour-config" disabled={!canAccessTourConfig}>
              Tour Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="event-info" className="space-y-6">
            {/* Event Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Event Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter event description" className="min-h-[120px] resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Type & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Event Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(EventTypeEnum).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Start Time & End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Start Time *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">End Time *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Capacity & Booking Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Capacity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter capacity"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookingDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Booking Deadline *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="mainImageUpload"
              render={() => (
                <FormItem>
                  <FormLabel className="text-gray-600">Event Images</FormLabel>
                  <FormControl>
                    <DropZoneWithPreview
                      uploadId="mainImageUpload"
                      autoRegister={true}
                      value={
                        mainImageUpload && mainImageUpload.file ? mainImageUpload.file : event?.metadata?.images?.[0]
                      }
                      onChange={(newValue) => {
                        if (!newValue) {
                          form.setValue('mainImageUpload', null);
                          return;
                        }
                        form.setValue('mainImageUpload', {
                          file: newValue,
                          mediaType: MediaType.IMAGE,
                          fileName: newValue instanceof File ? newValue.name : '',
                        });
                      }}
                      onRemove={() => form.setValue('mainImageUpload', null)}
                      mediaType={MediaType.IMAGE}
                      disabled={isPending}
                      manualUpload={true}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                onClick={handleSaveEventInfo}
                disabled={isPending}
                className="flex-1 sm:flex-initial"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isPending}
                  className="flex-1 sm:flex-initial"
                >
                  Cancel
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tour-config" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Select Tour Onlines</h3>
                <p className="text-sm text-gray-600">Choose tour onlines to associate with this event.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTourOnlines.map((tourOnline) => (
                  <div key={tourOnline.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{tourOnline.name}</h4>
                        <p className="text-sm text-gray-600">{tourOnline.description}</p>
                      </div>
                      <Checkbox
                        checked={selectedTourOnlineIds?.includes(tourOnline.id) || false}
                        onCheckedChange={() => toggleTourOnlineSelection(tourOnline.id)}
                        className="ml-3"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {selectedTourOnlineIds && selectedTourOnlineIds.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Selected Tours:</h4>
                  <ul className="list-disc list-inside text-sm text-blue-800 mt-2">
                    {selectedTourOnlineIds.map((id) => {
                      const tour = availableTourOnlines.find((t) => t.id === id);
                      return tour ? <li key={id}>{tour.name}</li> : null;
                    })}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleSaveTourConfig}
                  disabled={isPending || !selectedTourOnlineIds?.length}
                  className="flex-1 sm:flex-initial"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Tour Configuration
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab('event-info')}
                  disabled={isPending}
                  className="flex-1 sm:flex-initial"
                >
                  Back to Event Info
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Form>
    </div>
  );
};

export default EventForm;
