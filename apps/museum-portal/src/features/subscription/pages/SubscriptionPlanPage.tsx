'use client';

import { Check, Loader2, CreditCard, CheckCircle, XCircle, X, FileText, Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  useGetPlans,
  useBuySubscription,
  useGetMuseumSubscriptions,
  Plan,
  SubscriptionStatusEnum,
  Subscription,
  useGenerateContract,
} from '@musetrip360/payment-management';
import { useMuseumStore } from '@musetrip360/museum-management';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Separator } from '@musetrip360/ui-core/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@musetrip360/ui-core/dialog';
import { Form, FormLabel } from '@musetrip360/ui-core/form';
import { cn, toast } from '@musetrip360/ui-core';
import { formatCurrency, FormDropZone, MediaType, useFileUpload } from '@musetrip360/shared';
import get from 'lodash.get';

// Validation schema for confirmation dialog
const confirmationSchema = z.object({
  documents: z.array(z.union([z.string(), z.any()])).optional(),
});

type ConfirmationFormData = z.infer<typeof confirmationSchema>;

const SubscriptionPlanPage = () => {
  const { selectedMuseum } = useMuseumStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [contractUrl, setContractUrl] = useState<string | null>(null);

  const paymentSuccess = searchParams.get('success') === 'true';
  const paymentCanceled = searchParams.get('canceled') === 'true';

  const uploadFileMutation = useFileUpload();

  const confirmationForm = useForm<ConfirmationFormData>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      documents: [],
    },
  });

  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control: confirmationForm.control,
    name: 'documents',
  });

  const watchedDocuments = useWatch({ control: confirmationForm.control, name: 'documents' });

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
      console.log('Purchase response:', data);
      if (data?.orderCode) {
        setOrderCode(`${data.orderCode}`);
        startPollingOrder(`${data.orderCode}`);
      }
      if (data?.checkoutUrl) {
        setPaymentUrl(data.checkoutUrl);
        window.open(data.checkoutUrl, '_blank');
      }
      setShowConfirmDialog(false);
    },
    onError: (error) => {
      console.error('Failed to buy subscription:', error);
      toast.error(get(error, 'error', 'Đã xảy ra lỗi khi mua gói đăng ký. Vui lòng thử lại sau.'));
      setShowConfirmDialog(false);
    },
  });

  const { mutate: generateContract, isPending: isContractGenerating } = useGenerateContract({
    onSuccess: (data) => {
      console.log('Contract generated:', data);
      if (data?.url) {
        setContractUrl(data.url);
        // Add contract URL to documents
        const currentDocs = confirmationForm.getValues('documents') || [];
        const newDocs = [...currentDocs.filter(Boolean), data.url];
        confirmationForm.setValue('documents', newDocs);

        // Trigger download
        const link = document.createElement('a');
        link.href = data.url;
        link.download = `contract-${selectedPlan?.name || 'subscription'}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Hợp đồng đã được tạo và tải xuống thành công!');
      }
    },
    onError: (error) => {
      console.error('Failed to generate contract:', error);
      toast.error(get(error, 'error', 'Đã xảy ra lỗi khi tạo hợp đồng. Vui lòng thử lại sau.'));
    },
  });

  const handleBuyPlan = (planId: string) => {
    if (!selectedMuseum?.id) {
      toast.error('Vui lòng chọn bảo tàng trước khi mua gói');
      return;
    }

    const plan = (plans as Plan[])?.find((p) => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setContractUrl(null); // Reset contract URL
      setShowConfirmDialog(true);
    }
  };

  const handleGenerateContract = () => {
    if (!selectedPlan || !selectedMuseum?.id) {
      toast.error('Vui lòng chọn gói và bảo tàng');
      return;
    }

    generateContract({
      planId: selectedPlan.id,
      museumId: selectedMuseum.id,
      successUrl: '',
      cancelUrl: '',
      metadata: {
        documents: [],
      },
    });
  };

  const handleConfirmPurchase = async (data: ConfirmationFormData) => {
    if (!selectedPlan || !selectedMuseum?.id) return;

    try {
      setIsUploadingDocs(true);

      const validDocs = (data.documents || []).filter(Boolean).map((doc) => doc.file);
      const uploadedDocUrls: string[] = [];

      for (const doc of validDocs) {
        if (typeof doc === 'object' && doc !== null && 'name' in doc && 'type' in doc) {
          const result = await uploadFileMutation.mutateAsync(doc as File);
          console.log('Uploaded document result:', result);
          uploadedDocUrls.push(result.data.url);
        } else if (typeof doc === 'string') {
          uploadedDocUrls.push(doc);
        }
      }

      // Include contract URL if generated
      if (contractUrl) {
        uploadedDocUrls.push(contractUrl);
      }

      buySubscription({
        planId: selectedPlan.id,
        museumId: selectedMuseum.id,
        successUrl: `${window.location.origin}/museum/contract?success=true`,
        cancelUrl: `${window.location.origin}/museum/contract?canceled=true`,
        metadata: {
          documents: uploadedDocUrls,
        },
      });
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Có lỗi xảy ra khi tải lên tài liệu. Vui lòng thử lại.');
    } finally {
      setIsUploadingDocs(false);
    }
  };

  const startPollingOrder = (orderCode: string) => {
    setIsPolling(true);
    const pollInterval = setInterval(async () => {
      try {
        // TODO: Replace with actual order status API call
        // const orderStatus = await checkOrderStatus(orderCode);
        // For now, simulate polling for 30 seconds
        console.log('Polling order status for:', orderCode);

        // Stop polling after 30 seconds (10 polls × 3 seconds)
        setTimeout(() => {
          setIsPolling(false);
          setOrderCode(null);
          setPaymentUrl(null);
          clearInterval(pollInterval);
          refetchSubscriptions();
        }, 30000);
      } catch (error) {
        console.error('Error polling order status:', error);
        clearInterval(pollInterval);
        setIsPolling(false);
        setOrderCode(null);
        setPaymentUrl(null);
      }
    }, 3000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
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

  // Initialize document fields
  useEffect(() => {
    if (documentFields.length === 0) {
      appendDocument('');
    }
  }, [documentFields.length, appendDocument]);

  // Auto-append new field if all are filled
  useEffect(() => {
    const allDocumentsHaveValue = watchedDocuments?.every((doc) => !!doc);
    if (documentFields.length > 0 && allDocumentsHaveValue) {
      appendDocument('');
    }
  }, [watchedDocuments, documentFields, appendDocument]);

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
              <div className="space-y-2">
                <p>
                  Bạn đang sử dụng gói <strong>{activeSubscription.plan?.name}</strong> (hết hạn:{' '}
                  {new Date(activeSubscription.endDate).toLocaleDateString('vi-VN')})
                </p>

                {activeSubscription.metadata?.documents && activeSubscription.metadata.documents.length > 0 && (
                  <div className="pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">Hợp đồng đính kèm</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeSubscription.metadata.documents.map((docUrl: string, index: number) => (
                        <a href={docUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                          <Button key={index} variant="outline" size="sm" className="h-8 text-xs justify-start">
                            <Download className="h-3 w-3" />
                            <span>Tài liệu {index + 1}</span>
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </Button>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isPolling && orderCode && (
          <Alert className="mt-4 border-blue-200 bg-blue-50">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <AlertDescription className="text-blue-700">
              <div className="space-y-2">
                <p>
                  <strong>Đang xử lý đơn hàng #{orderCode}</strong> - Hệ thống đang kiểm tra trạng thái thanh toán...
                </p>
                {paymentUrl && (
                  <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                    <span className="text-sm">Nếu trang thanh toán không mở, vui lòng truy cập:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = paymentUrl;
                      }}
                      className="h-8 text-xs bg-white hover:bg-blue-50"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Thanh toán ngay
                    </Button>
                  </div>
                )}
              </div>
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
                    {formatCurrency(plan.price)}
                  </p>
                  <p className="text-3xl font-bold">{formatCurrency(discountedPrice)}</p>
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xác nhận mua gói đăng ký</DialogTitle>
            <DialogDescription>
              Bạn đang mua gói <strong>{selectedPlan?.name}</strong> cho bảo tàng{' '}
              <strong>{selectedMuseum?.name}</strong>. Vui lòng tải lên các tài liệu cần thiết (nếu có) trước khi tiếp
              tục.
            </DialogDescription>
          </DialogHeader>

          <Form {...confirmationForm}>
            <form onSubmit={confirmationForm.handleSubmit(handleConfirmPurchase)} className="space-y-6">
              {/* Plan Summary */}
              {selectedPlan && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold">{selectedPlan.name}</h3>
                  <div className="flex justify-between text-sm">
                    <span>Giá:</span>
                    <span className="font-medium">{formatCurrency(selectedPlan.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thời hạn:</span>
                    <span className="font-medium">{formatDuration(selectedPlan.durationDays)}</span>
                  </div>
                  {selectedPlan.maxEvents && (
                    <div className="flex justify-between text-sm">
                      <span>Số sự kiện tối đa:</span>
                      <span className="font-medium">
                        {selectedPlan.maxEvents > 100000 ? 'Không giới hạn' : selectedPlan.maxEvents}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Contract Generation */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-gray-600">Hợp đồng</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateContract}
                    disabled={isContractGenerating || isUploadingDocs || isBuyingSubscription}
                    className="gap-2"
                  >
                    {isContractGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : contractUrl ? (
                      <>
                        <Download className="h-4 w-4" />
                        Tải lại hợp đồng
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Tạo hợp đồng
                      </>
                    )}
                  </Button>
                </div>

                {contractUrl && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Hợp đồng đã được tạo thành công và sẽ được đính kèm trong đơn đăng ký.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-gray-600">Tài liệu hỗ trợ (tùy chọn)</FormLabel>
                  <span className="text-sm text-muted-foreground">Thêm tài liệu nếu cần hỗ trợ xử lý</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {documentFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-2 space-y-2 relative">
                      <FormDropZone
                        name={`documents.${index}`}
                        control={confirmationForm.control}
                        mediaType={MediaType.DOCUMENT}
                        label={''}
                        description={''}
                      />
                      {documentFields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeDocument(index)}
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isUploadingDocs || isBuyingSubscription}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isUploadingDocs || isBuyingSubscription} className="gap-2">
                  {isUploadingDocs || isBuyingSubscription ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  {isUploadingDocs || isBuyingSubscription ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlanPage;
