import withPermission from '@/hocs/withPermission';
import { ArtifactDataTable } from '@musetrip360/artifact-management/ui';
import { useMuseumStore } from '@musetrip360/museum-management';
import { PERMISSION_ARTIFACT_MANAGEMENT, PERMISSION_ARTIFACT_VIEW } from '@musetrip360/rolebase-management';

const MuseumArtifactPage = withPermission(() => {
  const { selectedMuseum } = useMuseumStore();
  if (!selectedMuseum) {
    return <div>Please select a museum to view artifacts.</div>;
  }
  return <ArtifactDataTable museumId={selectedMuseum?.id} />;
}, [PERMISSION_ARTIFACT_MANAGEMENT, PERMISSION_ARTIFACT_VIEW]);

export default MuseumArtifactPage;
