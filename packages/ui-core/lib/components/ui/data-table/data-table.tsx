import { flexRender, Table as TableProps } from '@tanstack/react-table';
import { Fragment } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table/table';
import DataTableHeader from './data-table-header';
import { DataTablePagination } from './data-table-pagination';
import { ScrollArea, ScrollBar } from '../scroll-area';

export default function DataTable<T extends object>({
  table,
  handleClickRow,
  tableHeight = '500px',
  children,
}: {
  table: TableProps<T>;
  tableHeight?: string;
  handleClickRow?: (row: T) => void;
  children?: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      {children}
      <ScrollArea style={{ height: tableHeight }} className="w-full relative px-2">
        <Table style={{ minHeight: tableHeight }} className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Fragment key={header.id}>
                        {header.column.getCanSort() ? (
                          <DataTableHeader header={header} />
                        ) : (
                          <TableHead className="font-semibold text-sm">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )}
                      </Fragment>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => {
                    if (row.getCanSelect()) {
                      row.toggleSelected();
                    }
                    handleClickRow?.(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {table.getState().pagination.pageIndex !== undefined && table.getState().pagination.pageSize !== undefined && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
