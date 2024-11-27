import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    })
  ],
  vite: {
    optimizeDeps: {
      include: ['axios']
    }
  },
  server: {
    port: 4321
  }
});