import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { DataTable, DataTableToolbar, useDataTable, useDataTableState } from '@musetrip360/ui-core/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { toast } from '@musetrip360/ui-core/sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Check, Eye, MoreHorizontal, X } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useApproveMuseumRequest, useGetMuseumRequests, useRejectMuseumRequest } from '../../api';
import { MuseumRequest } from '../../types';

interface MuseumRequestDataTableProps {
  onView?: (request: MuseumRequest) => void;
}

const MuseumRequestDataTable = ({ onView }: MuseumRequestDataTableProps) => {
  const initialData: MuseumRequest[] = useMemo(() => [], []);

  const { mutate: approveRequest } = useApproveMuseumRequest({
    onSuccess: () => {
      toast.success('Museum request approved successfully');
    },
    onError: (error) => {
      console.error('Approve error:', error);
      toast.error('Failed to approve museum request');
    },
  });

  const { mutate: rejectRequest } = useRejectMuseumRequest({
    onSuccess: () => {
      toast.success('Museum request rejected successfully');
    },
    onError: (error) => {
      console.error('Reject error:', error);
      toast.error('Failed to reject museum request');
    },
  });

  const handleAction = useCallback(
    () => ({
      onView: (data: MuseumRequest) => onView?.(data),
      onApprove: (data: MuseumRequest) => approveRequest(data.id),
      onReject: (data: MuseumRequest) => rejectRequest(data.id),
    }),
    [onView, approveRequest, rejectRequest]
  );

  const columns = useMemo<ColumnDef<MuseumRequest>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => {
          return (
            <Checkbox
              className="size-5"
              checked={table.getIsAllRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
              onCheckedChange={(checked) => table.toggleAllRowsSelected(!!checked)}
            />
          );
        },
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <Checkbox
              className="size-5"
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            />
          );
        },
      },
      {
        meta: {
          variant: 'text',
          placeholder: 'Tìm kiếm theo tên bảo tàng',
          label: 'Museum Name',
          isSortable: true,
          unit: '',
        },
        accessorKey: 'museumName',
        header: 'Tên bảo tàng',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => <div className="font-medium max-w-50 truncate">{row.original.museumName}</div>,
      },
      {
        accessorKey: 'createdByUser.fullName',
        header: 'Người gửi',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="font-medium">{row.original.createdByUser.fullName}</div>
            <div className="text-gray-500">{row.original.createdByUser.email}</div>
          </div>
        ),
      },
      {
        accessorKey: 'location',
        header: 'Địa điểm',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-sm max-w-40 whitespace-break-spaces line-clamp-2">{row.original.location}</div>
        ),
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter status',
          label: 'Status',
          isSortable: true,
          unit: '',
          options: [
            { label: 'Pending', value: 'Pending' },
            { label: 'Approved', value: 'Approved' },
            { label: 'Rejected', value: 'Rejected' },
          ],
        },
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const getStatusVariant = (status: string) => {
            switch (status) {
              case 'Approved':
                return 'default';
              case 'Rejected':
                return 'destructive';
              case 'Pending':
                return 'outline';
              default:
                return 'secondary';
            }
          };
          return <Badge variant={getStatusVariant(row.original.status)}>{row.original.status}</Badge>;
        },
      },
      {
        accessorKey: 'submittedAt',
        header: 'Ngày gửi',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {new Date(row.original.submittedAt).toLocaleDateString('vi-VN')}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Thao tác',
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction().onView(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              {row.original.status === 'Pending' && (
                <>
                  <DropdownMenuItem onClick={() => handleAction().onApprove(row.original)} className="text-green-600">
                    <Check className="mr-2 h-4 w-4" />
                    Phê duyệt
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction().onReject(row.original)} className="text-red-600">
                    <X className="mr-2 h-4 w-4" />
                    Từ chối
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction]
  );

  const tableState = useDataTableState({ defaultPerPage: 10, defaultSort: [{ id: 'submittedAt', desc: true }] });

  const { data: requestsData, isLoading: loadingRequests } = useGetMuseumRequests({
    Search: (tableState.columnFilters.find((filter) => filter.id === 'museumName')?.value as string) || undefined,
    Page: tableState.pagination.pageIndex + 1,
    PageSize: tableState.pagination.pageSize,
    Status: (tableState.columnFilters.find((filter) => filter.id === 'status')?.value as string) || undefined,
    sortList: tableState.sorting.map((columnSort) => `${columnSort.id}_${columnSort.desc ? 'desc' : 'asc'}`),
  });

  // Normalize API response shape to a plain array and total count
  const normalizedData: MuseumRequest[] = Array.isArray((requestsData as any)?.data)
    ? ((requestsData as any).data as MuseumRequest[])
    : Array.isArray((requestsData as any)?.list)
      ? ((requestsData as any).list as MuseumRequest[])
      : Array.isArray((requestsData as any)?.data?.data)
        ? ((requestsData as any).data.data as MuseumRequest[])
        : Array.isArray((requestsData as any)?.data?.list)
          ? ((requestsData as any).data.list as MuseumRequest[])
          : initialData;

  const totalCount: number | undefined = (requestsData as any)?.total ?? (requestsData as any)?.data?.total;

  const { table } = useDataTable<MuseumRequest, string>({
    data: normalizedData,
    columns,
    rowCount: totalCount,
    manualHandle: true,
    getRowId: (row) => row.id.toString(),
    ...tableState,
  });

  if (loadingRequests) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
};

export default MuseumRequestDataTable;
