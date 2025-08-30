import { useParams } from 'react-router';
import ArtifactForm from '../ArtifactForm';
import { useArtifact } from '@musetrip360/artifact-management';
import { BulkUploadProvider } from '@musetrip360/shared';

const ArtifactEditPage = () => {
  const { id } = useParams();

  const { data: artifact } = useArtifact(id as string);

  if (!artifact) {
    return <div>Artifact not found</div>;
  }

  return (
    <BulkUploadProvider>
      <ArtifactForm mode="edit" defaultValues={artifact.data} artifactId={id} />
    </BulkUploadProvider>
  );
};

export default ArtifactEditPage;
