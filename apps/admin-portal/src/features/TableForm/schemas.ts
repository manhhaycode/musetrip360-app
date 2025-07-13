import { z } from 'zod';

// Museum form schema
export const museumFormSchema = z.object({
  name: z.string().min(1, 'Tên bảo tàng là bắt buộc'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  category: z.enum(['art', 'history', 'science', 'culture', 'nature', 'military', 'technology', 'other', 'ethnology']),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  website: z.string().url('Website không hợp lệ').optional().or(z.literal('')),
  openingHours: z.string().min(1, 'Giờ mở cửa là bắt buộc'),
  ticketPrice: z.string().min(1, 'Giá vé là bắt buộc'),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'maintenance']),
});

// User form schema
export const userFormSchema = z.object({
  name: z.string().min(1, 'Tên người dùng là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  role: z.enum(['admin', 'manager', 'staff', 'visitor', 'museum_owner']),
  status: z.enum(['active', 'inactive', 'suspended', 'pending_verification']),
  phoneNumber: z.string().min(10, 'Số điện thoại không hợp lệ').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().url('URL avatar không hợp lệ').optional().or(z.literal('')),
  bio: z.string().optional(),
});

// Museum request form schema for approval workflow
export const museumRequestFormSchema = z.object({
  name: z.string().min(1, 'Tên bảo tàng là bắt buộc'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  category: z.enum(['art', 'history', 'science', 'culture', 'nature', 'military', 'technology', 'other', 'ethnology']),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  contact: z.string().min(1, 'Tên người liên hệ là bắt buộc'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  website: z.string().url('Website không hợp lệ').optional().or(z.literal('')),
  status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
  rejectionReason: z.string().optional(),
});

// Export inferred types
export type MuseumFormData = z.infer<typeof museumFormSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
export type MuseumRequestFormData = z.infer<typeof museumRequestFormSchema>;
