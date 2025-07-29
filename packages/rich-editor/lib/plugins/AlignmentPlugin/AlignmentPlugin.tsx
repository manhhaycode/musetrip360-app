import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@musetrip360/ui-core/button';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useCallback } from 'react';

export interface AlignmentConfig {
  showAlignment?: boolean;
}

interface AlignmentPluginProps {
  config?: AlignmentConfig;
}

export const AlignmentPlugin: React.FC<AlignmentPluginProps> = ({ config }) => {
  const [editor] = useLexicalComposerContext();

  const formatAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    },
    [editor]
  );

  if (!(config?.showAlignment ?? true)) {
    return null;
  }

  return (
    <div className="flex items-center gap-0.5 mx-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatAlignment('left')}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatAlignment('center')}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatAlignment('right')}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
