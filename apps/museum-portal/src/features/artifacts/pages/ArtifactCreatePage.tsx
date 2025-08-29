import { BulkUploadProvider } from '@musetrip360/shared';
import ArtifactForm from '../ArtifactForm';

const ArtifactCreatePage = () => {
  return (
    <BulkUploadProvider>
      <ArtifactForm mode="create" />
    </BulkUploadProvider>
  );
};

export default ArtifactCreatePage;
