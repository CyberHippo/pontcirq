import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pontcirq.vergnol.eu',
  output: 'static',
  // Keep event text exactly as written (no automatic curly quotes).
  markdown: {
    smartypants: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/fragments/'),
    }),
  ],
});
