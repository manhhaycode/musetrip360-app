/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { glob } from 'glob';
import packageJson from './package.json';
import tsconfigPaths from 'vite-tsconfig-paths';

// Generate entry points for all components
const componentEntries = Object.fromEntries(
  glob.sync('lib/components/ui/*/index.ts').map((file) => {
    const name = file.match(/lib\/components\/ui\/(.+)\/index\.ts$/)?.[1];
    return [name!, resolve(__dirname, file)];
  })
);

export default defineConfig({
  plugins: [
    react({
      // Optimize for library builds
      jsxImportSource: 'react',
    }),
    tailwindcss(),
    tsconfigPaths({ ignoreConfigErrors: true }),
    dts({
      // Generate TypeScript declarations
      insertTypesEntry: true,
      include: ['lib/**/*.ts', 'lib/**/*.tsx'],
      exclude: ['**/*.test.*', '**/*.spec.*', '**/*.stories.*'],
      outDir: 'dist',
      copyDtsFiles: false,
      compilerOptions: {
        preserveSymlinks: false,
        skipLibCheck: true,
      },
    }),
  ],

  // Add path alias resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './lib'),
    },
  },

  build: {
    lib: {
      entry: {
        // Main entry point
        index: resolve(__dirname, 'lib/index.ts'),
        // Utils entry
        utils: resolve(__dirname, 'lib/libs/utils.ts'),
        // Individual component entries for better tree-shaking
        ...componentEntries,
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [
        ...new Set([...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)]),
      ].map((dep) => new RegExp(`^${dep}`)),
      output: {
        // Preserve module structure for better tree-shaking
        preserveModules: true,
        preserveModulesRoot: 'lib',
        // Clean file names that map to original structure
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'index') {
            return '[format]/index.js';
          }
          if (chunkInfo.name === 'utils') {
            return '[format]/utils.js';
          }
          // Component entries
          if (componentEntries[chunkInfo.name]) {
            return `[format]/components/${chunkInfo.name}.js`;
          }
          return '[format]/[name].js';
        },
        chunkFileNames: '[format]/chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css';
          }
          return 'assets/[name][extname]';
        },
        // Provide global variables for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    target: 'es2022',
    minify: false,
    sourcemap: true,
    // Emit CSS as separate files
    cssCodeSplit: false,
    // Ensure CSS is emitted
    emptyOutDir: true,
    // Optimize for library size
    reportCompressedSize: false,
  },

  esbuild: {
    // Keep function names for better debugging
    keepNames: true,
    // Target modern environments for smaller output
    target: 'es2022',
  },

  // Optimize dependencies for development
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },

  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.test.*', '**/*.spec.*'],
    },
  },
});
