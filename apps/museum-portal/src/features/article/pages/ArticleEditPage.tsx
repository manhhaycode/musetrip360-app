import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@musetrip360/ui-core/button';
import { Article, useGetArticle } from '@musetrip360/museum-management';
import { useMuseumStore } from '@musetrip360/museum-management/state';
import ArticleForm from '@/features/article/ArticleForm';
import Divider from '@/components/Divider';

const ArticleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { selectedMuseum } = useMuseumStore();

  // Get return path from URL params or default to articles list
  const returnPath = searchParams.get('returnPath') || '/museum/articles';

  const { data: article, isLoading, error } = useGetArticle(id as string);

  const handleSuccess = (article: Article) => {
    console.log(`Article ${article.id} updated successfully`);
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
          <p className="text-sm text-muted-foreground">Vui lòng chọn một bảo tàng để chỉnh sửa bài viết.</p>
          <Button onClick={() => navigate('/museum')} className="mt-4">
            Chọn bảo tàng
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Không tìm thấy bài viết</h3>
          <p className="text-sm text-muted-foreground">
            {error ? 'Có lỗi xảy ra khi tải bài viết.' : 'Bài viết không tồn tại hoặc đã bị xóa.'}
          </p>
          <Button onClick={() => navigate(returnPath)} className="mt-4">
            Quay lại danh sách bài viết
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
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h2>
        </div>
      </div>

      <Divider />

      {/* Article Edit Form */}
      <ArticleForm article={article} museumId={selectedMuseum.id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
};

export default ArticleEditPage;
