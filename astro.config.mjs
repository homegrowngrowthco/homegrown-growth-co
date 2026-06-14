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
      // Exclude /404 and the staging subtrees (/case-studies/* and
      // /resources/*) by pathname prefix. The case-study + resources
      // sections are noindex + unlinked until real content lands; drop the
      // matching prefix here at go-live (see SITE_STATUS.md go-live checklist).
      filter: (page) => {
        const path = new URL(page).pathname;
        return (
          path !== '/404' &&
          path !== '/404/' &&
          !path.startsWith('/case-studies') &&
          !path.startsWith('/resources')
        );
      },
    }),
  ],
});
