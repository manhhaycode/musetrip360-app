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
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { cn } from '@musetrip360/ui-core';
import { forwardRef, useImperativeHandle } from 'react';
import type { EditorRef, RichEditorProps } from '../../types/editor';
import { Toolbar } from '../toolbar';

const createInitialConfig = (onError?: (error: Error) => void) => ({
  namespace: 'MuseTrip360RichEditor',
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode, AutoLinkNode, LinkNode],
  onError: (error: Error) => {
    console.error('Lexical Error:', error);
    onError?.(error);
  },
  theme: {
    // Use TailwindCSS classes instead of custom theme
    paragraph: 'mb-2',
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
    link: 'text-blue-600 hover:text-blue-800 underline',
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
      code: 'bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono',
    },
    quote: 'border-l-4 border-gray-300 pl-4 italic my-4',
    code: 'bg-gray-100 rounded p-4 font-mono text-sm overflow-x-auto mb-4',
  },
});

export const RichEditor = forwardRef<EditorRef, RichEditorProps>(
  (
    {
      className,
      placeholder = 'Nhập nội dung...',
      onChange,
      onError,
      showToolbar = false,
      toolbarConfig,
      toolbarClassName,
    },
    ref
  ) => {
    const initialConfig = createInitialConfig(onError);

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
        <LexicalComposer initialConfig={initialConfig}>
          {showToolbar && <Toolbar config={toolbarConfig} className={cn(toolbarClassName, 'border rounded-t-lg')} />}
          <div className="relative flex flex-1">
            <RichTextPlugin
              contentEditable={<ContentEditable className="p-4 border rounded-b-lg outline-none resize-none flex-1" />}
              placeholder={<div className="absolute top-4 left-4 text-gray-400 pointer-events-none">{placeholder}</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <CheckListPlugin />
          <TabIndentationPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          {onChange && (
            <OnChangePlugin
              onChange={(editorState) => {
                const jsonString = JSON.stringify(editorState.toJSON());
                onChange(jsonString);
              }}
            />
          )}
        </LexicalComposer>
      </div>
    );
  }
);

RichEditor.displayName = 'RichEditor';
