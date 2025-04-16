import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/GREEN/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for better debugging
    sourcemap: true,
    // Remove console logs in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
})
