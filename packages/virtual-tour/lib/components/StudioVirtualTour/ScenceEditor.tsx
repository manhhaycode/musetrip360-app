import { useCheckSceneExist } from '@/api';
import { PanoramaSphere } from '@/canvas';
import { useStudioStore } from '@/store';
import { BulkUploadProvider } from '@musetrip360/shared';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { SceneCubeMapUploadForm } from '../forms';
import { EditorToolbarProvider, EditorToolbar, useEditorToolbar } from './EditorToolbar';
import { cn } from '@musetrip360/ui-core/utils';

function SceneEditorContent() {
  const { selectedTool } = useEditorToolbar();
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

  // Determine if panorama rotation should be enabled based on selected tool
  const enableRotate = selectedTool === 'hand';

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
    <div className="flex-1 flex relative">
      <EditorToolbar className="absolute top-4 left-4 z-10" />
      <div
        className={cn(selectedTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default', 'flex-1 flex')}
      >
        <PanoramaSphere cubeMapLevel={selectedScene.data.cubeMaps[0]} enableRotate={enableRotate} />
      </div>
    </div>
  );
}

export default function SceneEditor() {
  return (
    <EditorToolbarProvider
      defaultTool="move"
      onToolChange={(tool) => {
        console.log('Tool changed to:', tool);
        // Tool-specific logic can be added here in the future
      }}
    >
      <SceneEditorContent />
    </EditorToolbarProvider>
  );
}
