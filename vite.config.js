import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Daily Quote',
                short_name: 'DailyQuote',
                description: 'Get inspired with a new quote every day',
                theme_color: '#4F46E5',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    // General quotes API cache
                    {
                        urlPattern: /^https:\/\/api\.quotable\.io\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'quotes-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 7
                            },
                            cacheableResponse: { statuses: [0, 200] }
                        }
                    },
                    // Bible verses API cache
                    {
                        urlPattern: /^https:\/\/labs\.bible\.org\/api\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'bible-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 7
                            },
                            cacheableResponse: { statuses: [0, 200] }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        port: 3000
    }
})
