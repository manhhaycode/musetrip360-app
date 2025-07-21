import type { LexicalEditor } from 'lexical';

export interface ToolbarConfig {
  showBold?: boolean;
  showItalic?: boolean;
  showUnderline?: boolean;
  showStrikethrough?: boolean;
  showCode?: boolean;
  showLink?: boolean;
  showList?: boolean;
  showQuote?: boolean;
  showHeadings?: boolean;
  showAlignment?: boolean;
  showColor?: boolean;
  showBackground?: boolean;
  customButtons?: ToolbarButton[];
}

export interface ToolbarButton {
  id: string;
  label: string;
  icon?: string;
  onClick: (editor: LexicalEditor) => void;
  isActive?: (editor: LexicalEditor) => boolean;
  isDisabled?: (editor: LexicalEditor) => boolean;
}

export interface CollaborationConfig {
  userId: string;
  userName: string;
  userColor?: string;
  roomId: string;
  websocketUrl?: string;
}

export type FormatType = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'subscript' | 'superscript';
