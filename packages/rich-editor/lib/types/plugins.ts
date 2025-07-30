import type { LexicalEditor } from 'lexical';

export interface ToolbarConfig {
  // Text Formatting Plugin
  showBold?: boolean;
  showItalic?: boolean;
  showUnderline?: boolean;
  showStrikethrough?: boolean;

  // Block Formatting Plugin
  showHeadings?: boolean;
  showList?: boolean;
  showQuote?: boolean;

  // Insert Plugin
  showLink?: boolean;
  showImage?: boolean;
  showTable?: boolean;

  // Alignment Plugin
  showAlignment?: boolean;

  // Font Styling Plugin
  showFontSize?: boolean;
  showFontFamily?: boolean;
  showFontWeight?: boolean;

  // Color Plugin
  showColor?: boolean;
  showBackground?: boolean;

  // History Plugin
  showUndo?: boolean;
  showRedo?: boolean;

  // Save Plugin
  showSave?: boolean;

  // Code Plugin (for future use)
  showCode?: boolean;

  // Custom functionality
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

export type FormatType = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'subscript' | 'superscript';
