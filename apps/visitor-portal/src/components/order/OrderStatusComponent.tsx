'use client';

import { PaymentStatusEnum, useGetOrderByCode } from '@musetrip360/payment-management';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { cn } from '@musetrip360/ui-core/utils';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Home,
  Receipt,
  RotateCcw,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderStatusComponentProps {
  pageType: 'success' | 'cancel';
  className?: string;
}

export function OrderStatusComponent({ pageType, className }: OrderStatusComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderCode = searchParams.get('orderCode');

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderByCode(orderCode || '', {
    enabled: !!orderCode,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // No order ID provided
  if (!orderCode) {
    const isCancel = pageType === 'cancel';
    return (
      <div className={cn('container mx-auto py-8 max-w-2xl', className)}>
        <Card>
          <CardContent className="p-8 text-center">
            {isCancel ? (
              <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold mb-4">{isCancel ? 'Thanh toán bị hủy' : 'Thiếu thông tin đơn hàng'}</h1>
            <p className="text-gray-600 mb-6">
              {isCancel
                ? 'Bạn đã hủy quá trình thanh toán. Không có đơn hàng nào được tạo.'
                : 'Không tìm thấy mã đơn hàng. Vui lòng kiểm tra lại đường dẫn.'}
            </p>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <Button>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Trang chủ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('container mx-auto py-8 max-w-2xl', className)}>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or order not found
  if (error || !order) {
    return (
      <div className={cn('container mx-auto py-8 max-w-2xl', className)}>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
            <p className="text-gray-600 mb-6">Đơn hàng với mã "{orderCode}" không tồn tại hoặc đã bị xóa.</p>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <Button>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Trang chủ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = order.status === PaymentStatusEnum.Success;
  const isPending = order.status === PaymentStatusEnum.Pending;
  const isCanceled = order.status === PaymentStatusEnum.Canceled;

  // Status headers and messages based on page type and status
  const getStatusConfig = () => {
    if (pageType === 'success') {
      return {
        icon: isSuccess ? (
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
        ) : isPending ? (
          <Clock className="h-20 w-20 text-blue-500 mx-auto" />
        ) : (
          <AlertCircle className="h-20 w-20 text-red-500 mx-auto" />
        ),
        title: isSuccess ? 'Thanh toán thành công!' : isPending ? 'Đang xử lý thanh toán...' : 'Thanh toán thất bại',
        description: isSuccess
          ? 'Cảm ơn bạn đã hoàn tất thanh toán. Đơn hàng của bạn đã được xác nhận.'
          : isPending
            ? 'Đơn hàng của bạn đang được xử lý. Vui lòng đợi trong giây lát.'
            : 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.',
        badgeText: isSuccess ? 'Hoàn thành' : isPending ? 'Đang xử lý' : 'Thất bại',
      };
    } else {
      // cancel page
      return {
        icon: isSuccess ? (
          <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto" />
        ) : (
          <X className="h-20 w-20 text-red-500 mx-auto" />
        ),
        title: isSuccess ? 'Đơn hàng đã được thanh toán' : isPending ? 'Thanh toán bị hủy' : 'Thanh toán thất bại',
        description: isSuccess
          ? 'Đơn hàng này đã được thanh toán thành công trước đó.'
          : isPending
            ? 'Bạn đã hủy quá trình thanh toán. Đơn hàng vẫn đang chờ xử lý.'
            : 'Quá trình thanh toán đã thất bại. Vui lòng thử lại.',
        badgeText: isSuccess ? 'Đã hoàn thành' : isPending ? 'Đã hủy thanh toán' : 'Thất bại',
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={cn('container mx-auto py-8 max-w-2xl', className)}>
      <div className="space-y-6">
        {/* Status Header */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">{statusConfig.icon}</div>
            <h1 className="text-3xl font-bold mb-2">{statusConfig.title}</h1>
            <p className="text-gray-600 mb-6">{statusConfig.description}</p>
            <Badge
              className={cn(
                'text-base px-4 py-2',
                isSuccess && 'bg-green-100 text-green-800 border-green-200',
                isPending &&
                  (pageType === 'success'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-orange-100 text-orange-800 border-orange-200'),
                isCanceled && 'bg-red-100 text-red-800 border-red-200'
              )}
            >
              {statusConfig.badgeText}
            </Badge>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Chi tiết đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Mã đơn hàng:</span>
                <p className="font-medium">{order.metadata?.orderCode || order.id}</p>
              </div>
              <div>
                <span className="text-gray-600">Loại đơn hàng:</span>
                <p className="font-medium">
                  {order.orderType === 'Event'
                    ? 'Sự kiện'
                    : order.orderType === 'Tour'
                      ? 'Tour'
                      : order.orderType === 'Subscription'
                        ? 'Đăng ký'
                        : order.orderType}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Tổng tiền:</span>
                <p className="font-bold text-lg text-primary">{formatPrice(order.totalAmount)}</p>
              </div>
              <div>
                <span className="text-gray-600">Thời gian tạo:</span>
                <p className="font-medium">{formatDateTime(order.createdAt.toString())}</p>
              </div>
            </div>

            {order.metadata?.description && (
              <div>
                <span className="text-gray-600 text-sm">Mô tả:</span>
                <p className="font-medium">{order.metadata.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information - Only for cancel page */}
        {pageType === 'cancel' && order.metadata && (isPending || isCanceled) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.metadata.expiredAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hạn thanh toán:</span>
                  <span className="font-medium">{formatDateTime(order.metadata.expiredAt.toString())}</span>
                </div>
              )}
              {order.metadata.currency && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đơn vị tiền tệ:</span>
                  <span className="font-medium">{order.metadata.currency}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Status-specific Alerts */}
        {pageType === 'success' && isPending && (
          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Trang này sẽ tự động cập nhật khi thanh toán hoàn tất.
              {order.metadata?.checkoutUrl && (
                <>
                  {' '}
                  Hoặc bạn có thể{' '}
                  <a
                    href={order.metadata.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    quay lại trang thanh toán
                  </a>
                  .
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {pageType === 'success' && isCanceled && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Thanh toán không thành công. Vui lòng kiểm tra thông tin thanh toán và thử lại.
            </AlertDescription>
          </Alert>
        )}

        {pageType === 'cancel' && isSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Đơn hàng này đã được thanh toán thành công. Bạn có thể xem chi tiết trong{' '}
              <Link href={`/order/success?orderCode=${orderCode}`} className="underline font-medium">
                trang thành công
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}

        {pageType === 'cancel' && isPending && (
          <Alert className="border-orange-200 bg-orange-50">
            <X className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Bạn đã hủy quá trình thanh toán. Đơn hàng vẫn còn hiệu lực và bạn có thể tiếp tục thanh toán.
              {order.metadata?.expiredAt && (
                <> Đơn hàng sẽ hết hạn vào {formatDateTime(order.metadata.expiredAt.toString())}.</>
              )}
            </AlertDescription>
          </Alert>
        )}

        {pageType === 'cancel' && isCanceled && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Thanh toán không thành công. Vui lòng kiểm tra thông tin thanh toán và thử lại sau.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {/* Success page actions */}
          {pageType === 'success' && isSuccess && (
            <>
              <Link href="/">
                <Button leftIcon={<Home className="h-4 w-4 mr-2" />}>Về trang chủ</Button>
              </Link>
              {order.orderType === 'Event' && (
                <Link href="/events">
                  <Button variant="outline" leftIcon={<Calendar className="h-4 w-4 mr-2" />}>
                    Xem sự kiện khác
                  </Button>
                </Link>
              )}
            </>
          )}

          {pageType === 'success' && isPending && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Làm mới trang
            </Button>
          )}

          {pageType === 'success' && isCanceled && (
            <>
              <Button variant="outline" onClick={() => router.back()}>
                Quay lại
              </Button>
              <Link href="/">
                <Button leftIcon={<Home className="h-4 w-4 mr-2" />}>Trang chủ</Button>
              </Link>
            </>
          )}

          {/* Cancel page actions */}
          {pageType === 'cancel' && isSuccess && (
            <>
              <Button>
                <Link href={`/order/success?orderCode=${orderCode}`}>Xem trang thành công</Link>
              </Button>
              <Button variant="outline">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Trang chủ
                </Link>
              </Button>
            </>
          )}

          {pageType === 'cancel' && isPending && (
            <>
              {order.metadata?.checkoutUrl && (
                <a href={order.metadata.checkoutUrl} target="_blank" rel="noopener noreferrer">
                  <Button leftIcon={<CreditCard className="h-4 w-4 mr-2" />}>Tiếp tục thanh toán</Button>
                </a>
              )}
              <Button variant="outline" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4 mr-2" />}>
                Quay lại
              </Button>
            </>
          )}

          {pageType === 'cancel' && isCanceled && (
            <>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                leftIcon={<RotateCcw className="h-4 w-4 mr-2" />}
              >
                Thử lại
              </Button>
              <Button variant="outline" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4 mr-2" />}>
                Quay lại
              </Button>
              <Link href="/">
                <Button leftIcon={<Home className="h-4 w-4 mr-2" />}>Trang chủ</Button>
              </Link>
            </>
          )}
        </div>

        {/* Help Section - Only for cancel page */}
        {pageType === 'cancel' && (
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Cần hỗ trợ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nếu bạn gặp vấn đề với thanh toán hoặc có câu hỏi về đơn hàng, vui lòng liên hệ với chúng tôi.
              </p>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  Liên hệ hỗ trợ
                </Button>
                <Button variant="outline" size="sm">
                  Câu hỏi thường gặp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
