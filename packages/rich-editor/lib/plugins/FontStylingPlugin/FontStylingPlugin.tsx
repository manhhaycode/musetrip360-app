import { $patchStyleText } from '@lexical/selection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@musetrip360/ui-core/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { $getSelection, $isRangeSelection } from 'lexical';
import { ChevronDown, Type, Hash } from 'lucide-react';
import { useCallback } from 'react';
import { useSelectionState } from '@/hooks';

export interface FontStylingConfig {
  showFontSize?: boolean;
  showFontFamily?: boolean;
  showFontWeight?: boolean;
}

interface FontStylingPluginProps {
  config?: FontStylingConfig;
}

const fontSizes = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
  { label: '48px', value: '48px' },
];

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

  const applyFontSize = useCallback(
    (size: string) => {
      applyInlineStyle('font-size', size);
    },
    [applyInlineStyle]
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

  return (
    <div className="flex items-center gap-1 mx-2">
      {/* Font Size Dropdown */}
      {(config?.showFontSize ?? true) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2 min-w-[70px] justify-start">
              <Hash className="h-3 w-3" />
              <span className="text-sm">{selectionState.fontSize}</span>
              <ChevronDown className="h-3 w-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32">
            {fontSizes.map((size) => (
              <DropdownMenuItem key={size.value} onClick={() => applyFontSize(size.value)} className="gap-3">
                <span style={{ fontSize: size.value }}>{size.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Font Family Dropdown */}
      {(config?.showFontFamily ?? true) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2 min-w-[80px] justify-start">
              <Type className="h-3 w-3" />
              <span className="text-sm">
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
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Font Weight Dropdown */}
      {(config?.showFontWeight ?? true) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2 min-w-[85px] justify-start">
              <span className="text-sm font-bold">W</span>
              <span className="text-sm">
                {fontWeights.find((w) => w.value === selectionState.fontWeight)?.label || 'Normal'}
              </span>
              <ChevronDown className="h-3 w-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            {fontWeights.map((weight) => (
              <DropdownMenuItem key={weight.value} onClick={() => applyFontWeight(weight.value)} className="gap-3">
                <span style={{ fontWeight: weight.value }}>{weight.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
