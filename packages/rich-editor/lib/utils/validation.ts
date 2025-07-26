/**
 * Check if editor content is empty
 */
export const isEditorEmpty = (jsonState: string): boolean => {
  try {
    const state = JSON.parse(jsonState);
    const root = state.root;
    if (!root || !root.children || root.children.length === 0) {
      return true;
    }

    // Check if there's only one empty paragraph
    if (root.children.length === 1) {
      const firstChild = root.children[0];
      if (firstChild.type === 'paragraph' && (!firstChild.children || firstChild.children.length === 0)) {
        return true;
      }
    }

    return false;
  } catch {
    return true;
  }
};

/**
 * Count words in text content
 */
export const countWords = (text: string): number => {
  if (!text.trim()) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

/**
 * Count characters (excluding whitespace)
 */
export const countCharacters = (text: string): number => {
  return text.replace(/\s/g, '').length;
};

/**
 * Validate minimum length
 */
export const validateMinLength = (text: string, minLength: number): boolean => {
  return text.trim().length >= minLength;
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (text: string, maxLength: number): boolean => {
  return text.length <= maxLength;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
