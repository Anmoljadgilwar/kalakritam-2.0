import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    // Enable Babel for better optimizations
    babel: {
      compact: true,
      plugins: [
        // Remove console.log in production
        ...(process.env.NODE_ENV === 'production' ? [['transform-remove-console', { exclude: ['error', 'warn'] }]] : [])
      ]
    },
    // Fast Refresh for better dev experience
    fastRefresh: true,
    // Enable JSX runtime optimization
    jsxRuntime: 'automatic'
  })],
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        inlineDynamicImports: false,
        // Ensure proper globals for React
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        manualChunks: (id) => {
          // Better chunk splitting strategy for smaller bundles
          if (id.includes('node_modules')) {
            // Core React bundle - keep small
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('scheduler')) {
              return 'react-core';
            }
            // React ecosystem
            if (id.includes('react-router')) {
              return 'react-router';
            }
            // Material-UI - split into separate chunk
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui';
            }
            // Graphics libraries - defer loading
            if (id.includes('three') || id.includes('@react-three') || id.includes('ogl')) {
              return 'graphics';
            }
            // Animation library
            if (id.includes('gsap')) {
              return 'gsap';
            }
            // Split large vendor libraries
            if (id.includes('lodash') || id.includes('moment') || id.includes('date-fns')) {
              return 'utils';
            }
            // React Toastify and notification libraries
            if (id.includes('react-toastify') || id.includes('sonner')) {
              return 'notifications';
            }
            // Other vendor code
            return 'vendor';
          }
          // Split admin components into separate chunk (lazy loaded)
          if (id.includes('/Admin')) {
            return 'admin';
          }
          // Split large components
          if (id.includes('/components/Gallery') || id.includes('/components/Workshops')) {
            return 'gallery-workshops';
          }
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Target modern browsers for better performance
    target: 'es2020',
    // Use esbuild for minification (faster)
    minify: 'esbuild',
    // Disable source maps in production for smaller files
    sourcemap: false,
    // Optimize CSS
    cssMinify: true,
    cssCodeSplit: true,
    // Preload modules
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Ensure correct loading order to prevent initialization errors
        // Load vendor and utils first, then react-core, then others
        const criticalChunks = ['vendor', 'utils', 'notifications', 'react-core', 'react-router'];
        
        const sortedDeps = deps.sort((a, b) => {
          const aIndex = criticalChunks.findIndex(chunk => a.includes(chunk));
          const bIndex = criticalChunks.findIndex(chunk => b.includes(chunk));
          
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
        
        return sortedDeps;
      }
    },
    // Ensure proper module initialization order
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    // Enable compression
    reportCompressedSize: true,
    // Optimize assets
    assetsInlineLimit: 4096
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'gsap',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ],
    exclude: [
      'ogl',
      '@react-three/fiber',
      '@react-three/drei'
    ]
  },
  // Ensure single React instance
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },
  // Optimize for development
  server: {
    port: 5173,

    hmr: {
      overlay: false
    },
    // Enable pre-bundling for faster dev server
    force: false
  },
  // Enable experimental features for better performance
  esbuild: {
    // Tree shake unused code
    treeShaking: true,
    // Minify identifiers
    minifyIdentifiers: true,
    // Minify syntax
    minifySyntax: true,
    // Minify whitespace
    minifyWhitespace: true
  }
})
