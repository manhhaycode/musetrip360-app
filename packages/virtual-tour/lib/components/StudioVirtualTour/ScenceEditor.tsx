import { useCheckSceneExist } from '@/api';
import { InteractiveHotspot, PanoramaSphere } from '@/canvas';
import { useStudioStore } from '@/store';
import { BulkUploadProvider } from '@musetrip360/shared';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { SceneCubeMapUploadForm } from '../forms';
import { EditorToolbarProvider, EditorToolbar, useEditorToolbar } from './EditorToolbar';
import { cn } from '@musetrip360/ui-core/utils';
import { ThreeEvent } from '@react-three/fiber';
import { Hotspot } from '@/canvas/types';

function SceneEditorContent() {
  const { selectedTool, setSelectedTool } = useEditorToolbar();
  const { selectedSceneId, getSelectedScene, isDirty, addHotspot, getSceneHotspots, selectHotspot, updateHotspot } =
    useStudioStore(
      useShallow((state) => ({
        selectedSceneId: state.selectedSceneId,
        getSelectedScene: state.getSelectedScene,
        isDirty: state.isDirty,
        addHotspot: state.addHotspot,
        getSceneHotspots: state.getSceneHotspots,
        selectHotspot: state.selectHotspot,
        updateHotspot: state.updateHotspot,
      }))
    );

  const selectedScene = useMemo(() => {
    return getSelectedScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSceneId, isDirty]);

  const hotspots = useMemo(() => {
    return getSceneHotspots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSceneHotspots, selectedSceneId, isDirty]);

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
  const isHotspotMode = selectedTool === 'hotspot';
  const isDragMode = selectedTool === 'drag';
  const isEditing = isHotspotMode || selectedTool === 'select';

  const handleHotspotCreate = (event: ThreeEvent<MouseEvent>) => {
    if (!isHotspotMode) return;
    const position = event.point;
    addHotspot({
      position: [position.x, position.y, position.z],
      title: 'New Hotspot',
      type: 'info',
    });
    setSelectedTool('select');
  };

  const handleHotspotSelect = (hotspot: Hotspot) => {
    if (!isDragMode) {
      setSelectedTool('select');
    }
    selectHotspot(hotspot.id);
  };

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
        className={cn(
          'flex-1 flex',
          selectedTool === 'hand' && 'cursor-grab active:cursor-grabbing',
          selectedTool === 'drag' && 'cursor-pointer active:cursor-move'
        )}
      >
        <PanoramaSphere
          cubeMapLevel={selectedScene.data.cubeMaps[0]}
          enableRotate={enableRotate}
          onClick={handleHotspotCreate}
        >
          {/* Render hotspots */}
          {hotspots.map((hotspot) => (
            <InteractiveHotspot
              key={hotspot.id}
              hotspot={hotspot}
              isEditing={isEditing}
              isDragMode={isDragMode}
              onSelect={() => handleHotspotSelect(hotspot)}
              onPositionChange={(id, newPosition) => {
                updateHotspot(id, { position: newPosition });
              }}
            />
          ))}
        </PanoramaSphere>
      </div>
    </div>
  );
}

export default function SceneEditor() {
  return (
    <EditorToolbarProvider defaultTool="hand">
      <SceneEditorContent />
    </EditorToolbarProvider>
  );
}
