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
    }
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
          // Better chunk splitting strategy
          if (id.includes('node_modules')) {
            // Bundle React, ReactDOM and all React-dependent libraries together
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || 
                id.includes('@mui') || id.includes('@emotion') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('three') || id.includes('@react-three') || id.includes('ogl')) {
              return 'graphics-vendor';
            }
            if (id.includes('gsap')) {
              return 'animation-vendor';
            }
            return 'vendor';
          }
          // Split admin components into separate chunk
          if (id.includes('/Admin')) {
            return 'admin';
          }
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for better performance
    target: 'es2020',
    // Use esbuild for minification (faster)
    minify: 'esbuild',
    // Enable source maps for debugging but smaller in production
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize CSS
    cssMinify: true,
    // Preload modules
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Ensure react-vendor is loaded before other chunks
        return deps.filter(dep => {
          if (filename.includes('react-vendor')) return true;
          if (dep.includes('react-vendor')) return true;
          return true;
        });
      }
    },
    // Ensure proper module initialization order
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
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
