import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@musetrip360/ui-core/tabs';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { toast } from '@musetrip360/ui-core/sonner';
import { Save, Send } from 'lucide-react';
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
  useRemoveEventTourOnlines,
  useSubmitEvent,
} from '@musetrip360/event-management';
import { useFileUpload, MediaType, DropZoneWithPreview } from '@musetrip360/shared';
import { useVirtualTourByMuseum } from '@musetrip360/virtual-tour/api';
import get from 'lodash.get';
import { EventTypeName } from '@/config/constants/event';
import { useMuseumStore } from '@musetrip360/museum-management';

const eventFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(255, 'Tiêu đề phải ngắn hơn 255 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  eventType: z.nativeEnum(EventTypeEnum, {
    required_error: 'Loại sự kiện là bắt buộc',
  }),
  startTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
  endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  capacity: z.number().min(1, 'Sức chứa phải ít nhất là 1'),
  bookingDeadline: z.string().min(1, 'Hạn đăng ký là bắt buộc'),
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

const eventTypeOptions: {
  value: EventTypeEnum;
  label: string;
}[] = Object.entries(EventTypeName).map(([value, label]) => ({
  label,
  value: value as EventTypeEnum,
}));

const EventForm = ({ event, museumId, onSuccess, onCancel, className }: EventFormProps) => {
  const isEditing = !!event;
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [currentTab, setCurrentTab] = useState('event-info');
  const [createdEventId, setCreatedEventId] = useState<string | null>(event?.id || null);
  const { selectedMuseum } = useMuseumStore();

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
      location: event?.location || selectedMuseum?.location || '',
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
      toast.success('Tạo sự kiện thành công');
      setCreatedEventId(data.id);
      // Move to tour configuration tab after creating event
      setCurrentTab('tour-config');
    },
    onError: (error) => {
      toast.error('Tạo sự kiện thất bại');
      console.error('Create event error:', error);
    },
  });

  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent({
    onSuccess: (data) => {
      toast.success('Cập nhật sự kiện thành công');
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error('Cập nhật sự kiện thất bại');
      console.error('Update event error:', error);
    },
  });

  const { mutate: addEventTourOnlines, isPending: isAddingTours } = useAddEventTourOnlines({
    onSuccess: (data) => {
      toast.success('Thêm cấu hình tour thành công');
      onSuccess?.(data);
      form.reset();
    },
    onError: (error) => {
      toast.error('Thêm cấu hình tour thất bại');
      console.error('Add event tour onlines error:', error);
    },
  });

  const { mutate: removeEventTourOnlines, isPending: isRemoveTours } = useRemoveEventTourOnlines({
    onSuccess: (data) => {
      toast.success('Xoá cấu hình tour thành công');
      onSuccess?.(data);
      form.reset();
    },
    onError: (error) => {
      toast.error('Xoá cấu hình tour thất bại');
      console.error('Remove event tour onlines error:', error);
    },
  });

  const { mutate: submitEvent, isPending: isSubmitting } = useSubmitEvent({
    onSuccess: () => {
      toast.success('Gửi sự kiện để duyệt thành công');
      onSuccess?.(event!);
    },
    onError: (error) => {
      toast.error('Gửi sự kiện để duyệt thất bại');
      console.error('Submit event error:', error);
    },
  });

  const updateEventTourOnlines = ({ eventId, tourOnlineIds }: { eventId: string; tourOnlineIds: string[] }) => {
    if (!eventId || !tourOnlineIds || tourOnlineIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một tour trực tuyến');
      return;
    }
    const existingTourIds = event?.tourOnlines?.map((tour) => tour.id) || [];
    const toursToAdd = tourOnlineIds.filter((id) => !existingTourIds.includes(id));
    const toursToRemove = existingTourIds.filter((id) => !tourOnlineIds.includes(id));
    if (toursToAdd.length > 0) {
      addEventTourOnlines({ eventId, tourOnlineIds: toursToAdd });
    }
    if (toursToRemove.length > 0) {
      removeEventTourOnlines({ eventId, tourOnlineIds: toursToRemove });
    }
  };

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
      toast.error('Tải lên hình ảnh thất bại. Vui lòng thử lại.');
      console.error('Image upload error:', error);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const onSubmitTourConfig = (data: EventFormData) => {
    const eventId = isEditing ? event?.id : createdEventId;

    if (!eventId) {
      toast.error('Vui lòng tạo sự kiện trước');
      return;
    }

    if (!data.selectedTourOnlineIds || data.selectedTourOnlineIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một tour trực tuyến');
      return;
    }

    if (isEditing) {
      // Update existing event's tour configurations
      updateEventTourOnlines({
        eventId: eventId,
        tourOnlineIds: data.selectedTourOnlineIds,
      });
    } else {
      // Add tour configurations to newly created event
      addEventTourOnlines({
        eventId: eventId,
        tourOnlineIds: data.selectedTourOnlineIds,
      });
    }
  };

  const handleSaveEventInfo = () => {
    form.handleSubmit(onSubmitEventInfo)();
  };

  const handleSaveTourConfig = () => {
    form.handleSubmit(onSubmitTourConfig)();
  };

  const handleSubmitForReview = () => {
    const eventId = isEditing ? event?.id : createdEventId;

    if (!eventId) {
      toast.error('Vui lòng tạo sự kiện trước');
      return;
    }

    submitEvent(eventId);
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

  const isPending = isCreating || isUpdating || isUploadingImages || isAddingTours || isRemoveTours || isSubmitting;
  const canAccessTourConfig = isEditing || createdEventId;

  return (
    <div className={className}>
      <Form {...form}>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="event-info">Thông tin Sự kiện</TabsTrigger>
            <TabsTrigger value="tour-config" disabled={!canAccessTourConfig}>
              Cấu hình Tour
            </TabsTrigger>
          </TabsList>

          <TabsContent value="event-info" className="space-y-6">
            {/* Event Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Tiêu đề Sự kiện *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề sự kiện" {...field} />
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
                  <FormLabel className="text-gray-600">Mô tả *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập mô tả sự kiện" className="min-h-[120px] resize-none" {...field} />
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
                    <FormLabel className="text-gray-600">Loại Sự kiện *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại sự kiện" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventTypeOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value || ''}>
                            {label}
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
                    <FormLabel className="text-gray-600">Địa điểm *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa điểm sự kiện" {...field} />
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
                    <FormLabel className="text-gray-600">Thời gian Bắt đầu *</FormLabel>
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
                    <FormLabel className="text-gray-600">Thời gian Kết thúc *</FormLabel>
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
                    <FormLabel className="text-gray-600">Sức chứa *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập sức chứa"
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
                    <FormLabel className="text-gray-600">Hạn đăng ký *</FormLabel>
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
                  <FormLabel className="text-gray-600">Hình ảnh Sự kiện</FormLabel>
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
                {isEditing ? 'Cập nhật Sự kiện' : 'Tạo Sự kiện'}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isPending}
                  className="flex-1 sm:flex-initial"
                >
                  Hủy
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tour-config" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Chọn Tour Trực tuyến</h3>
                <p className="text-sm text-gray-600">Chọn các tour trực tuyến để liên kết với sự kiện này.</p>
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
                  <h4 className="font-medium text-blue-900">Tour Đã chọn:</h4>
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
                  Lưu Cấu hình Tour
                </Button>

                {((isEditing && event?.status === 'Draft') || (!isEditing && createdEventId)) && (
                  <Button
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={isPending}
                    className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Gửi để Duyệt
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentTab('event-info')}
                  disabled={isPending}
                  className="flex-1 sm:flex-initial"
                >
                  Quay lại Thông tin Sự kiện
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
