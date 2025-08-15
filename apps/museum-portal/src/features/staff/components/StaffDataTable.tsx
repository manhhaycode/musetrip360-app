import { useMuseumUsers, useRemoveUserRole, UserWithRole } from '@musetrip360/user-management';
import { useMuseumStore } from '@musetrip360/museum-management';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { DataTable, DataTableToolbar, useDataTable, useDataTableState } from '@musetrip360/ui-core/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2, UserPlus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import get from 'lodash.get';
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core';
import AddStaffMember from './AddStaffMember';
import { toast } from '@musetrip360/ui-core/sonner';
import { PERMISSION_USER_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';

const StaffDataTable = () => {
  const { selectedMuseum } = useMuseumStore();
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  const { hasPermission } = useRolebaseStore();

  const tableState = useDataTableState({
    defaultPerPage: 10,
    defaultSort: [{ id: 'user.fullName', desc: false }],
  });

  const {
    data: staffData,
    isLoading: loadingStaff,
    refetch: refetchStaff,
  } = useMuseumUsers(
    {
      page: tableState.pagination.pageIndex + 1,
      pageSize: tableState.pagination.pageSize,
    },
    selectedMuseum?.id ?? ''
  );

  const { mutate: deleteUserRole } = useRemoveUserRole({
    onSuccess: () => {
      toast.success('Staff member removed successfully');
      refetchStaff();
    },
    onError: () => {
      toast.error('Failed to remove staff member');
    },
  });

  const handleAction = useCallback(
    () => ({
      onDelete: (data: UserWithRole) => {
        deleteUserRole({
          userId: data.userId,
          roleId: data.roleId,
          museumId: selectedMuseum?.id ?? '',
        });
      },
    }),
    [deleteUserRole, selectedMuseum?.id]
  );

  const columns = useMemo<ColumnDef<UserWithRole>[]>(
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
        accessorKey: 'user.avatarUrl',
        header: 'Avatar',
        enableSorting: false,
        cell: ({ row }) => (
          <Avatar>
            <AvatarImage src={row.original.user.avatarUrl as string} />
            <AvatarFallback>{row.original.user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ),
      },
      {
        accessorKey: 'user.fullName',
        header: 'Tên',
        enableSorting: true,
        cell: ({ row }) => <div className="font-medium max-w-50 truncate">{row.original.user.fullName || 'N/A'}</div>,
      },
      {
        accessorKey: 'user.email',
        header: 'Email',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm max-w-60 truncate text-muted-foreground">{row.original.user.email}</div>
        ),
      },
      {
        accessorKey: 'user.phoneNumber',
        header: 'Số điện thoại',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm max-w-60 truncate text-muted-foreground">
            {row.original.user.phoneNumber ?? 'N/A'}
          </div>
        ),
      },
      {
        accessorKey: 'role.name',
        header: 'Vai trò',
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant="outline" className="font-medium">
            {row.original.role.name}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {hasPermission(selectedMuseum?.id || '', PERMISSION_USER_MANAGEMENT) && (
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction().onDelete(row.original)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xoá
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        ),
      },
    ],
    [handleAction, hasPermission, selectedMuseum?.id]
  );

  const { table } = useDataTable<UserWithRole, string>({
    data: get(staffData, 'data.data', []),
    columns,
    rowCount: get(staffData, 'data.total', 0),
    manualHandle: true,
    getRowId: (row) => row.userId + '_' + row.roleId,
    ...tableState,
  });

  if (!selectedMuseum?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Museum Selected</h2>
          <p className="text-gray-500">Please select a museum to view staff members.</p>
        </div>
      </div>
    );
  }

  if (loadingStaff) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <Button variant="default" size="sm" className="ml-2" onClick={() => setIsAddStaffModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm
          </Button>
        </DataTableToolbar>
      </DataTable>

      <AddStaffMember
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSuccess={() => {
          refetchStaff();
          setIsAddStaffModalOpen(false);
          toast.success('Staff member added successfully');
        }}
      />
    </>
  );
};

export default StaffDataTable;
