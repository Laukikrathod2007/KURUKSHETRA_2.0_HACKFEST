import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Builds straight into ../frontend/app so FastAPI's static mount at /main
// serves this app without a separate copy step. Mirrors landing/vite.config.js.
export default defineConfig({
  plugins: [react()],
  base: '/main/',
  build: {
    outDir: '../dist/app',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
