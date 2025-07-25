import { useArtifactsByMuseum } from '@/api';
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
import { Artifact } from '../../types';
import { Link, useNavigate } from 'react-router';

const ArtifactMuseumDataTable = ({ museumId }: { museumId: string }) => {
  const initialData: Artifact[] = useMemo(() => [], []);
  const navigate = useNavigate();
  const handleAction = useCallback(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onView: (data: any) => {},

      onEdit: (data: any) => {
        navigate(`/artifact/edit/${data.id}`);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onDelete: (data: any) => {},
    }),
    [navigate]
  );

  const columns = useMemo<ColumnDef<Artifact>[]>(
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
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter periods',
          label: 'Historical Period',
          isSortable: true,
          unit: '',
          options: [
            { label: 'Ancient', value: 'Ancient' },
            { label: 'Medieval', value: 'Medieval' },
            { label: 'Renaissance', value: 'Renaissance' },
            { label: 'Modern', value: 'Modern' },
            { label: 'Contemporary', value: 'Contemporary' },
            { label: 'Prehistoric', value: 'Prehistoric' },
            { label: 'Classical', value: 'Classical' },
            { label: 'Industrial', value: 'Industrial' },
          ],
        },
        accessorKey: 'historicalPeriod',
        header: 'Historical Period',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <div className="text-sm max-w-30 whitespace-break-spaces line-clamp-2">{row.original.historicalPeriod}</div>
        ),
      },
      {
        accessorKey: 'metadata.type',
        header: 'Type',
        enableSorting: true,
        cell: ({ row }) => <Badge variant="outline">{row.original.metadata.type}</Badge>,
      },
      {
        accessorKey: 'metadata.material',
        header: 'Material',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm max-w-24 whitespace-break-spaces line-clamp-2">{row.original.metadata.material}</div>
        ),
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{row.original.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">★</span>
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

  const tableState = useDataTableState({ defaultPerPage: 10, defaultSort: [{ id: 'name', desc: false }] });

  const { data: artifactsData, isLoading: loadingArtifacts } = useArtifactsByMuseum({
    Page: tableState.pagination.pageIndex + 1,
    PageSize: tableState.pagination.pageSize,
    sortList: tableState.sorting.map((columnSort) => `${columnSort.id}_${columnSort.desc ? 'desc' : 'asc'}`),
    SearchKeyword: (tableState.columnFilters.find((filter) => filter.id === 'name')?.value as string) || '',
    IsActive: tableState.columnFilters.find((filter) => filter.id === 'isActive')?.value === 'true',
    HistoricalPeriods:
      (tableState.columnFilters.find((filter) => filter.id === 'historicalPeriod')?.value as string[]) || [],
    museumId: museumId || '',
  });

  const { table } = useDataTable<Artifact, string>({
    data: artifactsData?.list || initialData,
    columns,
    rowCount: artifactsData?.total,
    manualHandle: true,
    getRowId: (row) => row.id.toString(),
    ...tableState,
  });

  if (loadingArtifacts) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Link to="/artifact/create">
          <Button variant="default" size="sm" className="ml-2">
            Add Artifact
          </Button>
        </Link>
      </DataTableToolbar>
    </DataTable>
  );
};

export default ArtifactMuseumDataTable;
