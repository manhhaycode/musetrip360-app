import { PaginationState } from '@tanstack/react-table';

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

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPaginationChange: (pagination: PaginationState) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  className?: string;
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  totalCount,
  onPaginationChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  className,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = pageIndex + 1;

  const handlePageChange = (newPageIndex: number) => {
    onPaginationChange({ pageIndex: newPageIndex, pageSize });
  };

  const handlePageSizeChange = (newPageSize: string) => {
    onPaginationChange({ pageIndex: 0, pageSize: parseInt(newPageSize) });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, currentPage + halfVisible);

      // Adjust if we're near the beginning or end
      if (currentPage <= halfVisible) {
        end = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        start = totalPages - maxVisiblePages + 1;
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={cn('flex items-center gap-6 px-2 py-4', className)}>
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-sm font-medium">
          {totalCount === 0 ? (
            'No results'
          ) : (
            <>
              Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount}{' '}
              results
            </>
          )}
        </div>

        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page:</p>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px]">
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
                if (pageIndex > 0) handlePageChange(pageIndex - 1);
              }}
              className={pageIndex === 0 ? 'pointer-events-none opacity-50' : ''}
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
                    handlePageChange((page as number) - 1);
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
                if (pageIndex < totalPages - 1) handlePageChange(pageIndex + 1);
              }}
              className={pageIndex >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
