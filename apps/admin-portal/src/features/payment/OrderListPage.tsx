import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@musetrip360/ui-core/badge';
import { DataTable } from '@musetrip360/ui-core/data-table';
import { useDataTable } from '@musetrip360/ui-core/data-table';
import { useDataTableState } from '@musetrip360/ui-core/data-table';
import { useGetAdminOrders } from '@musetrip360/payment-management/api';
import { Order, PaymentStatusEnum, OrderTypeEnum } from '@musetrip360/payment-management';
import get from 'lodash/get';
import { formatCurrency } from '@musetrip360/shared';
import { Calendar, MapPin, Clock, Package } from 'lucide-react';

const OrderListPage = () => {
  const {
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    pagination,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    setSorting,
    setPagination,
  } = useDataTableState({
    defaultPerPage: 10,
  });

  const { data: ordersData, isLoading } = useGetAdminOrders({
    Page: pagination.pageIndex + 1,
    PageSize: pagination.pageSize,
  });

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'metadata.orderCode',
        header: 'Order Code',
        cell: ({ row }) => <div className="font-semibold">#{row.original.metadata?.orderCode}</div>,
        meta: {
          variant: 'number',
          placeholder: 'Search by code',
          label: 'Order Code',
          unit: '',
        },
      },
      {
        accessorKey: 'createdByUser.fullName',
        header: 'Customer',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.createdByUser.fullName}</div>
            <div className="text-sm text-muted-foreground">{row.original.createdByUser.email}</div>
          </div>
        ),
        meta: {
          variant: 'text',
          placeholder: 'Search by customer',
          label: 'Customer',
          unit: '',
        },
      },
      {
        accessorKey: 'orderType',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.original.orderType;
          const typeColors = {
            [OrderTypeEnum.Event]: 'bg-blue-100 text-blue-800',
            [OrderTypeEnum.Tour]: 'bg-green-100 text-green-800',
            [OrderTypeEnum.Subscription]: 'bg-purple-100 text-purple-800',
          };
          return (
            <Badge className={typeColors[type]} variant="secondary">
              {type}
            </Badge>
          );
        },
        meta: {
          variant: 'select',
          placeholder: 'Filter by type',
          label: 'Order Type',
          unit: '',
          options: Object.values(OrderTypeEnum).map((type) => ({
            label: type,
            value: type,
          })),
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          const statusColors = {
            [PaymentStatusEnum.Pending]: 'bg-yellow-100 text-yellow-800',
            [PaymentStatusEnum.Success]: 'bg-green-100 text-green-800',
            [PaymentStatusEnum.Canceled]: 'bg-red-100 text-red-800',
          };
          return (
            <Badge className={statusColors[status]} variant="secondary">
              {status}
            </Badge>
          );
        },
        meta: {
          variant: 'select',
          placeholder: 'Filter by status',
          label: 'Status',
          unit: '',
          options: Object.values(PaymentStatusEnum).map((status) => ({
            label: status,
            value: status,
          })),
        },
      },
      {
        accessorKey: 'details',
        header: 'Details',
        cell: ({ row }) => {
          const order = row.original;
          const { orderType, metadata } = order;

          // Common metadata fields
          const description = metadata?.description || 'No description available';

          switch (orderType) {
            case OrderTypeEnum.Event:
              return (
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">Event Order</span>
                  </div>
                  <div className="text-muted-foreground line-clamp-2">{description}</div>
                  {metadata?.expiredAt && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Expires: {new Date(metadata.expiredAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              );

            case OrderTypeEnum.Subscription:
              return (
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1 text-purple-600">
                    <Package className="h-3 w-3" />
                    <span className="font-medium">Subscription Plan</span>
                  </div>
                  <div className="text-muted-foreground line-clamp-2">{description}</div>
                  {metadata?.expiredAt && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Valid until: {new Date(metadata.expiredAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              );

            case OrderTypeEnum.Tour:
              return (
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <MapPin className="h-3 w-3" />
                    <span className="font-medium">Tour Booking</span>
                  </div>
                  <div className="text-muted-foreground line-clamp-2">{description}</div>
                  {metadata?.expiredAt && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Expires: {new Date(metadata.expiredAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              );

            default:
              return (
                <div className="space-y-1 text-sm">
                  <div className="font-medium text-gray-600">{orderType} Order</div>
                  <div className="text-muted-foreground line-clamp-2">{description}</div>
                </div>
              );
          }
        },
        meta: {
          variant: 'text',
          placeholder: 'Search details',
          label: 'Order Details',
          unit: '',
        },
      },
      {
        accessorKey: 'totalAmount',
        header: 'Amount',
        cell: ({ row }) => {
          const amount = row.original.totalAmount;
          return <div className="font-mono font-semibold">{formatCurrency(amount)}</div>;
        },
      },
      {
        accessorKey: 'metadata',
        header: 'Payment Info',
        cell: ({ row }) => {
          const metadata = row.original.metadata;
          if (!metadata) {
            return <div className="text-muted-foreground text-sm">No payment info</div>;
          }

          return (
            <div className="space-y-1 text-sm">
              {metadata.orderCode && <div className="font-medium text-gray-700">Order #{metadata.orderCode}</div>}
              {metadata.accountNumber && <div className="text-muted-foreground">Account: {metadata.accountNumber}</div>}
              {metadata.bin && <div className="text-muted-foreground">Bank: {metadata.bin}</div>}
              {metadata.paymentLinkId && <div className="text-xs text-blue-600">Payment Link Available</div>}
            </div>
          );
        },
        meta: {
          variant: 'text',
          placeholder: 'Search payment info',
          label: 'Payment Information',
          unit: '',
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => {
          const createdAt = new Date(row.original.createdAt);
          return (
            <div className="space-y-1 text-sm">
              <div className="font-medium">{createdAt.toLocaleDateString()}</div>
              <div className="text-muted-foreground text-xs">{createdAt.toLocaleTimeString()}</div>
            </div>
          );
        },
        meta: {
          variant: 'date',
          placeholder: 'Filter by date',
          label: 'Created Date',
          unit: '',
          isSortable: true,
        },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: get(ordersData, 'list', []) as Order[],
    columns,
    rowCount: get(ordersData, 'total', 0),
    manualHandle: true,
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
    pagination,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    setSorting,
    setPagination,
  });

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and view all customer orders</p>
        </div>
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        handleClickRow={(order) => {
          console.log('Order clicked:', order);
        }}
      />
    </div>
  );
};

export default OrderListPage;
