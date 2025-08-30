'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@musetrip360/ui-core/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { CreditCard, Wallet, ArrowDownToLine } from 'lucide-react';
import { useMuseumStore } from '@musetrip360/museum-management';
import MuseumWallet from '../components/MuseumWallet';
import BankAccountManagement from '../components/BankAccountManagement';
import PayoutManagement from '../components/PayoutManagement';
import Divider from '@/components/Divider';

const PaymentManagementPage = () => {
  const { selectedMuseum } = useMuseumStore();
  const [activeTab, setActiveTab] = useState('wallet');

  if (!selectedMuseum?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Museum Selected</h2>
          <p className="text-gray-500">Please select a museum to manage payments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-7xl max-w-full mx-auto px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý thanh toán</h1>
        <p className="text-gray-600 mt-2">Quản lý ví, tài khoản ngân hàng và yêu cầu rút tiền</p>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="mt-8 w=full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Ví bảo tàng
            </TabsTrigger>
            <TabsTrigger value="bank-accounts" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Tài khoản ngân hàng
            </TabsTrigger>
            <TabsTrigger value="payouts" className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Yêu cầu rút tiền
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin ví bảo tàng</CardTitle>
                <CardDescription>Xem thông tin số dư và lịch sử giao dịch của ví bảo tàng</CardDescription>
              </CardHeader>
              <CardContent>
                <MuseumWallet museumId={selectedMuseum.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank-accounts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý tài khoản ngân hàng</CardTitle>
                <CardDescription>Thêm và quản lý tài khoản ngân hàng để nhận tiền rút từ ví bảo tàng</CardDescription>
              </CardHeader>
              <CardContent>
                <BankAccountManagement museumId={selectedMuseum.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý yêu cầu rút tiền</CardTitle>
                <CardDescription>Tạo yêu cầu rút tiền và theo dõi trạng thái xử lý</CardDescription>
              </CardHeader>
              <CardContent>
                <PayoutManagement museumId={selectedMuseum.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PaymentManagementPage;
