'use client';

import { PreviewModal } from '@musetrip360/shared/ui';
import { Button } from '@musetrip360/ui-core/button';
import { Separator } from '@musetrip360/ui-core/separator';
import { SidebarTrigger } from '@musetrip360/ui-core/sidebar';
import { Circle, Eye, Redo, SettingsIcon, Undo } from 'lucide-react';

import { VirtualTourViewer } from '@/components/VirtualTourViewer';
import { useHistoryState, useIsDirty, useStudioStore } from '@/store/studioStore';
import { PERMISSION_TOUR_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';
import { cn } from '@musetrip360/ui-core/utils';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

export function VirtualTourStudioHeader({ museumId }: { museumId: string }) {
  const { setPropertiesSelection, getSelectedScene, selectedSceneId, virtualTour } = useStudioStore(
    useShallow((state) => ({
      selectedSceneId: state.selectedSceneId,
      setPropertiesSelection: state.setPropertiesSelection,
      getSelectedScene: state.getSelectedScene,
      virtualTour: state.virtualTour,
    }))
  );
  const { hasPermission } = useRolebaseStore();

  const isDirty = useIsDirty();

  const selectedScene = useMemo(() => {
    return getSelectedScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, selectedSceneId]);

  const { canUndo, canRedo, undo, redo } = useHistoryState();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleViewVirtualTour = () => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <header className="flex h-(--header-height) py-3 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />

        {/* Scene Name Display */}
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold">
            {selectedScene?.sceneName ? `Scene: ${selectedScene.sceneName}` : 'Virtual Tour Studio'}
          </h1>
          {selectedScene?.sceneDescription && (
            <span className="text-sm text-muted-foreground max-w-[200px] truncate">
              {selectedScene.sceneDescription}
            </span>
          )}
        </div>

        {/* Action Bar */}
        <div className="ml-auto flex items-center gap-2">
          {/* Save Status Indicator */}
          {hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT) && (
            <div className="flex items-center gap-1.5">
              <Circle
                className={cn(
                  'h-2 w-2 transition-colors duration-300 ease-in-out',
                  isDirty ? 'fill-orange-500 text-orange-500' : 'fill-green-500 text-green-500'
                )}
              />
            </div>
          )}

          <Separator orientation="vertical" className="mx-1 h-4" />

          {/* Undo/Redo Actions */}
          {hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT) && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Separator orientation="vertical" className="mx-1 h-4" />

          <Button
            leftIcon={<Eye className="h-4 w-4" />}
            variant="default"
            size="sm"
            onClick={handleViewVirtualTour}
            disabled={!virtualTour.metadata.scenes.length}
          >
            View Virtual Tour
          </Button>

          <Button
            leftIcon={<SettingsIcon className="h-4 w-4" />}
            variant="outline"
            size="sm"
            onClick={() => setPropertiesSelection('tour')}
          >
            Setting tour
          </Button>
        </div>
      </div>

      {/* Virtual Tour Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title="Virtual Scene Preview"
        size="fullscreen"
        showBackButton
        closeOnBackdropClick
        closeOnEscape
        lazyChildren
      >
        <div className="flex-1 p-6">
          <VirtualTourViewer
            initialSceneId={selectedSceneId}
            virtualTour={virtualTour}
            enableUserControls={true}
            useHamburgerMenu={true}
          />
        </div>
      </PreviewModal>
    </header>
  );
}
