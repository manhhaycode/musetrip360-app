import { Badge } from '@musetrip360/ui-core/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { Button } from '@musetrip360/ui-core/button';
import { Plan } from '@musetrip360/payment-management';

interface PlanDetailModalProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (plan: Plan) => void;
  onDelete?: (plan: Plan) => void;
}

const PlanDetailModal = ({ plan, open, onOpenChange, onEdit }: PlanDetailModalProps) => {
  if (!plan) return null;

  const formatDuration = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      if (remainingDays === 0) {
        return `${years} ${years === 1 ? 'năm' : 'năm'}`;
      }
      return `${years} năm ${remainingDays} ngày`;
    }
    if (days >= 30) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      if (remainingDays === 0) {
        return `${months} ${months === 1 ? 'tháng' : 'tháng'}`;
      }
      return `${months} tháng ${remainingDays} ngày`;
    }
    return `${days} ngày`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-full max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                Chi tiết thông tin gói đăng ký
                <Badge
                  className={plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  variant="secondary"
                >
                  {plan.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Badge>
              </DialogTitle>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onEdit(plan);
                    onOpenChange(false);
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tên gói</label>
              <p className="font-medium">{plan.name}</p>
            </div>

            {plan.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                <p className="text-sm leading-relaxed mt-1">{plan.description}</p>
              </div>
            )}
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin giá</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Giá gốc</label>
                <p className="text-xl font-mono font-bold">${plan.price.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Giảm giá</label>
                <p className="text-sm">
                  {plan.discountPercent ? (
                    <span className="text-green-600 font-medium">{plan.discountPercent}%</span>
                  ) : (
                    <span className="text-muted-foreground">Không giảm giá</span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Giá sau giảm</label>
                <p className="text-xl font-mono font-bold text-green-600">
                  $
                  {plan.discountPercent
                    ? ((plan.price * (100 - plan.discountPercent)) / 100).toLocaleString()
                    : plan.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tính năng</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Thời hạn</label>
                <p className="font-medium">{formatDuration(plan.durationDays)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Số sự kiện tối đa</label>
                <p className="font-medium">
                  {plan.maxEvents && plan.maxEvents < 100000
                    ? `${plan.maxEvents.toLocaleString()} sự kiện`
                    : 'Không giới hạn'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetailModal;
