import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/**/*.png', 'assets/**/*.jpg', 'assets/**/*.webp', 'assets/**/*.jpeg'],
      workbox: {
        // Cache all navigation requests to index.html (SPA routing support)
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/(api|admin)/],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.+\.(png|jpg|jpeg|webp|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lemaire-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      manifest: {
        name: 'Lemaire Clothing',
        short_name: 'Lemaire',
        description: 'Discover premium African hand-sown dresses and Ankara designs at Lemaire Clothing, Konongo.',
        theme_color: '#c97a2c',
        background_color: '#0a0a0a',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'assets/images/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/images/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
