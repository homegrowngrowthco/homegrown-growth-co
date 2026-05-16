---
description: Scaffold a new Astro page at src/pages/<slug>.astro and append its URL to the IndexNow list in deploy.yml
argument-hint: <slug> [title] [description]
---

Scaffold a new page. Arguments: `$ARGUMENTS`.

If the user didn't pass enough arguments, ask them for:
- **slug** (kebab-case, no extension, no leading slash) — required, becomes the URL path and filename
- **title** — required, the human-readable page title (will appear as `<title>X — Homegrown Growth Co.</title>`)
- **description** — required, the meta description (1-2 sentences, used in `<meta name="description">` and OG/Twitter cards)

## Steps

1. **Sanity-check the slug:**
   - Match `^[a-z][a-z0-9-]*$`
   - Doesn't already exist (`src/pages/{slug}.astro` not present)
   - Not a reserved name (`404`, `index`, `sitemap-index`, `sitemap-0`)

2. **Scaffold `src/pages/{slug}.astro`** using BaseLayout + PageHero. Template:

   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   import PageHero from '../components/PageHero.astro';

   const title = '{title} — Homegrown Growth Co.';
   const description = '{description}';
   const canonical = 'https://homegrowngrowth.co/{slug}';

   const schema = {
     '@context': 'https://schema.org',
     '@type': 'BreadcrumbList',
     itemListElement: [
       { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://homegrowngrowth.co/' },
       { '@type': 'ListItem', position: 2, name: '{title}', item: canonical },
     ],
   };
   ---

   <BaseLayout
     title={title}
     description={description}
     canonical={canonical}
     schema={schema}
   >
     <main id="main" class="page-content">

       <PageHero
         tag="{title}"
         headline="{title}"
         subtitle="TODO: subtitle"
         headlineMaxWidth="820px"
       />

       <section class="section section--bg">
         <div class="container container--narrow">
           <div class="fade-up">
             <p>TODO: page content goes here.</p>
           </div>
         </div>
       </section>

     </main>
   </BaseLayout>
   ```

3. **Append the URL to the IndexNow list in `.github/workflows/deploy.yml`.** The list is a multi-line JSON array inside a bash heredoc. The reliable insertion pattern: find the line containing `"https://homegrowngrowth.co/sms-opt-in"` (currently the last URL — but check first, the list can grow), then insert `,\n                "https://homegrowngrowth.co/{slug}"` after it.

   Use the Edit tool with `old_string` matching the current last URL line including its trailing newline + closing bracket; `new_string` adding the new URL between them. Show me the diff before saving.

4. **Verify:**
   - `npm run build` — confirm 18 (or N+1) page count.
   - Confirm `dist/{slug}.html` exists.
   - Confirm the new URL appears in the auto-generated `dist/sitemap-0.xml` (it should — `@astrojs/sitemap` picks up all `src/pages/*` except the filter exclusions for `/404` and `/case-studies`).
   - Confirm `deploy.yml` IndexNow list now has the new URL.

5. **Remind me** of the manual steps that still belong to me:
   - Fill in the actual content (the scaffold has TODO placeholders).
   - If this page needs richer schema (FAQ, Service, etc.), extend the `schema` object in the .astro frontmatter — the JsonLd component handles `@graph` arrays natively.
   - Commit + push when content is ready.

Do NOT commit anything yourself unless I explicitly say so — this is a scaffold command, not a ship command.
