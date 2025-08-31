import { useArtifactsByMuseum, useActivateArtifact, useDeactivateArtifact, useDeleteArtifact } from '@/api';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { DataTable, DataTableToolbar, useDataTable, useDataTableState, Option } from '@musetrip360/ui-core/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@musetrip360/ui-core/dialog';
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
import { Edit, MoreHorizontal, Power, PowerOff, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Artifact } from '../../types';
import { Link, useNavigate } from 'react-router';

const ArtifactMuseumDataTable = ({ museumId }: { museumId: string }) => {
  const initialData: Artifact[] = useMemo(() => [], []);
  const navigate = useNavigate();

  // State for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'single-status' | 'bulk-activate' | 'bulk-deactivate' | 'single-delete' | 'bulk-delete';
    artifacts: Artifact[];
    newStatus?: boolean;
  }>({
    isOpen: false,
    type: 'single-status',
    artifacts: [],
  });

  // State for bulk operation progress
  const [bulkProgress, setBulkProgress] = useState<{
    isProcessing: boolean;
    current: number;
    total: number;
  }>({
    isProcessing: false,
    current: 0,
    total: 0,
  });
  const { data: filterOptions } = useArtifactsByMuseum({
    Page: 1,
    PageSize: 10000,
    museumId: museumId || '',
  });

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

  const filteredArtifactTypes: Option[] = useMemo(() => {
    const uniqueTypes = new Set<string>();
    filterOptions?.list.forEach((artifact) => {
      if (artifact.metadata.type) {
        uniqueTypes.add(artifact.metadata.type);
      }
    });
    return Array.from(uniqueTypes).map((type) => ({ label: type, value: type }));
  }, [filterOptions]);

  const filteredArtifactMaterials: Option[] = useMemo(() => {
    const uniqueMaterials = new Set<string>();
    filterOptions?.list.forEach((artifact) => {
      if (artifact.metadata.material) {
        uniqueMaterials.add(artifact.metadata.material);
      }
    });
    return Array.from(uniqueMaterials).map((material) => ({ label: material, value: material }));
  }, [filterOptions]);

  const tableState = useDataTableState({ defaultPerPage: 10, defaultSort: [{ id: 'name', desc: false }] });

  const {
    data: artifactsData,
    isLoading: loadingArtifacts,
    refetch: refetchArtifacts,
  } = useArtifactsByMuseum({
    // Page: tableState.pagination.pageIndex + 1,
    // PageSize: tableState.pagination.pageSize,
    // sortList: tableState.sorting.map((columnSort) => `${columnSort.id}_${columnSort.desc ? 'desc' : 'asc'}`),
    // Search: (tableState.columnFilters.find((filter) => filter.id === 'name')?.value as string) || '',
    // HistoricalPeriods:
    //   (tableState.columnFilters.find((filter) => filter.id === 'historicalPeriod')?.value as string[]) || [],
    // museumId: museumId || '',
    Page: 1,
    PageSize: 10000,
    museumId: museumId || '',
  });

  // API mutations removed - updateArtifact not currently used

  const { mutate: deleteArtifact } = useDeleteArtifact({
    onError: (error) => {
      console.error('Delete failed:', error);
      toast.error('Failed to delete artifact');
    },
  });

  const { mutate: activateArtifact } = useActivateArtifact({
    onError: (error) => {
      console.log('Err', error);
    },
  });

  const { mutate: deactivateArtifact } = useDeactivateArtifact({
    onError: (error) => {
      console.log('Err', error);
    },
  });

  // Sequential API operation handler
  const handleSequentialOperations = useCallback(
    async (artifacts: Artifact[], operation: 'activate' | 'deactivate' | 'delete') => {
      setBulkProgress({ isProcessing: true, current: 0, total: artifacts.length });

      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < artifacts.length; i++) {
        const artifact = artifacts[i]!;
        setBulkProgress((prev) => ({ ...prev, current: i + 1 }));
        try {
          if (operation === 'delete') {
            deleteArtifact(artifact.id);
          } else if (operation === 'activate') {
            activateArtifact(artifact.id);
          } else if (operation === 'deactivate') {
            deactivateArtifact(artifact.id);
          }
          successCount++;

          // Add small delay between operations to prevent API overload
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Failed to ${operation} artifact ${artifact.name}:`, error);
          failureCount++;
        }
      }

      setBulkProgress({ isProcessing: false, current: 0, total: 0 });
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

      // Show summary notification only after all operations complete
      if (successCount > 0 && failureCount === 0) {
        const successMessage =
          operation === 'delete'
            ? `Successfully deleted ${successCount} artifact(s)`
            : `Successfully ${operation}d ${successCount} artifact(s)`;
        toast.success(successMessage);
      } else if (successCount > 0 && failureCount > 0) {
        toast.success(`${successCount} artifact(s) ${operation}d successfully, ${failureCount} failed`);
      } else if (failureCount > 0) {
        toast.error(`Failed to ${operation} ${failureCount} artifact(s)`);
      }

      // Refetch data only once after all operations complete
      refetchArtifacts();
    },
    [deleteArtifact, activateArtifact, deactivateArtifact, refetchArtifacts]
  );

  // Status change handlers
  const handleStatusChange = useCallback((artifact: Artifact, newStatus: boolean) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single-status',
      artifacts: [artifact],
      newStatus,
    });
  }, []);

  const handleBulkStatusChange = useCallback((selectedArtifacts: Artifact[], activate: boolean) => {
    setConfirmDialog({
      isOpen: true,
      type: activate ? 'bulk-activate' : 'bulk-deactivate',
      artifacts: selectedArtifacts,
      newStatus: activate,
    });
  }, []);

  const handleDeleteArtifact = useCallback((artifact: Artifact) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single-delete',
      artifacts: [artifact],
    });
  }, []);

  const handleBulkDelete = useCallback((selectedArtifacts: Artifact[]) => {
    setConfirmDialog({
      isOpen: true,
      type: 'bulk-delete',
      artifacts: selectedArtifacts,
    });
  }, []);

  const handleConfirmOperation = useCallback(() => {
    const { type, artifacts, newStatus } = confirmDialog;

    if (type === 'single-status' || type === 'bulk-activate' || type === 'bulk-deactivate') {
      const operation = newStatus ? 'activate' : 'deactivate';
      handleSequentialOperations(artifacts, operation);
    } else if (type === 'single-delete' || type === 'bulk-delete') {
      handleSequentialOperations(artifacts, 'delete');
    }
  }, [confirmDialog, handleSequentialOperations]);

  const handleCancelOperation = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleAction = useCallback(
    () => ({
      onEdit: (data: any) => {
        navigate(`/artifact/edit/${data.id}`);
      },

      onActivate: (data: Artifact) => {
        handleStatusChange(data, true);
      },

      onDeactivate: (data: Artifact) => {
        handleStatusChange(data, false);
      },

      onDelete: (data: Artifact) => {
        handleDeleteArtifact(data);
      },
    }),
    [navigate, handleStatusChange, handleDeleteArtifact]
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
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter types',
          label: 'Artifact Type',
          isSortable: true,
          unit: '',
          options: filteredArtifactTypes,
        },
        filterFn: 'arrIncludesSome',
        accessorKey: 'metadata.type',
        header: 'Type',
        enableSorting: true,
        cell: ({ row }) => <Badge variant="outline">{row.original.metadata.type}</Badge>,
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter materials',
          label: 'Artifact Material',
          isSortable: true,
          unit: '',
          options: filteredArtifactMaterials,
        },
        filterFn: 'arrIncludesSome',
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction().onDelete(row.original)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleAction, filteredHistoricalPeriods, filteredArtifactTypes, filteredArtifactMaterials]
  );

  const { table } = useDataTable<Artifact, string>({
    data: artifactsData?.list || initialData,
    columns,
    // rowCount: artifactsData?.total,
    // manualHandle: true,
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
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Bulk Actions ({table.getFilteredSelectedRowModel().rows.length})
                  <MoreHorizontal className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const selectedArtifacts = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
                    handleBulkStatusChange(selectedArtifacts, true);
                  }}
                  className="text-green-600"
                >
                  <Power className="mr-2 h-4 w-4" />
                  Activate artifacts
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const selectedArtifacts = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
                    handleBulkStatusChange(selectedArtifacts, false);
                  }}
                  className="text-orange-600"
                >
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate artifacts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const selectedArtifacts = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
                    handleBulkDelete(selectedArtifacts);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete artifacts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Link to="/artifact/create">
            <Button variant="default" size="sm" className="ml-2">
              Add Artifact
            </Button>
          </Link>
        </DataTableToolbar>
      </DataTable>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={handleCancelOperation}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === 'single-status'
                ? `${confirmDialog.newStatus ? 'Activate' : 'Deactivate'} Artifact`
                : confirmDialog.type === 'bulk-activate'
                  ? 'Activate Artifacts'
                  : confirmDialog.type === 'bulk-deactivate'
                    ? 'Deactivate Artifacts'
                    : confirmDialog.type === 'single-delete'
                      ? 'Delete Artifact'
                      : 'Delete Artifacts'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'single-status'
                ? `Are you sure you want to ${confirmDialog.newStatus ? 'activate' : 'deactivate'} this artifact? This action will ${confirmDialog.newStatus ? 'make the artifact visible to visitors' : 'hide the artifact from visitors'}.`
                : confirmDialog.type === 'bulk-activate'
                  ? `Are you sure you want to activate ${confirmDialog.artifacts.length} artifact(s)? This will make them visible to visitors.`
                  : confirmDialog.type === 'bulk-deactivate'
                    ? `Are you sure you want to deactivate ${confirmDialog.artifacts.length} artifact(s)? This will hide them from visitors.`
                    : confirmDialog.type === 'single-delete'
                      ? 'Are you sure you want to delete this artifact? This action cannot be undone.'
                      : `Are you sure you want to delete ${confirmDialog.artifacts.length} artifact(s)? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          {/* Show artifacts being affected */}
          {confirmDialog.artifacts.length > 0 && (
            <div className="max-h-80 overflow-y-auto -mr-4 pr-4 space-y-2 my-4">
              {confirmDialog.artifacts.map((artifact) => (
                <div key={artifact.id} className="flex items-center gap-3 p-2 border rounded-lg">
                  {artifact.imageUrl ? (
                    <img src={artifact.imageUrl} alt={artifact.name} className="w-16 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 flex items-center justify-center rounded text-xs">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{artifact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {artifact.historicalPeriod} • {artifact.metadata.type}
                    </p>
                  </div>
                  <Badge variant={artifact.isActive ? 'default' : 'secondary'} className="text-xs">
                    {artifact.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Bulk operation progress */}
          {bulkProgress.isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>
                  {bulkProgress.current} of {bulkProgress.total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelOperation} disabled={bulkProgress.isProcessing}>
              Cancel
            </Button>
            <Button
              variant={confirmDialog.type.includes('delete') ? 'destructive' : 'default'}
              onClick={handleConfirmOperation}
              disabled={bulkProgress.isProcessing}
            >
              {bulkProgress.isProcessing
                ? 'Processing...'
                : confirmDialog.type === 'single-status'
                  ? confirmDialog.newStatus
                    ? 'Activate'
                    : 'Deactivate'
                  : confirmDialog.type === 'bulk-activate'
                    ? 'Activate All'
                    : confirmDialog.type === 'bulk-deactivate'
                      ? 'Deactivate All'
                      : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtifactMuseumDataTable;
