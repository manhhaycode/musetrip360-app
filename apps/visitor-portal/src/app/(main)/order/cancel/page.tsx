'use client';

import { OrderStatusComponent } from '@/components/order/OrderStatusComponent';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function OrderCancelPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');

  return (
    <Suspense>
      <OrderStatusComponent orderCode={orderCode} pageType="success" />
    </Suspense>
  );
}
