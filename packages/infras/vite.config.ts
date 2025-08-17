/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import packageJson from './package.json';

export default defineConfig({
  plugins: [
    dts({
      // Generate TypeScript declarations
      insertTypesEntry: true,
      exclude: ['**/*.test.*', '**/*.spec.*'],
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MuseTrip360Infras',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [...new Set([...Object.keys(packageJson.dependencies)])].map((dep) => new RegExp(`^${dep}`)),
    },
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: true,
  },

  esbuild: {
    // Keep function names for better debugging
    keepNames: true,
    // Target modern environments for smaller output
    target: 'es2022',
  },

  // Test configuration
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.test.*', '**/*.spec.*'],
    },
  },
});
