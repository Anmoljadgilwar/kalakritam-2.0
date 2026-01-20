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
        // Manual chunk splitting for better caching and loading
        manualChunks(id) {
          // React core libraries - loaded on every page
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          
          // React Router - loaded on every page
          if (id.includes('node_modules/react-router-dom/') || 
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/@remix-run/')) {
            return 'vendor-router';
          }
          
          // MUI and Emotion - MUST stay together to avoid circular dependency issues
          if (id.includes('node_modules/@mui/') || 
              id.includes('node_modules/@emotion/') ||
              id.includes('node_modules/@babel/runtime')) {
            return 'vendor-mui';
          }
          
          // Three.js and related - only used in specific components
          if (id.includes('node_modules/three/') || 
              id.includes('node_modules/@react-three/') ||
              id.includes('node_modules/ogl/')) {
            return 'vendor-three';
          }
          
          // GSAP animation library
          if (id.includes('node_modules/gsap/')) {
            return 'vendor-gsap';
          }
          
          // React Icons - used across multiple components
          if (id.includes('node_modules/react-icons/')) {
            return 'vendor-icons';
          }
          
          // Motion/Animation libraries (except GSAP)
          if (id.includes('node_modules/motion/') || 
              id.includes('node_modules/@barba/')) {
            return 'vendor-animations';
          }
          
          // Other large utilities - split individually
          if (id.includes('node_modules/html2canvas/')) {
            return 'vendor-html2canvas';
          }
          
          if (id.includes('node_modules/jspdf/')) {
            return 'vendor-jspdf';
          }
          
          if (id.includes('node_modules/qrcode/')) {
            return 'vendor-qrcode';
          }
          
          // React Toastify
          if (id.includes('node_modules/react-toastify/')) {
            return 'vendor-toast';
          }
          
          // Rapier physics (heavy, only used in specific 3D components)
          if (id.includes('node_modules/@react-three/rapier/') ||
              id.includes('node_modules/@dimforge/')) {
            return 'vendor-physics';
          }
          
          // Postprocessing effects
          if (id.includes('node_modules/postprocessing/')) {
            return 'vendor-postprocessing';
          }
          
          // React Helmet for SEO
          if (id.includes('node_modules/react-helmet-async/')) {
            return 'vendor-helmet';
          }
          
          // Group all other node_modules into a common vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor-common';
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
    // Enable source maps for debugging but smaller in production
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize CSS
    cssMinify: true,
    // Enable selective module preload for critical dependencies
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Always preload React before other chunks
        if (filename.includes('vendor-react')) {
          return deps;
        }
        // Preload router with react
        if (filename.includes('vendor-router')) {
          return deps.filter(dep => dep.includes('vendor-react'));
        }
        // Preload MUI with react
        if (filename.includes('vendor-mui')) {
          return deps.filter(dep => dep.includes('vendor-react'));
        }
        // Don't preload dependencies for other chunks
        return [];
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
      'gsap'
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
    alias: {}
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
