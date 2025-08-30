import { useCheckSceneExist } from '@/api';
import { InteractiveHotspot, PanoramaSphere, InteractivePolygonSelect } from '@/canvas';
import { useStudioStore } from '@/store';
import { BulkUploadProvider } from '@musetrip360/shared';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { SceneCubeMapUploadForm } from '../forms';
import { EditorToolbarProvider, EditorToolbar, useEditorToolbar } from './EditorToolbar';
import { cn } from '@musetrip360/ui-core/utils';
import { ThreeEvent } from '@react-three/fiber';
import { Hotspot, Vector3Like } from '@/canvas/types';
import * as THREE from 'three';

function SceneEditorContent() {
  const { selectedTool, setSelectedTool } = useEditorToolbar();
  const {
    selectedSceneId,
    getSelectedScene,
    isDirty,
    addHotspot,
    getSceneHotspots,
    selectHotspot,
    updateHotspot,
    addPolygon,
    getScenePolygons,
    selectPolygon,
  } = useStudioStore(
    useShallow((state) => ({
      selectedSceneId: state.selectedSceneId,
      getSelectedScene: state.getSelectedScene,
      isDirty: state.isDirty,
      addHotspot: state.addHotspot,
      getSceneHotspots: state.getSceneHotspots,
      selectHotspot: state.selectHotspot,
      updateHotspot: state.updateHotspot,
      addPolygon: state.addPolygon,
      getScenePolygons: state.getScenePolygons,
      selectPolygon: state.selectPolygon,
    }))
  );

  // Polygon state - managed by store now
  const [polygonPoints, setPolygonPoints] = useState<THREE.Vector3[]>([]);

  const selectedScene = useMemo(() => {
    return getSelectedScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSceneId, isDirty]);

  const hotspots = useMemo(() => {
    return getSceneHotspots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSceneHotspots, selectedSceneId, isDirty]);

  const polygons = useMemo(() => {
    return getScenePolygons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getScenePolygons, selectedSceneId, isDirty]);

  const listImages = useMemo(() => {
    if (!selectedScene?.data?.cubeMaps[0]) return [];
    return Object.values(selectedScene.data.cubeMaps[0]);
  }, [selectedScene]);

  const { isLoading, isError } = useCheckSceneExist(selectedSceneId, listImages);

  // Determine if panorama rotation should be enabled based on selected tool
  const enableRotate = selectedTool === 'hand';
  const isHotspotMode = selectedTool === 'hotspot';
  const isDragMode = selectedTool === 'drag';
  const isPolygonMode = selectedTool === 'pen';
  const isEditing = isHotspotMode || selectedTool === 'select';

  console.log('SceneEditor: Tool states', {
    selectedTool,
    isPolygonMode,
    polygonPointsLength: polygonPoints.length,
    completedPolygonsLength: polygons.length,
  });

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

  // Polygon handlers
  const handlePolygonPointAdd = (point: THREE.Vector3) => {
    console.log('SceneEditor: handlePolygonPointAdd called', point);
    setPolygonPoints((prev) => {
      const newPoints = [...prev, point];
      console.log('SceneEditor: Updated polygon points', newPoints);
      return newPoints;
    });
  };

  const handlePolygonComplete = (points: THREE.Vector3[]) => {
    console.log('SceneEditor: handlePolygonComplete called', points);
    // Add polygon to store with a default artifactIdLink
    addPolygon({
      artifactIdLink: '', // This should be set from PropertiesPanel
      points: points,
    });
    setPolygonPoints([]);
    setSelectedTool('select');
  };

  const handlePolygonCancel = () => {
    console.log('SceneEditor: handlePolygonCancel called');
    setPolygonPoints([]);
    setSelectedTool('select');
  };

  const handlePolygonClick = (polygonIndex: number, points: Vector3Like[]) => {
    if (selectedTool !== 'pen' && selectedTool !== 'select') return;
    console.log('SceneEditor: Polygon clicked', { polygonIndex, points });
    // Get the polygon from store and select it
    const polygon = polygons[polygonIndex];
    if (polygon) {
      selectPolygon(polygon.id);
    }
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
          'flex absolute inset-0 border overflow-hidden',
          selectedTool === 'hand' && 'cursor-grab active:cursor-grabbing',
          selectedTool === 'drag' && 'cursor-pointer active:cursor-move',
          selectedTool === 'pen' && 'cursor-crosshair'
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

          {/* Render polygon selector */}
          <InteractivePolygonSelect
            isActive={isPolygonMode}
            points={polygonPoints}
            completedPolygons={polygons.map((polygon) => polygon.points)}
            onPointAdd={handlePolygonPointAdd}
            onPolygonComplete={handlePolygonComplete}
            onCancel={handlePolygonCancel}
            onPolygonClick={handlePolygonClick}
          />
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
