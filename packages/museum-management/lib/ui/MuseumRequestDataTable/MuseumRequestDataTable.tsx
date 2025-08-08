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
import { ColumnDef } from '@tanstack/react-table';
import { Check, Eye, MoreHorizontal, X } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useGetMuseumRequests } from '../../api';
import { MuseumRequest, MuseumRequestStatus } from '../../types';

interface MuseumRequestDataTableProps {
  onView?: (request: MuseumRequest) => void;
  onApprove?: (request: MuseumRequest) => void;
  onReject?: (request: MuseumRequest) => void;
}

const MuseumRequestDataTable = ({ onView, onApprove, onReject }: MuseumRequestDataTableProps) => {
  const initialData: MuseumRequest[] = useMemo(() => [], []);

  const handleAction = useCallback(
    () => ({
      onView: (data: MuseumRequest) => onView?.(data),
      onApprove: (data: MuseumRequest) => onApprove?.(data),
      onReject: (data: MuseumRequest) => onReject?.(data),
    }),
    [onView, onApprove, onReject]
  );

  const getStatusBadgeVariant = (status: MuseumRequestStatus) => {
    switch (status) {
      case MuseumRequestStatus.Approved:
        return 'default';
      case MuseumRequestStatus.Rejected:
        return 'destructive';
      case MuseumRequestStatus.Pending:
        return 'secondary';
      case MuseumRequestStatus.Draft:
        return 'outline';
      default:
        return 'secondary';
    }
  };

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
        cell: ({ row }) => <div className="font-medium max-w-50 truncate">{row.original.museumName}</div>,
      },
      {
        accessorKey: 'museumDescription',
        header: 'Mô tả',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="max-w-60 whitespace-break-spaces line-clamp-3 text-muted-foreground">
            {row.original.museumDescription}
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
        accessorKey: 'contactEmail',
        header: 'Email liên hệ',
        enableSorting: false,
        cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.original.contactEmail}</div>,
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Lọc theo trạng thái',
          label: 'Status',
          isSortable: true,
          unit: '',
          options: [
            { label: 'Chờ duyệt', value: MuseumRequestStatus.Pending },
            { label: 'Đã duyệt', value: MuseumRequestStatus.Approved },
            { label: 'Từ chối', value: MuseumRequestStatus.Rejected },
            { label: 'Bản nháp', value: MuseumRequestStatus.Draft },
          ],
        },
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <Badge variant={getStatusBadgeVariant(row.original.status)}>
            {row.original.status === MuseumRequestStatus.Pending && 'Chờ duyệt'}
            {row.original.status === MuseumRequestStatus.Approved && 'Đã duyệt'}
            {row.original.status === MuseumRequestStatus.Rejected && 'Từ chối'}
            {row.original.status === MuseumRequestStatus.Draft && 'Bản nháp'}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdByUser.fullName',
        header: 'Người gửi',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="font-medium">{row.original.createdByUser.fullName}</div>
            <div className="text-muted-foreground text-xs">{row.original.createdByUser.email}</div>
          </div>
        ),
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
        cell: ({ row }) => {
          const isPending = row.original.status === MuseumRequestStatus.Pending;

          return (
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
                {isPending && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAction().onApprove(row.original)} className="text-green-600">
                      <Check className="mr-2 h-4 w-4" />
                      Phê duyệt
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction().onReject(row.original)}
                      className="text-destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Từ chối
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleAction]
  );

  const tableState = useDataTableState({
    defaultPerPage: 10,
    defaultSort: [{ id: 'submittedAt', desc: true }],
  });

  const { data: requestsData, isLoading: loadingRequests } = useGetMuseumRequests({
    Page: tableState.pagination.pageIndex + 1,
    PageSize: tableState.pagination.pageSize,
    sortList: tableState.sorting.map((columnSort) => `${columnSort.id}_${columnSort.desc ? 'desc' : 'asc'}`),
    Search: (tableState.columnFilters.find((filter) => filter.id === 'museumName')?.value as string) || '',
    Status: (tableState.columnFilters.find((filter) => filter.id === 'status')?.value as string) || '',
  });

  // Debug log to see what's happening
  console.log('MuseumRequestDataTable Debug:', {
    requestsData,
    'requestsData.data': requestsData?.data,
    'list length': requestsData?.data?.list?.length,
    total: requestsData?.data?.total,
    loadingRequests,
  });

  const { table } = useDataTable<MuseumRequest, string>({
    data: requestsData?.data?.list || initialData,
    columns,
    rowCount: requestsData?.data?.total,
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
