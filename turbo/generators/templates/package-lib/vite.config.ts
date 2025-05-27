import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// @ts-ignore – Plugin installed in generated project
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Optimize for library builds
      jsxImportSource: 'react',
    }),
    dts({
      // Generate TypeScript declarations
      insertTypesEntry: true,
      exclude: ['**/*.test.*', '**/*.spec.*', '**/test/**', '**/tests/**'],
      rollupTypes: true,
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '{{pascalCase name}}',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        // Add other peer dependencies here
      ],
      output: {
        // Provide global variables for externalized deps in UMD builds
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        // Preserve module structure for better tree-shaking
        preserveModules: false,
        // Clean chunk names
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
      },
    },
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: true,
    // Emit CSS as separate files
    cssCodeSplit: true,
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
