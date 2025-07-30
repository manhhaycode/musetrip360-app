/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
    }),
    tailwindcss(),
    tsconfigPaths({ ignoreConfigErrors: true }),
    dts({
      insertTypesEntry: true,
      include: ['lib/**/*.ts', 'lib/**/*.tsx'],
      exclude: ['lib/**/*.test.*', 'lib/**/*.spec.*'],
      outDir: 'dist/types',
      entryRoot: resolve(__dirname, 'lib'),
      copyDtsFiles: true,
      compilerOptions: {
        preserveSymlinks: false,
        skipLibCheck: true,
      },
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, './lib/index.ts'),
      name: 'MuseumManagement',
      formats: ['es'],
      fileName: () => `index.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        /@musetrip360\/.*/,
        /@tanstack\/.*/,
        'lucide-react',
        'sonner',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    outDir: 'dist/lib',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
  },

  esbuild: {
    keepNames: true,
    target: 'es2022',
  },

  optimizeDeps: {
    include: ['react', 'react-dom'],
  },

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
      '@': resolve(__dirname, './lib'),
    },
  },
});
