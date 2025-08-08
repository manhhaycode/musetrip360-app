import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { Separator } from '@musetrip360/ui-core/separator';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Building2, Calendar, Check, Mail, MapPin, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { MuseumRequest, MuseumRequestStatus } from '../../types';

interface MuseumRequestDetailModalProps {
  request: MuseumRequest | null;
  open: boolean;
  onClose: () => void;
  onApprove?: (request: MuseumRequest) => void;
  onReject?: (request: MuseumRequest, reason: string) => void;
  isLoading?: boolean;
}

export default function MuseumRequestDetailModal({
  request,
  open,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
}: MuseumRequestDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const getStatusBadgeVariant = (status: MuseumRequestStatus) => {
    switch (status) {
      case MuseumRequestStatus.Approved:
        return 'default';
      case MuseumRequestStatus.Rejected:
        return 'destructive';
      case MuseumRequestStatus.Pending:
        return 'secondary';
      case MuseumRequestStatus.Draft:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: MuseumRequestStatus) => {
    switch (status) {
      case MuseumRequestStatus.Pending:
        return 'Chờ duyệt';
      case MuseumRequestStatus.Approved:
        return 'Đã duyệt';
      case MuseumRequestStatus.Rejected:
        return 'Từ chối';
      case MuseumRequestStatus.Draft:
        return 'Bản nháp';
      default:
        return 'Không xác định';
    }
  };

  const handleApprove = () => {
    if (request && onApprove) {
      onApprove(request);
    }
  };

  const handleReject = () => {
    if (request && onReject && rejectionReason.trim()) {
      onReject(request, rejectionReason.trim());
      setRejectionReason('');
      setShowRejectForm(false);
    }
  };

  const handleClose = () => {
    setRejectionReason('');
    setShowRejectForm(false);
    onClose();
  };

  if (!request) {
    return null;
  }

  const isPending = request.status === MuseumRequestStatus.Pending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Chi tiết yêu cầu tạo bảo tàng
          </DialogTitle>
          <DialogDescription>Xem thông tin chi tiết và phê duyệt yêu cầu tạo bảo tàng mới</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Trạng thái:</span>
              <Badge variant={getStatusBadgeVariant(request.status)}>{getStatusText(request.status)}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Gửi: {new Date(request.submittedAt).toLocaleDateString('vi-VN')}
            </div>
          </div>

          <Separator />

          {/* Requester Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin người gửi yêu cầu</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tên đầy đủ</label>
                <p className="mt-1 text-sm font-medium">{request.createdByUser.fullName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="mt-1 text-sm">{request.createdByUser.email}</p>
              </div>

              {request.createdByUser.phoneNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                  <p className="mt-1 text-sm">{request.createdByUser.phoneNumber}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Tài khoản</label>
                <p className="mt-1 text-sm">{request.createdByUser.username}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Loại xác thực</label>
                <p className="mt-1 text-sm">{request.createdByUser.authType}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Đăng nhập lần cuối</label>
                <p className="mt-1 text-sm">{new Date(request.createdByUser.lastLogin).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Museum Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin bảo tàng</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tên bảo tàng</label>
                <p className="mt-1 text-sm">{request.museumName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{request.museumDescription}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Địa điểm</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {request.location}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {request.contactEmail}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {request.contactPhone}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          {request.categories && request.categories.length > 0 && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Danh mục bảo tàng</h3>

                <div className="space-y-3">
                  {request.categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tên danh mục</label>
                          <p className="mt-1 text-sm font-medium">{category.name}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                          <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                        </div>

                        {category.metadata && Object.keys(category.metadata).length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Chi tiết</label>
                            <div className="mt-1 text-sm">
                              {Object.entries(category.metadata).map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="font-medium capitalize">{key}:</span>
                                  <span className="text-muted-foreground">
                                    {Array.isArray(value) ? value.join(', ') : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Metadata */}
          {request.metadata && Object.keys(request.metadata).length > 0 && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin bổ sung</h3>

                {request.metadata.specialty && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Chuyên môn</label>
                    <p className="mt-1 text-sm">{request.metadata.specialty}</p>
                  </div>
                )}

                {request.metadata.openingHours && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Giờ mở cửa</label>
                    <p className="mt-1 text-sm">{request.metadata.openingHours}</p>
                  </div>
                )}

                {request.metadata.documents && request.metadata.documents.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tài liệu đính kèm</label>
                    <ul className="mt-1 space-y-1">
                      {request.metadata.documents.map((doc, index) => (
                        <li key={index}>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                          >
                            Tài liệu {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {request.metadata.images && request.metadata.images.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hình ảnh</label>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      {request.metadata.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Museum image ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {request.metadata.additionalInfo && Object.keys(request.metadata.additionalInfo).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Thông tin khác</label>
                    <div className="mt-1 space-y-1">
                      {Object.entries(request.metadata.additionalInfo).map(([key, value]) => (
                        <div key={key} className="flex gap-2 text-sm">
                          <span className="font-medium capitalize">{key}:</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />
            </>
          )}

          {/* Rejection Form */}
          {showRejectForm && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lý do từ chối</h3>
                <Textarea
                  placeholder="Nhập lý do từ chối yêu cầu..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            {showRejectForm ? (
              <>
                <Button type="button" variant="outline" onClick={() => setShowRejectForm(false)} disabled={isLoading}>
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isLoading || !rejectionReason.trim()}
                >
                  <X className="mr-2 h-4 w-4" />
                  {isLoading ? 'Đang xử lý...' : 'Từ chối'}
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Đóng
                </Button>
                {isPending && (
                  <>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowRejectForm(true)}
                      disabled={isLoading}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Từ chối
                    </Button>
                    <Button
                      type="button"
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {isLoading ? 'Đang xử lý...' : 'Phê duyệt'}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
