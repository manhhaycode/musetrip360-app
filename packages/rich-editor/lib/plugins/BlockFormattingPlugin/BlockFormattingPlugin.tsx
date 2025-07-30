import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { Button } from '@musetrip360/ui-core/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { ChevronDown, Type, List, ListOrdered, Quote, Check } from 'lucide-react';
import { useCallback } from 'react';
import { useSelectionState } from '@/hooks';

export interface BlockFormattingConfig {
  showHeadings?: boolean;
  showList?: boolean;
  showQuote?: boolean;
}

interface BlockFormattingPluginProps {
  config?: BlockFormattingConfig;
}

type BlockFormat = 'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote';

export const BlockFormattingPlugin: React.FC<BlockFormattingPluginProps> = ({ config }) => {
  const [editor] = useLexicalComposerContext();
  const selectionState = useSelectionState();

  const formatBlockType = useCallback(
    (format: BlockFormat) => {
      if (format === 'ul') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else if (format === 'ol') {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (format === 'quote') {
              $setBlocksType(selection, () => $createQuoteNode());
            } else if (format === 'h1' || format === 'h2' || format === 'h3') {
              $setBlocksType(selection, () => $createHeadingNode(format));
            } else {
              // Convert to paragraph
              $setBlocksType(selection, () => $createParagraphNode());
            }
          }
        });
      }
      requestAnimationFrame(() => editor.focus());
    },
    [editor]
  );

  const getBlockFormatDisplay = (format: BlockFormat) => {
    switch (format) {
      case 'h1':
        return { icon: <span className="text-xl font-bold">H1</span>, label: 'Heading 1' };
      case 'h2':
        return { icon: <span className="text-lg font-bold">H2</span>, label: 'Heading 2' };
      case 'h3':
        return { icon: <span className="text-base font-bold">H3</span>, label: 'Heading 3' };
      case 'ul':
        return { icon: <List className="h-4 w-4" />, label: 'Bullet List' };
      case 'ol':
        return { icon: <ListOrdered className="h-4 w-4" />, label: 'Numbered List' };
      case 'quote':
        return { icon: <Quote className="h-4 w-4" />, label: 'Quote' };
      default:
        return { icon: <Type className="h-4 w-4" />, label: 'Paragraph' };
    }
  };

  const currentBlockDisplay = getBlockFormatDisplay(selectionState.blockFormat);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-3 gap-2 w-30 justify-start">
            {currentBlockDisplay.icon}
            <span className="text-sm truncate">{currentBlockDisplay.label}</span>
            <ChevronDown className="h-3 w-3 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => formatBlockType('paragraph')} className="gap-3">
            <Type className="h-4 w-4" />
            <span>Paragraph</span>
          </DropdownMenuItem>

          {(config?.showHeadings ?? true) && (
            <>
              <DropdownMenuItem onClick={() => formatBlockType('h1')} className="gap-3">
                <span className="text-xl font-bold">H1</span>
                <span>Heading 1</span>
                {currentBlockDisplay.label === 'Heading 1' && <Check className="h-3 w-3 ml-auto text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => formatBlockType('h2')} className="gap-3">
                <span className="text-lg font-bold">H2</span>
                <span>Heading 2</span>
                {currentBlockDisplay.label === 'Heading 2' && <Check className="h-3 w-3 ml-auto text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => formatBlockType('h3')} className="gap-3">
                <span className="text-base font-bold">H3</span>
                <span>Heading 3</span>
                {currentBlockDisplay.label === 'Heading 3' && <Check className="h-3 w-3 ml-auto text-primary" />}
              </DropdownMenuItem>
            </>
          )}

          {(config?.showList ?? true) && (
            <>
              <DropdownMenuItem onClick={() => formatBlockType('ul')} className="gap-3">
                <List className="h-4 w-4" />
                <span>Bullet List</span>
                {currentBlockDisplay.label === 'Bullet List' && <Check className="h-3 w-3 ml-auto text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => formatBlockType('ol')} className="gap-3">
                <ListOrdered className="h-4 w-4" />
                <span>Numbered List</span>
                {currentBlockDisplay.label === 'Numbered List' && <Check className="h-3 w-3 ml-auto text-primary" />}
              </DropdownMenuItem>
            </>
          )}

          {(config?.showQuote ?? true) && (
            <DropdownMenuItem onClick={() => formatBlockType('quote')} className="gap-3">
              <Quote className="h-4 w-4" />
              <span>Quote</span>
              {currentBlockDisplay.label === 'Quote' && <Check className="h-3 w-3 ml-auto text-primary" />}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
