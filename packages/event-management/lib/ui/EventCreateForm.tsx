'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormDropZone, MediaType } from '@musetrip360/shared';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { DateTimePicker } from '@musetrip360/ui-core/datetime-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
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

import { Checkbox } from '@musetrip360/ui-core/checkbox';

import { useCreateEvent } from '@/api';
import { EventCreateDto, EventTypeEnum } from '@/types';
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
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);
const eventCreateFormSchema = z.object({
  title: z.string().min(1, 'Tên sự kiện là bắt buộc').max(100, 'Tên sự kiện phải ngắn hơn 100 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').max(1000, 'Mô tả phải ngắn hơn 1000 ký tự'),
  eventType: z.nativeEnum(EventTypeEnum, {
    required_error: 'Loại sự kiện là bắt buộc',
  }),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  startTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
  endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  capacity: z.number().min(1, 'Sức chứa phải ít nhất là 1'),
  bookingDeadline: z.string().min(1, 'Hạn đăng ký là bắt buộc'),
  price: z.number().min(0, 'Giá phải là số dương'),
  requiresApproval: z.boolean().optional(),
  isFree: z.boolean().optional(),
  metadata: z.object({
    roomCreateType: z.enum(['AUTO', 'NOW', 'NONE']).optional(),
    thumbnail: z.instanceof(File).or(z.string().url()).nullable(),
    images: z.array(z.instanceof(File).or(z.string().url())).nullable(),
    plainDescription: z.string().optional(),
  }),
});

type EventCreateFormData = z.infer<typeof eventCreateFormSchema>;

interface EventCreateFormProps {
  museumId: string;
  onSuccess?: (eventId: string) => void;
  onCancel?: () => void;
  className?: string;
}

const eventTypeOptions = [
  { value: EventTypeEnum.Exhibition, label: 'Triển lãm' },
  { value: EventTypeEnum.Workshop, label: 'Workshop' },
  { value: EventTypeEnum.Lecture, label: 'Bài giảng' },
  { value: EventTypeEnum.SpecialEvent, label: 'Sự kiện đặc biệt' },
  { value: EventTypeEnum.HolidayEvent, label: 'Sự kiện lễ hội' },
  { value: EventTypeEnum.Other, label: 'Khác' },
];

export const EventCreateForm = ({ museumId, onSuccess }: EventCreateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EventCreateFormData>({
    disabled: isSubmitting,
    resolver: zodResolver(eventCreateFormSchema),
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
      isFree: true,
      metadata: {
        roomCreateType: 'NONE',
        thumbnail: null,
        images: [],
      },
    },
  });

  const { mutate: createEvent } = useCreateEvent({
    onSuccess: (data) => {
      setIsSubmitting(false);
      onSuccess?.(data.id);
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error('Create event error:', error);
    },
  });

  const onSubmit = (data: EventCreateFormData) => {
    setIsSubmitting(true);

    const eventData: EventCreateDto = {
      museumId,
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      startTime: new Date(data.startTime as string).toISOString(),
      endTime: new Date(data.endTime as string).toISOString(),
      location: data.location,
      capacity: data.capacity,
      availableSlots: data.capacity,
      bookingDeadline: new Date(data.bookingDeadline as string).toISOString(),
      metadata: {
        price: data.price,
        images: [],
      },
    };

    createEvent(eventData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 gap-8">
        <div className="basis-1/3 flex-shrink-0">
          <FormDropZone control={form.control} name="metadata.thumbnail" mediaType={MediaType.IMAGE} />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between">
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem className="flex gap-3">
                  <FormLabel className="text-gray-600 font-medium">Loại sự kiện</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormItem>
                        <SelectTrigger>
                          <Globe className="h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Chọn trạng thái"></SelectValue>
                        </SelectTrigger>
                      </FormItem>
                      <SelectContent>
                        <SelectItem value="DRAFT">Nháp</SelectItem>
                        <SelectItem value="PUBLISHED">Công khai</SelectItem>
                        <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
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
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <DotSquareIcon className="h-5 w-5" />
                      <span className="font-medium text-gray-600">Bắt đầu</span>
                    </div>
                    <DateTimePicker />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <DotSquareIcon className="h-5 w-5" />
                      <span className="font-medium text-gray-600">Kết thúc</span>
                    </div>
                    <DateTimePicker />
                  </div>
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
            <PopoverTrigger asChild>
              <Card className="bg-secondary/40 hover:bg-secondary/80! hover:cursor-pointer flex-1">
                <CardContent className="flex gap-2 relative">
                  {form.watch('metadata.roomCreateType') === 'NONE' ? (
                    <>
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-sm text-primary/80">Thêm địa điểm sự kiện</span>
                        <p className="text-gray-500 text-sm">Địa điểm trực tiếp hoặc liên kết ảo</p>
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
                  {form.watch('metadata.plainDescription') ? (
                    <div className="flex justify-start flex-col gap-2">
                      <p className="font-semibold text-sm text-primary/80 text-start">Mô tả sự kiện</p>
                      <p className="text-sm text-gray-500 text-start">{form.watch('metadata.plainDescription')}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-sm text-primary/80">Thêm mô tả</span>
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
                  value={form.watch('description')}
                  onChange={(editorStateTextString) => {
                    form.setValue('metadata.plainDescription', editorStateTextString, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  onSave={(content) => {
                    form.setValue('description', content, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    setIsOpen(false);
                  }}
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
              <Card className="bg-secondary/40 flex-1 cursor-pointer">
                <CardContent className="flex justify-between">
                  <div className="flex gap-2">
                    <Ticket className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Giá vé sự kiện</span>
                    <span className="text-sm font-medium text-gray-400">
                      {form.watch('price') ? `: ${Number(form.watch('price')).toLocaleString()} đ` : 'Chưa có'}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-medium text-gray-400">
                      {form.watch('isFree') ? 'Miễn phí' : 'Có phí'}
                    </span>
                    <PencilRuler className="h-4 w-4 text-gray-400" />
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
                        <Input type="number" placeholder="Nhập giá vé..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Sự kiện miễn phí</FormLabel>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                <Input type="number" placeholder="Nhập sức chứa..." {...form.register('capacity')} />
              </div>
            </CardContent>
          </Card>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            Tạo sự kiện
          </Button>
        </div>
      </form>
    </Form>
  );
};
