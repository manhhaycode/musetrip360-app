'use client';

import { cn } from '@musetrip360/ui-core/utils';
import { Button } from '@musetrip360/ui-core/button';
import { Separator } from '@musetrip360/ui-core/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@musetrip360/ui-core/tooltip';
import { MousePointer2, Hand, MapPin, PenTool, Move } from 'lucide-react';
import { useEditorToolbar, EditorTool } from './EditorToolbarContext';

interface EditorToolbarProps {
  className?: string;
}

interface ToolItem {
  id: EditorTool;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  shortcut: string;
}

const toolbarItems: ToolItem[] = [
  {
    id: 'select',
    icon: MousePointer2,
    label: 'Select Tool',
    description: 'Select objects in the scene',
    shortcut: 'S',
  },
  {
    id: 'hand',
    icon: Hand,
    label: 'Hand Tool',
    description: 'Pan and navigate around the scene',
    shortcut: 'H',
  },
  {
    id: 'drag',
    icon: Move,
    label: 'Drag Tool',
    description: 'Drag objects in the scene',
    shortcut: 'D',
  },
];

const creationTools: ToolItem[] = [
  {
    id: 'hotspot',
    icon: MapPin,
    label: 'Add Hotspot',
    description: 'Add interactive hotspots to the scene',
    shortcut: 'A',
  },
  {
    id: 'pen',
    icon: PenTool,
    label: 'Polygon Select',
    description: 'Draw polygon selection areas',
    shortcut: 'P',
  },
];

export default function EditorToolbar({ className }: EditorToolbarProps) {
  const { setSelectedTool, isToolActive, disabled } = useEditorToolbar();

  const renderToolButton = (tool: ToolItem) => {
    const Icon = tool.icon;
    const isActive = isToolActive(tool.id);

    return (
      <TooltipProvider key={tool.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-10 w-10 p-0',
                isActive && 'bg-primary text-primary-foreground',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => setSelectedTool(tool.id)}
              disabled={disabled}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <div className="font-medium">{tool.label}</div>
            <div className="text-xs">{tool.description}</div>
            <div className="text-xs">Shortcut: {tool.shortcut}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={cn('flex flex-col gap-1 p-2 bg-background border rounded-lg shadow-sm', 'min-w-[56px]', className)}>
      {/* Mouse Tools Section */}
      <div className="flex flex-col gap-1">{toolbarItems.map(renderToolButton)}</div>

      <Separator className="my-2" />

      {/* Creation Tools Section */}
      <div className="flex flex-col gap-1">{creationTools.map(renderToolButton)}</div>
    </div>
  );
}

export { type EditorToolbarProps };
