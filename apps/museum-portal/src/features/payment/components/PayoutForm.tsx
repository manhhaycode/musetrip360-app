'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, X, Building2, Wallet } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { useCreatePayout, BankAccount, MuseumWallet } from '@musetrip360/payment-management';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Validation schema
const payoutSchema = z.object({
  bankAccountId: z.string().min(1, 'Vui lòng chọn tài khoản ngân hàng'),
  amount: z
    .number()
    .min(1000, 'Số tiền rút tối thiểu là 1,000 VND')
    .max(50000000, 'Số tiền rút tối đa là 50,000,000 VND'),
});

type PayoutFormData = z.infer<typeof payoutSchema>;

interface PayoutFormProps {
  museumId: string;
  wallet?: MuseumWallet | null;
  bankAccounts: BankAccount[];
  onSuccess: () => void;
  onCancel: () => void;
}

const PayoutForm: React.FC<PayoutFormProps> = ({ museumId, wallet, bankAccounts, onSuccess, onCancel }) => {
  const form = useForm<PayoutFormData>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      bankAccountId: '',
      amount: 0,
    },
  });

  const { mutate: createPayout, isPending: isCreating } = useCreatePayout({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Create payout error:', error);
    },
  });

  const maxAmount = wallet?.availableBalance || 0;
  const selectedBankAccountId = form.watch('bankAccountId');
  const selectedBankAccount = bankAccounts.find((acc) => acc.id === selectedBankAccountId);
  const enteredAmount = form.watch('amount');

  const handleSubmit = (data: PayoutFormData) => {
    createPayout({
      museumId,
      bankAccountId: data.bankAccountId,
      amount: data.amount,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    form.setValue('amount', value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Wallet Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-4 w-4" />
              Thông tin ví
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Số dư khả dụng:</span>
                <p className="font-semibold text-green-600 text-lg">{formatCurrency(maxAmount)}</p>
              </div>
              <div>
                <span className="text-gray-600">Số dư chờ xử lý:</span>
                <p className="font-medium text-yellow-600">{formatCurrency(wallet?.pendingBalance || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Account Selection */}
        <FormField
          control={form.control}
          name="bankAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tài khoản ngân hàng nhận tiền</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tài khoản ngân hàng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{account.bankName}</p>
                          <p className="text-xs text-gray-500">
                            {account.holderName} - {account.accountNumber}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected Bank Account Preview */}
        {selectedBankAccount && (
          <div>
            <h6 className="text-sm font-medium ">Tài khoản được chọn</h6>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-blue-900">{selectedBankAccount.bankName}</p>
                <p className="text-blue-700">{selectedBankAccount.holderName}</p>
                <p className="text-sm font-mono text-blue-600">{selectedBankAccount.accountNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền rút</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Nhập số tiền muốn rút"
                    min={1000}
                    max={maxAmount}
                    step={1000}
                    disabled={isCreating}
                    {...field}
                    onChange={handleAmountChange}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">VND</div>
                </div>
              </FormControl>
              <FormDescription>Số tiền tối đa: {formatCurrency(maxAmount)}</FormDescription>
              <FormMessage />
              {enteredAmount > 0 && (
                <div className="text-sm space-y-1 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Số tiền rút:</span>
                    <span className="font-semibold">{formatCurrency(enteredAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Số dư còn lại:</span>
                    <span>{formatCurrency(maxAmount - enteredAmount)}</span>
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isCreating} className="gap-2">
            <X className="h-4 w-4" />
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isCreating || !selectedBankAccountId || enteredAmount <= 0 || enteredAmount > maxAmount}
            className="gap-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tạo yêu cầu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Tạo yêu cầu rút tiền
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PayoutForm;
