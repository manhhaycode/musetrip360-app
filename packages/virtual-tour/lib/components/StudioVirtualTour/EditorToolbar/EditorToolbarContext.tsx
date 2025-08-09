'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type EditorTool = 'select' | 'hand' | 'drag' | 'hotspot' | 'pen';

interface EditorToolbarContextValue {
  selectedTool: EditorTool;
  setSelectedTool: (tool: EditorTool) => void;
  isToolActive: (tool: EditorTool) => boolean;
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
  onToolChange?: (tool: EditorTool) => void;
}

interface EditorToolbarProviderProps {
  children: ReactNode;
  defaultTool?: EditorTool;
  onToolChange?: (tool: EditorTool) => void;
  disabled?: boolean;
}

const EditorToolbarContext = createContext<EditorToolbarContextValue | null>(null);

export function EditorToolbarProvider({
  children,
  defaultTool = 'hand',
  onToolChange,
  disabled = false,
}: EditorToolbarProviderProps) {
  const [selectedTool, setSelectedToolState] = useState<EditorTool>(defaultTool);
  const [isDisabled, setDisabled] = useState(disabled);

  const setSelectedTool = useCallback(
    (tool: EditorTool) => {
      if (isDisabled) return;

      setSelectedToolState(tool);
      onToolChange?.(tool);
    },
    [isDisabled, onToolChange]
  );

  const isToolActive = useCallback(
    (tool: EditorTool) => {
      return selectedTool === tool;
    },
    [selectedTool]
  );

  const value: EditorToolbarContextValue = {
    selectedTool,
    setSelectedTool,
    isToolActive,
    disabled: isDisabled,
    setDisabled,
    onToolChange,
  };

  return <EditorToolbarContext.Provider value={value}>{children}</EditorToolbarContext.Provider>;
}

export function useEditorToolbar() {
  const context = useContext(EditorToolbarContext);

  if (!context) {
    throw new Error('useEditorToolbar must be used within an EditorToolbarProvider');
  }

  return context;
}

export { type EditorToolbarProviderProps };
