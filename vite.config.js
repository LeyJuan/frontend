import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDotenv } from 'dotenv';

configDotenv();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users': {
        //target: 'http://rodo.tplinkdns.com:65000',
        target: `${process.env.DOMAIN}:${process.env.U_PORT}`,
        changeOrigin: true,
      },
      '/reports': {
        target: `${process.env.DOMAIN}:${process.env.R_PORT}`,
        //target: 'http://rodo.tplinkdns.com:65001',
        changeOrigin: true,
      },
    },
  },
})