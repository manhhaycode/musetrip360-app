import { useSelectionState } from '@/hooks';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { Button } from '@musetrip360/ui-core/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { $getSelection, $isRangeSelection } from 'lexical';
import { Check, ChevronDown } from 'lucide-react';
import { useCallback } from 'react';

export interface ColorConfig {
  showTextColor?: boolean;
  showBackgroundColor?: boolean;
}

interface ColorPluginProps {
  config?: ColorConfig;
}

const textColors = [
  { label: 'Black', value: '#000000' },
  { label: 'Dark Gray', value: '#374151' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Yellow', value: '#D97706' },
  { label: 'Green', value: '#16A34A' },
  { label: 'Blue', value: '#2563EB' },
  { label: 'Indigo', value: '#4F46E5' },
  { label: 'Purple', value: '#9333EA' },
  { label: 'Pink', value: '#DB2777' },
];

const backgroundColors = [
  { label: 'None Light', value: 'transparent' },
  { label: 'Gray Light', value: '#F3F4F6' },
  { label: 'Red Light', value: '#FEE2E2' },
  { label: 'Orange Light', value: '#FED7AA' },
  { label: 'Yellow Light', value: '#FEF3C7' },
  { label: 'Green Light', value: '#D1FAE5' },
  { label: 'Blue Light', value: '#DBEAFE' },
  { label: 'Indigo Light', value: '#E0E7FF' },
  { label: 'Purple Light', value: '#E9D5FF' },
  { label: 'Pink Light', value: '#FCE7F3' },
];

export const ColorPlugin: React.FC<ColorPluginProps> = ({ config }) => {
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

  const applyTextColor = useCallback(
    (color: string) => {
      applyInlineStyle('color', color);
    },
    [applyInlineStyle]
  );

  const applyBackgroundColor = useCallback(
    (color: string) => {
      applyInlineStyle('background-color', color);
    },
    [applyInlineStyle]
  );

  const getCurrentTextColorInfo = () => {
    const currentColor = selectionState.textColor;
    const colorInfo = textColors.find((c) => c.value === currentColor);
    return {
      value: currentColor || '#000000',
      label: colorInfo?.label || 'Custom',
    };
  };

  const getCurrentBackgroundColorInfo = () => {
    const currentColor = selectionState.backgroundColor;
    const colorInfo = backgroundColors.find((c) => c.value === currentColor);
    return {
      value: currentColor || 'transparent',
      label: colorInfo?.label || (currentColor ? 'Custom' : 'None'),
    };
  };

  const currentTextColor = getCurrentTextColorInfo();
  const currentBackgroundColor = getCurrentBackgroundColorInfo();

  return (
    <>
      {/* Text Color Dropdown */}
      {(config?.showTextColor ?? true) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2 min-w-[70px] justify-start">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded border border-gray-300"
                  style={{ backgroundColor: currentTextColor.value }}
                />
                <span className="text-sm">{currentTextColor.label}</span>
              </div>
              <ChevronDown className="h-3 w-3 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {textColors.map((color) => (
              <DropdownMenuItem
                key={color.value}
                onClick={() => applyTextColor(color.value)}
                className="gap-3 relative"
              >
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: color.value }} />
                <span style={{ color: color.value }}>{color.label}</span>
                {color.value === currentTextColor.value && <Check className="h-3 w-3 ml-auto text-blue-600" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Background Color Dropdown */}
      {(config?.showBackgroundColor ?? true) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              rightIcon={<ChevronDown className="h-3 w-3" />}
              variant="ghost"
              size="sm"
              className="h-8 px-3 gap-2 w-30 justify-start"
            >
              <div style={{ flex: '1 0 0' }} className="flex items-center gap-2 min-w-0">
                <div
                  className="w-3 h-3 flex-shrink-0 rounded border border-gray-300"
                  style={{
                    backgroundColor:
                      currentBackgroundColor.value === 'transparent' ? '#fff' : currentBackgroundColor.value,
                    backgroundImage:
                      currentBackgroundColor.value === 'transparent'
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                    backgroundSize: currentBackgroundColor.value === 'transparent' ? '6px 6px' : 'auto',
                    backgroundPosition:
                      currentBackgroundColor.value === 'transparent' ? '0 0, 0 3px, 3px -3px, -3px 0px' : 'auto',
                  }}
                />
                <span className="text-sm truncate">{currentBackgroundColor.label}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {backgroundColors.map((color) => (
              <DropdownMenuItem
                key={color.value}
                onClick={() => applyBackgroundColor(color.value)}
                className="gap-3 relative"
              >
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{
                    backgroundColor: color.value === 'transparent' ? '#fff' : color.value,
                    backgroundImage:
                      color.value === 'transparent'
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                    backgroundSize: color.value === 'transparent' ? '8px 8px' : 'auto',
                    backgroundPosition: color.value === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto',
                  }}
                />
                <span>{color.label}</span>
                {color.value === currentBackgroundColor.value && <Check className="h-3 w-3 ml-auto text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
