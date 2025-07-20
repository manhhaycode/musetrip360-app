import {
  OnChangeFn,
  RowSelectionState,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';

interface UseDataTableStateProps {
  pageCount?: number;
  defaultPerPage?: number;
  defaultSort?: SortingState;
}

export interface UseDataTableState {
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
}

export function useDataTableState({ defaultPerPage = 10, defaultSort }: UseDataTableStateProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(defaultSort ?? []);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPerPage,
  });

  return {
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
  };
}
