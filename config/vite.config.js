import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: './client',
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, './postcss.config.js'),
  },
  build: {
    outDir: 'dist', // Output to client/dist
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}) 