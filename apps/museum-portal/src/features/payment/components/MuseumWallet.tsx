'use client';

import React from 'react';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { useMuseumWallet } from '@musetrip360/payment-management/api';

interface MuseumWalletProps {
  museumId: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const MuseumWallet: React.FC<MuseumWalletProps> = ({ museumId }) => {
  const { data: wallet, isLoading, error, refetch } = useMuseumWallet(museumId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Có lỗi xảy ra khi tải thông tin ví</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-2">
          Thử lại
        </Button>
      </div>
    );
  }

  // Default values if wallet is null/undefined
  const walletData = wallet || {
    id: 'default',
    museumId,
    availableBalance: 0,
    pendingBalance: 0,
    totalBalance: 0,
  };

  const hasAvailableBalance = walletData.availableBalance > 0;

  return (
    <div className="space-y-6">
      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Số dư khả dụng</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{formatCurrency(walletData.availableBalance)}</div>
            <p className="text-xs text-green-600 mt-1">Có thể rút về tài khoản ngân hàng</p>
          </CardContent>
        </Card>

        {/* Pending Balance */}
        <Card className="border-2 border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Số dư chờ xử lý</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{formatCurrency(walletData.pendingBalance)}</div>
            <p className="text-xs text-yellow-600 mt-1">Đang chờ xử lý thanh toán</p>
          </CardContent>
        </Card>

        {/* Total Balance */}
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Tổng số dư</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{formatCurrency(walletData.totalBalance)}</div>
            <p className="text-xs text-blue-600 mt-1">Tổng tài sản trong ví</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Status Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Thông tin ví bảo tàng
          </CardTitle>
          <CardDescription>Thông tin chi tiết về trạng thái ví và khả năng giao dịch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Balance Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Trạng thái ví</h4>
              <p className="text-sm text-gray-600 mt-1">
                {hasAvailableBalance ? 'Có thể thực hiện rút tiền' : 'Chưa có số dư khả dụng để rút'}
              </p>
            </div>
            <Badge
              variant={hasAvailableBalance ? 'default' : 'secondary'}
              className={hasAvailableBalance ? 'bg-green-100 text-green-800' : ''}
            >
              {hasAvailableBalance ? 'Hoạt động' : 'Không khả dụng'}
            </Badge>
          </div>

          {/* Withdrawal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">ID ví:</span>
              <p className="font-mono mt-1 text-gray-900">{walletData.id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Mã bảo tàng:</span>
              <p className="font-mono mt-1 text-gray-900">{museumId}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h5 className="font-medium text-blue-900 mb-2">Hướng dẫn sử dụng ví:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Số dư khả dụng có thể được rút về tài khoản ngân hàng đã đăng ký</li>
              <li>• Số dư chờ xử lý sẽ chuyển thành khả dụng sau khi giao dịch được hoàn tất</li>
              <li>• Cần có ít nhất một tài khoản ngân hàng để thực hiện rút tiền</li>
              <li>• Thời gian xử lý rút tiền: 1-3 ngày làm việc</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MuseumWallet;
