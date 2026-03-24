import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api-users': {
        target: 'http://rodo.tplinkdns.com:65000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-users/, ''),
      },
      '/api-reports': {
        target: 'http://rodo.tplinkdns.com:65001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-reports/, ''),
      },
    },
  },
})