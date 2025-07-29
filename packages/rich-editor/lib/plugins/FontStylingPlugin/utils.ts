import { $patchStyleText } from '@lexical/selection';
import { $getSelection, LexicalEditor } from 'lexical';

export enum UpdateFontSizeType {
  increment = 1,
  decrement,
}

export const DEFAULT_FONT_SIZE = 14; // Default font size in pixels
export const MIN_ALLOWED_FONT_SIZE = 8; // Minimum allowed font size in pixels
export const MAX_ALLOWED_FONT_SIZE = 72; // Maximum allowed font size in pixels

/**
 * Calculates the new font size based on the update type.
 * @param currentFontSize - The current font size
 * @param updateType - The type of change, either increment or decrement
 * @returns the next font size
 */
export const calculateNextFontSize = (currentFontSize: number, updateType: UpdateFontSizeType | null) => {
  if (!updateType) {
    return currentFontSize;
  }

  let updatedFontSize: number = currentFontSize;
  switch (updateType) {
    case UpdateFontSizeType.decrement:
      switch (true) {
        case currentFontSize > MAX_ALLOWED_FONT_SIZE:
          updatedFontSize = MAX_ALLOWED_FONT_SIZE;
          break;
        case currentFontSize >= 48:
          updatedFontSize -= 12;
          break;
        case currentFontSize >= 24:
          updatedFontSize -= 4;
          break;
        case currentFontSize >= 14:
          updatedFontSize -= 2;
          break;
        case currentFontSize >= 9:
          updatedFontSize -= 1;
          break;
        default:
          updatedFontSize = MIN_ALLOWED_FONT_SIZE;
          break;
      }
      break;

    case UpdateFontSizeType.increment:
      switch (true) {
        case currentFontSize < MIN_ALLOWED_FONT_SIZE:
          updatedFontSize = MIN_ALLOWED_FONT_SIZE;
          break;
        case currentFontSize < 12:
          updatedFontSize += 1;
          break;
        case currentFontSize < 20:
          updatedFontSize += 2;
          break;
        case currentFontSize < 36:
          updatedFontSize += 4;
          break;
        case currentFontSize <= 60:
          updatedFontSize += 12;
          break;
        default:
          updatedFontSize = MAX_ALLOWED_FONT_SIZE;
          break;
      }
      break;

    default:
      break;
  }
  return updatedFontSize;
};

/**
 * Patches the selection with the updated font size.
 */
export const updateFontSizeInSelection = (
  editor: LexicalEditor,
  newFontSize: string | null,
  updateType: UpdateFontSizeType | null
) => {
  const getNextFontSize = (prevFontSize: string | null): string => {
    if (!prevFontSize) {
      prevFontSize = `${DEFAULT_FONT_SIZE}px`;
    }
    prevFontSize = prevFontSize.slice(0, -2);
    const nextFontSize = calculateNextFontSize(Number(prevFontSize), updateType);
    return `${nextFontSize}px`;
  };

  editor.update(() => {
    if (editor.isEditable()) {
      const selection = $getSelection();
      if (selection !== null) {
        $patchStyleText(selection, {
          'font-size': newFontSize || getNextFontSize,
        });
      }
    }
  });
};
