import { useStudioStore } from '@/store';
import { useMemo } from 'react';
import { SceneCubeMapUploadForm } from '../forms';
import { BulkUploadProvider } from '@musetrip360/shared';
export default function SceneEditor() {
  const { selectedSceneId, getSelectedScene } = useStudioStore();
  const selectedScene = useMemo(() => {
    return getSelectedScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSceneId, getSelectedScene]);

  if (!selectedScene) {
    return <div className="flex items-center justify-center flex-1">No scene selected</div>;
  }
  return (
    <BulkUploadProvider>
      <SceneCubeMapUploadForm />
    </BulkUploadProvider>
  );
}
