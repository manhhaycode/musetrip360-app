import { useArtifact } from '@musetrip360/artifact-management/api';
import { useMuseum } from './useMuseums';

/**
 * Hook để lấy thông tin museum của một artifact cụ thể
 * Sử dụng cho search results khi cần hiển thị museum info
 */
export function useArtifactMuseum(artifactId: string, enabled = true) {
  // Fetch artifact detail để lấy museumId
  const { data: artifactResponse, isLoading: artifactLoading } = useArtifact(artifactId, {
    enabled: enabled && !!artifactId,
  });

  const artifact = artifactResponse?.data;

  // Fetch museum data dựa trên museumId từ artifact
  const { data: museum, isLoading: museumLoading } = useMuseum(artifact?.museumId || '');

  return {
    artifact,
    museum,
    isLoading: artifactLoading || (!!artifact?.museumId && museumLoading),
    museumName: museum?.name,
    hasValidMuseum: !!artifact?.museumId,
  };
}
