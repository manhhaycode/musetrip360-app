import { $patchStyleText } from '@lexical/selection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { $getSelection, $isRangeSelection } from 'lexical';
import { ChevronDown, Type, Plus, Minus, Check } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { useSelectionState } from '@/hooks';
import {
  updateFontSizeInSelection,
  UpdateFontSizeType,
  MIN_ALLOWED_FONT_SIZE,
  MAX_ALLOWED_FONT_SIZE,
  calculateNextFontSize,
} from './utils';

export interface FontStylingConfig {
  showFontSize?: boolean;
  showFontFamily?: boolean;
  showFontWeight?: boolean;
}

interface FontStylingPluginProps {
  config?: FontStylingConfig;
}

const fontFamilies = [
  { label: 'Default', value: '' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
];

const fontWeights = [
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
];

export const FontStylingPlugin: React.FC<FontStylingPluginProps> = ({ config }) => {
  const [editor] = useLexicalComposerContext();
  const selectionState = useSelectionState();
  const [fontSizeInput, setFontSizeInput] = useState('14');

  useEffect(() => {
    const numericSize = selectionState.fontSize.replace('px', '');
    setFontSizeInput(numericSize);
  }, [selectionState.fontSize]);

  const applyInlineStyle = useCallback(
    (property: string, value: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { [property]: value });
        }
      });
      requestAnimationFrame(() => editor.focus()); // Ensure focus after applying styles
    },
    [editor]
  );

  const applyFontFamily = useCallback(
    (family: string) => {
      applyInlineStyle('font-family', family);
    },
    [applyInlineStyle]
  );

  const applyFontWeight = useCallback(
    (weight: string) => {
      applyInlineStyle('font-weight', weight);
    },
    [applyInlineStyle]
  );

  const updateFontSizeByInputValue = useCallback(
    (inputValueNumber: number) => {
      let updatedFontSize = inputValueNumber;
      if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
        updatedFontSize = MAX_ALLOWED_FONT_SIZE;
      } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
        updatedFontSize = MIN_ALLOWED_FONT_SIZE;
      }
      setFontSizeInput(String(updatedFontSize));
      updateFontSizeInSelection(editor, String(updatedFontSize) + 'px', null);
    },
    [editor]
  );

  const handleFontSizeIncrement = useCallback(() => {
    const newSize = calculateNextFontSize(Number(fontSizeInput), UpdateFontSizeType.increment);
    updateFontSizeByInputValue(newSize);
  }, [updateFontSizeByInputValue, fontSizeInput]);

  const handleFontSizeDecrement = useCallback(() => {
    const newSize = calculateNextFontSize(Number(fontSizeInput), UpdateFontSizeType.decrement);
    updateFontSizeByInputValue(newSize);
  }, [updateFontSizeByInputValue, fontSizeInput]);

  const handleInputBlur = useCallback(() => {
    if (fontSizeInput) {
      updateFontSizeByInputValue(Number(fontSizeInput));
    }
  }, [updateFontSizeByInputValue, fontSizeInput]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const inputValueNumber = Number(fontSizeInput);

      if (e.key === 'Tab') {
        return;
      }
      if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
        e.preventDefault();
        setFontSizeInput('');
        return;
      }
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();

        updateFontSizeByInputValue(inputValueNumber);
      }
    },
    [fontSizeInput, updateFontSizeByInputValue]
  );

  return (
    <>
      {/* Font Size Input with Plus/Minus */}
      {(config?.showFontSize ?? true) && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleFontSizeDecrement}>
            <Minus className="h-3 w-3" />
          </Button>

          <Input
            type="number"
            value={fontSizeInput}
            onChange={(e) => setFontSizeInput(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="h-8 w-12 px-1 text-center text-sm"
            min={MIN_ALLOWED_FONT_SIZE}
            max={MAX_ALLOWED_FONT_SIZE}
          />

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleFontSizeIncrement}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Font Family Dropdown */}
      {(config?.showFontFamily ?? true) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2 w-35 justify-start">
              <Type className="h-3 w-3" />
              <span className="text-sm truncate">
                {selectionState.fontFamily
                  ? fontFamilies.find((f) => f.value === selectionState.fontFamily)?.label || 'Custom'
                  : 'Default'}
              </span>
              <ChevronDown className="h-3 w-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {fontFamilies.map((font) => (
              <DropdownMenuItem
                key={font.value || 'default'}
                onClick={() => applyFontFamily(font.value)}
                className="gap-3"
              >
                <span style={{ fontFamily: font.value || 'inherit' }}>{font.label}</span>
                {font.value === selectionState.fontFamily && <Check className="h-3 w-3 ml-auto text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Font Weight Dropdown */}
      {(config?.showFontWeight ?? true) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2 w-30 justify-start">
              <span className="text-sm font-bold">W</span>
              <span className="text-sm truncate">
                {fontWeights.find((w) => w.value === selectionState.fontWeight)?.label || 'Normal'}
              </span>
              <ChevronDown className="h-3 w-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            {fontWeights.map((weight) => (
              <DropdownMenuItem key={weight.value} onClick={() => applyFontWeight(weight.value)} className="gap-3">
                <span style={{ fontWeight: weight.value }}>{weight.label}</span>
                {weight.value === selectionState.fontWeight && <Check className="h-3 w-3 ml-auto text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
