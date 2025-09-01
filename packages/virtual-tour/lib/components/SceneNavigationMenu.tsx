import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { IVirtualTour, IVirtualTourScene } from '../api/types';
import { Menu, X, Search, MapPin, Eye, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@musetrip360/ui-core/sheet';
import { Badge } from '@musetrip360/ui-core/badge';
import { Separator } from '@musetrip360/ui-core/separator';

export interface SceneNavigationMenuProps {
  /** Virtual tour data */
  virtualTour: IVirtualTour;
  /** Current active scene ID */
  currentSceneId: string;
  /** Called when user selects a scene */
  onSceneSelect: (sceneId: string) => void;
  /** Enable search functionality */
  enableSearch?: boolean;
  /** Show scene statistics */
  showStats?: boolean;
  /** Custom menu trigger component */
  customTrigger?: React.ReactNode;
}

export const SceneNavigationMenu: React.FC<SceneNavigationMenuProps> = ({
  virtualTour,
  currentSceneId,
  onSceneSelect,
  enableSearch = true,
  showStats = true,
  customTrigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten all scenes for easier processing
  const allScenes = useMemo(() => {
    const flattenScenes = (scenes: IVirtualTourScene[], depth = 0): Array<IVirtualTourScene & { depth: number }> => {
      const result: Array<IVirtualTourScene & { depth: number }> = [];

      scenes.forEach((scene) => {
        result.push({ ...scene, depth });

        if (scene.subScenes && scene.subScenes.length > 0) {
          result.push(...flattenScenes(scene.subScenes, depth + 1));
        }
      });

      return result;
    };

    return flattenScenes(virtualTour.metadata.scenes);
  }, [virtualTour.metadata.scenes]);

  // Filter scenes based on search
  const filteredScenes = useMemo(() => {
    if (!searchQuery.trim()) return allScenes;

    const query = searchQuery.toLowerCase();
    return allScenes.filter(
      (scene) => scene.sceneName.toLowerCase().includes(query) || scene.sceneDescription?.toLowerCase().includes(query)
    );
  }, [allScenes, searchQuery]);

  // Current scene info
  const currentScene = useMemo(() => {
    return allScenes.find((scene) => scene.sceneId === currentSceneId);
  }, [allScenes, currentSceneId]);

  // Statistics
  const stats = useMemo(() => {
    const total = allScenes.length;
    const withData = allScenes.filter((s) => s.data?.cubeMaps && s.data?.cubeMaps?.length > 0).length;
    const completion = total > 0 ? Math.round((withData / total) * 100) : 0;

    return { total, withData, completion };
  }, [allScenes]);

  // Handle scene selection
  const handleSceneSelect = useCallback(
    (sceneId: string) => {
      onSceneSelect(sceneId);
      setIsOpen(false); // Auto-close menu after selection
    },
    [onSceneSelect]
  );

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const renderMenuTrigger = () => {
    if (customTrigger) {
      return customTrigger;
    }

    return (
      <Button
        variant="secondary"
        size="lg"
        leftIcon={<Menu size={18} className="mr-2" />}
        className="bg-black/95 text-white hover:bg-black/90 backdrop-blur-sm border-0"
      >
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium truncate max-w-32">{currentScene?.sceneName || 'Select Scene'}</div>
          <div className="text-xs text-gray-300">
            {allScenes.findIndex((s) => s.sceneId === currentSceneId) + 1} of {allScenes.length}
          </div>
        </div>
      </Button>
    );
  };

  const renderSceneItem = (scene: IVirtualTourScene & { depth: number }) => {
    const isActive = scene.sceneId === currentSceneId;
    const hasData = scene.data?.cubeMaps && scene.data?.cubeMaps?.length > 0;
    const hotspotCount = scene.data?.hotspots?.length || 0;
    const polygonCount = scene.data?.polygons?.length || 0;

    return (
      <Button
        key={scene.sceneId}
        onClick={() => handleSceneSelect(scene.sceneId)}
        variant={isActive ? 'default' : 'ghost'}
        className={`flex-1 justify-start h-auto p-3 ${scene.depth > 0 ? 'ml-4 border-l-2 border-border pl-4' : ''}`}
        disabled={!hasData}
      >
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h4 className={`font-medium truncate text-sm ${!hasData ? 'text-muted-foreground' : ''}`}>
              {scene.sceneName}
            </h4>

            <div className="flex items-center gap-1 flex-shrink-0">
              {isActive && <MapPin size={14} className="text-primary" />}
              {hasData ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : (
                <Circle size={14} className="text-muted-foreground" />
              )}
            </div>
          </div>

          {scene.sceneDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2">{scene.sceneDescription}</p>
          )}

          <div className="flex items-center gap-2 text-xs">
            {hasData ? (
              <Badge variant="secondary" className="text-xs">
                <Eye size={10} className="mr-1" />
                Ready
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-orange-500">
                <Circle size={10} className="mr-1" />
                No data
              </Badge>
            )}

            {hotspotCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {hotspotCount} hotspots
              </Badge>
            )}

            {polygonCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {polygonCount} areas
              </Badge>
            )}
          </div>
        </div>
      </Button>
    );
  };

  const renderMenuContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <SheetHeader className="p-4 border-b">
        <SheetTitle>Scene Navigator</SheetTitle>
      </SheetHeader>

      {/* Current Scene Highlight */}
      {currentScene && (
        <>
          <div className="p-4 bg-primary/5 border-b">
            <div className="flex items-center gap-2 text-primary mb-1">
              <MapPin size={16} />
              <span className="text-sm font-medium">Currently viewing:</span>
            </div>
            <h3 className="font-semibold text-foreground">{currentScene.sceneName}</h3>
            {currentScene.sceneDescription && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{currentScene.sceneDescription}</p>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Search */}
      {enableSearch && (
        <>
          <div className="px-4 py-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search scenes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Scene List */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-2">
        {filteredScenes.length > 0 ? (
          filteredScenes.map(renderSceneItem)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>No scenes found</p>
            {searchQuery && (
              <Button variant="link" size="sm" onClick={() => setSearchQuery('')} className="mt-2 h-auto p-0">
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Statistics Footer */}
      {showStats && (
        <>
          <Separator />
          <div className="p-4 bg-muted/50">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {stats.total} scenes
              </span>
              <Badge variant={stats.completion === 100 ? 'default' : 'secondary'} className="text-xs">
                {stats.completion}% complete
              </Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{renderMenuTrigger()}</SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-80 lg:w-96 p-0">
        {renderMenuContent()}
      </SheetContent>
    </Sheet>
  );
};
