import { cn } from '@/libs/utils';
import { Column, Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import React from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { DataTableFacetedFilter } from './data-table-facade-filter';
import { DataTableViewOptions } from './data-table-view-option';

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

export function DataTableToolbar<TData>({ table, children, className, ...props }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, table.getAllColumns()]
  );

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getAllColumns()]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn('flex w-full items-start justify-between gap-2 p-1', className)}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button aria-label="Reset filters" variant="outline" size="sm" className="border-dashed" onClick={onReset}>
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        {children}
      </div>
    </div>
  );
}

function DataTableToolbarFilter<TData>({ column }: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta;

    const onFilterRender = React.useCallback(() => {
      if (!columnMeta?.variant) return null;

      switch (columnMeta.variant) {
        case 'text':
          return (
            <Input
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ''}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className="h-8 w-40 lg:w-56"
            />
          );

        case 'number':
          return (
            <div className="relative">
              <Input
                type="number"
                inputMode="numeric"
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className={cn('h-8 w-[120px]', columnMeta.unit && 'pr-8')}
              />
              {columnMeta.unit && (
                <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                  {columnMeta.unit}
                </span>
              )}
            </div>
          );

        // case 'range':
        //   return <DataTableSliderFilter column={column} title={columnMeta.label ?? column.id} />;

        // case 'date':
        // case 'dateRange':
        //   return (
        //     <DataTableDateFilter
        //       column={column}
        //       title={columnMeta.label ?? column.id}
        //       multiple={columnMeta.variant === 'dateRange'}
        //     />
        //   );

        case 'select':
        case 'multiSelect':
          return (
            <DataTableFacetedFilter
              column={column}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              multiple={columnMeta.variant === 'multiSelect'}
            />
          );

        default:
          return null;
      }
    }, [column, columnMeta]);

    return onFilterRender();
  }
}
