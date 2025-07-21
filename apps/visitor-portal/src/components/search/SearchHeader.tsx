'use client';

import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { LayoutGrid, LayoutList, MapPin, Search } from 'lucide-react';
import React, { useState } from 'react';

interface SearchHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  resultCount: number;
}

export function SearchHeader({ searchQuery, onSearch, sortBy, onSortChange, resultCount }: SearchHeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-secondary/5 border-b">
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <span>Trang chủ</span>
          <span>/</span>
          <span className="text-foreground">Tìm kiếm bảo tàng</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Khám phá{' '}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
              bảo tàng
            </span>
          </h1>
          <p className="text-muted-foreground">Tìm kiếm và khám phá các bảo tàng tuyệt vời trên khắp thế giới</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm bảo tàng, địa điểm, danh mục..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg h-14 bg-background/80 backdrop-blur-sm border-2 focus:border-primary"
            />
            <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10">
              Tìm kiếm
            </Button>
          </div>
        </form>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            Việt Nam
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Nghệ thuật
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Lịch sử
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Khoa học
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Miễn phí
          </Badge>
        </div>

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Tìm thấy <span className="font-semibold text-foreground">{resultCount}</span> bảo tàng
            </p>
            {searchQuery && <Badge variant="outline">Kết quả cho: "{searchQuery}"</Badge>}
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

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Liên quan nhất</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="reviews">Nhiều đánh giá nhất</SelectItem>
                <SelectItem value="name">Tên A-Z</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
