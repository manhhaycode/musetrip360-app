import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@musetrip360/ui-core';
import { FORMAT_TEXT_COMMAND, type TextFormatType } from 'lexical';
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react';
import { useCallback } from 'react';
import type { ToolbarConfig } from '../../types/plugins';

interface ToolbarProps {
  config?: ToolbarConfig;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ config, className }) => {
  const [editor] = useLexicalComposerContext();

  const formatText = useCallback(
    (format: TextFormatType) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor]
  );

  const insertList = useCallback(
    (type: 'ul' | 'ol') => {
      if (type === 'ul') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    },
    [editor]
  );

  return (
    <div className={`flex flex-wrap gap-1 p-2 border-b border-gray-200 ${className || ''}`}>
      {/* Text Formatting */}
      {(config?.showBold ?? true) && (
        <Button variant="outline" size="sm" onClick={() => formatText('bold')} title="Bold (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </Button>
      )}

      {(config?.showItalic ?? true) && (
        <Button variant="outline" size="sm" onClick={() => formatText('italic')} title="Italic (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </Button>
      )}

      {(config?.showUnderline ?? true) && (
        <Button variant="outline" size="sm" onClick={() => formatText('underline')} title="Underline (Ctrl+U)">
          <Underline className="h-4 w-4" />
        </Button>
      )}

      {(config?.showStrikethrough ?? true) && (
        <Button variant="outline" size="sm" onClick={() => formatText('strikethrough')} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </Button>
      )}

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Headings */}
      {(config?.showHeadings ?? true) && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Will implement heading commands later
            }}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Will implement heading commands later
            }}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Will implement heading commands later
            }}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </>
      )}

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Lists */}
      {(config?.showList ?? true) && (
        <>
          <Button variant="outline" size="sm" onClick={() => insertList('ul')} title="Bullet List">
            <List className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={() => insertList('ol')} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </>
      )}

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Quote */}
      {(config?.showQuote ?? true) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Will implement quote command later
          }}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
