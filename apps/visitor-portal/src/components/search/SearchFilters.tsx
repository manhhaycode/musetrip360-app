'use client';

import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Label } from '@musetrip360/ui-core/label';
import { RadioGroup, RadioGroupItem } from '@musetrip360/ui-core/radio-group';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TYPE_OPTIONS, type SearchFilters as SearchFiltersType } from '@/types/search';
import { DynamicIcon } from 'lucide-react/dynamic';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
  typeAggregations?: Record<string, number>;
  isLoading?: boolean;
}

export function SearchFilters({
  filters,
  onFilterChange,
  typeAggregations = {},
  isLoading = false,
}: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters);

  // Sync local filters with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterUpdate = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFiltersType = {
      query: '',
      type: 'All',
      page: 1,
      pageSize: 12,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Bộ lọc</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} disabled={isLoading}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Đặt lại
        </Button>
      </div>

      {/* Type Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Loại nội dung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={localFilters.type}
            onValueChange={(value) => handleFilterUpdate('type', value as any)}
            disabled={isLoading}
          >
            {TYPE_OPTIONS.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <RadioGroupItem value={type.value} id={type.value} />
                <Label htmlFor={type.value} className="flex-1 flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <DynamicIcon name={type.icon} className="h-4 w-4 text-primary" />
                    {type.label}
                  </span>
                  {typeAggregations[type.value] && (
                    <Badge variant="secondary" className="text-xs">
                      {typeAggregations[type.value]}
                    </Badge>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Filter Summary */}
      {(localFilters.query || localFilters.type !== 'All') && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bộ lọc hiện tại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {localFilters.query && (
              <Badge variant="outline" className="mr-2">
                Tìm kiếm: "{localFilters.query}"
              </Badge>
            )}
            {localFilters.type !== 'All' && (
              <Badge variant="outline" className="mr-2">
                Loại: {TYPE_OPTIONS.find((t) => t.value === localFilters.type)?.label}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
