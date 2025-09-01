import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@musetrip360/ui-core/button';
import { Article } from '@musetrip360/museum-management';
import { useMuseumStore } from '@musetrip360/museum-management/state';
import ArticleForm from '@/features/article/ArticleForm';
import Divider from '@/components/Divider';
import { BulkUploadProvider } from '@musetrip360/shared';

const ArticleCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { selectedMuseum } = useMuseumStore();

  // Get return path from URL params or default to articles list
  const returnPath = searchParams.get('returnPath') || '/museum/articles';

  const handleSuccess = (article: Article) => {
    console.log(`Article ${article.id} created successfully`);
    // Navigate back to the articles list or specified return path
    navigate(returnPath);
  };

  const handleCancel = () => {
    navigate(returnPath);
  };

  if (!selectedMuseum) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">Chưa chọn bảo tàng</h3>
          <p className="text-sm text-muted-foreground">Vui lòng chọn một bảo tàng để tạo bài viết.</p>
          <Button onClick={() => navigate('/museum')} className="mt-4">
            Chọn bảo tàng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tạo bài viết</h2>
        </div>
      </div>

      <Divider />

      {/* Article Creation Form */}
      <BulkUploadProvider>
        <ArticleForm museumId={selectedMuseum.id} onSuccess={handleSuccess} onCancel={handleCancel} />
      </BulkUploadProvider>
    </div>
  );
};

export default ArticleCreatePage;
