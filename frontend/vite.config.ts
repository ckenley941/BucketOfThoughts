import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative asset paths so the app works when served from:
  // - https://storage.googleapis.com/<bucket>/index.html
  // - https://<bucket>.storage.googleapis.com/
  // - a path-based load balancer/CDN origin
  base: './',
})
