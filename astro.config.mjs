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
      // Exclude /404 and the still-staging /case-studies/* subtree by pathname
      // prefix. /resources went live 2026-06-15 and is now indexed. Drop the
      // /case-studies prefix here when that section goes live too.
      filter: (page) => {
        const path = new URL(page).pathname;
        return (
          path !== '/404' &&
          path !== '/404/' &&
          !path.startsWith('/case-studies')
        );
      },
    }),
  ],
});
