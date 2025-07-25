import type { ToolbarConfig } from '@/types/plugins';
import { cn } from '@musetrip360/ui-core/utils';
import { SelectionStateProvider } from '@/context';
import { TextFormattingPlugin } from '../TextFormattingPlugin';
import { BlockFormattingPlugin } from '../BlockFormattingPlugin';
import { InsertPlugin } from '../InsertPlugin';
import { AlignmentPlugin } from '../AlignmentPlugin';
import { FontStylingPlugin } from '../FontStylingPlugin';
import { ColorPlugin } from '../ColorPlugin';

interface ToolbarProps {
  config?: ToolbarConfig;
  className?: string;
}

export const ToolbarPlugin: React.FC<ToolbarProps> = ({ config, className }) => {
  return (
    <SelectionStateProvider>
      <div className={cn('flex items-center p-2 border-b', className)}>
        {/* Text Formatting Group */}
        <TextFormattingPlugin
          config={{
            showBold: config?.showBold,
            showItalic: config?.showItalic,
            showUnderline: config?.showUnderline,
            showStrikethrough: config?.showStrikethrough,
          }}
        />

        {/* Block Format Group */}
        <BlockFormattingPlugin
          config={{
            showHeadings: config?.showHeadings,
            showList: config?.showList,
            showQuote: config?.showQuote,
          }}
        />

        <div className="w-px h-6 bg-gray-300" />

        {/* Insert Group */}
        <InsertPlugin
          config={{
            showLink: config?.showLink,
            showImage: config?.showImage,
            showTable: config?.showTable,
          }}
        />

        <div className="w-px h-6 bg-gray-300" />

        {/* Alignment Group */}
        <AlignmentPlugin
          config={{
            showAlignment: config?.showAlignment,
          }}
        />

        <div className="w-px h-6 bg-gray-300" />

        {/* Font Styling Group */}
        <FontStylingPlugin
          config={{
            showFontSize: config?.showFontSize,
            showFontFamily: config?.showFontFamily,
            showFontWeight: config?.showFontWeight,
          }}
        />

        <div className="w-px h-6 bg-gray-300" />

        {/* Color Group */}
        <ColorPlugin
          config={{
            showTextColor: config?.showColor,
            showBackgroundColor: config?.showBackground,
          }}
        />
      </div>
    </SelectionStateProvider>
  );
};
