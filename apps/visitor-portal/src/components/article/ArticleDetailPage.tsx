import { useGetArticle } from '@musetrip360/museum-management/api';
import { DataEntityType } from '@musetrip360/museum-management';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Separator } from '@musetrip360/ui-core/separator';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { cn } from '@musetrip360/ui-core/utils';
import { AlertCircle, ArrowLeft, Calendar, Tag, User, Building, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ArticleDetailPageProps {
  articleId: string;
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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function ArticleDetailPage({ articleId, className }: ArticleDetailPageProps) {
  const router = useRouter();

  const { data: article, isLoading, error } = useGetArticle(articleId);

  if (isLoading) {
    return (
      <div className={cn('container mx-auto px-4 py-8', className)}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 bg-accent/20" />
            <Skeleton className="h-10 w-3/4 bg-accent/20" />
            <div className="flex gap-3">
              <Skeleton className="h-6 w-20 bg-accent/20" />
              <Skeleton className="h-6 w-16 bg-accent/20" />
            </div>
            <Skeleton className="h-5 w-1/2 bg-accent/20" />
          </div>

          {/* Image Skeleton */}
          <Skeleton className="w-full h-96 bg-accent/20" />

          {/* Content Skeleton */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-full bg-accent/20" />
              <Skeleton className="h-4 w-full bg-accent/20" />
              <Skeleton className="h-4 w-3/4 bg-accent/20" />
              <Skeleton className="h-4 w-full bg-accent/20" />
              <Skeleton className="h-4 w-2/3 bg-accent/20" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={cn('container mx-auto px-4 py-8', className)}>
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error?.message || 'Không thể tải bài viết. Vui lòng thử lại sau.'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="hover:bg-accent/50 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge className={cn('text-sm', getEntityTypeColor(article.dataEntityType))}>
              <Tag className="h-3 w-3 mr-1" />
              {getEntityTypeLabel(article.dataEntityType)}
            </Badge>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Xuất bản: {formatDate(article.publishedAt)}</span>
            </div>

            {article.museum && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <Link
                  href={`/museum/${article.museumId}`}
                  className="text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  {article.museum.name}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {article.createdByUser && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Tác giả: {article.createdByUser.fullName || article.createdByUser.username}</span>
              </div>
            )}
          </div>
        </div>

        {/* Article Thumbnail */}
        {article.metadata?.thumbnail && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <Image
              src={article.metadata.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {/* Article Content */}
        <Card>
          <CardContent className="p-6 lg:p-8">
            <div
              className="prose prose-lg max-w-none prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </CardContent>
        </Card>

        {/* Article Footer */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin bài viết</h3>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Loại bài viết:</span>
                  <div className="mt-1">
                    <Badge className={cn('text-xs', getEntityTypeColor(article.dataEntityType))}>
                      {getEntityTypeIcon(article.dataEntityType)} {getEntityTypeLabel(article.dataEntityType)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-900">Ngày xuất bản:</span>
                  <div className="mt-1 text-gray-600">{formatDate(article.publishedAt)}</div>
                </div>

                {article.museum && (
                  <div>
                    <span className="font-medium text-gray-900">Bảo tàng:</span>
                    <div className="mt-1">
                      <Link
                        href={`/museum/${article.museumId}`}
                        className="text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        {article.museum.name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {article.createdByUser && (
                  <div>
                    <span className="font-medium text-gray-900">Tác giả:</span>
                    <div className="mt-1 text-gray-600">
                      {article.createdByUser.fullName || article.createdByUser.username}
                    </div>
                  </div>
                )}
              </div>

              {article.museum && (
                <>
                  <Separator />
                  <div className="text-center">
                    <Link href={`/museum/${article.museumId}`}>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Khám phá thêm về {article.museum.name}
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
