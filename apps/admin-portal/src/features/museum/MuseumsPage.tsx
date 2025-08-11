import { Museum, MuseumDataTable } from '@musetrip360/museum-management';
import { useNavigate } from 'react-router-dom';

const MuseumsPage = () => {
  const navigate = useNavigate();

  const handleView = (museum: Museum) => {
    navigate(`/museums/admin/${museum.id}`);
  };

  const handleEdit = (museum: Museum) => {
    navigate(`/museums/admin/${museum.id}`);
  };

  return (
    <>
      <MuseumDataTable onView={handleView} onEdit={handleEdit} />
    </>
  );
};

export default MuseumsPage;
