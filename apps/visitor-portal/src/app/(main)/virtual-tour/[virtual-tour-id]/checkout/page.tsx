'use client';

import { CreateOrder, OrderTypeEnum, useCreateOrder } from '@musetrip360/payment-management';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { useVirtualTourById } from '@musetrip360/virtual-tour';
import { ArrowLeft, CheckCircle, CreditCard, Loader2, XCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VirtualTourCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const virtualTourId = params['virtual-tour-id'] as string;

  // Fetch virtual tour data
  const { data: virtualTour, isLoading: tourLoading, error: tourError } = useVirtualTourById(virtualTourId);

  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Create order mutation
  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      setPaymentSuccess(true);
      setIsProcessing(false);

      // Redirect to payment gateway or success page
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // If no payment URL, redirect to return URL after delay
        setTimeout(() => router.push(`${window.location.origin}/order/success`));
      }
    },
    onError: (error) => {
      setPaymentError(error.message || 'Đã xảy ra lỗi khi xử lý thanh toán');
      setIsProcessing(false);
    },
  });

  const handlePurchase = async () => {
    if (!virtualTour) return;

    setIsProcessing(true);
    setPaymentError(null);

    const orderData: CreateOrder = {
      orderType: OrderTypeEnum.Tour,
      itemIds: [virtualTourId],
      metadata: {
        tourName: virtualTour.name,
        tourDescription: virtualTour.description,
      },
      returnUrl: `${window.location.origin}/order/success?continueURL=${encodeURIComponent(window.location.origin + `/virtual-tour/${virtualTourId}`)}`,
      cancelUrl: `${window.location.origin}/order/cancel?continueURL=${encodeURIComponent(window.location.origin + `/virtual-tour/${virtualTourId}`)}`,
    };

    createOrderMutation.mutate(orderData);
  };

  const handleBack = () => {
    router.push(`/virtual-tour/${virtualTourId}`);
  };

  // Loading state
  if (tourLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (tourError || !virtualTour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Lỗi tải dữ liệu</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Không thể tải thông tin virtual tour. Vui lòng thử lại sau.</p>
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={handleBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Thanh toán Virtual Tour</h1>
            <p className="text-muted-foreground">Hoàn tất thanh toán để trải nghiệm tour ảo</p>
          </div>
        </div>

        {/* Payment Success */}
        {paymentSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Đơn hàng đã được tạo thành công! Đang chuyển hướng đến cổng thanh toán...
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Error */}
        {paymentError && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{paymentError}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Tour Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Thông tin sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{virtualTour.name}</h3>
                  {virtualTour.description && <p className="text-muted-foreground mt-1">{virtualTour.description}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary">Virtual Tour</Badge>
                    <Badge variant="outline">{virtualTour.metadata?.scenes?.length || 0} không gian</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Virtual Tour Access</span>
                <span className="font-medium">
                  {virtualTour.price > 0 ? `${virtualTour.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Phí xử lý</span>
                <span className="font-medium">0 VNĐ</span>
              </div>
              <div className="flex justify-between items-center py-2 text-lg font-semibold">
                <span>Tổng cộng</span>
                <span className={virtualTour.price > 0 ? 'text-primary' : 'text-green-600'}>
                  {virtualTour.price > 0 ? `${virtualTour.price.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {virtualTour.price > 0
                  ? '* Thanh toán một lần để truy cập vĩnh viễn vào virtual tour này.'
                  : '* Virtual tour này hiện miễn phí trải nghiệm. Bạn chỉ cần xác nhận để có thể truy cập.'}
              </p>
            </CardContent>
          </Card>

          {/* Payment Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button onClick={handlePurchase} disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Xác nhận & Truy cập Tour
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Bằng cách nhấn "Xác nhận", bạn đồng ý với{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Chính sách bảo mật
                  </a>{' '}
                  của chúng tôi.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
