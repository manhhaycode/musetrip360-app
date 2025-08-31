import { IVirtualTour, useVirtualTourByMuseum, useUpdateVirtualTour, useDeleteVirtualTour } from '@/api';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { toast } from '@musetrip360/ui-core/sonner';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Power, PowerOff, MoreHorizontal } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';

export const VirtualTourDataTable = ({ museumId }: { museumId: string }) => {
  const initialData: IVirtualTour[] = useMemo(() => [], []);
  const navigate = useNavigate();

  // State for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'single-status' | 'bulk-activate' | 'bulk-deactivate' | 'single-delete' | 'bulk-delete';
    tours: IVirtualTour[];
    newStatus?: boolean;
  }>({
    isOpen: false,
    type: 'single-status',
    tours: [],
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

  // Fetch all data for client-side filtering
  const {
    data: virtualToursData,
    isLoading: loadingVirtualTours,
    refetch,
  } = useVirtualTourByMuseum({
    Page: 1,
    PageSize: 10000,
    museumId: museumId || '',
  });

  // API mutations
  const { mutate: updateVirtualTour } = useUpdateVirtualTour(
    {
      onError: (error) => {
        console.error('Update failed:', error);
      },
    },
    !bulkProgress.isProcessing
  );

  const { mutate: deleteVirtualTour } = useDeleteVirtualTour({
    onError: (error) => {
      console.error('Delete failed:', error);
    },
  });

  // Generate filter options from data
  const statusOptions: Option[] = useMemo(
    () => [
      { label: 'Active', value: 'true' },
      { label: 'Inactive', value: 'false' },
    ],
    []
  );

  const priceRangeOptions: Option[] = useMemo(() => {
    if (!virtualToursData?.list) return [];
    const prices = virtualToursData.list.map((tour) => tour.price).sort((a, b) => a - b);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const step = (maxPrice - minPrice) / 4;

    return [
      {
        label: `${minPrice.toLocaleString('vi-VN')}đ - ${Math.round(minPrice + step).toLocaleString('vi-VN')}đ`,
        value: `${minPrice}-${Math.round(minPrice + step)}`,
      },
      {
        label: `${Math.round(minPrice + step).toLocaleString('vi-VN')}đ - ${Math.round(minPrice + step * 2).toLocaleString('vi-VN')}đ`,
        value: `${Math.round(minPrice + step)}-${Math.round(minPrice + step * 2)}`,
      },
      {
        label: `${Math.round(minPrice + step * 2).toLocaleString('vi-VN')}đ - ${Math.round(minPrice + step * 3).toLocaleString('vi-VN')}đ`,
        value: `${Math.round(minPrice + step * 2)}-${Math.round(minPrice + step * 3)}`,
      },
      {
        label: `${Math.round(minPrice + step * 3).toLocaleString('vi-VN')}đ+`,
        value: `${Math.round(minPrice + step * 3)}-${maxPrice}`,
      },
    ];
  }, [virtualToursData]);

  const tableState = useDataTableState({ defaultPerPage: 10, defaultSort: [{ id: 'name', desc: false }] });

  // Sequential API operation handler
  const handleSequentialOperations = useCallback(
    async (tours: IVirtualTour[], operation: 'activate' | 'deactivate' | 'delete') => {
      setBulkProgress({ isProcessing: true, current: 0, total: tours.length });

      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < tours.length; i++) {
        const tour = tours[i]!;
        setBulkProgress((prev) => ({ ...prev, current: i + 1 }));
        try {
          if (operation === 'delete') {
            deleteVirtualTour(tour.id);
          } else {
            updateVirtualTour({
              ...tour,
              isActive: operation === 'activate',
            });
          }
          successCount++;

          // Add small delay between operations to prevent API overload
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Failed to ${operation} tour ${tour.name}:`, error);
          failureCount++;
        }
      }

      setBulkProgress({ isProcessing: false, current: 0, total: 0 });
      setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

      // Show summary notification only after all operations complete
      if (successCount > 0 && failureCount === 0) {
        const successMessage =
          operation === 'delete'
            ? `Successfully deleted ${successCount} virtual tour(s)`
            : `Successfully ${operation}d ${successCount} virtual tour(s)`;
        toast.success(successMessage);
      } else if (successCount > 0 && failureCount > 0) {
        toast.success(`${successCount} virtual tour(s) ${operation}d successfully, ${failureCount} failed`);
      } else if (failureCount > 0) {
        toast.error(`Failed to ${operation} ${failureCount} virtual tour(s)`);
      }

      // Refetch data only once after all operations complete
      refetch();
    },
    [updateVirtualTour, deleteVirtualTour, refetch]
  );

  // Status change handlers
  const handleStatusChange = useCallback((tour: IVirtualTour, newStatus: boolean) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single-status',
      tours: [tour],
      newStatus,
    });
  }, []);

  const handleBulkStatusChange = useCallback((selectedTours: IVirtualTour[], activate: boolean) => {
    setConfirmDialog({
      isOpen: true,
      type: activate ? 'bulk-activate' : 'bulk-deactivate',
      tours: selectedTours,
      newStatus: activate,
    });
  }, []);

  const handleDeleteTour = useCallback((tour: IVirtualTour) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single-delete',
      tours: [tour],
    });
  }, []);

  const handleBulkDelete = useCallback((selectedTours: IVirtualTour[]) => {
    setConfirmDialog({
      isOpen: true,
      type: 'bulk-delete',
      tours: selectedTours,
    });
  }, []);

  const handleConfirmOperation = useCallback(() => {
    const { type, tours, newStatus } = confirmDialog;

    if (type === 'single-status' || type === 'bulk-activate' || type === 'bulk-deactivate') {
      const operation = newStatus ? 'activate' : 'deactivate';
      handleSequentialOperations(tours, operation);
    } else if (type === 'single-delete' || type === 'bulk-delete') {
      handleSequentialOperations(tours, 'delete');
    }
  }, [confirmDialog, handleSequentialOperations]);

  const handleCancelOperation = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleEdit = useCallback(
    (data: any) => {
      navigate(`/virtual-tour/studio/${data.id}`);
    },
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
        cell: ({ row }) => {
          const thumbnailFile = row.original.metadata.images?.[0]?.file;
          const thumbnailUrl = typeof thumbnailFile === 'string' ? thumbnailFile : null;
          return (
            <div className="flex items-center gap-3">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={row.original.name}
                  className="w-16 h-12 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-12 bg-gray-200 flex min-w-fit items-center justify-center rounded shrink-0">
                  <span className="text-xs text-muted-foreground">No Image</span>
                </div>
              )}
              <div className="font-medium max-w-48 truncate" title={row.original.name}>
                {row.original.name}
              </div>
            </div>
          );
        },
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
          placeholder: 'Lọc theo khoảng giá',
          label: 'Khoảng Giá',
          isSortable: true,
          unit: '',
          options: priceRangeOptions,
        },
        filterFn: (row, _columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          const price = row.original.price;
          return filterValue.some((range: string) => {
            const [min, max] = range.split('-').map(Number);
            if (!min || !max || isNaN(min) || isNaN(max)) return false;
            return price >= min && price <= max;
          });
        },
        accessorKey: 'price',
        header: 'Giá',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.price ? row.original.price.toLocaleString('vi-VN') + 'đ' : 'Miễn phí'}
          </div>
        ),
      },
      {
        accessorKey: 'metadata.scenes',
        header: 'Scenes',
        enableSorting: false,
        cell: ({ row }) => <Badge variant="outline">{row.original.metadata.scenes?.length || 0} scenes</Badge>,
      },
      {
        sortingFn: (rowA, rowB) => {
          const dateA = rowA.original.createdAt ? new Date(rowA.original.createdAt).getTime() : 0;
          const dateB = rowB.original.createdAt ? new Date(rowB.original.createdAt).getTime() : 0;
          return dateA - dateB;
        },
        accessorKey: 'createdAt',
        header: 'Created',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A'}
          </div>
        ),
      },
      {
        meta: {
          variant: 'multiSelect',
          placeholder: 'Filter by status',
          label: 'Status',
          isSortable: true,
          unit: '',
          options: statusOptions,
        },
        filterFn: (row, _columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          const isActive = row.original.isActive.toString();
          return filterValue.includes(isActive);
        },
        accessorKey: 'isActive',
        header: 'Status',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <Select
            value={row.original.isActive.toString()}
            onValueChange={(value) => {
              const newStatus = value === 'true';
              if (newStatus !== row.original.isActive) {
                handleStatusChange(row.original, newStatus);
              }
            }}
          >
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active
                </div>
              </SelectItem>
              <SelectItem value="false">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Inactive
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTour(row.original)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleEdit, handleDeleteTour, priceRangeOptions, statusOptions, handleStatusChange]
  );

  const { table } = useDataTable<IVirtualTour, string>({
    data: virtualToursData?.list || initialData,
    columns,
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

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedTours = selectedRows.map((row) => row.original);
  const hasSelection = selectedTours.length > 0;

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          {hasSelection && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Bulk Actions ({selectedTours.length})
                  <MoreHorizontal className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleBulkStatusChange(selectedTours, true)}
                  className="text-green-600"
                  disabled={bulkProgress.isProcessing}
                >
                  <Power className="mr-2 h-4 w-4" />
                  Activate tours
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkStatusChange(selectedTours, false)}
                  className="text-orange-600"
                  disabled={bulkProgress.isProcessing}
                >
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate tours
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleBulkDelete(selectedTours)}
                  className="text-red-600"
                  disabled={bulkProgress.isProcessing}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete tours
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Link to="/virtual-tour/studio/create">
            <Button variant="default" size="sm" className="ml-2">
              Add Virtual Tour
            </Button>
          </Link>
        </DataTableToolbar>
      </DataTable>

      {/* Confirmation Dialog for Operations */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === 'single-status' && 'Confirm Status Change'}
              {confirmDialog.type === 'bulk-activate' && 'Confirm Bulk Activation'}
              {confirmDialog.type === 'bulk-deactivate' && 'Confirm Bulk Deactivation'}
              {confirmDialog.type === 'single-delete' && 'Confirm Delete'}
              {confirmDialog.type === 'bulk-delete' && 'Confirm Bulk Delete'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type.includes('status') &&
                `Are you sure you want to ${confirmDialog.newStatus ? 'activate' : 'deactivate'} the following virtual tour(s)?`}
              {confirmDialog.type.includes('delete') &&
                'Are you sure you want to delete the following virtual tour(s)? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-80 -mr-4 pr-4 overflow-y-auto">
            {confirmDialog.tours.map((tour) => (
              <div key={tour.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {tour.metadata.images?.[0]?.file && typeof tour.metadata.images[0].file === 'string' ? (
                    <img
                      src={tour.metadata.images[0].file}
                      alt={tour.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-xs text-muted-foreground">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" title={tour.name}>
                    {tour.name}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <span>{tour.metadata.scenes?.length || 0} scenes</span>
                    <Badge variant={tour.isActive ? 'default' : 'secondary'}>
                      {tour.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <span>{tour.price ? `${tour.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {bulkProgress.isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing...</span>
                <span>
                  {bulkProgress.current} / {bulkProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelOperation} disabled={bulkProgress.isProcessing}>
              Cancel
            </Button>
            <Button
              variant={
                confirmDialog.type.includes('delete')
                  ? 'destructive'
                  : confirmDialog.newStatus
                    ? 'default'
                    : 'secondary'
              }
              onClick={handleConfirmOperation}
              disabled={bulkProgress.isProcessing}
            >
              {bulkProgress.isProcessing && `Processing... (${bulkProgress.current}/${bulkProgress.total})`}
              {!bulkProgress.isProcessing && (
                <>
                  {confirmDialog.type === 'single-status' && (confirmDialog.newStatus ? 'Activate' : 'Deactivate')}
                  {confirmDialog.type === 'bulk-activate' && 'Activate All'}
                  {confirmDialog.type === 'bulk-deactivate' && 'Deactivate All'}
                  {confirmDialog.type === 'single-delete' && 'Delete'}
                  {confirmDialog.type === 'bulk-delete' && 'Delete All'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
