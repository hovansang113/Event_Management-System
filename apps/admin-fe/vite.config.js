import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3003 },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@mui/material') || id.includes('@mui/icons-material')) {
            return 'mui'
          }
          if (id.includes('@emotion/react') || id.includes('@emotion/styled')) {
            return 'emotion'
          }
          if (
            id.includes('node_modules/react/') || 
            id.includes('node_modules/react-dom/') || 
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})