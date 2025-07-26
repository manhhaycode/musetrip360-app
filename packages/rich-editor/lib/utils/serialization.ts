import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot } from 'lexical';
import type { LexicalEditor } from 'lexical';

/**
 * Convert editor content to HTML
 */
export const editorToHtml = (editor: LexicalEditor): Promise<string> => {
  return new Promise((resolve) => {
    editor.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      resolve(htmlString);
    });
  });
};

/**
 * Convert editor content to plain text
 */
export const editorToText = (editor: LexicalEditor): Promise<string> => {
  return new Promise((resolve) => {
    editor.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      resolve(textContent);
    });
  });
};

/**
 * Convert editor content to JSON
 */
export const editorToJson = (editor: LexicalEditor): Promise<string> => {
  return new Promise((resolve) => {
    editor.read(() => {
      const editorState = editor.getEditorState();
      const jsonString = JSON.stringify(editorState.toJSON());
      resolve(jsonString);
    });
  });
};

/**
 * Load HTML into editor
 */
export const htmlToEditor = (editor: LexicalEditor, html: string): void => {
  editor.update(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    const root = $getRoot();
    root.clear();
    root.append(...nodes);
  });
};

/**
 * Load JSON into editor with proper error handling
 */
export const jsonToEditor = (editor: LexicalEditor, jsonString: string): boolean => {
  try {
    const editorState = editor.parseEditorState(jsonString);
    editor.setEditorState(editorState);
    return true;
  } catch (error) {
    // Return false to indicate failure instead of console logging
    return !error;
  }
};
