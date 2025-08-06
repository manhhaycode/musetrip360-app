import { useArtifactsByMuseum, useActivateArtifact, useDeactivateArtifact } from '@/api';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { DataTable, DataTableToolbar, useDataTable, useDataTableState, Option } from '@musetrip360/ui-core/data-table';
import { toast } from '@musetrip360/ui-core/sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Power, PowerOff } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Artifact } from '../../types';
import { Link, useNavigate } from 'react-router';

const ArtifactMuseumDataTable = ({ museumId }: { museumId: string }) => {
  const initialData: Artifact[] = useMemo(() => [], []);
  const navigate = useNavigate();
  const { data: filterOptions } = useArtifactsByMuseum(
    {
      Page: 1,
      PageSize: 10000,
      museumId: museumId || '',
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  const filteredHistoricalPeriods: Option[] = useMemo(() => {
    const uniquePeriods = new Set<string>();
    filterOptions?.list.forEach((artifact) => {
      if (artifact.historicalPeriod) {
        uniquePeriods.add(artifact.historicalPeriod);
      }
    });
    // Debugging statement removed: console.log('Unique Historical Periods:', Array.from(uniquePeriods));
    return Array.from(uniquePeriods).map((period) => ({ label: period, value: period }));
  }, [filterOptions]);

  const tableState = useDataTableState({ defaultPerPage: 10, defaultSort: [{ id: 'name', desc: false }] });

  const {
    data: artifactsData,
    isLoading: loadingArtifacts,
    refetch: refetchArtifacts,
  } = useArtifactsByMuseum({
    Page: tableState.pagination.pageIndex + 1,
    PageSize: tableState.pagination.pageSize,
    sortList: tableState.sorting.map((columnSort) => `${columnSort.id}_${columnSort.desc ? 'desc' : 'asc'}`),
    SearchKeyword: (tableState.columnFilters.find((filter) => filter.id === 'name')?.value as string) || '',
    HistoricalPeriods:
      (tableState.columnFilters.find((filter) => filter.id === 'historicalPeriod')?.value as string[]) || [],
    museumId: museumId || '',
    // Page: 1,
    // PageSize: 10000,
    // museumId: museumId || '',
  });

  // Activate/Deactivate mutations
  const { mutate: activateArtifact } = useActivateArtifact({
    onSuccess: () => {
      // Success message could be shown here
      toast.success('Artifact activated successfully');
      refetchArtifacts();
    },
    onError: (error) => {
      console.log('Err', error);
      toast.error('Failed to activate artifact');
    },
  });

  const { mutate: deactivateArtifact } = useDeactivateArtifact({
    onSuccess: () => {
      // Success message could be shown here
      toast.success('Artifact deactivated successfully');
      refetchArtifacts();
    },
    onError: (error) => {
      console.log('Err', error);
      toast.error('Failed to deactivate artifact');
    },
  });

  const handleAction = useCallback(
    () => ({
      onEdit: (data: any) => {
        navigate(`/artifact/edit/${data.id}`);
      },

      onActivate: (data: any) => {
        activateArtifact(data.id);
      },

      onDeactivate: (data: any) => {
        deactivateArtifact(data.id);
      },
    }),
    [navigate, activateArtifact, deactivateArtifact]
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
        accessorKey: 'imageUrl',
        header: 'Thumbnail',
        enableSorting: false,
        cell: ({ row }) => {
          const thumbnailUrl = row.original.imageUrl;
          return (
            <div className="flex items-center justify-center">
              {row.original.imageUrl ? (
                <img src={thumbnailUrl} alt={row.original.name} className="w-16 h-12 object-cover rounded" />
              ) : (
                <div className="w-16 h-12 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-xs text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
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
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter periods',
          label: 'Historical Period',
          isSortable: true,
          unit: '',
          options: filteredHistoricalPeriods,
        },
        filterFn: 'arrIncludesSome',
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
              <DropdownMenuItem onClick={() => handleAction().onEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {row.original.isActive ? (
                <DropdownMenuItem onClick={() => handleAction().onDeactivate(row.original)} className="text-orange-600">
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleAction().onActivate(row.original)} className="text-green-600">
                  <Power className="mr-2 h-4 w-4" />
                  Activate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction, filteredHistoricalPeriods]
  );

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
