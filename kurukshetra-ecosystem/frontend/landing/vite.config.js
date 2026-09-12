import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Builds straight into ../frontend so FastAPI's static mount at "/" serves
// this landing page without a separate copy step. frontend/app/ (the
// existing GPay-clone demo, mounted at /main) is untouched by this build.
//
// Dev mode (`npm run dev`) proxies /api and /main to the FastAPI backend on
// :8000, so the whole thing behaves like one app with hot reload on the
// landing page.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: false,
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/main': 'http://127.0.0.1:8000',
    },
  },
})
