import type { ToolbarConfig } from '../../types/plugins';

// Preset cơ bản cho editor đơn giản
export const basicToolbarConfig: ToolbarConfig = {
  showBold: true,
  showItalic: true,
  showUnderline: true,
  showStrikethrough: false,
  showCode: false,
  showLink: true,
  showList: true,
  showQuote: false,
  showHeadings: false,
  showAlignment: false,
  showColor: false,
  showBackground: false,
};

// Preset đầy đủ cho content creator
export const fullToolbarConfig: ToolbarConfig = {
  showBold: true,
  showItalic: true,
  showUnderline: true,
  showStrikethrough: true,
  showCode: true,
  showLink: true,
  showList: true,
  showQuote: true,
  showHeadings: true,
  showAlignment: true,
  showColor: false,
  showBackground: false,
};

// Preset cho museum content
export const museumToolbarConfig: ToolbarConfig = {
  showBold: true,
  showItalic: true,
  showUnderline: false,
  showStrikethrough: false,
  showCode: false,
  showLink: true,
  showList: true,
  showQuote: true,
  showHeadings: true,
  showAlignment: false,
  showColor: false,
  showBackground: false,
};
