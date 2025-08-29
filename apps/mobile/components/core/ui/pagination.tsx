import { cn } from '@/libs/utils';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from './text';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPages?: number;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, showPages = 5, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = Math.min(totalPages, showPages);

    let startPage: number;

    if (totalPages <= showPages) {
      startPage = 1;
    } else if (currentPage <= Math.floor(showPages / 2) + 1) {
      startPage = 1;
    } else if (currentPage >= totalPages - Math.floor(showPages / 2)) {
      startPage = totalPages - showPages + 1;
    } else {
      startPage = currentPage - Math.floor(showPages / 2);
    }

    for (let i = 0; i < maxVisiblePages; i++) {
      pages.push(startPage + i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <View className={cn('flex-row items-center justify-center gap-2 py-4', className)}>
      {/* Previous Button */}
      <TouchableOpacity
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'px-3 py-2 rounded-lg border border-gray-300',
          currentPage === 1 ? 'bg-gray-100 opacity-50' : 'bg-white active:bg-gray-50'
        )}
      >
        <Text className={cn('text-sm font-medium', currentPage === 1 ? 'text-gray-400' : 'text-gray-700')}>Trước</Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      <View className="flex-row gap-1">
        {visiblePages.map((pageNumber) => {
          const isCurrentPage = pageNumber === currentPage;

          return (
            <TouchableOpacity
              key={pageNumber}
              onPress={() => onPageChange(pageNumber)}
              className={cn(
                'w-10 h-10 rounded-lg border border-gray-300 items-center justify-center',
                isCurrentPage ? 'bg-primary border-primary' : 'bg-card active:bg-muted'
              )}
            >
              <Text
                className={cn('text-sm font-medium', isCurrentPage ? 'text-primary-foreground' : 'text-foreground')}
              >
                {pageNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-3 py-2 rounded-lg border border-gray-300',
          currentPage === totalPages ? 'bg-gray-100 opacity-50' : 'bg-white active:bg-gray-50'
        )}
      >
        <Text className={cn('text-sm font-medium', currentPage === totalPages ? 'text-gray-400' : 'text-gray-700')}>
          Sau
        </Text>
      </TouchableOpacity>
    </View>
  );
}
