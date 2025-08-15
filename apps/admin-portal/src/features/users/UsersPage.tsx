import { Button } from '@musetrip360/ui-core/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { Input } from '@musetrip360/ui-core/input';
import { Label } from '@musetrip360/ui-core/label';
import { IUser, UserDataTable, UserUpdateDto, useUpdateUser } from '@musetrip360/user-management';
import { useState } from 'react';
import { toast } from 'sonner';

const UsersPage = () => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState<UserUpdateDto>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const updateUserMutation = useUpdateUser({
    onSuccess: () => {
      toast.success('Cập nhật người dùng thành công!');
      setShowEditDialog(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error('Cập nhật người dùng thất bại: ' + error.message);
    },
  });

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
    });
    setShowEditDialog(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        userData: formData,
      });
    }
  };

  return (
    <>
      <UserDataTable onEdit={handleEdit} />

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editUsername">Username</Label>
              <Input
                id="editUsername"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editFullName">Tên đầy đủ</Label>
              <Input
                id="editFullName"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editPhoneNumber">Số điện thoại</Label>
              <Input
                id="editPhoneNumber"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                Cập nhật
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersPage;
