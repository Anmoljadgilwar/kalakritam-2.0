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
        assetFileNames: 'assets/[name]-[hash].[ext]'
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
    // Preload modules (use defaults)
    modulePreload: {
      polyfill: true
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
