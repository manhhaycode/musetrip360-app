import { Button } from '@musetrip360/ui-core/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { AlertTriangle } from 'lucide-react';
import { DeleteModalProps } from './types';

export default function DeleteConfirmModal<T>({
  open,
  onClose,
  data,
  title,
  onConfirm,
  isLoading = false,
}: DeleteModalProps<T>) {
  if (!data) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  // Extract name field if it exists
  const itemName = (data as any)?.name || 'mục này';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa "{itemName}"? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
