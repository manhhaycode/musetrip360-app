import { IVirtualTour, useVirtualTourByMuseum } from '@/api';
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
import { Link, useNavigate } from 'react-router';

export const VirtualTourDataTable = ({ museumId }: { museumId: string }) => {
  const initialData: IVirtualTour[] = useMemo(() => [], []);
  const navigate = useNavigate();

  const tableState = useDataTableState({ defaultPerPage: 10, defaultSort: [{ id: 'name', desc: false }] });

  const { data: virtualToursData, isLoading: loadingVirtualTours } = useVirtualTourByMuseum({
    Page: 1,
    PageSize: 10000,
    museumId: museumId || '',
  });

  const handleAction = useCallback(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onView: (data: any) => {},

      onEdit: (data: any) => {
        navigate(`/virtual-tour/studio/${data.id}`);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onDelete: (data: any) => {},
    }),
    [navigate]
  );

  const columns = useMemo<ColumnDef<IVirtualTour>[]>(
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
          placeholder: 'Search by name',
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
        accessorKey: 'isActive',
        header: 'Status',
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
            {row.original.isActive ? 'Active' : 'Inactive'}
          </Badge>
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

  const { table } = useDataTable<IVirtualTour, string>({
    data: virtualToursData?.list || initialData,
    columns,
    rowCount: virtualToursData?.total,
    manualHandle: true,
    getRowId: (row) => row.id.toString(),
    ...tableState,
  });

  if (loadingVirtualTours) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Link to="/virtual-tour/studio/create">
          <Button variant="default" size="sm" className="ml-2">
            Add Virtual Tour
          </Button>
        </Link>
      </DataTableToolbar>
    </DataTable>
  );
};
