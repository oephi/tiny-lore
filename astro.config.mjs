import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tiny-lore.vercel.app',
  integrations: [react(), keystatic(), sitemap()],
  output: 'static',
  adapter: vercel(),
});
