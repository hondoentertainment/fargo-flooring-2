import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 75 },
      png: { quality: 80 },
      webp: { quality: 80 },
    })
  ],
  test: {
    environment: 'jsdom',
    exclude: ['tests/**', 'node_modules/**'],
    env: {
      VITE_GEMINI_API_KEY: 'test-key'
    }
  }
})
