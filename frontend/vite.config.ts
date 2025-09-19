import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React und React-DOM in separaten Chunk
          'react-vendor': ['react', 'react-dom'],
          // Material-UI in separaten Chunk
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // Routing in separaten Chunk
          'router-vendor': ['react-router-dom'],
          // Excel-Funktionalität in separaten Chunk (lazy loading)
          'excel-vendor': ['exceljs'],
          // Utilities
          'utils-vendor': ['axios', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})