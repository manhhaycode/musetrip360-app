'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { useCreateBankAccount, useUpdateBankAccount, BankAccount } from '@musetrip360/payment-management';
import { useUserStore } from '@musetrip360/user-management';
import { FormDropZone, MediaType, useFileUpload } from '@musetrip360/shared';

// Validation schema
const bankAccountSchema = z.object({
  holderName: z.string().min(1, 'Tên chủ tài khoản là bắt buộc').min(2, 'Tên phải có ít nhất 2 ký tự'),
  bankName: z.string().min(1, 'Tên ngân hàng là bắt buộc').min(2, 'Tên ngân hàng phải có ít nhất 2 ký tự'),
  accountNumber: z
    .string()
    .min(1, 'Số tài khoản là bắt buộc')
    .min(8, 'Số tài khoản phải có ít nhất 8 số')
    .max(20, 'Số tài khoản không được quá 20 số')
    .regex(/^\d+$/, 'Số tài khoản chỉ được chứa các chữ số'),
  qrCode: z.any().refine((file) => file && file.file, 'Hình ảnh QR code là bắt buộc'),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

interface BankAccountFormProps {
  museumId: string;
  bankAccount?: BankAccount | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({ museumId, bankAccount, onSuccess, onCancel }) => {
  const { user } = useUserStore();
  const uploadFileMutation = useFileUpload();
  const isEditing = !!bankAccount;

  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      holderName: bankAccount?.holderName || '',
      bankName: bankAccount?.bankName || '',
      accountNumber: bankAccount?.accountNumber || '',
      qrCode: undefined,
    },
  });

  const { mutate: createBankAccount, isPending: isCreating } = useCreateBankAccount({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Create bank account error:', error);
    },
  });

  const { mutate: updateBankAccount, isPending: isUpdating } = useUpdateBankAccount(bankAccount?.id || '', {
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Update bank account error:', error);
    },
  });

  const isPending = isCreating || isUpdating;

  const handleSubmit = async (data: BankAccountFormData) => {
    try {
      if (!user?.id) {
        console.error('User not found');
        return;
      }

      // Upload QR code image
      let qrCodeUrl = '';
      if (data.qrCode?.file) {
        const result = await uploadFileMutation.mutateAsync(data.qrCode.file);
        qrCodeUrl = result.data.url;
      } else if (isEditing && bankAccount?.qrCode) {
        // Keep existing QR code if editing and no new file uploaded
        qrCodeUrl = bankAccount.qrCode;
      }

      const formData = {
        holderName: data.holderName,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        qrCode: qrCodeUrl,
      };

      if (isEditing && bankAccount) {
        updateBankAccount({
          ...bankAccount,
          ...formData,
        });
      } else {
        createBankAccount({
          museumId,
          userId: user.id,
          ...formData,
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Holder Name */}
        <FormField
          control={form.control}
          name="holderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên chủ tài khoản</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên chủ tài khoản" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bank Name */}
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên ngân hàng</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Vietcombank, Techcombank, BIDV..." disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Number */}
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tài khoản</FormLabel>
              <FormControl>
                <Input placeholder="Nhập số tài khoản" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* QR Code Image Upload */}
        <FormField
          control={form.control}
          name="qrCode"
          render={() => (
            <FormItem>
              <FormControl>
                <FormDropZone
                  name="qrCode"
                  control={form.control}
                  mediaType={MediaType.IMAGE}
                  label="Tải lên hình ảnh QR Code"
                  description="Tải lên hình ảnh QR Code để khách hàng có thể thanh toán"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show existing QR Code if editing */}
        {isEditing && bankAccount?.qrCode && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">QR Code hiện tại:</label>
            <div className="border rounded-lg p-3 bg-gray-50">
              <img src={bankAccount.qrCode} alt="Current QR Code" className="max-w-xs h-auto rounded border" />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending} className="gap-2">
            <X className="h-4 w-4" />
            Hủy
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? 'Đang cập nhật...' : 'Đang thêm...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? 'Cập nhật' : 'Thêm tài khoản'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BankAccountForm;
