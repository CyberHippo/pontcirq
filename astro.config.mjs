import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pontcirq.vergnol.eu',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/fragments/'),
    }),
  ],
});
