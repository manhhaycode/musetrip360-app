/* eslint-disable import/no-extraneous-dependencies */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { useChangePassword } from '@musetrip360/user-management';
import Link from 'next/link';

// Validation schema for password change
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
  const { mutate: changePassword, isPending } = useChangePassword({
    onSuccess: () => {
      setSuccessMessage('Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới.');
    },
    onError: () => {
      setError('Mật khẩu cũ không khớp');
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: ChangePasswordFormData) => {
    try {
      setError(null);
      setSuccessMessage(null);

      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      form.reset();
    } catch (error: any) {
      console.error('Change password error:', error);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="w-full px-8 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Lock className="h-6 w-6 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="my-8">
        {/* Success Message */}
        {successMessage && (
          <div className="animate-in slide-in-from-bottom-1 duration-200 rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-200 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="animate-in slide-in-from-top-1 duration-200 rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Security Guidelines */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Yêu cầu mật khẩu mới:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Tối thiểu 8 ký tự</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Ít nhất 1 chữ cái thường (a-z)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Ít nhất 1 chữ cái hoa (A-Z)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
              <span>Ít nhất 1 số (0-9)</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">
                    Mật khẩu hiện tại <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu hiện tại"
                        disabled={isPending}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('current')}
                        disabled={isPending}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới"
                        disabled={isPending}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('new')}
                        disabled={isPending}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">
                    Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        disabled={isPending}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('confirm')}
                        disabled={isPending}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" disabled={isPending} className="gap-2 w-full sm:w-auto">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {isPending ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
