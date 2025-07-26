import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { TRANSFORMERS } from '@lexical/markdown';

export const defaultEditorConfig: InitialConfigType = {
  namespace: 'MuseTrip360RichEditor',
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode, AutoLinkNode, LinkNode],
  onError: (error: Error) => {
    throw error;
  },
  theme: {
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
    link: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
      code: 'bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono',
    },
    quote: 'border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700',
    code: 'bg-gray-100 rounded p-4 font-mono text-sm overflow-x-auto mb-4 border',
  },
};

export const markdownTransformers = TRANSFORMERS;
