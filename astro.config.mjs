// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://homegrowngrowth.co',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.endsWith('/404') &&
        !page.endsWith('/404/') &&
        !page.endsWith('/case-studies') &&
        !page.endsWith('/case-studies/'),
    }),
  ],
});
