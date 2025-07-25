import { $createLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { Button } from '@musetrip360/ui-core/button';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import { Image, Link, Table } from 'lucide-react';
import { useCallback } from 'react';

export interface InsertConfig {
  showLink?: boolean;
  showImage?: boolean;
  showTable?: boolean;
}

interface InsertPluginProps {
  config?: InsertConfig;
}

export const InsertPlugin: React.FC<InsertPluginProps> = ({ config }) => {
  const [editor] = useLexicalComposerContext();

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (!url) return;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const linkText = selection.getTextContent() || 'Link';
        const linkNode = $createLinkNode(url);
        linkNode.append($createTextNode(linkText));
        selection.insertNodes([linkNode]);
      }
    });
  }, [editor]);

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (!url) return;

    // This is a basic implementation - you might want to create a custom image node
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // For now, insert as text - you'll need a proper image node later
        const imageText = $createTextNode(`[Image: ${url}]`);
        selection.insertNodes([imageText]);
      }
    });
  }, [editor]);

  const insertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');

    if (!rows || !cols) return;

    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: cols,
      rows: rows,
      includeHeaders: true,
    });
  }, [editor]);

  return (
    <div className="flex items-center gap-0.5 mx-2">
      {(config?.showImage ?? true) && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertImage} title="Insert Image">
          <Image className="h-4 w-4" />
        </Button>
      )}

      {(config?.showLink ?? true) && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertLink} title="Insert Link">
          <Link className="h-4 w-4" />
        </Button>
      )}

      {(config?.showTable ?? true) && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertTable} title="Insert Table">
          <Table className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
