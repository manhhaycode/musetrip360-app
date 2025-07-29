import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot } from 'lexical';
import { useEffect } from 'react';

interface ValuePluginProps {
  value?: string;
}

export const ValuePlugin: React.FC<ValuePluginProps> = ({ value }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value === undefined) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      if (value.trim()) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        root.append(...nodes);
      }
    });
  }, [editor, value]);

  return null;
};
