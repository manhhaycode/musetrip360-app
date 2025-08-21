import { useState } from 'react';
import { useGetArticlesByMuseum } from '@musetrip360/museum-management/api';
import { Article, ArticleStatusEnum, DataEntityType } from '@musetrip360/museum-management';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { cn } from '@musetrip360/ui-core/utils';
import { AlertCircle, Calendar, Eye, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

interface MuseumArticlesTabProps {
  museumId: string;
  className?: string;
}

const getEntityTypeIcon = (type: DataEntityType): string => {
  switch (type) {
    case DataEntityType.Museum:
      return '🏛️';
    case DataEntityType.Event:
      return '📅';
    case DataEntityType.Artifact:
      return '🏺';
    case DataEntityType.TourOnline:
      return '🎯';
    default:
      return '📄';
  }
};

const getEntityTypeLabel = (type: DataEntityType): string => {
  switch (type) {
    case DataEntityType.Museum:
      return 'Bảo tàng';
    case DataEntityType.Event:
      return 'Sự kiện';
    case DataEntityType.Artifact:
      return 'Hiện vật';
    case DataEntityType.TourOnline:
      return 'Tour ảo';
    default:
      return 'Khác';
  }
};

const getEntityTypeColor = (type: DataEntityType) => {
  switch (type) {
    case DataEntityType.Museum:
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case DataEntityType.Event:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case DataEntityType.Artifact:
      return 'bg-green-50 text-green-700 border-green-200';
    case DataEntityType.TourOnline:
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export function MuseumArticlesTab({ museumId, className }: MuseumArticlesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');

  const router = useRouter();

  const {
    data: articlesData,
    isLoading,
    error,
  } = useGetArticlesByMuseum(
    museumId,
    {
      Page: 1,
      PageSize: 10000,
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  const allArticles = (articlesData as any)?.list || [];

  // Filter only published articles for visitors
  const publishedArticles = allArticles.filter((article: Article) => article.status === ArticleStatusEnum.Published);

  // Frontend filtering and sorting
  const filteredArticles = useMemo(() => {
    let filtered = publishedArticles;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (article: Article) =>
          article.title.toLowerCase().includes(query) || article.content.toLowerCase().includes(query)
      );
    }

    // Entity type filter
    if (entityTypeFilter !== 'all') {
      filtered = filtered.filter((article: Article) => article.dataEntityType === entityTypeFilter);
    }

    // Sort by published date (newest first)
    return filtered.sort(
      (a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [publishedArticles, searchQuery, entityTypeFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setEntityTypeFilter('all');
  };

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải danh sách bài viết. Vui lòng thử lại sau.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Filter Header */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Loại bài viết" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value={DataEntityType.Museum}>Bảo tàng</SelectItem>
              <SelectItem value={DataEntityType.Event}>Sự kiện</SelectItem>
              <SelectItem value={DataEntityType.Artifact}>Hiện vật</SelectItem>
              <SelectItem value={DataEntityType.TourOnline}>Tour ảo</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || entityTypeFilter !== 'all') && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Articles Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-32 h-24 bg-muted/30" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4 bg-muted/30" />
                  <Skeleton className="h-4 w-full bg-muted/30" />
                  <Skeleton className="h-4 w-2/3 bg-muted/30" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 bg-muted/30" />
                    <Skeleton className="h-6 w-20 bg-muted/30" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-lg font-semibold mb-2">Không có bài viết</h3>
          <p className="text-muted-foreground">
            {searchQuery || entityTypeFilter !== 'all'
              ? 'Không tìm thấy bài viết phù hợp'
              : 'Chưa có bài viết nào được xuất bản'}
          </p>
          {(searchQuery || entityTypeFilter !== 'all') && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Xóa tất cả bộ lọc
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Bài viết ({filteredArticles.length})</h2>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article: Article) => (
              <Card
                key={article.id}
                className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white border border-gray-100 overflow-hidden"
                onClick={() => router.push(`/article/${article.id}`)}
              >
                <div className="relative">
                  {/* Article Thumbnail */}
                  <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
                    {article.metadata?.thumbnail ? (
                      <Image
                        src={article.metadata.thumbnail}
                        alt={article.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl opacity-60">{getEntityTypeIcon(article.dataEntityType)}</span>
                      </div>
                    )}
                  </div>

                  {/* Entity Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={cn('text-xs', getEntityTypeColor(article.dataEntityType))}>
                      {getEntityTypeLabel(article.dataEntityType)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">{article.title}</h3>

                    {/* Content Preview */}
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>

                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/article/${article.id}`);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Đọc
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
