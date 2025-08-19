'use client';

import { OrderStatusComponent } from '@/components/order/OrderStatusComponent';
import { Suspense } from 'react';

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderStatusComponent pageType="success" />
    </Suspense>
  );
}
