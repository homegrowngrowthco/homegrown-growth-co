# Homegrown Growth Co. — Website

## Purpose
Static marketing site for Homegrown Growth Co., Ian's fractional growth-operations consulting practice. Heavy SEO/structured-data focus: every page has JSON-LD (Service / FAQPage / BreadcrumbList / Person / Organization). Completed inventory and live-state are in `SITE_STATUS.md`; open tasks in `TODO.md`; dated history in `docs/SESSION_LOG.md`.

## Tech Stack
- **Astro 5** + **TypeScript strict** + **vanilla CSS** (no Tailwind; the design system in `src/styles/global.css` is the canonical source)
- `output: 'static'` + `build.format: 'file'` (flat `dist/<slug>.html`, served at `/<slug>` natively by Netlify without trailing-slash 301s)
- `@astrojs/sitemap` autogenerates the sitemap at build time (filters out `/404` and `/case-studies*`)
- Self-hosted webfonts: **Geist Sans + Geist Mono** in `public/fonts/` (Session 13 rebrand; Inter/DM Mono removed)
- Netlify hosting + GitHub Actions deploy (`npm ci && npm run build && netlify deploy --dir=dist`); `NODE_VERSION="24"` pinned in `netlify.toml`
- GA4 + Microsoft Clarity, lazily loaded on first interaction or idle (PR #6); conversion events documented in `ANALYTICS.md`
- IndexNow auto-ping on every prod deploy; weekly curl-based link-check workflow

## Live site
- Production: https://homegrowngrowth.co
- GitHub: https://github.com/homegrowngrowthco/homegrown-growth-co (default branch `main`)
- Netlify Site ID: `35530ce7-21f4-4734-92ae-12758607e79e`

## Key Files & Folders
- `src/pages/` contains 25 static `.astro` routes + 2 dynamic (`case-studies/[slug]`, `resources/[slug]`), 1:1 to URLs. 12 are thin data-only `ServicePage` wrappers.
- `src/layouts/BaseLayout.astro` renders the full `<head>` (meta, fonts, analytics, canonical, OG/Twitter, optional JSON-LD via `JsonLd`) and body (skip-link, Nav, slot, Footer, NetlifyFormStubs, bundled `nav.ts`). Props: `title`, `description`, `canonical`, `ogType?`, `ogImage?`, `noindex?`, `schema?`, `bareNav?`, `bareFooter?`.
- `src/components/`: `Nav`, `Footer`, `JsonLd` (with `</script>` XSS-escape), `PageHero`, `SmsOptInForm`, `NetlifyFormStubs` (hidden duplicate forms so Netlify detects them regardless of attribute stripping), `ServicePage` (shared template for the 12 service pages; schema derived from the same data as the visible content so it can't drift), `CaseStudy`, `Testimonials`.
- `src/content/` + `src/content.config.ts`: Content Layer; the `resources` collection powers the live `/resources` blog. Drop a non-draft `.md` in `src/content/resources/` and rebuild to publish.
- `src/data/`: `caseStudies.ts` (drives `/case-studies`; `published:true` gates detail pages) and `testimonials.ts` (auto-hides `TODO:` placeholders).
- `src/styles/global.css`: single shared stylesheet, bundled/hashed to `/_astro/*.css`.
- `src/scripts/nav.ts`: sticky nav, mobile menu, dropdown, scroll animations, Calendly init + booking conversion event.
- `public/` is served as-is: `analytics.js`, `fonts/`, favicons, `og-image.png`, `robots.txt`, IndexNow verification file.
- `_baseline/lighthouse-2026-06-14/`: current Lighthouse baseline (post-rebrand, analytics deferred). `/audit-seo` diffs against it.
- `_assets/`: source brand assets, kept in repo but not deployed. `_archive/` (local, gitignored): resolved audit artifacts.
- `netlify.toml`: security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy, cache rules), `NODE_VERSION`, 404 fallback. No per-page rewrites.
- `.github/workflows/deploy.yml` (build + Netlify deploy + IndexNow, actions @v5) and `link-check.yml` (weekly curl check).
- `.claude/settings.json` (committed shared allowlist), `.claude/settings.local.json` (gitignored per-machine), `.claude/commands/` (`/preview`, `/build-check`, `/add-page`, `/audit-seo`, `/gsc-status`).
- `scripts/gsc-index-status.py`: GSC URL Inspection over every sitemap URL (OAuth creds in `~/.gsc`, venv `C:\Users\Ian\.venvs\gsc`). `scripts/lint-docs.mjs`: docs guardrail (`npm run qa:docs`).
- `README.md` (deploy flow + add-a-page checklist), `SITE_STATUS.md` (live-state inventory), `TODO.md` (open tasks), `docs/SESSION_LOG.md` (history), `DIRECTORY_PROFILES.md` (paste-ready directory copy), `ANALYTICS.md` (event map + console runbooks).

## External Dependencies
- Netlify (hosting + Forms), GA4 `G-4QR1JQK9QL`, Microsoft Clarity `wgqsqcvysb` (both public IDs)
- IndexNow (verification file `9ca65fb52b8ccbac961ff671bbbfa5cd.txt` in repo)
- Calendly (booking embed on `/roi-call`)
- Twilio (SMS: TFV toll-free +1 866 369 4940 plus A2P 10DLC sole-prop; the site carries the compliance pages, sending lives outside this repo)

## Environment Variables
None for build. Deploy uses GitHub Actions secrets `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID`.

## Deployment
Push to `main` triggers GitHub Actions: `npm ci && npm run build && netlify deploy --dir=dist --prod`, then an IndexNow ping. End-to-end ~1 minute. PRs deploy a Netlify branch preview (deploy-ID URL, not a `deploy-preview-N` URL; the Netlify GitHub App is not installed).

**When adding a new page**, use `/add-page <slug>`: it scaffolds `src/pages/<slug>.astro` and appends the URL to the IndexNow list in `deploy.yml`. Sitemap and nav/footer are automatic. Manual path: create the page, append to the IndexNow `urlList`, optionally update `link-check.yml` + `SITE_STATUS.md`.

## Open tasks
Open tasks live in [`TODO.md`](TODO.md), the single source of truth, ranked and synced to Notion. Do not maintain a separate open-task list here or in `SITE_STATUS.md` (that duplication caused status drift; see the S16 convention).

## Operating conventions (docs + git)
- **CLAUDE.md is an evergreen brief.** No session-by-session history here; target under ~150 lines, hard lint at 400.
- **`docs/SESSION_LOG.md` is the append-only history**, strictly newest-first. One entry per session, 20 lines or fewer: shipped / SHAs / verify / revert / gotchas.
- **`TODO.md` holds open tasks only.** Delete `[x]` items when done (rescue any live follow-up as a new open item first); keep each item to 3 lines or fewer; detail belongs in `SITE_STATUS.md` or the session log.
- **Guardrail:** `npm run qa:docs` (`scripts/lint-docs.mjs`) fails if CLAUDE.md exceeds 400 lines or TODO.md contains `- [x]`; warns on open items over 400 chars.
- Docs-only commits go direct to `main` (they produce a byte-identical site build). Feature work uses branches + `--no-ff` merges.
- No em or en dashes in newly authored site copy or docs prose (archived text stays as written).
- Git: stage explicit paths (never `git add -A`); secret-scan the staged diff before pushing.

## Distilled gotchas (earned in Sessions 1-30)
- **PS 5.1 mangles embedded double quotes in `git commit -m`.** Write the message to a file and use `git commit -F`.
- **Netlify deploy previews send `X-Robots-Tag: noindex`.** Lighthouse SEO ~0.69 on previews is an artifact; audit prod for a true score.
- **Netlify strips `data-netlify` from rendered HTML.** That is the detection SUCCESS signal, not a regression.
- **Editing `.github/workflows/*` needs the gh token `workflow` scope** (the token has it; see memory).
- **Lighthouse CLI exits 1 even on success** (still writes valid JSON); occasional runs need one retry.
- **IndexNow pings Bing/Yandex only and link-check is CI-only.** Neither affects Google indexing. GSC's Pages report lags the live index by days; trust the URL Inspection API (`/gsc-status`).
- **Keep schema single-sourced from visible content** (ServicePage FAQ text derives from `htmlA`; `/services` ItemList builds from the rendered array). Never reintroduce a parallel schema field.
- **Twilio SMS compliance:** sole-prop legal name = `Ian Chamberland` (DBA Homegrown Growth Co.); SMS consent must be standalone (never bundled with terms/intake/contract wording anywhere, including Twilio free-text fields); site copy is strictly transactional, "no marketing" stated.
- **Stale `.astro` content-store cache** can throw phantom "duplicate id" glob-loader warnings; delete `.astro/` + `dist/` and rebuild.
- **`build.format: 'file'` is load-bearing.** The directory format reintroduces trailing-slash 301 chains.
- Resources posts support an optional `faqs:[{q,a}]` frontmatter field that renders a visible accordion AND emits FAQPage schema from the same array.

## Resolved long-term tech debt (2026-05-16 to 2026-06-14)
- ✅ Astro 5 migration: shared BaseLayout/Nav/Footer/ServicePage eliminated per-page duplication (S5).
- ✅ `/for-saas` unified onto the shared design system (S6); refreshed to the umbrella framing (S10).
- ✅ Unused fonts dropped (S6); later full font swap to Geist (S13).
- ✅ Inline `style="..."` cleanup 93 to 25; the remainder are bespoke one-offs (S6).
- ✅ CSP fixed where it mattered: Clarity SDK + upload endpoints allowlisted (S6, S18-19); `frame-ancestors 'none'` + `upgrade-insecure-requests` added.
- ✅ Full evidence-backed site audit + all fix waves shipped (S18-21, PR #5 `3f3da7c` + PR #6 `8c470a3`): cache rules, image re-encodes, WCAG teal-700 contrast (a11y 1.00), dead-CSS purge, deferred analytics (mobile perf 0.83-0.97).

Deliberately kept as-is, with rationale:
- **`'unsafe-inline'` in CSP script-src/style-src.** Removal needs per-build hashing of inline JSON-LD + Astro module scripts (~2-4h) with no real threat on a static no-auth site. Revisit on a compliance driver.
- **No branch protection on `main`** while solo; friction outweighs near-zero benefit. Revisit if a collaborator joins.

## Recovery note
Survived the 2026-05-04 machine wipe: full git history on GitHub, live site untouched, Actions secrets intact. All post-recovery follow-ups (push verified, `NETLIFY_AUTH_TOKEN` rotated, GA4/Clarity verified) closed by Session 11.
