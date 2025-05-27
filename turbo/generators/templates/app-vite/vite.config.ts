// @ts-ignore – Vite types will be available in the generated project
import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite';
// @ts-ignore – Plugin installed in generated project
import react from '@vitejs/plugin-react-swc';
// @ts-ignore – Plugin installed in generated project
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';
// @ts-ignore – Plugin installed in generated project
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }: { mode: 'development' | 'production' | 'test' }) => {
  // Load environment variables based on the current mode.
  const env = loadEnv(mode, process.cwd(), '');

  // Enable bundle visualizer when ANALYZE=true
  const isAnalyze = env.ANALYZE === 'true';

  return {
    plugins: [
      react({
        // SWC options optimized for monorepo
        tsDecorators: true,
        // Enable fast refresh for better DX in monorepo
        fastRefresh: true,
      }),
      tsconfigPaths({
        // Support workspace path mapping
        projects: ['./tsconfig.json', '../../packages/*/tsconfig.json'],
      }),
      splitVendorChunkPlugin(),
      isAnalyze &&
        visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // Monorepo workspace aliases
        '@packages': path.resolve(__dirname, '../../packages'),
        '@shared': path.resolve(__dirname, '../../packages'),
      },
      // Dedupe dependencies that might be duplicated across workspace packages
      dedupe: ['react', 'react-dom', '@types/react', '@types/react-dom', 'zustand', '@tanstack/react-query'],
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    esbuild: {
      // Remove console & debugger statements in production builds for smaller bundles
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      // Keep names for better debugging in development
      keepNames: mode === 'development',
    },

    optimizeDeps: {
      // Pre-bundle workspace dependencies for faster dev server startup
      include: ['react', 'react-dom', 'react/jsx-runtime', 'zustand', '@tanstack/react-query'],
      // Exclude workspace packages from pre-bundling to enable HMR
      exclude: [
        '@packages/ui',
        '@packages/museum-core',
        '@packages/event-core',
        '@packages/ticketing-core',
        '@packages/user-management',
      ],
    },

    build: {
      target: 'es2022', // Aligned with monorepo TypeScript target for consistency
      outDir: 'dist',
      assetsInlineLimit: 4096,
      minify: 'esbuild',
      sourcemap: mode === 'development' ? true : false,
      chunkSizeWarningLimit: 1000, // Higher limit for monorepo apps
      brotliSize: false,
      rollupOptions: {
        output: {
          // Enhanced chunk splitting for monorepo
          manualChunks(id: string) {
            // Workspace packages get their own chunks
            if (id.includes('packages/')) {
              const packageName = id.split('packages/')[1].split('/')[0];
              return `workspace-${packageName}`;
            }

            // Group common vendor libraries
            if (id.includes('node_modules')) {
              const vendorName = id.split('node_modules/')[1].split('/')[0].replace('@', '');

              // Group React ecosystem
              if (['react', 'react-dom', 'react-router'].some((pkg) => vendorName.includes(pkg))) {
                return 'vendor-react';
              }

              // Group UI libraries
              if (['framer-motion', 'lucide-react', 'radix-ui'].some((pkg) => vendorName.includes(pkg))) {
                return 'vendor-ui';
              }

              // Group state management
              if (['zustand', 'tanstack'].some((pkg) => vendorName.includes(pkg))) {
                return 'vendor-state';
              }

              // Group Three.js ecosystem
              if (['three', 'fiber', 'drei'].some((pkg) => vendorName.includes(pkg))) {
                return 'vendor-3d';
              }

              // Other vendors
              return `vendor-${vendorName}`;
            }
          },
          // Consistent naming for better caching
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // External dependencies that should not be bundled (if any)
        external: [],
      },
    },

    server: {
      port: 5173,
      host: true, // Allow external connections for container/network development
      open: true,
      // Proxy API calls to backend during development
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
      // Watch workspace packages for changes
      watch: {
        ignored: ['!**/node_modules/@packages/**'],
      },
    },

    preview: {
      port: 4173,
      host: true,
    },

    // Monorepo-specific caching
    cacheDir: '../../node_modules/.vite',
  };
});
