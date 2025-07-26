/**
 * Check if element is an editor container
 */
export const isEditorContainer = (element: Element): boolean => {
  return element.hasAttribute('contenteditable') || element.closest('[contenteditable]') !== null;
};

/**
 * Get current selection range
 */
export const getCurrentSelection = (): Range | null => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    return selection.getRangeAt(0);
  }
  return null;
};

/**
 * Check if there is text selected
 */
export const hasTextSelection = (): boolean => {
  const selection = window.getSelection();
  return selection ? !selection.isCollapsed : false;
};

/**
 * Get selected text
 */
export const getSelectedText = (): string => {
  const selection = window.getSelection();
  return selection ? selection.toString() : '';
};

/**
 * Focus on editor element
 */
export const focusEditor = (editorElement: HTMLElement): void => {
  const contentEditable = editorElement.querySelector('[contenteditable="true"]');
  if (contentEditable instanceof HTMLElement) {
    contentEditable.focus();
  }
};
