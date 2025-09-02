import { useMuseumStore } from '@musetrip360/museum-management';
import { StudioVirtualTour } from '@musetrip360/virtual-tour/components';
import { useNavigate, useParams } from 'react-router';
export default function VirtualTourInfo() {
  const navigate = useNavigate();
  const { selectedMuseum } = useMuseumStore();
  const { id } = useParams<{ id: string }>();

  // Show loading while checking user museums
  if (!selectedMuseum) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin bảo tàng...</p>
        </div>
      </div>
    );
  }

  return (
    selectedMuseum && (
      <StudioVirtualTour
        virtualTourId={id}
        museumId={selectedMuseum?.id}
        onBackScreen={() => navigate('/virtual-tour')}
        onCreateVirtualTour={(virtualTour) => {
          // Navigate to the created virtual tour's edit page
          navigate(`/virtual-tour/studio/${virtualTour.id}`);
        }}
      />
    )
  );
}
