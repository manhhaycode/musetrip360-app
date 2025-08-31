'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useVirtualTourById } from '@musetrip360/virtual-tour';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { CheckCircle, ArrowRight, Eye, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';

export default function VirtualTourSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const virtualTourId = params['virtual-tour-id'] as string;

  // Get order info from query params
  const orderId = searchParams.get('orderId');
  const orderCode = searchParams.get('orderCode');
  const paymentStatus = searchParams.get('status');

  // Fetch virtual tour data
  const { data: virtualTour, isLoading } = useVirtualTourById(virtualTourId);

  useEffect(() => {
    // Auto redirect to viewer after 5 seconds if payment successful
    if (paymentStatus === 'success' && virtualTour) {
      const timer = setTimeout(() => {
        router.push(`/virtual-tour/${virtualTourId}/viewer`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [paymentStatus, virtualTour, virtualTourId, router]);

  const handleStartTour = () => {
    router.push(`/virtual-tour/${virtualTourId}/viewer`);
  };

  const handleBackToDetail = () => {
    router.push(`/virtual-tour/${virtualTourId}`);
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download
    console.log('Download receipt for order:', orderId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  // Payment failed
  if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Thanh toán không thành công</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {paymentStatus === 'cancelled'
                ? 'Bạn đã hủy giao dịch thanh toán.'
                : 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBackToDetail} className="flex-1">
                Về trang chi tiết
              </Button>
              <Button onClick={() => router.push(`/virtual-tour/${virtualTourId}/checkout`)} className="flex-1">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment successful
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Thanh toán thành công!</h1>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã mua virtual tour. Bây giờ bạn có thể trải nghiệm toàn bộ tour ảo.
          </p>
        </div>

        {/* Success Alert */}
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Giao dịch đã được xử lý thành công. Tự động chuyển đến tour trong 5 giây...
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderId && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Mã đơn hàng</span>
                  <span className="font-mono font-medium">#{orderId}</span>
                </div>
              )}
              {orderCode && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Mã giao dịch</span>
                  <span className="font-mono font-medium">{orderCode}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Sản phẩm</span>
                <span className="font-medium">{virtualTour?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Trạng thái</span>
                <span className="font-medium text-green-600">Đã thanh toán</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Thời gian</span>
                <span className="font-medium">{new Date().toLocaleString('vi-VN')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Tour Information */}
          {virtualTour && (
            <Card>
              <CardHeader>
                <CardTitle>Tour ảo đã mua</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{virtualTour.name}</h3>
                    {virtualTour.description && <p className="text-muted-foreground mt-1">{virtualTour.description}</p>}
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <span>{virtualTour.metadata?.scenes?.length || 0} không gian</span>
                      <span>•</span>
                      <span>Truy cập vĩnh viễn</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button onClick={handleStartTour} className="w-full" size="lg">
                  <Eye className="w-4 h-4 mr-2" />
                  Bắt đầu trải nghiệm tour ảo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleBackToDetail}>
                    Về trang chi tiết
                  </Button>
                  <Button variant="outline" onClick={handleDownloadReceipt}>
                    <Download className="w-4 h-4 mr-2" />
                    Tải hóa đơn
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Bạn có thể truy cập tour ảo này bất cứ lúc nào từ trang cá nhân của mình.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
