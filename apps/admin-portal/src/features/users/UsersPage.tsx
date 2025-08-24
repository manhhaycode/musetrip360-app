import { Button } from '@musetrip360/ui-core/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { Input } from '@musetrip360/ui-core/input';
import { Label } from '@musetrip360/ui-core/label';
import {
  IUser,
  useCreateUser,
  UserCreateDto,
  UserDataTable,
  UserUpdateDto,
  useUpdateUser,
} from '@musetrip360/user-management';
import { useState } from 'react';
import { toast } from '@musetrip360/ui-core/sonner';

const UsersPage = () => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState<UserUpdateDto>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [createFormData, setCreateFormData] = useState<UserCreateDto>({
    fullName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    status: 'Active',
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

  const createUserMutation = useCreateUser({
    onSuccess: () => {
      toast.success('Tạo người dùng thành công!');
      setShowCreateDialog(false);
      setCreateFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        status: 'Active',
      });
    },
    onError: (error) => {
      toast.error('Tạo người dùng thất bại: ' + error.message);
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

  const handleAdd = () => {
    setShowCreateDialog(true);
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(createFormData);
  };

  return (
    <>
      <UserDataTable onEdit={handleEdit} onAdd={handleAdd} />

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
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

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo người dùng mới</DialogTitle>
            <DialogDescription>Thêm người dùng mới vào hệ thống</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Label htmlFor="createUsername">Username</Label>
              <Input
                id="createUsername"
                value={createFormData.username || ''}
                onChange={(e) => setCreateFormData({ ...createFormData, username: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="createPassword">Mật khẩu</Label>
              <Input
                id="createPassword"
                type="password"
                value={createFormData.password || ''}
                onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="createFullName">Tên đầy đủ</Label>
              <Input
                id="createFullName"
                value={createFormData.fullName || ''}
                onChange={(e) => setCreateFormData({ ...createFormData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="createEmail">Email</Label>
              <Input
                id="createEmail"
                type="email"
                value={createFormData.email || ''}
                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="createPhoneNumber">Số điện thoại</Label>
              <Input
                id="createPhoneNumber"
                value={createFormData.phoneNumber || ''}
                onChange={(e) => setCreateFormData({ ...createFormData, phoneNumber: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={createUserMutation.isPending}>
                Tạo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersPage;
