import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { UseDataTableState } from './use-data-table-state';

// The following import is required for side effects, such as extending @tanstack/react-table functionality.
import '@tanstack/react-table'; // or vue, svelte, solid, qwik, etc.
import { RowData } from '@tanstack/react-table';

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    variant: 'text' | 'number' | 'range' | 'date' | 'dateRange' | 'boolean' | 'select' | 'multiSelect';
    placeholder: string;
    label: string;
    isSortable?: boolean;
    unit: string;
    options?: Option[];
    range?: [number, number];
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

interface UseDataTableProps<TData, TValue> extends UseDataTableState {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  rowCount?: number;
  manualHandle?: boolean;
  getRowId?: (row: TData, index: number) => string;
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  rowSelection,
  columnVisibility,
  columnFilters,
  sorting,
  pagination,
  rowCount,
  manualHandle = false,
  setRowSelection,
  setColumnVisibility,
  setColumnFilters,
  setSorting,
  setPagination,
  getRowId,
}: UseDataTableProps<TData, TValue>) {
  const table = useReactTable<TData>({
    data,
    columns,
    rowCount,
    getRowId,
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    ...(manualHandle
      ? {
          manualPagination: true,
          manualSorting: true,
          manualFiltering: true,
          autoResetSelectedRows: false,
          autoResetPageIndex: false,
        }
      : {
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
        }),
  });

  const selectedRowIds = useMemo(() => {
    return Object.keys(rowSelection).map((id) => id);
  }, [rowSelection]);

  const selectedRows = useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, rowSelection]);

  return {
    table,
    selectedRowIds,
    selectedRows,
    pagination,
    setPagination,
  };
}
