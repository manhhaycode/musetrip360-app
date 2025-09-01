'use client';

import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { LayoutGrid, LayoutList, Search, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { TYPE_OPTIONS, type SearchFilters } from '../../types/search';
import { DynamicIcon } from 'lucide-react/dynamic';

interface SearchHeaderProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  resultCount: number;
  isLoading?: boolean;
  typeAggregations?: Record<string, number>;
}

export function SearchHeader({
  filters,
  onFiltersChange,
  resultCount,
  isLoading = false,
  typeAggregations = {},
}: SearchHeaderProps) {
  const [inputValue, setInputValue] = useState(filters.query);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync input with filters
  useEffect(() => {
    setInputValue(filters.query);
  }, [filters.query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, query: inputValue, page: 1 });
  };

  const handleTypeQuickFilter = (type: string) => {
    onFiltersChange({ ...filters, type: type as any, page: 1 });
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-secondary/5 border-b">
      <div className="container mx-auto max-w-screen-2xl px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-8">
          <span>Trang chủ</span>
          <span>/</span>
          <span className="text-foreground">Tìm kiếm</span>
        </div>

        {/* Page Title - Centered */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Khám phá{' '}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
              thế giới
            </span>{' '}
            bảo tàng
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tìm kiếm và khám phá bảo tàng, hiện vật, sự kiện và tour ảo tuyệt vời từ khắp nơi trên thế giới
          </p>
        </div>

        {/* Search Form - Centered */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm bảo tàng, hiện vật, sự kiện, tour ảo..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-16 pr-32 py-4 text-lg h-16 bg-background/90 backdrop-blur-sm border-2 focus:border-primary rounded-full shadow-lg"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 px-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Search className="h-5 w-5 mr-2" />}
              {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
            </Button>
          </div>
        </form>

        {/* Quick Type Filters - Centered */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {TYPE_OPTIONS.slice(1).map((type) => (
            <Badge
              key={type.value}
              variant={filters.type === type.value ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 px-4 py-2 text-sm font-medium"
              onClick={() => handleTypeQuickFilter(type.value)}
            >
              <span className="mr-2 text-base">
                <DynamicIcon name={type.icon} className="h-4 w-4" />
              </span>
              {type.label}
              {typeAggregations[type.value] && (
                <span className="ml-2 text-xs opacity-75 bg-background/20 px-2 py-0.5 rounded-full">
                  {typeAggregations[type.value]}
                </span>
              )}
            </Badge>
          ))}
        </div>

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tìm kiếm...
                </span>
              ) : (
                <>
                  Tìm thấy <span className="font-semibold text-foreground">{resultCount}</span> kết quả
                </>
              )}
            </p>
            {filters.query && <Badge variant="outline">Tìm kiếm: "{filters.query}"</Badge>}
            {filters.type !== 'All' && (
              <Badge variant="outline">Loại: {TYPE_OPTIONS.find((t) => t.value === filters.type)?.label}</Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>

            {/* Results per page */}
            <Select
              value={filters.pageSize.toString()}
              onValueChange={(value) => onFiltersChange({ ...filters, pageSize: Number(value), page: 1 })}
              disabled={isLoading}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 / trang</SelectItem>
                <SelectItem value="12">12 / trang</SelectItem>
                <SelectItem value="24">24 / trang</SelectItem>
                <SelectItem value="48">48 / trang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
