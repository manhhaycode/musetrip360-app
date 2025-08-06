import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
// import { VirtualTourForm } from '@musetrip360/virtual-tour/components';
import { useIsAuthenticated } from '@musetrip360/auth-system';
import { useGetUserMuseums, useMuseumStore } from '@musetrip360/museum-management';
import { StudioVirtualTour } from '@musetrip360/virtual-tour/components';
import { useEffect } from 'react';
export default function VirtualTourInfo() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: userMuseums, isLoading } = useGetUserMuseums();
  const { setUserMuseums, setSelectedMuseum, selectedMuseum } = useMuseumStore();
  const { id } = useParams<{ id: string }>();

  // Update the store when user museums are loaded
  useEffect(() => {
    if (userMuseums) {
      setUserMuseums(userMuseums);

      // Auto-select the first museum if none is selected
      if (!selectedMuseum && userMuseums.length > 0) {
        setSelectedMuseum(userMuseums[0] || null);
      }
    }
  }, [userMuseums, setUserMuseums, setSelectedMuseum, selectedMuseum]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  // Show loading while checking user museums
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin bảo tàng...</p>
        </div>
      </div>
    );
  }

  // If user has no museums and is on the main route, redirect to welcome page
  if (userMuseums && userMuseums.length === 0 && location.pathname === '/') {
    return <Navigate to="/welcome" replace />;
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
