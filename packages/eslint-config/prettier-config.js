/**
 * @fileoverview Utility to load Prettier configuration
 * @author MuseTrip360
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load Prettier configuration from the root .prettierrc file
 * @returns {Object} Prettier configuration object
 */
export function loadPrettierConfig() {
  try {
    // Resolve the path to the .prettierrc file in the project root
    const prettierConfigPath = resolve(__dirname, '../../.prettierrc');
    
    // Read and parse the .prettierrc file
    const prettierConfig = JSON.parse(readFileSync(prettierConfigPath, 'utf8'));
    
    return prettierConfig;
  } catch (error) {
    console.error('Error loading Prettier configuration:', error);
    
    // Return default Prettier configuration if the file cannot be loaded
    return {
      arrowParens: 'always',
      bracketSameLine: false,
      bracketSpacing: true,
      embeddedLanguageFormatting: 'auto',
      htmlWhitespaceSensitivity: 'css',
      insertPragma: false,
      jsxSingleQuote: false,
      printWidth: 180,
      proseWrap: 'preserve',
      quoteProps: 'as-needed',
      requirePragma: false,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
      useTabs: false,
      vueIndentScriptAndStyle: false
    };
  }
}

export default loadPrettierConfig();
