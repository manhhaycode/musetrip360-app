import { Museum, MuseumDataTable } from '@musetrip360/museum-management';
import { toast } from 'sonner';

const MuseumsPage = () => {
  const handleView = (museum: Museum) => {
    toast.info(`Xem chi tiết: ${museum.name}`);
  };

  const handleEdit = (museum: Museum) => {
    toast.info(`Chỉnh sửa: ${museum.name}`);
  };

  const handleDelete = (museum: Museum) => {
    toast.warning(`Xóa bảo tàng: ${museum.name}`);
  };

  return (
    <>
      <MuseumDataTable onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
};

export default MuseumsPage;
