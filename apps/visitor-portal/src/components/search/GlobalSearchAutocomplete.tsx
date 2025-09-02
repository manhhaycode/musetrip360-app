'use client';

import { GlobalSearchItem, useSearchSuggestions } from '@musetrip360/shared';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { cn } from '@musetrip360/ui-core/utils';
import { Calendar, GalleryHorizontalEnd, Globe, Loader2, MapPin, Search, User, Video } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface GlobalSearchAutocompleteProps {
  placeholder?: string;
  className?: string;
}

const getTypeIcon = (type: GlobalSearchItem['type']) => {
  const iconProps = { className: 'h-4 w-4' };

  switch (type) {
    case 'Museum':
      return <Globe {...iconProps} />;
    case 'Event':
      return <Calendar {...iconProps} />;
    case 'Artifact':
      return <GalleryHorizontalEnd {...iconProps} />;
    case 'TourOnline':
      return <Video {...iconProps} />;
    case 'User':
      return <User {...iconProps} />;
    default:
      return <Search {...iconProps} />;
  }
};

const getTypeLabel = (type: GlobalSearchItem['type']) => {
  switch (type) {
    case 'Museum':
      return 'Bảo tàng';
    case 'Event':
      return 'Sự kiện';
    case 'Artifact':
      return 'Hiện vật';
    case 'TourOnline':
      return 'Tour trực tuyến';
    case 'User':
      return 'Người dùng';
    default:
      return type;
  }
};

const getDetailUrl = (item: GlobalSearchItem): string => {
  switch (item.type) {
    case 'Museum':
      return `/museum/${item.id}`;
    case 'Event':
      return `/event/${item.id}`;
    case 'Artifact':
      return `/artifact/${item.id}`;
    case 'TourOnline':
      return `/tour/${item.id}`;
    case 'User':
      return `/user/${item.id}`;
    default:
      return `/search?q=${encodeURIComponent(item.title)}&type=${item.type}`;
  }
};

export function GlobalSearchAutocomplete({
  placeholder = 'Tìm bảo tàng, sự kiện...',
  className,
}: GlobalSearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [], isLoading } = useSearchSuggestions(query);

  // Helper function to build search URL preserving existing filters
  const buildSearchUrl = (searchQuery: string, itemType?: string) => {
    const params = new URLSearchParams();

    // Set the query
    params.set('q', searchQuery);

    // If itemType is provided, use it; otherwise preserve existing type filter
    if (itemType) {
      params.set('type', itemType);
    } else {
      const currentType = searchParams.get('type');
      if (currentType && currentType !== 'All') {
        params.set('type', currentType);
      }
    }

    // Preserve other existing filters
    const currentPage = searchParams.get('page');
    const currentPageSize = searchParams.get('pageSize');

    if (currentPage && currentPage !== '1') {
      params.set('page', currentPage);
    }
    if (currentPageSize && currentPageSize !== '12') {
      params.set('pageSize', currentPageSize);
    }

    return `/search?${params.toString()}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(value.length >= 2);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        router.push(buildSearchUrl(query));
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : -1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleItemClick(suggestions[selectedIndex]);
        } else {
          router.push(buildSearchUrl(query));
          setIsOpen(false);
          inputRef.current?.blur();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleItemClick = (item: GlobalSearchItem) => {
    router.push(getDetailUrl(item));
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-8 w-80"
        />
        {isLoading && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start px-4 py-3 h-auto text-left hover:bg-accent rounded-none',
                    selectedIndex === index && 'bg-accent'
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0 text-muted-foreground">{getTypeIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground line-clamp-1">{item.title}</span>
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full flex-shrink-0">
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
              <div className="border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-center py-2 text-sm text-muted-foreground hover:text-foreground rounded-none"
                  onClick={() => {
                    router.push(buildSearchUrl(query));
                    setIsOpen(false);
                    inputRef.current?.blur();
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Xem tất cả kết quả cho "{query}"
                </Button>
              </div>
            </>
          ) : query.length >= 2 && !isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Không tìm thấy kết quả cho "{query}"
              <Button
                variant="ghost"
                className="w-full mt-2 justify-center text-sm"
                onClick={() => {
                  router.replace(buildSearchUrl(query));
                  setIsOpen(false);
                  inputRef.current?.blur();
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm trên toàn bộ trang web
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
