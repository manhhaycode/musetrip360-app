import { $isListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  RootNode,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface SelectionState {
  // Text formatting states
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;

  // Block formatting state
  blockFormat: 'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote';

  // Font styling states
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
  canUndo?: boolean;
  canRedo?: boolean;
}

const createDefaultSelectionState = (): SelectionState => ({
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  blockFormat: 'paragraph',
  fontSize: '16px',
  fontFamily: '',
  fontWeight: '400',
  textColor: '#000000',
  backgroundColor: 'transparent',
});

const SelectionStateContext = createContext<SelectionState | null>(null);

interface SelectionStateProviderProps {
  children: React.ReactNode;
}

export const SelectionStateProvider: React.FC<SelectionStateProviderProps> = ({ children }) => {
  const [editor] = useLexicalComposerContext();
  const [selectionState, setSelectionState] = useState<SelectionState>(() => createDefaultSelectionState());

  const updateSelectionState = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        setSelectionState((prev) => ({
          ...prev,
          hasSelection: false,
        }));
        return;
      }

      // Get text formatting using Lexical's recommended API
      const isBold = selection.hasFormat('bold');
      const isItalic = selection.hasFormat('italic');
      const isUnderline = selection.hasFormat('underline');
      const isStrikethrough = selection.hasFormat('strikethrough');

      // Get block format
      let blockFormat: SelectionState['blockFormat'] = 'paragraph';
      const anchorNode = selection.anchor.getNode();
      let elementNode = anchorNode.getParent();

      if (!elementNode || elementNode.getType() === RootNode.getType()) {
        if ($isHeadingNode(anchorNode)) {
          blockFormat = anchorNode.getTag() as 'h1' | 'h2' | 'h3';
        } else if ($isQuoteNode(anchorNode)) {
          blockFormat = 'quote';
        } else if ($isListNode(anchorNode)) {
          blockFormat = anchorNode.getListType() === 'bullet' ? 'ul' : 'ol';
        }
      } else {
        // Traverse up to find block element
        while (elementNode) {
          if ($isHeadingNode(elementNode)) {
            blockFormat = elementNode.getTag() as 'h1' | 'h2' | 'h3';
            break;
          }
          if ($isQuoteNode(elementNode)) {
            blockFormat = 'quote';
            break;
          }
          if ($isListNode(elementNode)) {
            blockFormat = elementNode.getListType() === 'bullet' ? 'ul' : 'ol';
            break;
          }
          elementNode = elementNode.getParent();
        }
      }

      // Get font styling using Lexical's recommended API
      const fontSize = $getSelectionStyleValueForProperty(selection, 'font-size', '16px');
      const fontFamily = $getSelectionStyleValueForProperty(selection, 'font-family', '');
      const fontWeight = $getSelectionStyleValueForProperty(selection, 'font-weight', '400');
      const textColor = $getSelectionStyleValueForProperty(selection, 'color', '#000000');
      const backgroundColor = $getSelectionStyleValueForProperty(selection, 'background-color', 'transparent');

      setSelectionState((prev) => ({
        ...prev,
        isBold,
        isItalic,
        isUnderline,
        isStrikethrough,
        blockFormat,
        fontSize,
        fontFamily,
        fontWeight,
        textColor,
        backgroundColor,
      }));
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateSelectionState();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateSelectionState]);

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateSelectionState();
      });
    });

    return () => {
      unregister();
    };
  }, [editor, updateSelectionState]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setSelectionState((prev) => ({ ...prev, canUndo: payload }));
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setSelectionState((prev) => ({ ...prev, canRedo: payload }));
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor]);

  return <SelectionStateContext.Provider value={selectionState}>{children}</SelectionStateContext.Provider>;
};

export const useSelectionStateContext = (): SelectionState => {
  const context = useContext(SelectionStateContext);
  if (!context) {
    throw new Error('useSelectionStateContext must be used within a SelectionStateProvider');
  }
  return context;
};
