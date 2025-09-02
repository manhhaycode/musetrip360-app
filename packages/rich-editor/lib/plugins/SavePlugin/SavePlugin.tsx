import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@musetrip360/ui-core/button';
import { $generateHtmlFromNodes } from '@lexical/html';
import { Save } from 'lucide-react';
import { useCallback } from 'react';
import { useBulkUpload } from '@musetrip360/shared';

export interface SaveConfig {
  onSave?: (content: string) => void;
}

interface SavePluginProps {
  config?: SaveConfig;
}

export const SavePlugin: React.FC<SavePluginProps> = ({ config }) => {
  const [editor] = useLexicalComposerContext();
  const bulkUpload = useBulkUpload();

  const handleSave = useCallback(async () => {
    const updateEditor = () =>
      editor.update(() => {
        const htmlContent = $generateHtmlFromNodes(editor, null);
        config?.onSave?.(htmlContent);
      });
    try {
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        editor.setEditable(false);
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
          updateEditor();
        } else return;
      } else {
        updateEditor();
      }
    } finally {
      editor.setEditable(true);
    }
  }, [editor, config, bulkUpload]);

  return (
    <Button variant="ghost" size="sm" onClick={handleSave} title="Save (Ctrl+S)">
      <Save className="h-4 w-4" />
    </Button>
  );
};
