import { SelectionStateProvider } from '@/context';
import { ImageNode } from '@/nodes/ImageNode';
import { ImagePlugin } from '@/plugins/ImagePlugin';
import { ToolbarPlugin } from '@/plugins/ToolbarPlugin';
import { ValuePlugin } from '@/plugins/ValuePlugin';
import type { EditorRef, RichEditorProps } from '@/types/editor';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { BulkUploadProvider } from '@musetrip360/shared/contexts';
import { cn } from '@musetrip360/ui-core/utils';
import { $getRoot } from 'lexical';
import { forwardRef, useEffect, useImperativeHandle } from 'react';

const createInitialConfig = (onError?: (error: Error) => void, readOnly?: boolean) => ({
  namespace: 'MuseTrip360RichEditor',
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    ImageNode,
  ],
  onError: (error: Error) => {
    console.error('Lexical Error:', error);
    onError?.(error);
  },
  editable: !readOnly,
  theme: {
    // Use TailwindCSS classes instead of custom theme
    paragraph: 'mb-4',
    heading: {
      h1: 'text-4xl font-bold mb-4',
      h2: 'text-3xl font-bold mb-3',
      h3: 'text-2xl font-bold mb-3',
      h4: 'text-xl font-bold mb-2',
      h5: 'text-lg font-bold mb-2',
      h6: 'text-base font-bold mb-2',
    },
    list: {
      nested: {
        listitem: 'list-none',
      },
      ol: 'list-decimal list-inside mb-2',
      ul: 'list-disc list-inside mb-2',
      listitem: 'mb-1',
    },
    link: 'text-primary hover:text-primary/70 underline',
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
      code: 'bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono',
    },
    quote: 'border-l-4 border-gray-300 pl-4 italic my-4',
    code: 'bg-gray-100 rounded p-4 font-mono text-sm overflow-x-auto mb-4',
    table: 'border-collapse border border-gray-300 my-4',
    tableCell: 'border border-gray-300 px-3 py-2 text-left',
    tableCellHeader: 'border border-gray-300 px-3 py-2 text-left font-bold bg-gray-50',
    image: 'my-4 mx-auto max-w-full',
  },
});

export const RichEditor = forwardRef<EditorRef, RichEditorProps>(
  (
    {
      className,
      placeholder = 'Nhập nội dung...',
      onChange,
      onSave,
      onError,
      showToolbar = false,
      toolbarConfig,
      toolbarClassName,
      value,
      readOnly,
    },
    ref
  ) => {
    const initialConfig = createInitialConfig(onError, readOnly);
    console.log(initialConfig);

    useImperativeHandle(ref, () => ({
      editor: null as any, // Will be set in actual implementation
      focus: () => {},
      blur: () => {},
      clear: () => {},
      getContent: () => '',
      setContent: () => {},
    }));

    return (
      <div className={cn('flex flex-1 flex-col', className)}>
        <BulkUploadProvider>
          <LexicalComposer initialConfig={initialConfig}>
            <SelectionStateProvider>
              {showToolbar && !readOnly && (
                <ToolbarPlugin
                  config={toolbarConfig}
                  className={cn(toolbarClassName, 'border rounded-t-lg')}
                  onSave={onSave}
                />
              )}
              <div style={{ flex: '1 0 0' }} className="relative py-4 border rounded-b-lg min-h-0">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="px-4 outline-none resize-none h-full w-full overflow-y-auto" />
                  }
                  placeholder={
                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">{placeholder}</div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
              </div>
            </SelectionStateProvider>
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ValuePlugin value={value} />
            <ListPlugin />
            <LinkPlugin />
            <CheckListPlugin />
            <TablePlugin />
            <TabIndentationPlugin />
            <ImagePlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            {onChange && (
              <OnChangePlugin
                onChange={(editorState, editor) => {
                  const jsonString = JSON.stringify(editorState.toJSON());
                  const parsedEditorState = editor.parseEditorState(jsonString);
                  const editorStateTextString = parsedEditorState.read(() => $getRoot().getTextContent()).trim();
                  onChange(editorStateTextString);
                }}
              />
            )}
          </LexicalComposer>
        </BulkUploadProvider>
      </div>
    );
  }
);

RichEditor.displayName = 'RichEditor';
