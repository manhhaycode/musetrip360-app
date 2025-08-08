import { useCheckSceneExist } from '@/api';
import { PanoramaSphere } from '@/canvas';
import { useStudioStore } from '@/store';
import { BulkUploadProvider } from '@musetrip360/shared';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { SceneCubeMapUploadForm } from '../forms';
export default function SceneEditor() {
  const { selectedSceneId, getSelectedScene, isDirty } = useStudioStore(
    useShallow((state) => ({
      selectedSceneId: state.selectedSceneId,
      getSelectedScene: state.getSelectedScene,
      isDirty: state.isDirty,
    }))
  );
  const selectedScene = useMemo(() => {
    return getSelectedScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSceneId, isDirty]);

  const listImages = useMemo(() => {
    return (
      selectedScene?.data?.cubeMaps.flatMap((item) => {
        return Object.values(item).map((cubeMap) => cubeMap);
      }) || []
    );
  }, [selectedScene]);

  const { isLoading, isError } = useCheckSceneExist(selectedSceneId, listImages);

  if (!selectedScene) {
    return <div className="flex items-center justify-center flex-1">No scene selected</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center flex-1">Checking Image...</div>;
  }

  if (isError || !selectedScene.data?.cubeMaps[0] || listImages.filter((item) => item).length !== 6) {
    return (
      <BulkUploadProvider>
        <SceneCubeMapUploadForm />
      </BulkUploadProvider>
    );
  }
  return (
    <div className="flex-1">
      <PanoramaSphere cubeMapLevel={selectedScene.data.cubeMaps[0]}></PanoramaSphere>
    </div>
  );
}
