import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Medora - Patient Portal",
        short_name: "Medora",
        description: "Your personal health companion.",
        theme_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          {
            src: "medoralogo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "medoralogo.png", 
            sizes: "512x512",
            type: "image/png",
          },
          // Add more sizes for better compatibility
          {
            src: "medoralogo.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "medoralogo.png",
            sizes: "256x256", 
            type: "image/png",
          },
          // Apple touch icon
          {
            src: "medoralogo.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon"
          },
          // Maskable icon for Android
          {
            src: "medoralogo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "medoralogo.png",
            sizes: "512x512",
            type: "image/png", 
            purpose: "maskable"
          }
        ],
        // Add these for better mobile experience
        orientation: "portrait",
        categories: ["health", "medical"],
        // Splash screen for iOS
        ios: true,
      },
      // Add workbox for offline support
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      // Enable dev mode for testing
      devOptions: {
        enabled: false // Set to true during development to test PWA
      }
    }),
  ],
});