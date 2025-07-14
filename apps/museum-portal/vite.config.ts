import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

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
      exclude: [
        '@mustrip360/ui-core',
        '@mustrip360/auth-system',
        '@musetrip360/user-management',
        '@musetrip360/infras',
        '@musetrip360/query-foundation',
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
          // Dynamic chunk splitting with pattern-based grouping
          manualChunks(id: string) {
            // Workspace packages - highest priority for caching
            if (id.includes('packages/')) {
              const packageName = id.split('packages/')[1]?.split('/')[0];
              return `workspace-${packageName}`;
            }

            // Node modules
            if (id.includes('node_modules')) {
              const packageName = id.split('node_modules/')[1]?.split('/')[0];
              return `lib-${packageName}`;
            }

            // Application code stays in main chunk
            return undefined;
          },
          // Consistent naming for better caching
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // Ensure proper loading order
        external: [],
        // Force dependency order
        treeshake: {
          moduleSideEffects: (id) => {
            return id.includes('node_modules');
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
      // watch: {
      //   ignored: ['!**/node_modules/@musetrip360/**'],
      // },
    },

    preview: {
      port: 4173,
      host: true,
    },

    // Monorepo-specific caching
    cacheDir: '../../node_modules/.vite',
  };
});
