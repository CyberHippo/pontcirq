import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.pontcirq.fr',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/fragments/'),
    }),
  ],
});
