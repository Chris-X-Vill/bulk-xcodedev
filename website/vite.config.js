import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset paths so the site works under any sub-path (e.g. /bulk-xcodedev/website/).
  base: './',
  plugins: [react(), tailwindcss()],
})
