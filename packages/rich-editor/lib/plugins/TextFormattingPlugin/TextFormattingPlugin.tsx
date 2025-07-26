import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@musetrip360/ui-core/button';
import { FORMAT_TEXT_COMMAND, type TextFormatType } from 'lexical';
import { Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { useCallback } from 'react';
import { useSelectionState } from '@/hooks';

export interface TextFormattingConfig {
  showBold?: boolean;
  showItalic?: boolean;
  showUnderline?: boolean;
  showStrikethrough?: boolean;
}

interface TextFormattingPluginProps {
  config?: TextFormattingConfig;
}

export const TextFormattingPlugin: React.FC<TextFormattingPluginProps> = ({ config }) => {
  const [editor] = useLexicalComposerContext();
  const selectionState = useSelectionState();

  const formatText = useCallback(
    (format: TextFormatType) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor]
  );

  return (
    <div className="flex items-center gap-0.5 mx-2">
      {(config?.showBold ?? true) && (
        <Button
          variant={selectionState.isBold ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => formatText('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
      )}

      {(config?.showItalic ?? true) && (
        <Button
          variant={selectionState.isItalic ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => formatText('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
      )}

      {(config?.showUnderline ?? true) && (
        <Button
          variant={selectionState.isUnderline ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => formatText('underline')}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
      )}

      {(config?.showStrikethrough ?? true) && (
        <Button
          variant={selectionState.isStrikethrough ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => formatText('strikethrough')}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
