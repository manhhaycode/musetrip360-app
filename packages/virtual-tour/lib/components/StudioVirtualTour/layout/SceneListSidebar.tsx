import { IVirtualTourScene } from '@/api/types';
import { useScenes, useStudioStore } from '@/store/studioStore';
import { Button } from '@musetrip360/ui-core/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@musetrip360/ui-core/sidebar';
import { ArrowLeft, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import React from 'react';

const sidebarButtonClasses =
  'hover:text-primary-foreground data-[active=true]:text-primary-foreground data-[active=true]:bg-primary/70 active:text-primary-foreground data-[state=close]:hover:text-primary-foreground data-[state=open]:hover:text-primary-foreground';

interface SceneListItemProps {
  scene: IVirtualTourScene;
}

function SceneListItem({ scene }: SceneListItemProps) {
  const { selectedSceneId, addScene, deleteScene, selectScene } = useStudioStore();
  const handleDelete = (e: React.MouseEvent, sceneId: string, parentSceneId?: string) => {
    e.stopPropagation();
    deleteScene(sceneId, parentSceneId);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        className="hover:text-primary-foreground data-[active=true]:text-primary-foreground active:text-primary-foreground data-[state=close]:hover:text-primary-foreground data-[state=open]:hover:text-primary-foreground"
        isActive={selectedSceneId === scene.sceneId}
        onClick={() => selectScene(scene.sceneId)}
      >
        <div className="flex items-center gap-2 flex-1 cursor-pointer">
          <div className="w-8 h-8 rounded flex items-center justify-center text-xs flex-shrink-0">
            {scene.thumbnail ? (
              <img
                src={typeof scene.thumbnail === 'string' ? scene.thumbnail : URL.createObjectURL(scene.thumbnail)}
                alt={scene.sceneName}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <Eye className="w-4 h-4 !text-inherit" />
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium truncate">{scene.sceneName}</p>
          </div>
          <Trash2
            onClick={(e) => handleDelete(e, scene.sceneId)}
            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </SidebarMenuButton>
      <SidebarMenuSub className="p-2">
        <SidebarMenuSubItem>
          <Button
            rightIcon={<Plus className="w-4 h-4" />}
            variant="outline"
            className="w-full"
            onClick={() => addScene(scene)}
          >
            Thêm scene phụ
          </Button>
        </SidebarMenuSubItem>
      </SidebarMenuSub>
      <SidebarMenuSub className="p-2">
        {scene.subScenes?.map((subItem) => (
          <SidebarMenuSubItem key={subItem.sceneId}>
            <SidebarMenuSubButton
              onClick={() => selectScene(subItem.sceneId)}
              isActive={selectedSceneId === subItem.sceneId}
              className={sidebarButtonClasses}
              asChild
            >
              <div className="flex items-center gap-2 flex-1 cursor-pointer">
                <div className="w-8 h-8 rounded flex items-center justify-center text-xs flex-shrink-0">
                  {subItem.thumbnail ? (
                    <img
                      src={
                        typeof subItem.thumbnail === 'string'
                          ? subItem.thumbnail
                          : URL.createObjectURL(subItem.thumbnail)
                      }
                      alt={subItem.sceneName}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Eye className="w-4 h-4 !text-inherit" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{subItem.sceneName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDelete(e, subItem.sceneId, scene.sceneId)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}

export default function SceneListSidebar({ onBackScreen }: { onBackScreen?: () => void }) {
  const scenes = useScenes();
  const { addScene } = useStudioStore();

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button className="w-full" leftIcon={<ArrowLeft className="w-4 h-4 mr-2" />} onClick={onBackScreen}>
              Trở lại trang quản lý
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="outline"
              className="w-full"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => addScene()}
            >
              Thêm scene mới
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className=""></div>
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Tour Scenes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {scenes.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <EyeOff className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Chưa có scene nào</p>
                  <p className="text-xs">Nhấn nút + để thêm scene đầu tiên</p>
                </div>
              ) : (
                scenes.map((scene) => <SceneListItem key={scene.sceneId} scene={scene} />)
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">Total scenes: {scenes.length}</div>
      </SidebarFooter>
    </Sidebar>
  );
}
