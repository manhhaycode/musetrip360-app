import { flexRender, PaginationState, Table as TableProps } from '@tanstack/react-table';
import { Fragment } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table/table';
import DataTableHeader from './data-table-header';
import { DataTablePagination } from './data-table-pagination';
import { ScrollArea, ScrollBar } from '../scroll-area';

export default function DataTable<T extends object>({
  table,
  handlePagination,
  pageIndex,
  pageSize,
  total,
  handleClickRow,
}: {
  table: TableProps<T>;
  handlePagination?: (pagination: PaginationState) => void;
  pageIndex?: number;
  pageSize?: number;
  total?: number;
  handleClickRow?: (row: T) => void;
}) {
  return (
    <>
      <ScrollArea className="w-full h-[500px] relative">
        <Table>
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
      {handlePagination && pageIndex !== undefined && pageSize !== undefined && total !== undefined && (
        <DataTablePagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={total}
          onPaginationChange={handlePagination}
        />
      )}
    </>
  );
}
