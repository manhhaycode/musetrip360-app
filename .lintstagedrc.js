module.exports = {
  // Run Prettier on all supported files
  '**/*.{js,jsx,ts,tsx,json,md,mdx,css,html,yml,yaml}': ['prettier --check'],
  
  // Run ESLint on JavaScript and TypeScript files
  '**/*.{js,jsx,ts,tsx}': ['eslint --max-warnings=0'],
};
