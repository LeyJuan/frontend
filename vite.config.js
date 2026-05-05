import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDotenv } from 'dotenv';

configDotenv();

// Usar valores por defecto si no están definidos
const DOMAIN = (process.env.VITE_DOMAIN || 'http://localhost').trim().replace(/['"]+/g, '')
const U_PORT = process.env.VITE_U_PORT || 8000
const R_PORT = process.env.VITE_R_PORT || 8001
const N_PORT = process.env.VITE_N_PORT || 8002
const MOD_PORT = process.env.VITE_MOD_PORT || 8003
const ANALYTICS_PORT = process.env.VITE_ANALYTICS_PORT || 8004

const USERS_TARGET = `${DOMAIN}:${U_PORT}`
const REPORTS_TARGET = `${DOMAIN}:${R_PORT}`
const NOTIFICATIONS_TARGET = `${DOMAIN}:${N_PORT}`
const MODERATION_TARGET = `${DOMAIN}:${MOD_PORT}`
const ANALYTICS_TARGET = `${DOMAIN}:${ANALYTICS_PORT}`

console.log('📡 Vite Proxy Configuration:')
console.log(`  /users         → ${USERS_TARGET}`)
console.log(`  /reports       → ${REPORTS_TARGET}`)
console.log(`  /notifications → ${NOTIFICATIONS_TARGET}`)
console.log(`  /moderation    → ${MODERATION_TARGET}`)
console.log(`  /metrics       → ${ANALYTICS_TARGET}`)

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users': {
        target: USERS_TARGET,
        changeOrigin: true,
      },
      '/reports': {
        target: REPORTS_TARGET,
        changeOrigin: true,
      },
      '/notifications': {
        target: NOTIFICATIONS_TARGET,
        changeOrigin: true,
      },
      '/moderation': {
        target: MODERATION_TARGET,
        changeOrigin: true,
      },
      '/metrics': {
        target: ANALYTICS_TARGET,
        changeOrigin: true,
      },
    },
  },
})