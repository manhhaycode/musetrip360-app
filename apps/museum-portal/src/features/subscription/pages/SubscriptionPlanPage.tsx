'use client';

import { Check, Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

import {
  useGetPlans,
  useBuySubscription,
  useGetMuseumSubscriptions,
  Plan,
  SubscriptionStatusEnum,
  Subscription,
} from '@musetrip360/payment-management';
import { useMuseumStore } from '@musetrip360/museum-management';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Separator } from '@musetrip360/ui-core/separator';
import { cn } from '@musetrip360/ui-core';

const SubscriptionPlanPage = () => {
  const { selectedMuseum } = useMuseumStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentSuccess = searchParams.get('success') === 'true';
  const paymentCanceled = searchParams.get('canceled') === 'true';

  const { data: plans, isLoading: isLoadingPlans, error: plansError } = useGetPlans();

  const {
    data: currentSubscriptions,
    isLoading: isLoadingSubscriptions,
    refetch: refetchSubscriptions,
  } = useGetMuseumSubscriptions(selectedMuseum?.id ?? '', {
    enabled: !!selectedMuseum?.id,
  });

  const { mutate: buySubscription, isPending: isBuyingSubscription } = useBuySubscription({
    onSuccess: (data) => {
      // Redirect to payment URL
      console.log(data);
      if (data?.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      }
    },
    onError: (error) => {
      console.error('Failed to buy subscription:', error);
    },
  });

  const handleBuyPlan = (planId: string) => {
    if (!selectedMuseum?.id) {
      alert('Vui lòng chọn bảo tàng trước khi mua gói');
      return;
    }

    buySubscription({
      planId,
      museumId: selectedMuseum.id,
      successUrl: `${window.location.origin}/museum/contract?success=true`,
      cancelUrl: `${window.location.origin}/museum/contract?canceled=true`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDuration = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} năm`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} tháng`;
    }
    return `${days} ngày`;
  };

  const getActiveSubscription = () => {
    return (currentSubscriptions as Subscription[])?.find((sub) => sub.status === SubscriptionStatusEnum.Active);
  };

  const isCurrentPlan = (planId: string) => {
    const activeSubscription = getActiveSubscription();
    return activeSubscription?.planId === planId;
  };

  const comparePlan = (a: Plan, b: Plan) => {
    // Returns positive if 'b' is better than 'a' (upgrade available)
    // Returns negative/zero if 'b' is same/worse than 'a' (downgrade/same)

    // Compare by maxEvents first (higher is better)
    if (a.maxEvents && b.maxEvents) {
      return b.maxEvents - a.maxEvents;
    }

    // If maxEvents are equal or undefined, compare by duration (longer is better)
    if (a.durationDays && b.durationDays) {
      return b.durationDays - a.durationDays;
    }

    // Finally compare by price (higher price usually means better plan)
    return b.price - a.price;
  };

  // Handle payment redirect states
  useEffect(() => {
    if (paymentSuccess) {
      // Refresh subscription data after successful payment
      refetchSubscriptions();

      // Clean up URL parameters after 3 seconds
      const timer = setTimeout(() => {
        navigate('/museum/contract', { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (paymentCanceled) {
      // Clean up URL parameters after 5 seconds for cancel state
      const timer = setTimeout(() => {
        navigate('/museum/contract', { replace: true });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, paymentCanceled, refetchSubscriptions, navigate]);

  if (isLoadingPlans || isLoadingSubscriptions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải danh sách gói...</span>
      </div>
    );
  }

  if (plansError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Không thể tải danh sách gói. Vui lòng thử lại sau.</AlertDescription>
      </Alert>
    );
  }

  if (!selectedMuseum) {
    return (
      <Alert>
        <AlertDescription>Vui lòng chọn bảo tàng để xem các gói đăng ký.</AlertDescription>
      </Alert>
    );
  }

  const activeSubscription = getActiveSubscription();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gói Đăng Ký</h1>
        <p className="text-muted-foreground">Chọn gói phù hợp cho bảo tàng {selectedMuseum.name}</p>

        {/* Payment Status Alerts */}
        {paymentSuccess && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Thanh toán thành công!</strong> Gói đăng ký của bạn đã được kích hoạt. Trang sẽ tự động làm mới
              sau 3 giây.
            </AlertDescription>
          </Alert>
        )}

        {paymentCanceled && (
          <Alert className="mt-4" variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Thanh toán đã bị hủy. Bạn có thể thử lại bằng cách chọn gói phù hợp bên dưới.
            </AlertDescription>
          </Alert>
        )}

        {activeSubscription && (
          <Alert className="mt-4">
            <Check className="h-4 w-4" />
            <AlertDescription>
              Bạn đang sử dụng gói <strong>{activeSubscription.plan?.name}</strong> (hết hạn:{' '}
              {new Date(activeSubscription.endDate).toLocaleDateString('vi-VN')})
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(plans as Plan[])?.map((plan: Plan) => {
          const isActive = isCurrentPlan(plan.id);
          const discountedPrice = plan.discountPercent ? plan.price * (1 - plan.discountPercent / 100) : plan.price;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col h-full ${isActive ? 'ring-2 ring-primary' : ''} ${!plan.isActive ? 'opacity-60' : ''}`}
            >
              {isActive && (
                <Badge className="absolute -top-2 -right-2" variant="default">
                  Gói hiện tại
                </Badge>
              )}

              {plan.discountPercent && plan.discountPercent > 0 ? (
                <Badge className="absolute -top-2 -left-2" variant="destructive">
                  -{plan.discountPercent}%
                </Badge>
              ) : (
                <></>
              )}

              <CardHeader>
                <CardTitle className="text-xl min-h-20 line-clamp-3">{plan.name}</CardTitle>
                {plan.description && (
                  <CardDescription className="min-h-20">
                    <p className="line-clamp-4">{plan.description}</p>
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="space-y-1 text-center mb-4">
                  <p
                    className={cn(
                      'text-sm text-muted-foreground line-through invisible',
                      plan.discountPercent && plan.discountPercent > 0 && 'visible'
                    )}
                  >
                    {formatPrice(plan.price)}
                  </p>
                  <p className="text-3xl font-bold">{formatPrice(discountedPrice)}</p>
                  <p className="text-sm text-muted-foreground">cho {formatDuration(plan.durationDays)}</p>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  <Separator className="mb-4" />

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Thời hạn:</span>
                      <span className="font-medium">{formatDuration(plan.durationDays)}</span>
                    </div>

                    {plan.maxEvents && (
                      <div className="flex justify-between text-sm">
                        <span>Số sự kiện tối đa:</span>
                        <span className="font-medium">
                          {plan.maxEvents > 100000 ? 'Không giới hạn' : plan.maxEvents}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleBuyPlan(plan.id)}
                    disabled={
                      !plan.isActive ||
                      isActive ||
                      isBuyingSubscription ||
                      !!(activeSubscription?.plan && comparePlan(activeSubscription.plan, plan) <= 0)
                    }
                    className="w-full"
                    variant={isActive ? 'secondary' : 'default'}
                  >
                    {isBuyingSubscription ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    {isActive ? 'Gói hiện tại' : !plan.isActive ? 'Không khả dụng' : 'Chọn gói này'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!plans && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Hiện tại không có gói nào khả dụng.</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanPage;
