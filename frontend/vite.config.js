import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd());
  const apiBase = (VITE_API_URL || 'http://localhost:5002').replace(/\/api\/?$/, '').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'SocietySync',
          short_name: 'SocietySync',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#00bcd4',
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': { target: apiBase, changeOrigin: true },
        '/uploads': { target: apiBase, changeOrigin: true },
      },
    },
  };
});
