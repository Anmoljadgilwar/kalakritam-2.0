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
        // Professional chunk splitting - optimized for caching and load performance
        manualChunks(id) {
          // Core React ecosystem - MUST stay together to avoid circular deps
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-is/') ||
              id.includes('node_modules/scheduler/') ||
              id.includes('node_modules/prop-types/') ||
              id.includes('node_modules/use-sync-external-store/')) {
            return 'react-core';
          }
          
          // React Router - commonly used, separate for caching
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run/')) {
            return 'react-router';
          }
          
          // Emotion (CSS-in-JS) - must load before MUI
          if (id.includes('node_modules/@emotion/')) {
            return 'emotion';
          }
          
          // MUI Base system
          if (id.includes('node_modules/@mui/system/') ||
              id.includes('node_modules/@mui/private-theming/') ||
              id.includes('node_modules/@mui/styled-engine/') ||
              id.includes('node_modules/@mui/utils/')) {
            return 'mui-system';
          }
          
          // MUI Material components
          if (id.includes('node_modules/@mui/material/')) {
            return 'mui-material';
          }
          
          // MUI Charts - lazy loaded, admin only
          if (id.includes('node_modules/@mui/x-charts/') ||
              id.includes('node_modules/@mui/x-internals/') ||
              id.includes('node_modules/d3-')) {
            return 'mui-charts';
          }
          
          // Three.js core
          if (id.includes('node_modules/three/')) {
            return 'three-core';
          }
          
          // React Three ecosystem
          if (id.includes('node_modules/@react-three/fiber/') ||
              id.includes('node_modules/@react-three/drei/')) {
            return 'react-three';
          }
          
          // Physics engine - heavy, lazy load
          if (id.includes('node_modules/@react-three/rapier/') ||
              id.includes('node_modules/@dimforge/')) {
            return 'physics';
          }
          
          // GSAP animations
          if (id.includes('node_modules/gsap/') ||
              id.includes('node_modules/@gsap/')) {
            return 'gsap';
          }
          
          // Framer Motion
          if (id.includes('node_modules/motion/') ||
              id.includes('node_modules/framer-motion/')) {
            return 'framer-motion';
          }
          
          // PDF generation - lazy loaded
          if (id.includes('node_modules/jspdf/')) {
            return 'pdf';
          }
          
          // HTML to Canvas - lazy loaded
          if (id.includes('node_modules/html2canvas/')) {
            return 'html2canvas';
          }
          
          // QR Code generation
          if (id.includes('node_modules/qrcode/')) {
            return 'qrcode';
          }
          
          // React Icons - commonly used
          if (id.includes('node_modules/react-icons/')) {
            return 'icons';
          }
          
          // Toast notifications
          if (id.includes('node_modules/react-toastify/')) {
            return 'toast';
          }
          
          // React Helmet SEO
          if (id.includes('node_modules/react-helmet-async/')) {
            return 'helmet';
          }
          
          // ReactFlow - admin only
          if (id.includes('node_modules/reactflow/') ||
              id.includes('node_modules/@reactflow/')) {
            return 'reactflow';
          }
          
          // Zustand state management
          if (id.includes('node_modules/zustand/')) {
            return 'zustand';
          }
          
          // OGL WebGL library
          if (id.includes('node_modules/ogl/')) {
            return 'ogl';
          }
          
          // Postprocessing effects
          if (id.includes('node_modules/postprocessing/')) {
            return 'postprocessing';
          }
          
          // Barba page transitions
          if (id.includes('node_modules/@barba/')) {
            return 'barba';
          }
          
          // Remaining node_modules - small utilities
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 300,
    // Target modern browsers for better performance
    target: 'esnext',
    // Use esbuild for minification (faster)
    minify: 'esbuild',
    // Enable source maps for debugging but smaller in production
    sourcemap: false,
    // Optimize CSS
    cssMinify: true,
    // Enable module preload for critical chunks
    modulePreload: {
      polyfill: false
    },
    // Ensure proper module initialization order
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      strictRequires: 'auto'
    },
    // Improve CSS code splitting
    cssCodeSplit: true,
    // Enable aggressive tree shaking
    treeshake: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react-router-dom',
      '@emotion/react',
      '@emotion/styled',
      'gsap'
    ],
    exclude: [
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/rapier'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  // Ensure single React instance and optimize resolution
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      'react-is',
      '@emotion/react',
      '@emotion/styled',
      'zustand'
    ]
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
    // Aggressive minification
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    target: 'esnext'
  }
})
