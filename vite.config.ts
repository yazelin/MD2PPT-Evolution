/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import path from 'path';
import { readFileSync } from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      // 改用相對路徑，增加部署靈活性
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'prompt', // Prompt user for update
          includeAssets: ['logo.svg', 'robots.txt', 'apple-touch-icon.png'],
          manifest: {
            name: 'MD2PPT Evolution',
            short_name: 'MD2PPT',
            description: 'Markdown to Professional PowerPoint Converter',
            theme_color: '#1C1917',
            background_color: '#1C1917',
            display: 'standalone',
            start_url: './',
            icons: [
              {
                src: 'logo.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              },
              {
                src: 'logo.svg',
                sizes: '512x512',
                type: 'image/svg+xml'
              }
            ]
          },
          workbox: {
            // Include all static assets in precache
            globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
            // Cleanup old caches
            cleanupOutdatedCaches: true,
            // Allow large chunks (some dependencies like pptxgenjs/shiki are big)
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
            
            // Runtime caching for external resources
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-static-cache',
                  expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                // Cache Shiki assets from CDN if applicable, or generic JS/JSON from dynamic imports
                urlPattern: /.*\.wasm|.*\.json|.*\.js/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'dynamic-resources-cache',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  }
                }
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        __APP_VERSION__: JSON.stringify(packageJson.version),
      },
      build: {
        chunkSizeWarningLimit: 2000, // 提高警告門檻至 2MB，適配大型庫
        rollupOptions: {
          output: {
            manualChunks: {
              // 分拆大型第三方庫以優化載入與緩存
              'vendor-react': ['react', 'react-dom'],
              'vendor-utils': ['lucide-react', 'file-saver', 'i18next', 'react-i18next', 'js-yaml', 'marked'],
              'vendor-mermaid': ['mermaid'],
              'vendor-pptx': ['pptxgenjs'],
            },
          },
        },
      },
    };
});
