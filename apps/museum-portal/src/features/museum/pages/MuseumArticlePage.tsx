import { useState } from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Article } from '@musetrip360/museum-management';
import { useMuseumStore } from '@musetrip360/museum-management/state';
import ArticleDataTable from '@/features/article/ArticleDataTable';
import ArticleDetail from '@/features/article/ArticleDetail';
import { useNavigate } from 'react-router';
import withPermission from '@/hocs/withPermission';
import { PERMISSION_CONTENT_MANAGEMENT } from '@musetrip360/rolebase-management';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

const MuseumArticlePage = withPermission(() => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { selectedMuseum } = useMuseumStore();

  const navigate = useNavigate();

  const handleView = (article: Article) => {
    setSelectedArticle(article);
    setViewMode('detail');
  };

  const handleEdit = (article: Article) => {
    navigate(`/museum/articles/edit/${article.id}`);
  };

  const handleAdd = () => {
    navigate('/museum/articles/create');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedArticle(null);
  };

  if (!selectedMuseum) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">No Museum Selected</h3>
          <p className="text-sm text-muted-foreground">Please select a museum to manage articles.</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'detail' && selectedArticle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Article Details</h1>
            <p className="text-muted-foreground">View article details for {selectedMuseum.name}</p>
          </div>
          <Button onClick={handleBackToList} variant="outline">
            Back to List
          </Button>
        </div>

        <ArticleDetail articleId={selectedArticle.id} onEdit={handleEdit} onDelete={handleBackToList} />
      </div>
    );
  }

  return (
    <>
      <ArticleDataTable museumId={selectedMuseum.id} onView={handleView} onEdit={handleEdit} onAdd={handleAdd} />
    </>
  );
}, [PERMISSION_CONTENT_MANAGEMENT]);

export default MuseumArticlePage;
