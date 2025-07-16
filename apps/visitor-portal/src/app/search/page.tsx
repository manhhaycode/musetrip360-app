'use client';

import { useState } from 'react';
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchPagination } from '@/components/search/SearchPagination';
import { Button } from '@musetrip360/ui-core/button';
import { Sheet, SheetContent, SheetTrigger } from '@musetrip360/ui-core/sheet';
import { SlidersHorizontal } from 'lucide-react';

// Mock data for demonstration
const mockMuseums = [
  {
    id: 1,
    name: 'Bảo tàng Lịch sử Việt Nam',
    category: 'Lịch sử',
    location: 'Hà Nội, Việt Nam',
    rating: 4.8,
    reviewCount: 245,
    price: 'Miễn phí',
    image: '/api/placeholder/400/300',
    description: 'Khám phá lịch sử dân tộc Việt Nam qua các hiện vật quý giá...',
    features: ['Tour ảo 360°', 'Hướng dẫn viên AI', 'Tương tác VR'],
    openHours: '8:00 - 17:00',
    established: '1958',
  },
  {
    id: 2,
    name: 'Musée du Louvre',
    category: 'Nghệ thuật',
    location: 'Paris, France',
    rating: 4.9,
    reviewCount: 1250,
    price: '€17',
    image: '/api/placeholder/400/300',
    description: 'Bảo tàng nghệ thuật lớn nhất thế giới với những kiệt tác bất hủ...',
    features: ['Tour ảo 360°', 'Thực tế ảo', 'Hướng dẫn đa ngôn ngữ'],
    openHours: '9:00 - 18:00',
    established: '1793',
  },
  {
    id: 3,
    name: 'Natural History Museum',
    category: 'Khoa học',
    location: 'London, UK',
    rating: 4.7,
    reviewCount: 892,
    price: 'Free',
    image: '/api/placeholder/400/300',
    description: 'Khám phá thế giới tự nhiên với bộ sưu tập khủng long và khoáng vật...',
    features: ['AR Experience', 'Interactive Tours', 'Kids Zone'],
    openHours: '10:00 - 18:00',
    established: '1881',
  },
  {
    id: 4,
    name: 'Bảo tàng Dân tộc học',
    category: 'Văn hóa',
    location: 'Hồ Chí Minh, Việt Nam',
    rating: 4.6,
    reviewCount: 156,
    price: '20.000 VND',
    image: '/api/placeholder/400/300',
    description: 'Tìm hiểu về văn hóa các dân tộc Việt Nam qua trang phục và đồ vật...',
    features: ['Tour ảo', 'Trải nghiệm văn hóa', 'Workshop'],
    openHours: '8:30 - 17:00',
    established: '1991',
  },
  {
    id: 5,
    name: 'Metropolitan Museum',
    category: 'Nghệ thuật',
    location: 'New York, USA',
    rating: 4.8,
    reviewCount: 2100,
    price: '$30',
    image: '/api/placeholder/400/300',
    description: 'Bộ sưu tập nghệ thuật đa dạng từ cổ đại đến hiện đại...',
    features: ['Virtual Reality', 'Audio Guide', 'Mobile App'],
    openHours: '10:00 - 17:00',
    established: '1870',
  },
  {
    id: 6,
    name: 'Bảo tàng Hồ Chí Minh',
    category: 'Lịch sử',
    location: 'Hà Nội, Việt Nam',
    rating: 4.5,
    reviewCount: 320,
    price: 'Miễn phí',
    image: '/api/placeholder/400/300',
    description: 'Tìm hiểu về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh...',
    features: ['Tour hướng dẫn', 'Triển lãm tương tác', 'Tài liệu lịch sử'],
    openHours: '8:00 - 11:30, 14:00 - 16:30',
    established: '1990',
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const resultsPerPage = 6;
  const totalPages = Math.ceil(mockMuseums.length / resultsPerPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: any) => {
    setSelectedCategory(filters.category);
    setSelectedLocation(filters.location);
    setPriceRange(filters.priceRange);
    setRating(filters.rating);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <SearchHeader
        searchQuery={searchQuery}
        onSearch={handleSearch}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        resultCount={mockMuseums.length}
      />

      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SearchFilters
                  selectedCategory={selectedCategory}
                  selectedLocation={selectedLocation}
                  priceRange={priceRange}
                  rating={rating}
                  onFilterChange={handleFilterChange}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <SearchFilters
              selectedCategory={selectedCategory}
              selectedLocation={selectedLocation}
              priceRange={priceRange}
              rating={rating}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Search Results */}
          <div className="flex-1">
            <SearchResults museums={mockMuseums} currentPage={currentPage} resultsPerPage={resultsPerPage} />

            {/* Pagination */}
            <div className="mt-8">
              <SearchPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
