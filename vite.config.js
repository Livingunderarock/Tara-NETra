import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Tara-NETra/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
