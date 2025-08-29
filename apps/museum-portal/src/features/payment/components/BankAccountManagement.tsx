'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@musetrip360/ui-core/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@musetrip360/ui-core/alert-dialog';
import { toast } from '@musetrip360/ui-core/sonner';
import { useGetMuseumBankAccounts, useDeleteBankAccount, BankAccount } from '@musetrip360/payment-management';
import BankAccountForm from './BankAccountForm';
import get from 'lodash/get';

interface BankAccountManagementProps {
  museumId: string;
}

const BankAccountManagement: React.FC<BankAccountManagementProps> = ({ museumId }) => {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: bankAccountsData, isLoading, error, refetch } = useGetMuseumBankAccounts(museumId);

  const bankAccounts = get(bankAccountsData, 'data', []) as BankAccount[];

  const { mutate: deleteBankAccount, isPending: isDeleting } = useDeleteBankAccount({
    onSuccess: () => {
      toast.success('Đã xóa tài khoản ngân hàng');
      refetch();
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi xóa tài khoản ngân hàng: ' + error.message);
    },
  });

  const handleAddNew = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const handleEdit = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const handleDelete = (accountId: string) => {
    deleteBankAccount(accountId);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedAccount(null);
    refetch();
    toast.success('Đã lưu thông tin tài khoản ngân hàng');
  };

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
        <p>Có lỗi xảy ra khi tải danh sách tài khoản ngân hàng</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-2">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Danh sách tài khoản ngân hàng</h3>
          <p className="text-sm text-gray-600">Quản lý tài khoản ngân hàng để nhận tiền từ ví bảo tàng</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm tài khoản
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedAccount ? 'Cập nhật tài khoản ngân hàng' : 'Thêm tài khoản ngân hàng mới'}
              </DialogTitle>
            </DialogHeader>
            <BankAccountForm
              museumId={museumId}
              bankAccount={selectedAccount}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Bank Accounts List */}
      {bankAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài khoản ngân hàng</h3>
            <p className="text-gray-500 text-center mb-4">
              Thêm tài khoản ngân hàng để có thể nhận tiền từ ví bảo tàng
            </p>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm tài khoản đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bankAccounts.map((account) => (
            <Card key={account.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5" />
                      {account.bankName}
                    </CardTitle>
                    <CardDescription className="mt-1">{account.holderName}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(account)} className="gap-1">
                      <Edit className="h-3 w-3" />
                      Sửa
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isDeleting}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa tài khoản ngân hàng này? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(account.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Số tài khoản:</span>
                    <p className="font-mono mt-1">{account.accountNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">QR Code:</span>
                    {account.qrCode && (
                      <div className="mt-2">
                        <img src={account.qrCode} alt="QR Code" className="w-20 h-20 object-cover rounded border" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankAccountManagement;
