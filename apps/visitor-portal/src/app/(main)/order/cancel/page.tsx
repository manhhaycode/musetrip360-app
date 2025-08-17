'use client';

import { OrderStatusComponent } from '@/components/order/OrderStatusComponent';

import { useSearchParams } from 'next/navigation';

export default function OrderCancelPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');

  return <OrderStatusComponent orderCode={orderCode} pageType="cancel" />;
}
