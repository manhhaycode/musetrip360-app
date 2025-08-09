import { Article, useGetArticle, useDeleteArticle, ArticleStatusEnum } from '@musetrip360/museum-management';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Separator } from '@musetrip360/ui-core/separator';
import { toast } from '@musetrip360/ui-core/sonner';
import { Archive, Calendar, Edit, FileCheck, MapPin, Tag, Trash2, User } from 'lucide-react';

interface ArticleDetailProps {
  articleId: string;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
  onPublish?: (article: Article) => void;
  onArchive?: (article: Article) => void;
  className?: string;
}

const ArticleDetail = ({ articleId, onEdit, onDelete, onPublish, onArchive, className }: ArticleDetailProps) => {
  const { data: articleData, isLoading } = useGetArticle(articleId, {
    enabled: !!articleId,
  });

  const { mutate: deleteArticle, isPending: isDeleting } = useDeleteArticle({
    onSuccess: () => {
      toast.success('Article deleted successfully');
      onDelete?.(articleId);
    },
    onError: (error) => {
      toast.error('Failed to delete article');
      console.error('Delete article error:', error);
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      deleteArticle(articleId);
    }
  };

  const getStatusVariant = (status: ArticleStatusEnum) => {
    switch (status) {
      case ArticleStatusEnum.Published:
        return 'default';
      case ArticleStatusEnum.Pending:
        return 'secondary';
      case ArticleStatusEnum.Draft:
        return 'outline';
      case ArticleStatusEnum.Archived:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!articleData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">Article not found</h3>
          <p className="text-sm text-muted-foreground">The requested article could not be loaded.</p>
        </div>
      </div>
    );
  }

  const article = articleData;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{article.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(article.status)}>{article.status}</Badge>
                <Badge variant="outline">
                  <Tag className="mr-1 h-3 w-3" />
                  {article.dataEntityType}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {article.status === ArticleStatusEnum.Draft && onPublish && (
                <Button size="sm" onClick={() => onPublish(article)} className="text-green-600" variant="outline">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Publish
                </Button>
              )}

              {article.status === ArticleStatusEnum.Published && onArchive && (
                <Button size="sm" onClick={() => onArchive(article)} className="text-orange-600" variant="outline">
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </Button>
              )}

              <Button size="sm" variant="outline" onClick={() => onEdit?.(article)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created by:</span>
              <span className="font-medium">{article.createdByUser?.fullName || 'Unknown'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Published:</span>
              <span className="font-medium">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Entity ID:</span>
              <span className="font-medium font-mono text-xs">{article.entityId}</span>
            </div>
          </div>

          <Separator />

          {/* Metadata Section */}
          {article.metadata && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Article Details</h4>

              {/* Thumbnail */}
              {article.metadata.thumbnail && (
                <div>
                  <span className="text-muted-foreground text-sm">Thumbnail:</span>
                  <div className="mt-2">
                    <img
                      src={article.metadata.thumbnail}
                      alt="Article thumbnail"
                      className="w-32 h-20 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          <div>
            <h4 className="text-lg font-semibold mb-3">Content</h4>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{article.content}</div>
            </div>
          </div>

          {article.museum && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-semibold mb-3">Museum Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{article.museum.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{article.museum.location}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleDetail;
