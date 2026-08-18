import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tiny-lore.vercel.app',
  integrations: [sitemap()],
  output: 'static',
  adapter: vercel(),
});
