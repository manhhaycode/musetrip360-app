'use client';

import React, { useCallback } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { Avatar, AvatarFallback, AvatarImage, toast } from '@musetrip360/ui-core';
import { useDeleteTourGuide, TourGuide } from '@musetrip360/user-management';

interface DeleteTourGuideConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tourGuide: TourGuide;
}

const DeleteTourGuideConfirm: React.FC<DeleteTourGuideConfirmProps> = ({ isOpen, onClose, onSuccess, tourGuide }) => {
  const { mutate: deleteTourGuide, isPending: isDeleting } = useDeleteTourGuide({
    onSuccess: () => {
      toast.success('Xoá hướng dẫn viên thành công');
      onSuccess?.();
      onClose();
    },
    onError: () => {
      toast.error('Xoá hướng dẫn viên thất bại');
    },
  });

  const handleDelete = useCallback(() => {
    deleteTourGuide(tourGuide.id);
  }, [tourGuide.id, deleteTourGuide]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Xác nhận xoá</h3>
            <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tourGuide.user.avatarUrl ?? ''} />
            <AvatarFallback>{tourGuide.user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-sm">{tourGuide.name || tourGuide.user.fullName}</div>
            <div className="text-xs text-gray-500">{tourGuide.user.email}</div>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-6">
          Bạn có chắc chắn muốn xoá hướng dẫn viên <strong>{tourGuide.name || tourGuide.user.fullName}</strong> không?
          Tất cả dữ liệu liên quan sẽ bị xoá và không thể khôi phục.
        </p>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isDeleting}>
            Huỷ
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="flex-1">
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xoá...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Xoá
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTourGuideConfirm;
