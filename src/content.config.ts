import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// Resources / blog collection (Astro 5 Content Layer).
// Drop a Markdown file in src/content/resources/ and rebuild: it becomes a post.
// `draft: true` keeps a file out of the index + the generated routes (see
// src/pages/resources.astro and src/pages/resources/[slug].astro).
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  // heroImage is a public path (e.g. /images/foo.jpg), matching the site's
  // existing /images/* convention rather than the src-relative image() helper.
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().default('Ian Chamberland'),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { resources };
