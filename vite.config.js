import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
        about: './pages/about.html',
        dashboard: './pages/dashboard.html',
        forms: './pages/forms.html'
      }
    }
  },
  css: {
    devSourcemap: true
  }
})
