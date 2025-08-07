import { useMuseumStore } from '@musetrip360/museum-management';
import { VirtualTourDataTable } from '@musetrip360/virtual-tour/components';

export default function VirtualTourManagement() {
  const { selectedMuseum } = useMuseumStore();
  if (!selectedMuseum) {
    return (
      <div className="flex items-center justify-center flex-1">Please select a museum to manage virtual tours.</div>
    );
  }
  return <VirtualTourDataTable museumId={selectedMuseum.id} />;
}
