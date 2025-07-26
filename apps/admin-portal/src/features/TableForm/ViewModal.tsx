import { Badge } from '@musetrip360/ui-core/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { Building2, FileText, UserCheck } from 'lucide-react';
import { Museum, MUSEUM_CATEGORIES, MuseumRequest, User } from '../types';
import { ViewModalProps } from './types';

type MuseumViewModalProps = ViewModalProps<Museum>;
type UserViewModalProps = ViewModalProps<User>;
type RequestViewModalProps = ViewModalProps<MuseumRequest>;

// Museum View Modal
export function MuseumViewModal({ open, onClose, data, title }: MuseumViewModalProps) {
  const STATUS_CONFIG = {
    active: { label: 'Hoạt động', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    inactive: { label: 'Không hoạt động', className: 'bg-red-100 text-red-700 border-red-200' },
    pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    suspended: { label: 'Tạm khóa', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    maintenance: { label: 'Bảo trì', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        {data && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Tên bảo tàng</label>
                <p className="font-medium">{data.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Danh mục</label>
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                  {MUSEUM_CATEGORIES[data.category]?.label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Mô tả</label>
              <p className="text-slate-700">{data.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Địa điểm</label>
                <p>{data.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Trạng thái</label>
                <Badge variant="outline" className={STATUS_CONFIG[data.status]?.className}>
                  {STATUS_CONFIG[data.status]?.label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Địa chỉ</label>
              <p>{data.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Điện thoại</label>
                <p>{data.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p>{data.email}</p>
              </div>
            </div>

            {data.website && (
              <div>
                <label className="text-sm font-medium text-slate-600">Website</label>
                <p>
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {data.website}
                  </a>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Giờ mở cửa</label>
                <p>{data.openingHours}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Giá vé</label>
                <p>{data.ticketPrice}</p>
              </div>
            </div>

            {data.rating && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Đánh giá</label>
                  <p>{data.rating} ⭐</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Lượt thăm</label>
                  <p>{data.visitorsCount?.toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Tạo lúc</label>
                <p>{data.createdAt ? new Date(data.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Cập nhật</label>
                <p>{data.updatedAt ? new Date(data.updatedAt).toLocaleString('vi-VN') : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// User View Modal
export function UserViewModal({ open, onClose, data, title }: UserViewModalProps) {
  const STATUS_CONFIG = {
    active: { label: 'Hoạt động', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    inactive: { label: 'Không hoạt động', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    suspended: { label: 'Tạm khóa', className: 'bg-red-100 text-red-700 border-red-200' },
    pending_verification: { label: 'Chờ xác thực', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  };

  const ROLE_CONFIG = {
    admin: { label: 'Admin', className: 'bg-red-100 text-red-700 border-red-200' },
    manager: { label: 'Manager', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    staff: { label: 'Staff', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    museum_owner: { label: 'Museum Owner', className: 'bg-purple-100 text-purple-700 border-purple-200' },
    visitor: { label: 'Visitor', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        {data && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Họ và tên</label>
                <p className="font-medium">{data.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p>{data.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Vai trò</label>
                <Badge variant="outline" className={ROLE_CONFIG[data.role]?.className}>
                  {ROLE_CONFIG[data.role]?.label}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Trạng thái</label>
                <Badge variant="outline" className={STATUS_CONFIG[data.status]?.className}>
                  {STATUS_CONFIG[data.status]?.label}
                </Badge>
              </div>
            </div>

            {data.phoneNumber && (
              <div>
                <label className="text-sm font-medium text-slate-600">Số điện thoại</label>
                <p>{data.phoneNumber}</p>
              </div>
            )}

            {data.address && (
              <div>
                <label className="text-sm font-medium text-slate-600">Địa chỉ</label>
                <p>{data.address}</p>
              </div>
            )}

            {data.bio && (
              <div>
                <label className="text-sm font-medium text-slate-600">Tiểu sử</label>
                <p className="text-slate-700">{data.bio}</p>
              </div>
            )}

            {data.permissions && data.permissions.length > 0 && (
              <div>
                <label className="text-sm font-medium text-slate-600">Quyền hạn</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="bg-slate-100 text-slate-700">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Ngày tham gia</label>
                <p>{new Date(data.joinDate).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Đăng nhập cuối</label>
                <p>{new Date(data.lastLogin).toLocaleString('vi-VN')}</p>
              </div>
            </div>

            {data.museumCount && (
              <div>
                <label className="text-sm font-medium text-slate-600">Số bảo tàng sở hữu</label>
                <p>{data.museumCount}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Museum Request View Modal
export function RequestViewModal({ open, onClose, data, title }: RequestViewModalProps) {
  const STATUS_CONFIG = {
    pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    under_review: { label: 'Đang xem xét', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    approved: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Từ chối', className: 'bg-red-100 text-red-700 border-red-200' },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        {data && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Tên bảo tàng</label>
                <p className="font-medium">{data.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Danh mục</label>
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                  {MUSEUM_CATEGORIES[data.category]?.label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Mô tả</label>
              <p className="text-slate-700">{data.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Địa điểm</label>
                <p>{data.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Trạng thái</label>
                <Badge variant="outline" className={STATUS_CONFIG[data.status]?.className}>
                  {STATUS_CONFIG[data.status]?.label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Địa chỉ</label>
              <p>{data.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Người liên hệ</label>
                <p>{data.contact}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Điện thoại</label>
                <p>{data.phone}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <p>{data.email}</p>
            </div>

            {data.website && (
              <div>
                <label className="text-sm font-medium text-slate-600">Website</label>
                <p>
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {data.website}
                  </a>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Ngày nộp</label>
                <p>{new Date(data.submittedDate).toLocaleDateString('vi-VN')}</p>
              </div>
              {data.reviewedDate && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Ngày xét duyệt</label>
                  <p>{new Date(data.reviewedDate).toLocaleDateString('vi-VN')}</p>
                </div>
              )}
            </div>

            {data.rejectionReason && (
              <div>
                <label className="text-sm font-medium text-slate-600">Lý do từ chối</label>
                <p className="text-red-700 bg-red-50 p-3 rounded border">{data.rejectionReason}</p>
              </div>
            )}

            {data.documents && data.documents.length > 0 && (
              <div>
                <label className="text-sm font-medium text-slate-600">Tài liệu đính kèm</label>
                <div className="space-y-2">
                  {data.documents.map((doc, index) => (
                    <p key={index}>
                      <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Tài liệu {index + 1}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Generic View Modal
export default function ViewModal<T>({ open, onClose, data, title }: ViewModalProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {data && (
          <div className="space-y-4">
            <pre className="bg-slate-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
