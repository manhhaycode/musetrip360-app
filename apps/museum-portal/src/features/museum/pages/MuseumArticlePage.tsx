import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { Button } from '@musetrip360/ui-core/button';
import { Article } from '@musetrip360/museum-management';
import { useMuseumStore } from '@musetrip360/museum-management/state';
import ArticleDataTable from '@/features/article/ArticleDataTable';
import ArticleDetail from '@/features/article/ArticleDetail';
import ArticleForm from '@/features/article/ArticleForm';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

const MuseumArticlePage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { selectedMuseum } = useMuseumStore();

  const handleView = (article: Article) => {
    setSelectedArticle(article);
    setViewMode('detail');
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedArticle(null);
    setShowForm(true);
  };

  const handleFormSuccess = (article: Article) => {
    setShowForm(false);
    setSelectedArticle(null);
    setViewMode('list');
    console.log(`Article ${article.id} saved successfully`);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedArticle(null);
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle ? 'Edit Article' : 'Create New Article'}</DialogTitle>
          </DialogHeader>

          <ArticleForm
            article={selectedArticle || undefined}
            museumId={selectedMuseum.id}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            className="py-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MuseumArticlePage;
