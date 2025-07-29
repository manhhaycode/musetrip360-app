import type { ToolbarConfig } from '@/types/plugins';
import { cn } from '@musetrip360/ui-core/utils';
import { AlignmentPlugin } from '../AlignmentPlugin';
import { BlockFormattingPlugin } from '../BlockFormattingPlugin';
import { ColorPlugin } from '../ColorPlugin';
import { FontStylingPlugin } from '../FontStylingPlugin';
import { HistoryPlugin } from '../HistoryPlugin';
import { InsertPlugin } from '../InsertPlugin';
import { SavePlugin } from '../SavePlugin';
import { TextFormattingPlugin } from '../TextFormattingPlugin';

interface ToolbarProps {
  config?: ToolbarConfig;
  className?: string;
  onSave?: (content: string) => void;
}

export const ToolbarPlugin: React.FC<ToolbarProps> = ({ config, className, onSave }) => {
  return (
    <div className={cn('flex flex-wrap gap-y-3 gap-x-1 items-center p-2 border-b', className)}>
      {/* History Group */}
      <HistoryPlugin
        config={{
          showUndo: config?.showUndo,
          showRedo: config?.showRedo,
        }}
      />

      {(config?.showSave ?? true) && (
        <>
          <div className="w-px h-6 bg-gray-300" />
          <SavePlugin config={{ onSave }} />
        </>
      )}

      <div className="w-px h-6 bg-gray-300" />

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
  );
};
