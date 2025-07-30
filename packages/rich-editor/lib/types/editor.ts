import type { EditorConfig, LexicalEditor } from 'lexical';
import type { ReactNode } from 'react';
import type { ToolbarConfig } from './plugins';

export interface RichEditorProps {
  config?: Partial<EditorConfig>;
  placeholder?: string;
  value?: string;
  onChange?: (editorState: string) => void;
  onSave?: (content: string) => void;
  onError?: (error: Error) => void;
  readOnly?: boolean;
  theme?: string;
  className?: string;
  children?: ReactNode;
  showToolbar?: boolean;
  toolbarConfig?: ToolbarConfig;
  toolbarClassName?: string;
}

export interface EditorRef {
  editor: LexicalEditor;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getContent: () => string;
  setContent: (content: string) => void;
}
