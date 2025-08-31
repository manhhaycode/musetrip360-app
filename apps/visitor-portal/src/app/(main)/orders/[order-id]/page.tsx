'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetOrderById, Order, OrderTypeEnum, PaymentStatusEnum } from '@musetrip360/payment-management';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Separator } from '@musetrip360/ui-core/separator';
import { ArrowLeft, CheckCircle, Clock, XCircle, Calendar, Eye, MapPin, Loader2, ExternalLink } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params['order-id'] as string;

  const { data: order, isLoading, error } = useGetOrderById(orderId);

  const handleBack = () => {
    router.back();
  };

  const handleNavigateToItem = () => {
    if (!order) return;

    if (order.orderType === OrderTypeEnum.Event && order.orderEvents[0]) {
      router.push(`/events/${order.orderEvents[0].eventId}`);
    } else if (order.orderType === OrderTypeEnum.Tour && order.orderTours[0]) {
      router.push(`/virtual-tour/${order.orderTours[0].tourId}`);
    }
  };

  const getStatusBadge = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.Success:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Đã thanh toán</Badge>;
      case PaymentStatusEnum.Pending:
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            Đang xử lý
          </Badge>
        );
      case PaymentStatusEnum.Canceled:
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusIcon = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.Success:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case PaymentStatusEnum.Pending:
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case PaymentStatusEnum.Canceled:
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderItemCard = (order: Order) => {
    if (order.orderType === OrderTypeEnum.Event && order.orderEvents[0]) {
      const orderEvent = order.orderEvents[0];
      const event = orderEvent.event;

      return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleNavigateToItem}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                Sự kiện
              </CardTitle>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
              {event.description && (
                <p className="text-muted-foreground mt-1 text-sm line-clamp-2">{event.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Thời gian</p>
                  <p className="font-medium">{new Date(event.startTime).toLocaleString('vi-VN')}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Địa điểm</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Giá vé</span>
              <span className="font-semibold text-lg">
                {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
              </span>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (order.orderType === OrderTypeEnum.Tour && order.orderTours[0]) {
      const orderTour = order.orderTours[0];
      const tour = orderTour.tourOnline;

      return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleNavigateToItem}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="w-5 h-5 text-primary" />
                Virtual Tour
              </CardTitle>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{tour.name}</h3>
              {tour.description && (
                <p className="text-muted-foreground mt-1 text-sm line-clamp-2">{tour.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Số không gian</p>
                <p className="font-medium">{tour.metadata?.scenes?.length || 0} không gian 3D</p>
              </div>

              <div>
                <p className="text-muted-foreground">Truy cập</p>
                <p className="font-medium">Vĩnh viễn</p>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Giá tour</span>
              <span className="font-semibold text-lg">
                {tour.price > 0 ? `${tour.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
              </span>
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Không tìm thấy đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.</p>
            <Button onClick={handleBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={handleBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chi tiết đơn hàng</h1>
            <p className="text-muted-foreground">Xem thông tin chi tiết về đơn hàng của bạn</p>
          </div>
        </div>

        {/* Status Alert */}
        {order.status === PaymentStatusEnum.Success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Đơn hàng đã được thanh toán thành công. Bạn có thể truy cập sản phẩm ngay bây giờ.
            </AlertDescription>
          </Alert>
        )}

        {order.status === PaymentStatusEnum.Pending && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Đơn hàng đang được xử lý. Vui lòng chờ trong giây lát.
            </AlertDescription>
          </Alert>
        )}

        {order.status === PaymentStatusEnum.Canceled && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>Đơn hàng đã bị hủy. Vui lòng liên hệ hỗ trợ nếu bạn cần thêm thông tin.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Order Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  Thông tin đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Mã đơn hàng</span>
                  <span className="font-mono font-medium">#{order.id}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Loại đơn hàng</span>
                  <Badge variant="outline">
                    {order.orderType === OrderTypeEnum.Event
                      ? 'Sự kiện'
                      : order.orderType === OrderTypeEnum.Tour
                        ? 'Virtual Tour'
                        : order.orderType}
                  </Badge>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Trạng thái</span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Người đặt</span>
                  <div className="text-right">
                    <p className="font-medium">{order.createdByUser.fullName}</p>
                    <p className="text-sm text-muted-foreground">{order.createdByUser.email}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Thời gian đặt</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                </div>

                <div className="flex justify-between items-center py-2 text-lg font-semibold">
                  <span>Tổng tiền</span>
                  <span className="text-primary">{order.totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Card */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Sản phẩm đã mua</h2>
              {renderItemCard(order)}
            </div>

            {/* Actions */}
            {order.status === PaymentStatusEnum.Success && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button onClick={handleNavigateToItem} className="w-full" size="lg">
                      {order.orderType === OrderTypeEnum.Event ? (
                        <>
                          <Calendar className="w-4 h-4 mr-2" />
                          Xem chi tiết sự kiện
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Trải nghiệm Virtual Tour
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Bạn có thể truy cập sản phẩm này bất cứ lúc nào từ trang cá nhân.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
