// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://homegrowngrowth.co',
  output: 'static',
  trailingSlash: 'never',
  // Astro 7 changed the compressHTML default from `true` to `'jsx'`, which strips
  // whitespace between inline elements and can alter rendered text spacing.
  // Pin the Astro 5/6 behavior so the upgrade is output-preserving.
  compressHTML: true,
  build: {
    // Flat dist/<slug>.html (not dist/<slug>/index.html), so Netlify serves
    // /<slug> directly without a trailing-slash 301. Matches the URL shape the
    // prod site has always had. Was 'file' through Astro 5; under Astro 7 'file'
    // makes Astro.url.pathname '/index.html' on the homepage, which drops the
    // BaseLayout homepage-only font preload. 'preserve' writes the same files
    // here (flat .html for every route, root index.html) and keeps pathname '/'
    // on the homepage. Caveat: a future src/pages/<dir>/index.astro would build
    // as <dir>/index.html under 'preserve'; use <dir>.astro instead.
    format: 'preserve',
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
