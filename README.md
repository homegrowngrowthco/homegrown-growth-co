# Homegrown Growth Co. — Website

Static marketing site for [homegrowngrowth.co](https://homegrowngrowth.co). Plain HTML5 + vanilla JavaScript, hosted on Netlify, deployed automatically from this repository.

## Live site

- **Production:** https://homegrowngrowth.co
- **Repo default branch:** `main`
- **Hosting:** Netlify (site ID `35530ce7-21f4-4734-92ae-12758607e79e`)

## Deploy flow

Every push to `main` triggers `.github/workflows/deploy.yml`:

1. GitHub Actions runs `netlify deploy --prod`
2. After a successful prod deploy, the workflow pings IndexNow with the full canonical URL list (homepage, services, pricing, about, ROI call, for-saas, and the six service pages). This notifies Bing/Yandex/Google within seconds.

There is no build step — everything in this directory is published as-is. `netlify.toml` controls security headers, cache rules, and clean-URL redirects (`/about` → `/about.html`, etc.).

**When you add a new page, also update:**
- `sitemap.xml` (add the URL + lastmod)
- `netlify.toml` (add the clean-URL redirect)
- `.github/workflows/deploy.yml` (add the URL to the IndexNow `urlList`)
- `.github/workflows/link-check.yml` (add the URL so the CI smoke test covers it)
- `SITE_STATUS.md` (update the page inventory)
- Nav + footer links across all pages (or use the bulk-update PowerShell pattern from prior commits)

**After every deploy:** refresh `SITE_STATUS.md` and any relevant memory files in the same session — see the durable rule on this in `~/.claude/projects/.../memory/feedback_keep_docs_synced.md`. Stale docs are a known issue; treat them as part of the deploy.

## CI

Two workflows run in `.github/workflows/`:

- **`deploy.yml`** — fires on every push to `main`. Runs the Netlify deploy then pings IndexNow.
- **`link-check.yml`** — fires weekly (Mondays 09:00 UTC) and on-demand via the GitHub UI. A simple curl loop that confirms each canonical URL returns 200 and `/resources` still 301s. Runs in ~11s. (Earlier attempts with lychee kept tripping on Netlify edge rate-limits during recursive crawls — curl is the right tool for this size of site.)

## Project structure

```
2026.04.20/hgc_v8/        ← repo root (this folder is what gets deployed)
├── *.html                 — every page is its own static file
├── styles.css             — single shared stylesheet (~46KB)
├── script.js              — UI logic: nav, dropdown, mobile menu, scroll animations, Calendly
├── analytics.js           — GA4 + Microsoft Clarity bootstrap (loaded with defer)
├── fonts/                 — self-hosted Inter, DM Mono, DM Sans, Plus Jakarta Sans (woff2)
├── netlify.toml           — headers, redirects, caching
├── robots.txt, sitemap.xml
├── 9ca65...txt            — IndexNow site verification key (intentionally public)
└── .github/workflows/     — deploy.yml (Netlify) + link-check.yml (CI link checker)
```

## Pages

Live + indexed: `/`, `/services`, `/pricing`, `/about`, `/for-saas`, `/roi-call`, plus six service pages (`/fractional-revops`, `/crm-implementation`, `/process-automation`, `/reporting-analytics`, `/tech-stack-audit`, `/sales-comp-enablement`).

Live but `noindex`: `/case-studies` (placeholder until real content lands).

Retired: `/resources` → 301 to `/`.

## Things to know

- **`for-saas.html` uses its own embedded design system** (different CSS variables, Plus Jakarta Sans + DM Sans fonts, custom nav). Site-wide nav or design changes do NOT propagate there automatically — they need to be applied separately. Long-term goal: unify into the shared `styles.css`.
- **CSP retains `'unsafe-inline'` in `script-src`** because every page has inline JSON-LD schema blocks. Tightening would require SHA-256 hashes per schema block (brittle). Acceptable for a static site with no user-generated content.
- **Analytics:** GA4 ID `G-4QR1JQK9QL`, Microsoft Clarity ID `wgqsqcvysb`. Both bootstrap from `analytics.js` (loaded with `defer`).
- **`robots.txt`** is wide-open (allows everything, points to sitemap). `case-studies.html` uses `<meta name="robots" content="noindex">` instead of a Disallow.

## Local preview

Open any HTML file directly in a browser, or run a local server from this folder:

```sh
python -m http.server 8000
# then visit http://localhost:8000
```

For accurate behavior of clean URLs and redirects (the `/about` → `/about.html` mapping), use Netlify CLI:

```sh
netlify dev
```

## Where else context lives

- `SITE_STATUS.md` — running checklist of what's done / what's left
- Repo issues / Netlify dashboard — deploy logs, build history
