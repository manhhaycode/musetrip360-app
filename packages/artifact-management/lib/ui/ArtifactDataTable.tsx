import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { DataTable } from '@musetrip360/ui-core/data-table';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { Artifact } from '../types';

interface ArtifactDataTableProps {
  artifacts: Artifact[];
  onView?: (artifact: Artifact) => void;
  onEdit?: (artifact: Artifact) => void;
  onDelete?: (artifact: Artifact) => void;
  onRowClick?: (artifact: Artifact) => void;
  loading?: boolean;
}

const ArtifactDataTable = ({
  artifacts,
  onView,
  onEdit,
  onDelete,
  onRowClick,
  loading = false,
}: ArtifactDataTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="w-60 whitespace-break-spaces line-clamp-3 text-muted-foreground">
            {row.original.description}
          </div>
        ),
      },
      {
        accessorKey: 'historicalPeriod',
        header: 'Historical Period',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-sm w-30 whitespace-break-spaces line-clamp-2">{row.original.historicalPeriod}</div>
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
          <div className="text-sm w-24 whitespace-break-spaces line-clamp-2">{row.original.metadata.material}</div>
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
              {onView && (
                <DropdownMenuItem onClick={() => onView(row.original)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );

  const table = useReactTable({
    data: artifacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    pageCount: Math.ceil(artifacts.length / pageSize),

    state: {
      sorting,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DataTable
      pageIndex={pageIndex}
      pageSize={pageSize}
      total={artifacts.length}
      handlePagination={setPagination}
      table={table}
      handleClickRow={(artifact) => onRowClick?.(artifact)}
    />
  );
};

export default ArtifactDataTable;
