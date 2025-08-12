import { ArrowLeft, Calendar, Clock, Mail, MapPin, Phone, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  MuseumRequestStatus,
  useApproveMuseumRequest,
  useGetMuseumRequestById,
  useRejectMuseumRequest,
} from '@musetrip360/museum-management';
import { Avatar, Badge, Button } from '@musetrip360/ui-core';
import { useState } from 'react';

const MuseumRequestDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: requestData,
    isLoading,
    error,
  } = useGetMuseumRequestById(id!, {
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });

  const { mutate: approveRequest, isPending: isApproving } = useApproveMuseumRequest({
    onSuccess: () => {
      setSuccessMessage('Yêu cầu đã được phê duyệt thành công!');
      setErrorMessage(null);
    },
    onError: () => {
      setErrorMessage('Có lỗi xảy ra khi phê duyệt yêu cầu.');
      setSuccessMessage(null);
    },
  });

  const { mutate: rejectRequest, isPending: isRejecting } = useRejectMuseumRequest({
    onSuccess: () => {
      setSuccessMessage('Yêu cầu đã được từ chối.');
      setErrorMessage(null);
    },
    onError: () => {
      setErrorMessage('Có lỗi xảy ra khi từ chối yêu cầu.');
      setSuccessMessage(null);
    },
  });

  const handleApprove = () => {
    if (id) {
      approveRequest(id);
    }
  };

  const handleReject = () => {
    if (id) {
      rejectRequest(id);
    }
  };

  const getStatusVariant = (status: MuseumRequestStatus) => {
    switch (status) {
      case MuseumRequestStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case MuseumRequestStatus.Approved:
        return 'bg-green-100 text-green-800';
      case MuseumRequestStatus.Rejected:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải thông tin yêu cầu...</p>
          <p className="text-sm text-gray-500 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Không thể tải thông tin yêu cầu</p>
          <p className="text-sm text-gray-500 mb-4">Error: {error?.message || 'Unknown error'}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-yellow-600 mb-2">Không tìm thấy dữ liệu</p>
          <p className="text-sm text-gray-500 mb-4">Request ID: {id}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const request = requestData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu bảo tàng</h1>
            <p className="text-gray-600">Xem và quản lý yêu cầu đăng ký bảo tàng</p>
          </div>
        </div>
        <Badge className={getStatusVariant(request.status)}>
          {request.status === MuseumRequestStatus.Pending && 'Chờ xử lý'}
          {request.status === MuseumRequestStatus.Approved && 'Đã phê duyệt'}
          {request.status === MuseumRequestStatus.Rejected && 'Đã từ chối'}
        </Badge>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="animate-in slide-in-from-bottom-1 duration-200 rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="animate-in slide-in-from-top-1 duration-200 rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Museum Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bảo tàng</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{request.museumName}</h3>
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>{request.location}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Mô tả</h4>
                <p className="text-gray-700 leading-relaxed break-words">
                  {request.museumDescription || 'Chưa có mô tả'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{request.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{request.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          {request.categories && request.categories.length > 0 && (
            <div className="rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Danh mục bảo tàng</h2>
              <div className="flex flex-wrap gap-2">
                {request.categories.map((category: any) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents and Images */}
          {(request.metadata?.documents?.length || request.metadata?.images?.length) && (
            <div className="rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tài liệu đính kèm</h2>

              {request.metadata.images && request.metadata.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Hình ảnh ({request.metadata.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {request.metadata.images.map((imageUrl: string, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={`Museum image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.png';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {request.metadata.documents && request.metadata.documents.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Tài liệu ({request.metadata.documents.length})</h3>
                  <div className="space-y-2">
                    {request.metadata.documents.map((docUrl: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Tài liệu {index + 1}</span>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2"
                        >
                          Xem
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requester Info */}
          <div className="rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Người gửi yêu cầu</h2>
            <div className="flex items-center space-x-3 mb-4">
              <Avatar>
                {request.createdByUser.avatarUrl ? (
                  <img src={request.createdByUser.avatarUrl} alt={request.createdByUser.fullName} />
                ) : (
                  <div className="bg-blue-500 text-white flex items-center justify-center h-full w-full">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{request.createdByUser.fullName}</p>
                <p className="text-sm text-gray-600">@{request.createdByUser.username}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{request.createdByUser.email}</span>
              </div>
              {request.createdByUser.phoneNumber && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{request.createdByUser.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thời gian</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Ngày gửi</p>
                  <p className="text-sm text-gray-600">{formatDate(request.submittedAt)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Cập nhật lần cuối</p>
                  <p className="text-sm text-gray-600">{formatDate(request.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h2>
            <div className="space-y-3">
              {request.status === MuseumRequestStatus.Pending ? (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isApproving ? 'Đang xử lý...' : 'Phê duyệt'}
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isApproving || isRejecting}
                    variant="destructive"
                    className="w-full"
                  >
                    {isRejecting ? 'Đang xử lý...' : 'Từ chối'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Yêu cầu đã được {request.status === MuseumRequestStatus.Approved ? 'phê duyệt' : 'từ chối'}
                  </p>
                  <Badge className={getStatusVariant(request.status)}>
                    {request.status === MuseumRequestStatus.Approved && 'Đã phê duyệt'}
                    {request.status === MuseumRequestStatus.Rejected && 'Đã từ chối'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumRequestDetailPage;
