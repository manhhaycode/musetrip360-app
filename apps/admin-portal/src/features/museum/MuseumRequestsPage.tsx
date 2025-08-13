import { MuseumRequest, MuseumRequestDataTable } from '@musetrip360/museum-management';
import { useNavigate } from 'react-router-dom';

const MuseumRequestsPage = () => {
  const navigate = useNavigate();

  const handleView = (request: MuseumRequest) => {
    navigate(`/museums/requests/${request.id}`);
  };

  return (
    <>
      <MuseumRequestDataTable onView={handleView} />
    </>
  );
};

export default MuseumRequestsPage;
