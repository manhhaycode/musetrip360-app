'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Clock, CheckCircle, XCircle, MoreHorizontal, Check, Eye, RefreshCw, Upload, FileImage } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { Badge } from '@musetrip360/ui-core/badge';
import { DataTable } from '@musetrip360/ui-core/data-table';
import { useDataTable } from '@musetrip360/ui-core/data-table';
import { useDataTableState } from '@musetrip360/ui-core/data-table';
import { Input } from '@musetrip360/ui-core/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@musetrip360/ui-core/dialog';
import { Label } from '@musetrip360/ui-core/label';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { toast } from '@musetrip360/ui-core/sonner';
import { useApprovePayout, Payout, usePayoutsAdmin, PayoutStatusEnum } from '@musetrip360/payment-management';
import { formatCurrency, useFileUpload } from '@musetrip360/shared';
import get from 'lodash/get';
import { Card, CardContent } from '@musetrip360/ui-core';

// Remove PayoutWithMuseum interface as Payout now has museum and bankAccount fields

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadge = (status: PayoutStatusEnum) => {
  switch (status) {
    case PayoutStatusEnum.Pending:
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Đang xử lý
        </Badge>
      );
    case PayoutStatusEnum.Approved:
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã hoàn thành
        </Badge>
      );
    case PayoutStatusEnum.Rejected:
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

const PayoutListPage = () => {
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [modalType, setModalType] = useState<'details' | 'approval' | null>(null);

  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  // File upload mutation
  const uploadFileMutation = useFileUpload();

  // DataTable state management
  const {
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    pagination,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    setSorting,
    setPagination,
  } = useDataTableState({
    defaultPerPage: 10,
  });

  const {
    data: payoutsData,
    isLoading,
    error,
    refetch,
  } = usePayoutsAdmin({
    Page: pagination.pageIndex + 1,
    PageSize: pagination.pageSize,
  });

  const payouts = get(payoutsData, 'payouts', []) as Payout[];
  const totalCount = get(payoutsData, 'total', 0);

  const approveMutation = useApprovePayout({
    onSuccess: () => {
      toast.success('Đã phê duyệt yêu cầu rút tiền thành công');
      refetch();
    },
    onError: (error) => {
      toast.error(`Lỗi phê duyệt: ${error.message}`);
    },
  });

  // Table columns definition
  const columns = useMemo<ColumnDef<Payout>[]>(
    () => [
      {
        accessorKey: 'museum.name',
        header: 'Museum',
        cell: ({ row }) => <div className="font-medium">{row.original.museum?.name || 'N/A'}</div>,
        meta: {
          variant: 'text',
          placeholder: 'Search by museum',
          label: 'Museum',
          unit: '',
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => <div className="font-mono font-semibold">{formatCurrency(row.original.amount)}</div>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.original.status),
        meta: {
          variant: 'select',
          placeholder: 'Filter by status',
          label: 'Status',
          unit: '',
          options: Object.values(PayoutStatusEnum).map((status) => ({
            label:
              status === PayoutStatusEnum.Pending
                ? 'Chờ xử lý'
                : status === PayoutStatusEnum.Approved
                  ? 'Đã phê duyệt'
                  : status === PayoutStatusEnum.Rejected
                    ? 'Đã từ chối'
                    : status,
            value: status,
          })),
        },
      },
      {
        accessorKey: 'bankAccount',
        header: 'Bank Account',
        cell: ({ row }) => {
          const bankAccount = row.original.bankAccount;
          return (
            <div className="space-y-1">
              <div className="font-medium text-sm">{bankAccount?.bankName || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">{bankAccount?.holderName || 'N/A'}</div>
              <div className="text-xs font-mono text-muted-foreground">{bankAccount?.accountNumber || 'N/A'}</div>
            </div>
          );
        },
        meta: {
          variant: 'text',
          placeholder: 'Search bank info',
          label: 'Bank Account',
          unit: '',
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const payout = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewDetails(payout)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </DropdownMenuItem>
                {payout.status === PayoutStatusEnum.Pending && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleOpenApproval(payout)}
                      disabled={approveMutation.isPending}
                      className="text-green-600"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Phê duyệt
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [approveMutation.isPending]
  );

  // DataTable setup
  const { table } = useDataTable({
    data: payouts,
    columns,
    rowCount: totalCount,
    manualHandle: true,
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    pagination,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    setSorting,
    setPagination,
  });

  const handleOpenApproval = (payout: Payout) => {
    setSelectedPayout(payout);
    setPaymentProofUrl('');
    setApprovalNote('');
    setModalType(null); // Ensure details modal closes first
    setTimeout(() => setModalType('approval'), 0); // Open approval modal after closing details
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      const result = await uploadFileMutation.mutateAsync(file);
      setPaymentProofUrl(result.data.url);
      toast.success('Tải ảnh thành công');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Lỗi tải ảnh. Vui lòng thử lại.');
    }
  };

  const handleApprove = async () => {
    if (!selectedPayout) return;

    if (!paymentProofUrl) {
      toast.error('Vui lòng tải lên ảnh chứng từ thanh toán');
      return;
    }

    if (!approvalNote.trim()) {
      toast.error('Vui lòng nhập ghi chú xác nhận');
      return;
    }

    try {
      await approveMutation.mutateAsync({
        id: selectedPayout.id,
        metadata: {
          ...selectedPayout.metadata,
          imageUrl: paymentProofUrl,
          note: approvalNote.trim(),
        },
      });
      setModalType(null);
    } catch (error) {
      console.error('Error approving payout:', error);
    }
  };

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout);
    setModalType('details');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-2xl border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p className="text-lg font-medium mb-2">Có lỗi xảy ra khi tải danh sách yêu cầu rút tiền</p>
        <p className="text-sm mb-4">{get(error, 'message', 'Lỗi không xác định')}</p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payout Management</h1>
          <p className="text-muted-foreground">Review and approve payout requests from museums</p>
        </div>
      </div>

      <DataTable table={table} isLoading={isLoading} />

      {/* Approval Modal */}
      <Dialog open={modalType === 'approval'} onOpenChange={(open) => setModalType(open ? 'approval' : null)}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Phê duyệt yêu cầu rút tiền
            </DialogTitle>
            <DialogDescription>
              Xác nhận phê duyệt yêu cầu rút tiền #{selectedPayout?.id.slice(-8)} với ảnh chứng từ và ghi chú
            </DialogDescription>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-6">
              {/* Payout Summary */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-blue-700">Số tiền</label>
                    <p className="text-lg font-bold text-blue-900">{formatCurrency(selectedPayout.amount)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-700">Bảo tàng</label>
                    <p className="font-medium text-blue-900">{selectedPayout.museum?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-700">Ngân hàng</label>
                    <p className="font-medium text-blue-900">{selectedPayout.bankAccount?.bankName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-700">Số tài khoản</label>
                    <p className="font-mono text-blue-900">{selectedPayout.bankAccount?.accountNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-3">
                <Label htmlFor="payment-proof" className="text-base font-medium text-red-600 flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  Ảnh chứng từ thanh toán * (Bắt buộc)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {paymentProofUrl ? (
                    <div className="space-y-3">
                      <img src={paymentProofUrl} alt="Payment proof" className="max-h-48 mx-auto rounded border" />
                      <p className="text-sm text-green-600 font-medium">Ảnh đã được tải lên thành công</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPaymentProofUrl('');
                        }}
                      >
                        Thay đổi ảnh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Kéo thả ảnh vào đây hoặc nhấp để chọn tệp</p>
                        <Input
                          id="payment-proof"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          className="max-w-xs mx-auto"
                          disabled={uploadFileMutation.isPending}
                        />
                      </div>
                      {uploadFileMutation.isPending && <p className="text-sm text-blue-600">Đang tải ảnh...</p>}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">Chấp nhận định dạng: JPG, PNG, GIF. Kích thước tối đa: 10MB</p>
              </div>

              {/* Note Section */}
              <div className="space-y-3">
                <Label htmlFor="approval-note" className="text-base font-medium text-red-600">
                  Ghi chú xác nhận * (Bắt buộc)
                </Label>
                <Textarea
                  id="approval-note"
                  placeholder="Nhập ghi chú xác nhận chuyển tiền (ví dụ: 'Đã chuyển khoản thành công vào ngày DD/MM/YYYY lúc HH:MM qua ngân hàng XXX')..."
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  rows={4}
                  className="resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ghi chú sẽ được lưu vào lịch sử giao dịch</span>
                  <span>{approvalNote.length}/500</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              Hủy
            </Button>
            <Button
              onClick={handleApprove}
              disabled={
                approveMutation.isPending || uploadFileMutation.isPending || !paymentProofUrl || !approvalNote.trim()
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Xác nhận phê duyệt
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Details Modal */}
      <Dialog open={modalType === 'details'} onOpenChange={(open) => setModalType(open ? 'details' : null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu rút tiền</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu rút tiền #{selectedPayout?.id.slice(-8)}
            </DialogDescription>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Số tiền</label>
                  <p className="text-lg font-bold">{formatCurrency(selectedPayout.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedPayout.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Bảo tàng</label>
                  <p className="mt-1">{selectedPayout.museum?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày tạo</label>
                  <p className="mt-1">{formatDate(selectedPayout.processedDate)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Thông tin tài khoản ngân hàng</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ngân hàng</p>
                      <p className="font-medium">{selectedPayout.bankAccount?.bankName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Chủ tài khoản</p>
                      <p className="font-medium">{selectedPayout.bankAccount?.holderName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Số tài khoản</p>
                    <p className="font-mono">{selectedPayout.bankAccount?.accountNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedPayout.bankAccount?.qrCode && (
                <div>
                  <label className="text-sm font-medium text-gray-600">QR Code tài khoản ngân hàng</label>
                  <div className="mt-2">
                    <img
                      src={selectedPayout.bankAccount.qrCode}
                      alt="Bank account QR code"
                      className="max-w-xs h-auto rounded border"
                    />
                  </div>
                </div>
              )}

              {selectedPayout.metadata?.imageUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Hình ảnh đính kèm</label>
                  <div className="mt-2">
                    <img
                      src={selectedPayout.metadata.imageUrl}
                      alt="Payout attachment"
                      className="max-w-full h-auto rounded border"
                    />
                  </div>
                </div>
              )}

              {selectedPayout.status === PayoutStatusEnum.Pending && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleOpenApproval(selectedPayout);
                    }}
                    disabled={approveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Phê duyệt
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayoutListPage;
