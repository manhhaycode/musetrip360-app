export interface RichEditorConfig {
  theme?: string;
  plugins?: string[];
  readOnly?: boolean;
  placeholder?: string;
  initialValue?: string;
}

export interface EditorTheme {
  name: string;
  styles: Record<string, string>;
}

export interface CustomNode {
  type: string;
  version: number;
  serializedNode: any;
}

export * from './editor';
export * from './nodes';
export * from './plugins';
