import { Artifact, useArtifactsByMuseum } from '@musetrip360/artifact-management';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { cn } from '@musetrip360/ui-core/utils';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Grid3X3,
  Hammer,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface MuseumArtifactsTabProps {
  museumId: string;
  className?: string;
}

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getArtifactTypeIcon = (type?: string): string => {
  if (!type) return '🏛️';
  const lowerType = type.toLowerCase();
  if (lowerType.includes('gốm') || lowerType.includes('sứ')) return '🏺';
  if (lowerType.includes('đồng') || lowerType.includes('kim loại')) return '⚱️';
  if (lowerType.includes('đá')) return '🗿';
  if (lowerType.includes('tranh') || lowerType.includes('họa')) return '🖼️';
  if (lowerType.includes('vũ khí')) return '⚔️';
  if (lowerType.includes('trang sức')) return '💎';
  return '🏛️';
};

const getArtifactTypeColor = (type?: string) => {
  if (!type) return 'bg-muted/50 text-muted-foreground';
  const lowerType = type.toLowerCase();
  if (lowerType.includes('gốm') || lowerType.includes('sứ')) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (lowerType.includes('đồng') || lowerType.includes('kim loại'))
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  if (lowerType.includes('đá')) return 'bg-gray-100 text-gray-700 border-gray-200';
  if (lowerType.includes('tranh') || lowerType.includes('họa'))
    return 'bg-purple-100 text-purple-700 border-purple-200';
  if (lowerType.includes('vũ khí')) return 'bg-red-100 text-red-700 border-red-200';
  if (lowerType.includes('trang sức')) return 'bg-pink-100 text-pink-700 border-pink-200';
  return 'bg-blue-100 text-blue-700 border-blue-200';
};

export function MuseumArtifactsTab({ museumId, className }: MuseumArtifactsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const {
    data: artifactsData,
    isLoading,
    error,
  } = useArtifactsByMuseum(
    {
      Page: 1,
      PageSize: 10000,
      museumId: museumId || '',
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  const allArtifacts = artifactsData?.list || [];

  // Frontend filtering and sorting
  const filteredAndSortedArtifacts = useMemo(() => {
    let filtered = allArtifacts;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (artifact) =>
          artifact.name.toLowerCase().includes(query) ||
          artifact.description.toLowerCase().includes(query) ||
          artifact.historicalPeriod.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter((artifact) => artifact.rating >= minRating);
    }

    // Period filter
    if (periodFilter !== 'all') {
      filtered = filtered.filter((artifact) =>
        artifact.historicalPeriod.toLowerCase().includes(periodFilter.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'historicalPeriod':
          return a.historicalPeriod.localeCompare(b.historicalPeriod);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allArtifacts, searchQuery, ratingFilter, periodFilter, sortBy]);

  // Pagination
  const paginatedArtifacts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredAndSortedArtifacts.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedArtifacts, page, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedArtifacts.length / pageSize);

  // Get unique historical periods for filter
  const uniquePeriods = useMemo(() => {
    const periods = allArtifacts.map((a) => a.historicalPeriod);
    return [...new Set(periods)].filter(Boolean);
  }, [allArtifacts]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handleRatingFilter = (value: string) => {
    setRatingFilter(value);
    setPage(1);
  };

  const handlePeriodFilter = (value: string) => {
    setPeriodFilter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter('all');
    setPeriodFilter('all');
    setPage(1);
  };

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải danh sách hiện vật. Vui lòng thử lại sau.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Enhanced Search and Filter Header */}
      <div className="bg-gradient-to-r from-primary/5 via-background to-secondary/5 rounded-2xl p-1">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Top Row - Search and View Toggle */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, mô tả hoặc thời kỳ..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Row - Advanced Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Bộ lọc:</span>
              </div>

              <div className="flex flex-wrap gap-3 flex-1">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                    <SelectItem value="createdAt">Mới nhất</SelectItem>
                    <SelectItem value="historicalPeriod">Thời kỳ</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={handleRatingFilter}>
                  <SelectTrigger className="w-36 h-9">
                    <SelectValue placeholder="Đánh giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="4.5">4.5+ sao</SelectItem>
                    <SelectItem value="4.0">4.0+ sao</SelectItem>
                    <SelectItem value="3.5">3.5+ sao</SelectItem>
                    <SelectItem value="3.0">3.0+ sao</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={periodFilter} onValueChange={handlePeriodFilter}>
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue placeholder="Thời kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thời kỳ</SelectItem>
                    {uniquePeriods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchQuery || ratingFilter !== 'all' || periodFilter !== 'all') && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div
          className={cn(
            viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'
          )}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <Skeleton className="h-48 w-full bg-muted/30" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 bg-muted/30" />
                <Skeleton className="h-4 w-full bg-muted/30" />
                <Skeleton className="h-4 w-1/2 bg-muted/30" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedArtifacts.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="text-8xl mb-6">🏺</div>
              <h3 className="text-xl font-bold mb-3">
                {searchQuery || ratingFilter !== 'all' || periodFilter !== 'all'
                  ? 'Không tìm thấy hiện vật nào'
                  : 'Chưa có hiện vật'}
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                {searchQuery || ratingFilter !== 'all' || periodFilter !== 'all'
                  ? 'Hãy thử từ khóa khác hoặc điều chỉnh bộ lọc'
                  : 'Bảo tàng này chưa có hiện vật nào được đăng tải'}
              </p>
              {(searchQuery || ratingFilter !== 'all' || periodFilter !== 'all') && (
                <Button variant="outline" onClick={clearFilters} className="h-11 px-6">
                  Xóa tất cả bộ lọc
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Results Stats */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/30 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">
                Hiển thị <span className="font-bold text-primary">{paginatedArtifacts.length}</span> trong số{' '}
                <span className="font-bold">{filteredAndSortedArtifacts.length}</span> hiện vật
              </p>
              {(searchQuery || ratingFilter !== 'all' || periodFilter !== 'all') && (
                <Badge variant="secondary" className="text-xs">
                  Đang lọc
                </Badge>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Trang {page} / {totalPages}
            </div>
          </div>

          {/* Enhanced Artifacts Display */}
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8'
                : 'space-y-4'
            )}
          >
            {paginatedArtifacts.map((artifact: Artifact) =>
              viewMode === 'grid' ? (
                // Grid View - Enhanced Card
                <Card
                  key={artifact.id}
                  className="group overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer border-0 shadow-lg bg-white h-fit"
                >
                  <div className="relative overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    {artifact.imageUrl ? (
                      <Image
                        src={artifact.imageUrl}
                        alt={artifact.name}
                        width={400}
                        height={240}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <span className="text-6xl opacity-60">🏺</span>
                      </div>
                    )}

                    {/* Enhanced Badges */}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-white/95 text-primary backdrop-blur-md shadow-lg border-0">
                        <Star className="h-3 w-3 mr-1 fill-primary" />
                        {artifact.rating.toFixed(1)}
                      </Badge>
                    </div>

                    {artifact.model3DUrl && (
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white backdrop-blur-md shadow-lg border-0">
                          <Eye className="h-3 w-3 mr-1" />
                          3D
                        </Badge>
                      </div>
                    )}

                    {/* Hover Action Button */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      {artifact.model3DUrl ? (
                        <Button className="w-full backdrop-blur-md bg-white/90 text-primary hover:bg-white border-0 shadow-lg">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem mô hình 3D
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full backdrop-blur-md bg-white/90 border-white/50 shadow-lg"
                        >
                          Xem chi tiết
                        </Button>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
                          {artifact.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                          {artifact.description}
                        </p>
                      </div>

                      {/* Metadata Information */}
                      <div className="space-y-3">
                        {/* Type and Material Row */}
                        <div className="flex gap-2 flex-wrap">
                          {artifact.metadata?.type && (
                            <Badge
                              className={cn('text-xs font-medium border', getArtifactTypeColor(artifact.metadata.type))}
                            >
                              <span className="mr-1">{getArtifactTypeIcon(artifact.metadata.type)}</span>
                              {artifact.metadata.type}
                            </Badge>
                          )}
                          {artifact.metadata?.material && (
                            <Badge variant="outline" className="text-xs">
                              <Hammer className="h-2 w-2 mr-1" />
                              {artifact.metadata.material}
                            </Badge>
                          )}
                        </div>

                        {/* Discovery Location */}
                        {artifact.metadata?.discoveryLocation && (
                          <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                            <div className="p-1 rounded bg-green-500/10">
                              <MapPin className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                              Phát hiện tại: {artifact.metadata.discoveryLocation}
                            </span>
                          </div>
                        )}

                        {/* Historical Period */}
                        <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                          <div className="p-1 rounded bg-primary/10">
                            <Clock className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{artifact.historicalPeriod}</span>
                        </div>

                        {/* Status and Date */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div
                            className="flex items-center gap-1"
                            title={`Trạng thái: ${artifact.isActive ? 'Đang được trưng bày tại bảo tàng' : 'Hiện tại không được trưng bày'}`}
                          >
                            {artifact.isActive ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>{artifact.isActive ? 'Đang trưng bày' : 'Không trưng bày'}</span>
                          </div>
                          <span title={`Lần cập nhật cuối: ${formatDate(artifact.updatedAt)}`}>
                            Cập nhật: {formatDate(artifact.updatedAt)}
                          </span>
                        </div>

                        {/* Multiple Images Indicator */}
                        {artifact.metadata?.images && artifact.metadata.images.length > 1 && (
                          <div
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title={`Hiện vật này có ${artifact.metadata.images.length} hình ảnh`}
                          >
                            <Eye className="h-3 w-3" />
                            <span>{artifact.metadata.images.length} hình ảnh</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // List View - Horizontal Card
                <Card
                  key={artifact.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md"
                >
                  <div className="flex">
                    <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
                      {artifact.imageUrl ? (
                        <Image
                          src={artifact.imageUrl}
                          alt={artifact.name}
                          width={192}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <span className="text-3xl opacity-60">🏺</span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-white/95 text-primary backdrop-blur-sm text-xs">
                          <Star className="h-2 w-2 mr-1 fill-primary" />
                          {artifact.rating.toFixed(1)}
                        </Badge>
                      </div>

                      {artifact.model3DUrl && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-500 text-white text-xs">
                            <Eye className="h-2 w-2 mr-1" />
                            3D
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="flex-1 p-4">
                      <div className="flex flex-col h-full justify-between">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                              {artifact.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{artifact.description}</p>
                          </div>

                          {/* Metadata Row */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {/* Left Column */}
                            <div className="space-y-2">
                              {artifact.metadata?.type && (
                                <div className="flex items-center gap-1">
                                  <span>{getArtifactTypeIcon(artifact.metadata.type)}</span>
                                  <span className="font-medium">{artifact.metadata.type}</span>
                                </div>
                              )}
                              {artifact.metadata?.material && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Hammer className="h-2 w-2" />
                                  <span>{artifact.metadata.material}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-2 w-2" />
                                <span>{artifact.historicalPeriod}</span>
                              </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-2">
                              {artifact.metadata?.discoveryLocation && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-2 w-2" />
                                  <span className="line-clamp-1">{artifact.metadata.discoveryLocation}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                {artifact.isActive ? (
                                  <CheckCircle className="h-2 w-2 text-green-500" />
                                ) : (
                                  <XCircle className="h-2 w-2 text-red-500" />
                                )}
                                <span className={artifact.isActive ? 'text-green-600' : 'text-red-600'}>
                                  {artifact.isActive ? 'Trưng bày' : 'Không trưng bày'}
                                </span>
                              </div>
                              {artifact.metadata?.images && artifact.metadata.images.length > 1 && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Eye className="h-2 w-2" />
                                  <span>{artifact.metadata.images.length} ảnh</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          {artifact.model3DUrl ? (
                            <Button size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              Xem 3D
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="flex-1">
                              Chi tiết
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="h-10 px-4 rounded-xl border-2"
              >
                Trước
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => {
                  let pageNumber: number;

                  if (totalPages <= 7) {
                    pageNumber = index + 1;
                  } else if (page <= 4) {
                    pageNumber = index + 1;
                  } else if (page >= totalPages - 3) {
                    pageNumber = totalPages - 6 + index;
                  } else {
                    pageNumber = page - 3 + index;
                  }

                  const isCurrentPage = pageNumber === page;

                  return (
                    <Button
                      key={pageNumber}
                      variant={isCurrentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNumber)}
                      className={cn(
                        'w-10 h-10 rounded-xl border-2 transition-all',
                        isCurrentPage ? 'shadow-lg scale-110' : 'hover:scale-105'
                      )}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="h-10 px-4 rounded-xl border-2"
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
