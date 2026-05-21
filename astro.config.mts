// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';
import icon from 'astro-icon';

export default defineConfig({
  output: 'static',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: true,
      fallbackType: "rewrite"
    },
    fallback: {
      de: 'en',
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://pioniergarage.de',
  integrations: [react(), icon()]
});