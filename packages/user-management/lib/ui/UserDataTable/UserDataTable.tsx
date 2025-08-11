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
import { Edit, Eye, MoreHorizontal, UserPlus } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useAdminUsers } from '../../api';
import { IUser } from '../../types';

interface UserDataTableProps {
  onView?: (user: IUser) => void;
  onEdit?: (user: IUser) => void;
  onAdd?: () => void;
}

const UserDataTable = ({ onView, onEdit, onAdd }: UserDataTableProps) => {
  const initialData: IUser[] = useMemo(() => [], []);
  const handleAction = useCallback(
    () => ({
      onView: (data: IUser) => onView?.(data),
      onEdit: (data: IUser) => onEdit?.(data),
    }),
    [onView, onEdit]
  );

  const columns = useMemo<ColumnDef<IUser>[]>(
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
          placeholder: 'Tìm kiếm theo tên',
          label: 'Full Name',
          isSortable: true,
          unit: '',
        },
        accessorKey: 'fullName',
        header: 'Tên đầy đủ',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => <div className="font-medium">{row.original.fullName || 'N/A'}</div>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
        cell: ({ row }) => <div className="text-sm text-gray-600">{row.original.email}</div>,
      },
      {
        accessorKey: 'username',
        header: 'Username',
        enableSorting: true,
        cell: ({ row }) => <div className="text-sm font-mono">{row.original.username}</div>,
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter auth type',
          label: 'Auth Type',
          isSortable: true,
          unit: '',
          options: [
            { label: 'Email', value: 'Email' },
            { label: 'Google', value: 'Google' },
          ],
        },
        accessorKey: 'authType',
        header: 'Loại đăng nhập',
        enableSorting: true,
        cell: ({ row }) => {
          const getAuthTypeVariant = (authType: string) => {
            switch (authType) {
              case 'Google':
                return 'outline';
              case 'Email':
                return 'secondary';
              default:
                return 'outline';
            }
          };
          return <Badge variant={getAuthTypeVariant(row.original.authType)}>{row.original.authType}</Badge>;
        },
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter status',
          label: 'Status',
          isSortable: true,
          unit: '',
          options: [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ],
        },
        accessorKey: 'status',
        header: 'Trạng thái',
        enableSorting: true,
        cell: ({ row }) => {
          const getStatusVariant = (status: string) => {
            switch (status) {
              case 'Active':
                return 'default';
              case 'Inactive':
                return 'secondary';
              default:
                return 'outline';
            }
          };
          return <Badge variant={getStatusVariant(row.original.status)}>{row.original.status}</Badge>;
        },
      },
      {
        accessorKey: 'lastLogin',
        header: 'Đăng nhập lần cuối',
        enableSorting: true,
        cell: ({ row }) => {
          const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          };
          return <div className="text-sm text-gray-600">{formatDate(row.original.lastLogin)}</div>;
        },
      },
      {
        id: 'actions',
        header: 'Thao tác',
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction().onView(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction().onEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction]
  );

  const tableState = useDataTableState({ defaultPerPage: 10, defaultSort: [{ id: 'fullName', desc: false }] });

  const { data: usersData, isLoading: loadingUsers } = useAdminUsers({
    search: (tableState.columnFilters.find((filter) => filter.id === 'fullName')?.value as string) || '',
    page: tableState.pagination.pageIndex + 1,
    pageSize: tableState.pagination.pageSize,
    isActive:
      (tableState.columnFilters.find((filter) => filter.id === 'status')?.value as string) === 'Active'
        ? true
        : undefined,
  });

  const { table } = useDataTable<IUser, string>({
    data: usersData?.data?.data || initialData,
    columns,
    rowCount: usersData?.data?.total,
    manualHandle: true,
    getRowId: (row) => row.id.toString(),
    ...tableState,
  });

  if (loadingUsers) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        {onAdd && (
          <Button variant="default" size="sm" className="ml-2" onClick={onAdd}>
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        )}
      </DataTableToolbar>
    </DataTable>
  );
};

export default UserDataTable;
