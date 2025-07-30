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
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useMuseums } from '../../api';
import { Museum } from '../../types';

interface MuseumDataTableProps {
  onView?: (museum: Museum) => void;
  onEdit?: (museum: Museum) => void;
  onDelete?: (museum: Museum) => void;
  onAdd?: () => void;
}

const MuseumDataTable = ({ onView, onEdit, onDelete, onAdd }: MuseumDataTableProps) => {
  const initialData: Museum[] = useMemo(() => [], []);
  const handleAction = useCallback(
    () => ({
      onView: (data: Museum) => onView?.(data),
      onEdit: (data: Museum) => onEdit?.(data),
      onDelete: (data: Museum) => onDelete?.(data),
    }),
    [onView, onEdit, onDelete]
  );

  const columns = useMemo<ColumnDef<Museum>[]>(
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
          label: 'Name',
          isSortable: true,
          unit: '',
        },
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        cell: ({ row }) => <div className="font-medium max-w-50 truncate">{row.original.name}</div>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="max-w-60 whitespace-break-spaces line-clamp-3 text-muted-foreground">
            {row.original.description}
          </div>
        ),
      },
      {
        accessorKey: 'location',
        header: 'Location',
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
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Archived', value: 'Archived' },
          ],
        },
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <Badge variant={row.original.status === 'Active' ? 'default' : 'secondary'}>{row.original.status}</Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">{new Date(row.original.createdAt).toLocaleDateString()}</div>
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
              <DropdownMenuItem onClick={() => handleAction().onDelete(row.original)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction]
  );

  const tableState = useDataTableState({ defaultPerPage: 10, defaultSort: [{ id: 'name', desc: false }] });

  const { data: museumsData, isLoading: loadingMuseums } = useMuseums({
    Page: tableState.pagination.pageIndex + 1,
    PageSize: tableState.pagination.pageSize,
    sortList: tableState.sorting.map((columnSort) => `${columnSort.id}_${columnSort.desc ? 'desc' : 'asc'}`),
    Search: (tableState.columnFilters.find((filter) => filter.id === 'name')?.value as string) || '',
    Status: (tableState.columnFilters.find((filter) => filter.id === 'status')?.value as string) || '',
  });

  const { table } = useDataTable<Museum, string>({
    data: museumsData?.data?.list || initialData,
    columns,
    rowCount: museumsData?.data?.total,
    manualHandle: true,
    getRowId: (row) => row.id.toString(),
    ...tableState,
  });

  if (loadingMuseums) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Button variant="default" size="sm" className="ml-2" onClick={onAdd}>
          Thêm Bảo Tàng
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
};

export default MuseumDataTable;
