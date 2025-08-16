'use client';

import { FileText, MapPin, MousePointer, Settings } from 'lucide-react';

import { HotspotPropertyForm, ScenePropertyForm } from '@/components/forms';
import { VirtualTourForm } from '@/components/forms/VirtualTourForm';
import { useStudioStore } from '@/store';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { useShallow } from 'zustand/shallow';

interface PropertiesPanelProps {
  className?: string;
  museumId: string; // ID of the museum to create the virtual tour for
}

function EmptyState() {
  return (
    <div className="p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <MousePointer className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-sm mb-2">Nothing Selected</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Select a scene from the sidebar or the tour itself to edit its properties.
      </p>
    </div>
  );
}

export function PropertiesPanel({ className, museumId }: PropertiesPanelProps) {
  const { propertiesSelection: type } = useStudioStore(
    useShallow((state) => ({
      propertiesSelection: state.propertiesSelection,
    }))
  );

  const renderHeader = () => {
    const getIcon = () => {
      switch (type) {
        case 'scene':
          return <Settings className="h-4 w-4" />;
        case 'tour':
          return <FileText className="h-4 w-4" />;
        case 'hotspot':
          return <MapPin className="h-4 w-4" />;
        default:
          return <MousePointer className="h-4 w-4" />;
      }
    };

    const getTitle = () => {
      switch (type) {
        case 'scene':
          return 'Scene Properties';
        case 'tour':
          return 'Tour Properties';
        case 'hotspot':
          return 'Hotspot Properties';
        default:
          return 'Properties';
      }
    };

    return (
      <div className="flex items-center gap-2 p-4 border-b border-border">
        {getIcon()}
        <h2 className="font-medium text-sm">{getTitle()}</h2>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'scene':
        return <ScenePropertyForm />;
      case 'tour':
        return <VirtualTourForm mode="edit" museumId={museumId} />;

      case 'hotspot':
        return <HotspotPropertyForm />;

      default:
        return <EmptyState />;
    }
  };

  return (
    <div className={`w-80 h-full flex flex-col ${className || ''}`}>
      <div className="flex-skrink-0">{renderHeader()}</div>
      <div style={{ flex: '1 0 0' }} className="min-h-0 flex">
        <ScrollArea className="w-full h-full p-2">{renderContent()}</ScrollArea>
      </div>
    </div>
  );
}
