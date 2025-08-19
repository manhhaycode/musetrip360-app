'use client';

import { OrderStatusComponent } from '@/components/order/OrderStatusComponent';
import { Suspense } from 'react';

export default function OrderCancelPage() {
  return (
    <Suspense>
      <OrderStatusComponent pageType="cancel" />
    </Suspense>
  );
}
