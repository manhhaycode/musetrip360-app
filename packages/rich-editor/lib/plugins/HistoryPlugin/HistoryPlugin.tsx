import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@musetrip360/ui-core/button';
import { UNDO_COMMAND, REDO_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND } from 'lexical';
import { Undo, Redo } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export interface HistoryConfig {
  showUndo?: boolean;
  showRedo?: boolean;
}

interface HistoryPluginProps {
  config?: HistoryConfig;
}

export const HistoryPlugin: React.FC<HistoryPluginProps> = ({ config }) => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  const handleUndo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  return (
    <>
      {(config?.showUndo ?? true) && (
        <Button variant="ghost" size="sm" onClick={handleUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo className="h-4 w-4" />
        </Button>
      )}

      {(config?.showRedo ?? true) && (
        <Button variant="ghost" size="sm" onClick={handleRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};
