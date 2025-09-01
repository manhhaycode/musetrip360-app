'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormDropZone, MediaType, useBulkUpload, ZodFileData } from '@musetrip360/shared';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { DateTimePicker, DateTimePickerRef } from '@musetrip360/ui-core/datetime-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input, NumberInput } from '@musetrip360/ui-core/input';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@musetrip360/ui-core/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@musetrip360/ui-core/sheet';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@musetrip360/ui-core/dialog';

import { useCreateEvent, useCreateEventRoom, useUpdateEvent } from '@/api';
import { Event, EventStatusEnum, EventTypeEnum } from '@/types';
import { cn } from '@musetrip360/ui-core/utils';
import {
  DotSquareIcon,
  FileText,
  Globe,
  MapPin,
  PencilRuler,
  Presentation,
  Ticket,
  UsersRoundIcon,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@musetrip360/ui-core/sonner';
import { z } from 'zod';

const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);
const eventInfoFormSchema = z.object({
  title: z.string().min(1, 'Tên sự kiện là bắt buộc').max(100, 'Tên sự kiện phải ngắn hơn 100 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').max(1000, 'Mô tả phải ngắn hơn 1000 ký tự'),
  eventType: z.nativeEnum(EventTypeEnum, {
    required_error: 'Loại sự kiện là bắt buộc',
  }),
  status: z.nativeEnum(EventStatusEnum).optional(),
  startTime: z
    .string()
    .min(1, 'Thời gian bắt đầu là bắt buộc')
    .refine((value) => {
      const date = new Date(value);
      return date > new Date();
    }, 'Thời gian bắt đầu phải là tương lai'),
  endTime: z
    .string()
    .min(1, 'Thời gian kết thúc là bắt buộc')
    .refine((value) => {
      const date = new Date(value);
      return date > new Date();
    }, 'Thời gian kết thúc phải là tương lai'),
  location: z.string().optional(),
  capacity: z.number().min(1, 'Sức chứa phải ít nhất là 1'),
  bookingDeadline: z
    .string()
    .min(1, 'Hạn đăng ký là bắt buộc')
    .refine((value) => {
      const date = new Date(value);
      return date > new Date();
    }, 'Hạn đăng ký phải là tương lai'),
  price: z.number().min(0, 'Giá phải là số dương'),
  requiresApproval: z.boolean().optional(),
  metadata: z.object({
    roomCreateType: z.enum(['AUTO', 'NOW', 'NONE']).optional(),
    thumbnail: ZodFileData.nullable().optional(),
    images: z.array(ZodFileData.nullable()).nullable().optional(),
    richDescription: z.string().optional(),
  }),
});

const eventPublishedSchema = z.object({
  title: z.string().min(1, 'Tên sự kiện là bắt buộc').max(100, 'Tên sự kiện phải ngắn hơn 100 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').max(1000, 'Mô tả phải ngắn hơn 1000 ký tự'),
  eventType: z.nativeEnum(EventTypeEnum, {
    required_error: 'Loại sự kiện là bắt buộc',
  }),
  status: z.nativeEnum(EventStatusEnum).optional(),
  location: z.string().optional(),
  capacity: z.number().min(1, 'Sức chứa phải ít nhất là 1'),
  endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
  startTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
  bookingDeadline: z.string().min(1, 'Hạn đăng ký là bắt buộc'),
  price: z.number().min(0, 'Giá phải là số dương'),
  requiresApproval: z.boolean().optional(),
  metadata: z.object({
    roomCreateType: z.enum(['AUTO', 'NOW', 'NONE']).optional(),
    thumbnail: ZodFileData.nullable().optional(),
    images: z.array(ZodFileData.nullable()).nullable().optional(),
    richDescription: z.string().optional(),
  }),
});

type EventInfoFormData = z.infer<typeof eventInfoFormSchema>;

interface EventInfoFormProps {
  museumId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  event?: Event;
}

const eventTypeOptions = [
  { value: EventTypeEnum.Exhibition, label: 'Triển lãm' },
  { value: EventTypeEnum.Workshop, label: 'Workshop' },
  { value: EventTypeEnum.Lecture, label: 'Bài giảng' },
  { value: EventTypeEnum.SpecialEvent, label: 'Sự kiện đặc biệt' },
  { value: EventTypeEnum.HolidayEvent, label: 'Sự kiện lễ hội' },
  { value: EventTypeEnum.Other, label: 'Khác' },
];

export const EventBasicInfoForm = ({ museumId, event, onSuccess }: EventInfoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const endTimePickerRef = useRef<DateTimePickerRef>(null);
  const bookingDeadlinePickerRef = useRef<DateTimePickerRef>(null);
  const bulkUpload = useBulkUpload();

  const form = useForm<EventInfoFormData>({
    disabled: isSubmitting || event?.status === EventStatusEnum.Expired,
    resolver: (data, context, options) => {
      if (event?.status === EventStatusEnum.Published) {
        return zodResolver(eventPublishedSchema)(data, context, options);
      }
      return zodResolver(eventInfoFormSchema)(data, context, options);
    },
    defaultValues: {
      title: '',
      description: '',
      eventType: EventTypeEnum.Other,
      startTime: '',
      endTime: '',
      location: '',
      capacity: 50,
      bookingDeadline: '',
      price: 0,
      requiresApproval: false,
      metadata: {
        roomCreateType: 'NONE',
        thumbnail: null,
        images: [],
      },
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        ...event,
        metadata: {
          ...event.metadata,
          thumbnail: {
            file: event.metadata?.thumbnail || '',
            mediaType: MediaType.IMAGE,
          },
          images: event.metadata?.images || [],
          richDescription: event.metadata?.richDescription ?? event.description,
        },
      });
    } else {
      form.reset({
        title: '',
        description: '',
        eventType: EventTypeEnum.Other,
        startTime: '',
        endTime: '',
        location: '',
        capacity: 50,
        bookingDeadline: '',
        price: 0,
        requiresApproval: false,
        metadata: {
          roomCreateType: 'NONE',
          thumbnail: null,
          images: [],
        },
      });
    }
    // Reset form when scene changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const { mutate: createEvent } = useCreateEvent({
    onSuccess: (data) => {
      createEventRoom({
        eventId: data.id,
        name: `Phòng sự kiện ${data.title}`,
        description: `Phòng dành cho sự kiện ${data.title}`,
        status: 'Active',
      });
    },
    onError: (error) => {
      toast.error('Tạo sự kiện thất bại, hãy thử lại!');
      setIsSubmitting(false);
      console.error('Create event error:', error);
    },
  });

  const { mutate: updateEvent } = useUpdateEvent({
    onSuccess: () => {
      toast.success('Cập nhật sự kiện thành công');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Cập nhật sự kiện thất bại, hãy thử lại!');
      setIsSubmitting(false);
      console.error('Create event error:', error);
    },
  });

  const { mutate: createEventRoom } = useCreateEventRoom({
    onSuccess: (data) => {
      console.log('Event room created:', data);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Tạo sự kiện thất bại, hãy thử lại!');
      console.error('Create event room error:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
        }
      }
      setIsSubmitting(true);
      const data = form.getValues();

      const eventData: Partial<Event> = {
        museumId,
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        ...((event?.status === EventStatusEnum.Draft || event?.status === EventStatusEnum.Pending) && {
          startTime: new Date(data.startTime as string).toISOString(),
          endTime: new Date(data.endTime as string).toISOString(),
          bookingDeadline: new Date(data.bookingDeadline as string).toISOString(),
          price: data.price,
        }),
        location: data.location || 'Sự kiện trực tuyến',
        capacity: data.capacity,
        availableSlots: data.capacity,
        metadata: {
          roomCreateType: data.metadata.roomCreateType,
          thumbnail: data.metadata.thumbnail?.file as string,
          richDescription: data.metadata.richDescription as string,
          images: [],
        },
      };
      if (event) {
        updateEvent({ ...eventData, eventId: event.id });
      } else {
        createEvent(eventData as Event);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(form.formState.disabled || event?.status === EventStatusEnum.Published);

  return (
    <Form {...form}>
      <form
        style={{ flex: '1 0 0' }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-0 overflow-auto pt-2 gap-8 relative"
      >
        <div className="basis-1/3 sticky top-0 flex-shrink-0">
          <FormDropZone
            label="Thumbnail sự kiện"
            control={form.control}
            name="metadata.thumbnail"
            mediaType={MediaType.IMAGE}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 pr-4">
          <div className="flex justify-between">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem className="flex gap-3">
                  <FormLabel className="text-gray-600 font-medium">Loại sự kiện</FormLabel>
                  <FormControl>
                    <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                      <FormItem>
                        <SelectTrigger>
                          <PencilRuler className="h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Chọn loại sự kiện"></SelectValue>
                        </SelectTrigger>
                      </FormItem>
                      <SelectContent>
                        {eventTypeOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select disabled key={field.value} onValueChange={field.onChange} value={field.value}>
                      <FormItem>
                        <SelectTrigger>
                          <Globe className="h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Chọn trạng thái"></SelectValue>
                        </SelectTrigger>
                      </FormItem>
                      <SelectContent>
                        <SelectItem value={EventStatusEnum.Draft}>Nháp</SelectItem>
                        <SelectItem value={EventStatusEnum.Published}>Công khai</SelectItem>
                        <SelectItem value={EventStatusEnum.Expired}>Lưu trữ</SelectItem>
                        <SelectItem value={EventStatusEnum.Cancelled}>Huỷ</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState: { error } }) => (
              <FormItem className={cn('flex flex-col py-2', error ? 'bg-red-100' : '')}>
                <FormControl>
                  <Input
                    placeholder="Nhập tên sự kiện..."
                    {...field}
                    className={cn(
                      'shadow-none border-none bg-transparent my-1! text-3xl! font-bold text-gray-800 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0',
                      error ? 'bg-red-100' : ''
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-1 gap-3">
            <Card className="bg-secondary/40 flex-1">
              <CardContent>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <DotSquareIcon className="h-5 w-5" />
                            <span className="font-medium text-gray-600">Bắt đầu</span>
                          </div>
                          <DateTimePicker
                            disabled={form.formState.disabled || event?.status === EventStatusEnum.Published}
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => {
                              field.onChange(date?.toISOString());
                              // Trigger endTime and bookingDeadline revalidation when startTime changes
                              setTimeout(() => {
                                endTimePickerRef.current?.revalidateTime();
                                bookingDeadlinePickerRef.current?.revalidateTime();
                              });
                            }}
                            minDate={new Date()}
                          />
                        </div>
                        {error && <FormMessage className="text-xs text-red-500 mt-1">{error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <DotSquareIcon className="h-5 w-5" />
                            <span className="font-medium text-gray-600">Kết thúc</span>
                          </div>
                          <DateTimePicker
                            disabled={form.formState.disabled || event?.status === EventStatusEnum.Published}
                            ref={endTimePickerRef}
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date?.toISOString())}
                            minDate={form.watch('startTime') ? new Date(form.watch('startTime')) : new Date()}
                          />
                        </div>
                        {error && <FormMessage className="text-xs text-red-500 mt-1">{error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bookingDeadline"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <DotSquareIcon className="h-5 w-5" />
                            <span className="font-medium text-gray-600">Hạn đăng ký</span>
                          </div>
                          <DateTimePicker
                            disabled={form.formState.disabled || event?.status === EventStatusEnum.Published}
                            ref={bookingDeadlinePickerRef}
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => {
                              field.onChange(date?.toISOString());
                              // No need to trigger endTime revalidation since booking deadline is independent
                            }}
                            minDate={new Date()}
                            maxDate={form.watch('startTime') ? new Date(form.watch('startTime')) : undefined}
                          />
                        </div>
                        {error && <FormMessage className="text-xs text-red-500 mt-1">{error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/40 basis-1/4">
              <CardContent className="flex flex-col gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-600">GMT +07:00</span>
                <span className="text-gray-500 font-medium text-sm">Saigon</span>
              </CardContent>
            </Card>
          </div>

          <Popover>
            <PopoverTrigger disabled={form.formState.disabled} asChild>
              <Card className="bg-secondary/40 hover:bg-secondary/80! hover:cursor-pointer flex-1">
                <CardContent className="flex gap-2 relative">
                  {form.watch('metadata.roomCreateType') === 'NONE' ? (
                    <>
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-sm text-primary/80">Thêm địa điểm sự kiện</span>
                        <p className="text-gray-500 text-sm">Địa điểm trực tiếp hoặc liên kết ảo</p>
                        {form.formState.errors.location && (
                          <p className="text-red-500 text-xs">{form.formState.errors.location.message}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Presentation className="h-5 w-5 text-gray-400" />
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-sm text-primary/80">Sự kiện trực tuyến</span>
                        <p className="text-gray-500 text-sm">
                          {form.watch('metadata.roomCreateType') === 'AUTO'
                            ? 'Tạo phòng trực tuyến ngay'
                            : 'Phòng sẽ được tạo tự động khi sự kiện bắt đầu'}
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue('metadata.roomCreateType', 'NONE');
                        }}
                        type="button"
                        variant="secondary"
                        leftIcon={<X />}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width)">
              <div className="w-full flex flex-col gap-1">
                <p className="mr-2 text-xs text-gray-600 mb-2">Tuỳ chọn trực tuyến</p>
                <PopoverClose className="outline-none">
                  <div
                    onClick={() => form.setValue('metadata.roomCreateType', 'AUTO')}
                    className="w-full cursor-pointer rounded-md flex gap-2 p-2 hover:bg-secondary/80 items-center"
                  >
                    <Presentation className="h-5 w-5 text-gray-400" />

                    <p className="text-sm font-medium text-gray-500">Tạo phòng trực tuyến ngay</p>
                  </div>
                </PopoverClose>
                <PopoverClose className="outline-none">
                  <div
                    onClick={() => form.setValue('metadata.roomCreateType', 'NOW')}
                    className="w-full cursor-pointer rounded-md flex gap-2 p-2 hover:bg-secondary/80 items-center"
                  >
                    <Presentation className="h-5 w-5 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500">Phòng sẽ được tạo tự động khi sự kiện bắt đầu</p>
                  </div>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>

          <Sheet open={isOpen}>
            <SheetTrigger onClick={() => setIsOpen(!isOpen)}>
              <Card className="bg-secondary/40 hover:bg-secondary/80! hover:cursor-pointer flex-1">
                <CardContent className="flex gap-2 relative">
                  <FileText className="h-5 w-5 text-gray-400" />
                  {form.watch('description') ? (
                    <div className="flex justify-start flex-col gap-2">
                      <p className="font-semibold text-sm text-primary/80 text-start">Mô tả sự kiện</p>
                      <p className="text-sm text-gray-500 text-start">{form.watch('description')}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-sm text-primary/80">Thêm mô tả</span>
                      {form.formState.errors.description && (
                        <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl" dir="right">
              <SheetHeader>
                <SheetTitle>Thêm mô tả sự kiện</SheetTitle>
                <SheetDescription>
                  Mô tả chi tiết về sự kiện, bao gồm thông tin quan trọng, nội dung và các chi tiết khác.
                </SheetDescription>
              </SheetHeader>
              <React.Suspense fallback={<div className="w-full justify-center">Đang tải trình soạn thảo...</div>}>
                <RichEditor
                  value={form.watch('metadata.richDescription')}
                  onChange={(editorStateTextString) => {
                    form.setValue('description', editorStateTextString);
                  }}
                  onSave={(content) => {
                    form.setValue('metadata.richDescription', content);
                    setIsOpen(false);
                  }}
                  readOnly={form.formState.disabled}
                  toolbarConfig={{ showFontFamily: false }}
                  showToolbar
                  placeholder="Nhập nội dung..."
                />
              </React.Suspense>
            </SheetContent>
          </Sheet>
          <FormLabel className="text-gray-600 font-medium">Tuỳ chọn sự kiện</FormLabel>
          <Dialog>
            <DialogTrigger asChild>
              <Card
                onClick={(e) => {
                  if (form.formState.disabled || event?.status === EventStatusEnum.Published) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="bg-secondary/40 flex-1 cursor-pointer"
              >
                <CardContent className="flex justify-between">
                  <div className="flex gap-2">
                    <Ticket className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Giá vé sự kiện</span>
                    <span className="text-sm font-medium text-gray-400">
                      {form.watch('price') ? `: ${Number(form.watch('price')).toLocaleString()} đ` : 'Miễn phí'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Cài đặt vé sự kiện</DialogHeader>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá vé</FormLabel>
                      <FormControl>
                        <NumberInput suffix=" VNĐ" placeholder="Nhập giá vé..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Lưu</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Card className="bg-secondary/40 flex-1 cursor-pointer">
            <CardContent className="flex items-center justify-between">
              <div className="flex gap-2">
                <UsersRoundIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Sức chứa</span>
              </div>
              <div className="flex gap-2 items-center">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NumberInput placeholder="Nhập sức chứa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {event ? 'Cập nhật sự kiện' : 'Tạo sự kiện'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
