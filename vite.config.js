import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDotenv } from 'dotenv';

configDotenv();

// Usar valores por defecto si no están definidos
const U_URI = process.env.VITE_U_PORT || "https://usuarios.vozciudadana.duckdns.org"
const R_URI = process.env.VITE_R_PORT || "https://reportes.vozciudadana.duckdns.org"
const N_URI = process.env.VITE_N_PORT || "https://notificaciones.vozciudadana.duckdns.org"
const MOD_URI = process.env.VITE_MOD_PORT || "https://admin.vozciudadana.duckdns.org"
const ANALYTICS_URI = process.env.VITE_ANALYTICS_PORT || "https://metricas.vozciudadana.duckdns.org"

console.log('📡 Vite Proxy Configuration:')
console.log(`  /users         → ${U_URI}`)
console.log(`  /reports       → ${R_URI}`)
console.log(`  /notifications → ${N_URI}`)
console.log(`  /moderation    → ${MOD_URI}`)
console.log(`  /metrics       → ${ANALYTICS_URI}`)

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users': {
        target: U_URI,
        changeOrigin: true,
      },
      '/reports': {
        target: R_URI,
        changeOrigin: true,
      },
      '/notifications': {
        target: N_URI,
        changeOrigin: true,
      },
      '/moderation': {
        target: MOD_URI,
        changeOrigin: true,
      },
      '/metrics': {
        target: ANALYTICS_URI,
        changeOrigin: true,
      },
    },
  },
})