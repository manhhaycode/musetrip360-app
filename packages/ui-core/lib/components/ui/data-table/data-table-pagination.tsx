import { Table } from '@tanstack/react-table';

import { cn } from '@/libs/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  className?: string;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  className,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalPages = table.getPageCount();
  const currentPage = pageIndex + 1;

  // For manual pagination: use rowCount, for client-side: use data length
  const rowCount = table.options.manualPagination ? table.getRowCount() : table.getPrePaginationRowModel().rows.length;

  const handlePageSizeChange = (newPageSize: string) => {
    table.setPageSize(parseInt(newPageSize));
  };

  // Simple pagination: show first, current-1, current, current+1, last
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Add ellipsis if current page is far from start
    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis if current page is far from end
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className={cn('flex items-center gap-6 px-2 py-4', className)}>
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-sm font-medium">
          {rowCount === 0 ? (
            'No results'
          ) : (
            <>
              Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, rowCount)} of {rowCount}{' '}
              results
            </>
          )}
        </div>

        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page:</p>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (table.getCanPreviousPage()) table.previousPage();
              }}
              className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex((page as number) - 1);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (table.getCanNextPage()) table.nextPage();
              }}
              className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
