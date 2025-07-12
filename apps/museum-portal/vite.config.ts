import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

// Chunk splitting configuration - easily maintainable
const CHUNK_CONFIG = {
  reactCore: ['react', 'react-dom', 'scheduler', 'react/jsx-runtime'],
  reactPatterns: [
    /^react/,
    /^@react/,
    /use-.*/,
    /^aria-/,
    /^radix-ui/,
    /^@radix-ui/,
    /framer/,
    /lucide/,
    /cmdk/,
    /sonner/,
    /vaul/,
    /embla/,
    /recharts/,
    /input-otp/,
  ],
  vendorPatterns: {
    '3d': /^(three|@react-three|@drei)/,
    state: /^(zustand|@tanstack|redux|mobx|jotai|valtio)/,
    utils: /^(lodash|ramda|date-fns|moment|dayjs|clsx|classnames|tailwind|@tailwindcss)/,
    large: /^(monaco|codemirror|chart\.js|d3|plotly)/,
    styling: /^(@emotion|styled|stitches|@stitches)/,
    test: /^(@testing-library|vitest|jest)/,
  },
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // SWC options optimized for monorepo
        tsDecorators: true,
      }),

      tailwindcss(),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
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
      include: ['react', 'react-dom', 'react/jsx-runtime'],
      // Exclude workspace packages from pre-bundling to enable HMR
      exclude: ['@mustrip360/ui-core', '@mustrip360/auth-system'],
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
          // Dynamic chunk splitting with pattern-based grouping
          manualChunks(id: string) {
            // Helper function to get package name from path
            const getPackageName = (id: string) => {
              if (!id.includes('node_modules')) return null;
              const parts = id.split('node_modules/')[1]?.split('/');
              return parts?.[0]?.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts?.[0];
            };

            // Helper function to detect React-dependent packages
            const isReactDependent = (packageName: string) => {
              return CHUNK_CONFIG.reactPatterns.some((pattern) => pattern.test(packageName || ''));
            };

            // Helper function to categorize vendor packages
            const getVendorCategory = (packageName: string) => {
              for (const [category, pattern] of Object.entries(CHUNK_CONFIG.vendorPatterns)) {
                if (pattern.test(packageName)) {
                  return category;
                }
              }
              return 'misc';
            };

            // Workspace packages - highest priority for caching
            if (id.includes('packages/')) {
              const packageName = id.split('packages/')[1]?.split('/')[0];
              return `workspace-${packageName}`;
            }

            // Node modules
            if (id.includes('node_modules')) {
              const packageName = getPackageName(id);
              if (!packageName) return 'vendor-misc';

              // React core ecosystem - must load first
              if (CHUNK_CONFIG.reactCore.includes(packageName)) {
                return 'react-core';
              }

              // React-dependent libraries - second priority
              if (isReactDependent(packageName)) {
                return 'react-deps';
              }

              // Categorize other vendor packages dynamically
              const category = getVendorCategory(packageName);
              return `vendor-${category}`;
            }

            // Application code stays in main chunk
            return undefined;
          },
          // Consistent naming for better caching
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // Ensure proper loading order
        external: [/^@musetrip360\/.*/],
        // Force dependency order
        treeshake: {
          moduleSideEffects: (id) => {
            // Ensure React side effects are preserved and loaded first
            return id.includes('react') || id.includes('scheduler');
          },
        },
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
