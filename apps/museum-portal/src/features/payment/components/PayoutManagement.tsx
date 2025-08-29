'use client';

import React, { useState } from 'react';
import { Plus, ArrowDownToLine, Building2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@musetrip360/ui-core/dialog';
import { toast } from '@musetrip360/ui-core/sonner';
import {
  useMuseumPayouts,
  useMuseumWallet,
  useGetMuseumBankAccounts,
  BankAccount,
} from '@musetrip360/payment-management';
import PayoutForm from './PayoutForm';

interface PayoutManagementProps {
  museumId: string;
}
import get from 'lodash/get';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Đang xử lý
        </Badge>
      );
    case 'approved':
    case 'completed':
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã hoàn thành
        </Badge>
      );
    case 'rejected':
    case 'failed':
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Thất bại
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const PayoutManagement: React.FC<PayoutManagementProps> = ({ museumId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data: payouts = [],
    isLoading: isLoadingPayouts,
    error: payoutsError,
    refetch: refetchPayouts,
  } = useMuseumPayouts(museumId);

  const { data: wallet, isLoading: isLoadingWallet } = useMuseumWallet(museumId);

  const { data: bankAccountsData, isLoading: isLoadingBankAccounts } = useGetMuseumBankAccounts(museumId);

  const bankAccounts = get(bankAccountsData, 'data', []) as BankAccount[];

  const hasAvailableBalance = wallet && wallet.availableBalance > 0;
  const hasBankAccounts = bankAccounts.length > 0;
  const canCreatePayout = hasAvailableBalance && hasBankAccounts;

  const handleCreatePayout = () => {
    if (!canCreatePayout) {
      if (!hasAvailableBalance) {
        toast.error('Ví của bạn không có số dư khả dụng để rút tiền.');
      } else if (!hasBankAccounts) {
        toast.error('Bạn cần thêm ít nhất một tài khoản ngân hàng để rút tiền.');
      }
      return;
    }
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetchPayouts();
    toast.success('Đã tạo yêu cầu rút tiền thành công');
  };

  if (isLoadingPayouts || isLoadingWallet || isLoadingBankAccounts) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (payoutsError) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Có lỗi xảy ra khi tải danh sách yêu cầu rút tiền</p>
        <Button onClick={() => refetchPayouts()} variant="outline" className="mt-2">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Danh sách yêu cầu rút tiền</h3>
          <p className="text-sm text-gray-600">Quản lý các yêu cầu rút tiền từ ví bảo tàng về tài khoản ngân hàng</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreatePayout} disabled={!canCreatePayout} className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo yêu cầu rút tiền
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo yêu cầu rút tiền mới</DialogTitle>
            </DialogHeader>
            <PayoutForm
              museumId={museumId}
              wallet={wallet}
              bankAccounts={bankAccounts}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Information */}
      {(!hasAvailableBalance || !hasBankAccounts) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <ArrowDownToLine className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Không thể tạo yêu cầu rút tiền</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {!hasAvailableBalance && <li>• Ví của bạn không có số dư khả dụng để rút</li>}
                  {!hasBankAccounts && <li>• Cần thêm ít nhất một tài khoản ngân hàng để rút tiền</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payouts List */}
      {payouts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ArrowDownToLine className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có yêu cầu rút tiền</h3>
            <p className="text-gray-500 text-center mb-4">
              Tạo yêu cầu rút tiền đầu tiên để chuyển số dư từ ví về tài khoản ngân hàng
            </p>
            <Button onClick={handleCreatePayout} disabled={!canCreatePayout} className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo yêu cầu đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => {
            const bankAccount = bankAccounts.find((acc) => acc.id === payout.bankAccountId);

            return (
              <Card key={payout.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ArrowDownToLine className="h-5 w-5" />
                        {formatCurrency(payout.amount)}
                      </CardTitle>
                      <CardDescription className="mt-1">Yêu cầu rút tiền #{payout.id.slice(-8)}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(payout.status)}
                      <span className="text-sm text-gray-500">{formatDate(payout.processedDate)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Account Info */}
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building2 className="h-4 w-4 text-gray-600 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">
                          {bankAccount?.bankName || 'Tài khoản không xác định'}
                        </p>
                        <p className="text-sm text-gray-600">{bankAccount?.holderName || 'N/A'}</p>
                        <p className="text-sm font-mono text-gray-500">{bankAccount?.accountNumber || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Payout Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số tiền:</span>
                        <span className="font-medium">{formatCurrency(payout.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span className="font-medium">{payout.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span className="font-medium">{formatDate(payout.processedDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Show image if available */}
                  {payout.metadata?.imageUrl && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-600 mb-2">Hình ảnh đính kèm:</p>
                      <img
                        src={payout.metadata.imageUrl}
                        alt="Payout attachment"
                        className="max-w-xs h-auto rounded border"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PayoutManagement;
