import { MuseumStatus, useGetMuseumById, useUpdateMuseum } from '@musetrip360/museum-management';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { ArrowLeft, Building, Calendar, Edit, Mail, MapPin, Phone, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const MuseumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<MuseumStatus | ''>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: museum,
    isLoading,
    error,
  } = useGetMuseumById(id!, {
    enabled: !!id,
  });

  const updateMuseumMutation = useUpdateMuseum({
    onSuccess: () => {
      setSuccessMessage('Cập nhật trạng thái bảo tàng thành công!');
      setErrorMessage(null);
      setIsEditing(false);
      toast.success('Cập nhật trạng thái bảo tàng thành công');
    },
    onError: (error) => {
      setErrorMessage('Cập nhật thất bại: ' + error.message);
      setSuccessMessage(null);
      toast.error('Cập nhật thất bại: ' + error.message);
    },
  });

  const handleStatusUpdate = () => {
    if (!museum || !selectedStatus) return;

    updateMuseumMutation.mutate({
      ...museum,
      status: selectedStatus,
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'NotVerified':
        return 'destructive';
      case 'Pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <div className="text-xl font-medium text-destructive">Không tìm thấy bảo tàng</div>
        <Button variant="outline" onClick={() => navigate('/museums/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/museums/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{museum.name}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusVariant(museum.status)} className="px-3 py-1">
            {museum.status === 'NotVerified' ? 'Not Verified' : museum.status}
          </Badge>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setIsEditing(!isEditing);
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            disabled={updateMuseumMutation.isPending}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa trạng thái'}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="animate-in slide-in-from-bottom-1 duration-200 rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
          <p className="text-green-800 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="animate-in slide-in-from-top-1 duration-200 rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
          <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Status Editor */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa trạng thái</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-600 mb-2">Trạng thái mới</label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as MuseumStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="NotVerified">Not Verified</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-6">
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || selectedStatus === museum.status || updateMuseumMutation.isPending}
                className="gap-2"
              >
                {updateMuseumMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật trạng thái'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Museum Information */}
      <div className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Building className="mr-2 h-5 w-5 text-blue-600" />
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tên bảo tàng</label>
              <p className="text-gray-900 text-base">{museum.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-900 text-base font-medium">{museum.rating}/5</span>
              <span className="text-gray-500 text-sm">điểm đánh giá</span>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
              <p className="text-gray-900 text-base leading-relaxed">
                {museum.description || 'Chưa có mô tả chi tiết cho bảo tàng này.'}
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 mt-0.5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ</label>
                <p className="text-gray-900 text-base">{museum.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin liên hệ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <p className="text-gray-900 text-base">{museum.contactEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
                <p className="text-gray-900 text-base">{museum.contactPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {museum.metadata &&
          (museum.metadata.detail || (museum.metadata.images && museum.metadata.images.length > 0)) &&
          !museum.metadata.contentHomePage && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin bổ sung</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {museum.metadata.detail && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Chi tiết</label>
                    <p className="text-gray-900 text-base break-words">{museum.metadata.detail}</p>
                  </div>
                )}
                {museum.metadata.images && museum.metadata.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Hình ảnh</label>
                    <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                      <p className="text-green-800 text-sm font-medium">
                        {museum.metadata.images.length} hình ảnh đã tải lên
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Categories */}
        {museum.categories && museum.categories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Danh mục bảo tàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {museum.categories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-600" />
          Thông tin hệ thống
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Ngày tạo</label>
            <p className="text-gray-900 text-base">{formatDate(museum.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cập nhật lần cuối</label>
            <p className="text-gray-900 text-base">{formatDate(museum.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetailPage;
