import { ArtifactDataTable, mockArtifacts } from '@musetrip360/artifact-management/ui';

const MuseumArtifactPage = () => {
  return (
    <>
      <ArtifactDataTable artifacts={mockArtifacts} />
    </>
  );
};

export default MuseumArtifactPage;
