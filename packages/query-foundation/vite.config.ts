/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import packageJson from './package.json';

export default defineConfig({
  plugins: [
    react({
      // Optimize for library builds
      jsxImportSource: 'react',
    }),
    tailwindcss(),
    dts({
      // Generate TypeScript declarations
      insertTypesEntry: true,
      exclude: ['**/*.test.*', '**/*.spec.*'],
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MuseTrip360DesignSystem',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
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
    target: 'es2022',
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
});
