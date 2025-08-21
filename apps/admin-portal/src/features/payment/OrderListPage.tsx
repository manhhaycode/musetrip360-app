import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@musetrip360/ui-core/badge';
import { DataTable } from '@musetrip360/ui-core/data-table';
import { useDataTable } from '@musetrip360/ui-core/data-table';
import { useDataTableState } from '@musetrip360/ui-core/data-table';
import { useGetAdminOrders } from '@musetrip360/payment-management/api';
import { Order, PaymentStatusEnum, OrderTypeEnum } from '@musetrip360/payment-management';
import get from 'lodash/get';

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
        accessorKey: 'id',
        header: 'Order ID',
        meta: {
          variant: 'text',
          placeholder: 'Search by ID',
          label: 'Order ID',
          unit: '',
        },
      },
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
        accessorKey: 'totalAmount',
        header: 'Amount',
        cell: ({ row }) => <div className="font-mono">${row.original.totalAmount.toLocaleString()}</div>,
        meta: {
          variant: 'number',
          placeholder: 'Filter by amount',
          label: 'Total Amount',
          unit: 'VND',
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => <div className="text-sm">{new Date(row.original.createdAt).toLocaleDateString()}</div>,
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
