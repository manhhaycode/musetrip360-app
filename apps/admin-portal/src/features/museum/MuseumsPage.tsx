import { Museum, MuseumDataTable, useCreateMuseum } from '@musetrip360/museum-management';
import { useState } from 'react';
import { toast } from 'sonner';
import MuseumApiForm from '../TableForm/MuseumApiForm';
import { MuseumApiFormData } from '../TableForm/schemas';

const MuseumsPage = () => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const createMuseumMutation = useCreateMuseum({
    onSuccess: () => {
      toast.success('Tạo bảo tàng thành công!');
      setIsCreateFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Lỗi tạo bảo tàng: ${error.message}`);
    },
  });

  const handleView = (museum: Museum) => {
    toast.info(`Xem chi tiết: ${museum.name}`);
  };

  const handleEdit = (museum: Museum) => {
    toast.info(`Chỉnh sửa: ${museum.name}`);
  };

  const handleDelete = (museum: Museum) => {
    toast.warning(`Xóa bảo tàng: ${museum.name}`);
  };

  const handleAdd = () => {
    setIsCreateFormOpen(true);
  };

  const handleSubmit = (data: MuseumApiFormData) => {
    createMuseumMutation.mutate(data);
  };

  return (
    <>
      <MuseumDataTable onView={handleView} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />

      <MuseumApiForm
        mode="add"
        title="Thêm Bảo Tàng Mới"
        open={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMuseumMutation.isPending}
      />
    </>
  );
};

export default MuseumsPage;
