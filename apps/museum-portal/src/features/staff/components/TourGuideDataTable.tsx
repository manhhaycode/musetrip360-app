import { TourGuide, useTourGuides } from '@musetrip360/user-management';
import { useMuseumStore } from '@musetrip360/museum-management';
import { Button } from '@musetrip360/ui-core/button';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { DataTable, useDataTable, useDataTableState } from '@musetrip360/ui-core/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@musetrip360/ui-core/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, UserPlus, Edit, Trash2 } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';

import get from 'lodash.get';
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core';
import AddTourGuide from './AddTourGuide';
import EditTourGuide from './EditTourGuide';
import DeleteTourGuideConfirm from './DeleteTourGuideConfirm';

const TourGuideDataTable = () => {
  const { selectedMuseum } = useMuseumStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTourGuide, setSelectedTourGuide] = useState<TourGuide | null>(null);

  const tableState = useDataTableState({
    defaultPerPage: 10,
    defaultSort: [{ id: 'user.fullName', desc: false }],
  });

  const {
    data: tourGuideData,
    isLoading: loadingTourGuide,
    refetch,
  } = useTourGuides(selectedMuseum?.id || '', {
    Page: tableState.pagination.pageIndex + 1,
    PageSize: tableState.pagination.pageSize,
  });

  const handleAddTourGuideSuccess = useCallback(() => {
    setIsAddModalOpen(false);
    refetch();
  }, [refetch]);

  const handleEditTourGuide = useCallback((tourGuide: TourGuide) => {
    setSelectedTourGuide(tourGuide);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteTourGuide = useCallback((tourGuide: TourGuide) => {
    setSelectedTourGuide(tourGuide);
    setIsDeleteModalOpen(true);
  }, []);

  const handleEditSuccess = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedTourGuide(null);
    refetch();
  }, [refetch]);

  const handleDeleteSuccess = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedTourGuide(null);
    refetch();
  }, [refetch]);

  const columns = useMemo<ColumnDef<TourGuide>[]>(
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
        accessorKey: 'name',
        header: 'Tên vị trí',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="font-medium max-w-50 truncate">
            {row.original.name || row.original.user.fullName || 'N/A'}
          </div>
        ),
      },
      {
        accessorKey: 'bio',
        header: 'Tiểu sử',
        enableSorting: true,
        cell: ({ row }) => <div className="font-medium max-w-50 truncate">{row.original.bio || 'N/A'}</div>,
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
        id: 'actions',
        header: 'Actions',
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
              <DropdownMenuItem onClick={() => handleEditTourGuide(row.original)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteTourGuide(row.original)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleDeleteTourGuide, handleEditTourGuide]
  );

  const { table } = useDataTable<TourGuide, string>({
    data: get(tourGuideData, 'data.list', []),
    columns,
    rowCount: get(tourGuideData, 'data.total', 0),
    manualHandle: true,
    getRowId: (row) => row.id,
    ...tableState,
  });

  if (!selectedMuseum?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Museum Selected</h2>
          <p className="text-gray-500">Hãy chọn bảo tàng trước khi xem hướng dẫn viên.</p>
        </div>
      </div>
    );
  }

  if (loadingTourGuide) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Hướng dẫn viên</h2>
          <p className="text-gray-600">Quản lý hướng dẫn viên {selectedMuseum?.name}</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Thêm
        </Button>
      </div>

      <DataTable table={table} />

      <AddTourGuide
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddTourGuideSuccess}
      />

      {selectedTourGuide && (
        <EditTourGuide
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTourGuide(null);
          }}
          onSuccess={handleEditSuccess}
          tourGuide={selectedTourGuide}
        />
      )}

      {selectedTourGuide && (
        <DeleteTourGuideConfirm
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTourGuide(null);
          }}
          onSuccess={handleDeleteSuccess}
          tourGuide={selectedTourGuide}
        />
      )}
    </>
  );
};

export default TourGuideDataTable;
