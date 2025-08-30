import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@musetrip360/ui-core/badge';
import { DataTable } from '@musetrip360/ui-core/data-table';
import { useDataTable } from '@musetrip360/ui-core/data-table';
import { useDataTableState } from '@musetrip360/ui-core/data-table';
import { useGetAdminSubscriptions } from '@musetrip360/payment-management/api';
import { Subscription, SubscriptionStatusEnum } from '@musetrip360/payment-management';
import get from 'lodash/get';
import { formatCurrency } from '@musetrip360/shared';

const SubscriptionListPage = () => {
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

  const { data: subscriptionsData, isLoading } = useGetAdminSubscriptions({
    Page: pagination.pageIndex + 1,
    PageSize: pagination.pageSize,
  });

  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        accessorKey: 'plan.name',
        header: 'Gói',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.plan?.name}</div>
            <div className="text-sm text-muted-foreground">{formatCurrency(row.original.plan?.price ?? 0)}</div>
          </div>
        ),
        meta: {
          variant: 'text',
          placeholder: 'Search by plan',
          label: 'Gói',
          unit: '',
        },
      },
      {
        accessorKey: 'museum.name',
        header: 'Bảo tàng',
        cell: ({ row }) => <div className="font-medium">{row.original.museum?.name}</div>,
        meta: {
          variant: 'text',
          placeholder: 'Search by museum',
          label: 'Bảo tàng',
          unit: '',
        },
      },
      {
        accessorKey: 'user.fullName',
        header: 'Người mua',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.user?.fullName}</div>
            <div className="text-sm text-muted-foreground">{row.original.user?.email}</div>
          </div>
        ),
        meta: {
          variant: 'text',
          placeholder: 'Search by customer',
          label: 'Người mua',
          unit: '',
        },
      },

      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          const status = row.original.status;
          const statusColors = {
            [SubscriptionStatusEnum.Active]: 'bg-green-100 text-green-800',
            [SubscriptionStatusEnum.Expired]: 'bg-red-100 text-red-800',
            [SubscriptionStatusEnum.Cancelled]: 'bg-gray-100 text-gray-800',
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
          label: 'Trạng thái',
          unit: '',
          options: Object.values(SubscriptionStatusEnum).map((status) => ({
            label: status,
            value: status,
          })),
        },
      },
      {
        accessorKey: 'startDate',
        header: 'Ngày bắt đầu',
        cell: ({ row }) => <div className="text-sm">{new Date(row.original.startDate).toLocaleDateString()}</div>,
        meta: {
          variant: 'date',
          placeholder: 'Filter by start date',
          label: 'Ngày bắt đầu',
          unit: '',
          isSortable: true,
        },
      },
      {
        accessorKey: 'endDate',
        header: 'Ngày kết thúc',
        cell: ({ row }) => <div className="text-sm">{new Date(row.original.endDate).toLocaleDateString()}</div>,
        meta: {
          variant: 'date',
          placeholder: 'Filter by end date',
          label: 'Ngày kết thúc',
          unit: '',
          isSortable: true,
        },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: get(subscriptionsData, 'list', []) as Subscription[],
    columns,
    rowCount: get(subscriptionsData, 'total', 0),
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
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage and view all museum subscriptions</p>
        </div>
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        handleClickRow={(subscription) => {
          console.log('Subscription clicked:', subscription);
        }}
      />
    </div>
  );
};

export default SubscriptionListPage;
