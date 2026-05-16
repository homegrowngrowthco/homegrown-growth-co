// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://homegrowngrowth.co',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // 'file' produces dist/<slug>.html (not dist/<slug>/index.html), so Netlify
    // serves /<slug> directly without a trailing-slash 301. Matches the URL
    // shape the prod site has always had.
    format: 'file',
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
