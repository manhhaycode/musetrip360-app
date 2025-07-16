/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import packageJson from './package.json';
import tsconfigPaths from 'vite-tsconfig-paths';

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
      include: ['lib/**/*'],
      exclude: ['lib/**/*.test.*', 'lib/**/*.spec.*'],
    }),
  ],

  build: {
    lib: {
      entry: {
        index: resolve(__dirname, './lib/index.ts'),
        // domain: resolve(__dirname, './lib/domain/index.ts'),
        api: resolve(__dirname, './lib/api/index.ts'),
        types: resolve(__dirname, './lib/types/index.ts'),
        ui: resolve(__dirname, './lib/ui/index.ts'),
        state: resolve(__dirname, './lib/state/index.ts'),
        validation: resolve(__dirname, './lib/validation/index.ts'),
      },
      name: 'AuthManagement',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'mjs' : 'js';
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [
        ...new Set([...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)]),
      ].map((dep) => new RegExp(`^${dep}`)),

      output: {
        // Provide global variables for externalized deps in UMD builds
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        // Preserve module structure for better tree-shaking
        preserveModules: false,
        // Clean chunk names
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css';
          }
          return assetInfo.name || 'asset';
        },
      },
    },
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
    // Emit CSS as separate files
    cssCodeSplit: false,
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

  resolve: {
    alias: {
      '@/lib': resolve(__dirname, './lib'),
    },
  },
});
