import { ArtifactDataTable } from '@musetrip360/artifact-management/ui';
import { useMuseumStore } from '@musetrip360/museum-management';

const MuseumArtifactPage = () => {
  const { selectedMuseum } = useMuseumStore();
  if (!selectedMuseum) {
    return <div>Please select a museum to view artifacts.</div>;
  }
  return <ArtifactDataTable museumId={selectedMuseum?.id} />;
};

export default MuseumArtifactPage;
