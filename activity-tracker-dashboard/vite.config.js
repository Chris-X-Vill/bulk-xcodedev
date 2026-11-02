import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset paths so the build works under any sub-path (e.g. GitHub Pages /bulk-xcodedev/).
  base: './',
  plugins: [react(), tailwindcss()],
})
