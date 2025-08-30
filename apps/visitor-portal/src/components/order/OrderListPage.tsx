/* eslint-disable import/no-extraneous-dependencies */
'use client';

import { useState } from 'react';
import { useGetOrders } from '@musetrip360/payment-management/api';
import { PaymentStatusEnum, OrderTypeEnum, Order } from '@musetrip360/payment-management';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Calendar, CreditCard, Package, Ticket, Users, Clock, MapPin, User, Star, Info } from 'lucide-react';
import get from 'lodash/get';

const getStatusBadgeVariant = (status: PaymentStatusEnum) => {
  switch (status) {
    case PaymentStatusEnum.Success:
      return 'default';
    case PaymentStatusEnum.Pending:
      return 'secondary';
    case PaymentStatusEnum.Canceled:
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusText = (status: PaymentStatusEnum) => {
  switch (status) {
    case PaymentStatusEnum.Success:
      return 'Thành công';
    case PaymentStatusEnum.Pending:
      return 'Đang xử lý';
    case PaymentStatusEnum.Canceled:
      return 'Đã hủy';
    default:
      return status;
  }
};

const getOrderTypeText = (type: OrderTypeEnum) => {
  switch (type) {
    case OrderTypeEnum.Event:
      return 'Sự kiện';
    case OrderTypeEnum.Tour:
      return 'Tour';
    case OrderTypeEnum.Subscription:
      return 'Đăng ký';
    default:
      return type;
  }
};

const getOrderTypeIcon = (type: OrderTypeEnum) => {
  switch (type) {
    case OrderTypeEnum.Event:
      return <Calendar className="h-4 w-4" />;
    case OrderTypeEnum.Tour:
      return <Package className="h-4 w-4" />;
    case OrderTypeEnum.Subscription:
      return <Users className="h-4 w-4" />;
    default:
      return <Ticket className="h-4 w-4" />;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const PAGE_SIZE = 20;

export function OrderListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatusEnum | undefined>();
  const [selectedType, setSelectedType] = useState<OrderTypeEnum | undefined>();

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetOrders({
    Page: currentPage,
    PageSize: PAGE_SIZE,
    status: selectedStatus,
    orderType: selectedType,
  });

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === 'all' ? undefined : (value as PaymentStatusEnum));
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value === 'all' ? undefined : (value as OrderTypeEnum));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-6">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Có lỗi xảy ra khi tải danh sách đơn hàng. Vui lòng thử lại sau.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = get(ordersData, 'list') || [];
  const totalPages = get(ordersData, 'total', 0) / PAGE_SIZE || 1;

  return (
    <div className="container mx-auto py-8 px-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
            <p className="text-muted-foreground">Quản lý và theo dõi các đơn hàng của bạn</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedStatus || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value={PaymentStatusEnum.Success}>Thành công</SelectItem>
              <SelectItem value={PaymentStatusEnum.Pending}>Đang xử lý</SelectItem>
              <SelectItem value={PaymentStatusEnum.Canceled}>Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType || 'all'} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Loại đơn hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value={OrderTypeEnum.Event}>Sự kiện</SelectItem>
              <SelectItem value={OrderTypeEnum.Tour}>Tour</SelectItem>
              <SelectItem value={OrderTypeEnum.Subscription}>Đăng ký</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-muted-foreground">
                  {selectedStatus || selectedType
                    ? 'Không tìm thấy đơn hàng nào phù hợp với bộ lọc.'
                    : 'Bạn chưa có đơn hàng nào. Hãy khám phá các sự kiện và tour thú vị!'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          orders.map((order: Order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getOrderTypeIcon(order.orderType)}
                    <div>
                      <CardTitle className="text-lg">
                        Đơn hàng #{order.metadata?.orderCode || order.id.slice(-8)}
                      </CardTitle>
                      <CardDescription>
                        {getOrderTypeText(order.orderType)} • {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusText(order.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Enhanced Details Section Based on Order Type */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  {order.orderType === OrderTypeEnum.Event && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-700 font-medium">
                        <Calendar className="h-4 w-4" />
                        Chi tiết sự kiện
                      </div>

                      {/* Display actual event information from OrderEvent */}
                      {order.orderEvents && order.orderEvents.length > 0 ? (
                        <div className="space-y-3">
                          {order.orderEvents.map((orderEvent, index) => (
                            <div
                              key={orderEvent.eventId || index}
                              className="border-l-4 border-blue-200 pl-4 bg-blue-50 p-3 rounded"
                            >
                              {orderEvent.event ? (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-blue-900">{orderEvent.event.title}</h4>
                                  <p className="text-sm text-blue-800">{orderEvent.event.description}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-1 text-green-700">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        Bắt đầu: {new Date(orderEvent.event.startTime).toLocaleString('vi-VN')}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-700">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        Kết thúc: {new Date(orderEvent.event.endTime).toLocaleString('vi-VN')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-blue-700">Sự kiện ID: {orderEvent.eventId}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          {order.metadata?.expiredAt && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <Clock className="h-3 w-3" />
                              <span>Hạn: {new Date(order.metadata.expiredAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          )}
                          {order.metadata?.description && (
                            <div className="flex items-start gap-1">
                              <Info className="h-3 w-3 mt-0.5 text-gray-500" />
                              <span className="text-gray-600 line-clamp-2">{order.metadata.description}</span>
                            </div>
                          )}
                          {order.metadata?.paymentLinkId && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CreditCard className="h-3 w-3" />
                              <span>Link thanh toán khả dụng</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-500 col-span-full">
                            <Info className="h-3 w-3" />
                            <span>Chi tiết sự kiện sẽ được cập nhật sau khi thanh toán</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {order.orderType === OrderTypeEnum.Subscription && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-purple-700 font-medium">
                        <Package className="h-4 w-4" />
                        Chi tiết gói đăng ký
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {order.metadata?.expiredAt && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Clock className="h-3 w-3" />
                            <span>Hết hạn: {new Date(order.metadata.expiredAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-purple-600">
                          <Star className="h-3 w-3" />
                          <span>Gói thành viên cao cấp</span>
                        </div>
                        {order.metadata?.description && (
                          <div className="flex items-start gap-1 col-span-full">
                            <Info className="h-3 w-3 mt-0.5 text-gray-500" />
                            <span className="text-gray-600">{order.metadata.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {order.orderType === OrderTypeEnum.Tour && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-700 font-medium">
                        <MapPin className="h-4 w-4" />
                        Chi tiết tour
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {order.metadata?.expiredAt && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Clock className="h-3 w-3" />
                            <span>Hạn đặt: {new Date(order.metadata.expiredAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-green-600">
                          <User className="h-3 w-3" />
                          <span>Tour hướng dẫn viên</span>
                        </div>
                        {order.metadata?.description && (
                          <div className="flex items-start gap-1 col-span-full">
                            <Info className="h-3 w-3 mt-0.5 text-gray-500" />
                            <span className="text-gray-600">{order.metadata.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Information */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-lg">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    {order.metadata?.orderCode && (
                      <div className="text-xs text-muted-foreground">Mã đơn: #{order.metadata.orderCode}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {order.metadata?.checkoutUrl && order.status === PaymentStatusEnum.Pending && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(order.metadata?.checkoutUrl, '_blank')}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Thanh toán
                      </Button>
                    )}
                  </div>
                </div>

                {/* Additional Order Information */}
                {(order.metadata?.accountNumber || order.metadata?.bin || order.metadata?.qrCode) && (
                  <div className="mt-3 p-2 bg-blue-50 rounded border">
                    <div className="text-xs text-blue-700 font-medium mb-1">Thông tin thanh toán</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-blue-600">
                      {order.metadata?.bin && <div>Ngân hàng: {order.metadata.bin}</div>}
                      {order.metadata?.accountNumber && <div>STK: {order.metadata.accountNumber}</div>}
                      {order.metadata?.qrCode && <div className="col-span-full text-green-600">✓ QR Code có sẵn</div>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Trước
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
