# Homegrown Growth Co. — Website

## Purpose
Static marketing site for Homegrown Growth Co., Ian's fractional RevOps consulting practice. Heavy SEO/structured-data focus — every page has JSON-LD (Service / FAQPage / BreadcrumbList / Person / Organization). See `SITE_STATUS.md` for the running punch list.

## Tech Stack
- **Astro 5** + **TypeScript strict** + **vanilla CSS** (no Tailwind; the existing design system in `src/styles/global.css` is the canonical source)
- `output: 'static'` + `build.format: 'file'` (produces flat `dist/<slug>.html`, served at `/<slug>` natively by Netlify without trailing-slash 301s)
- `@astrojs/sitemap` integration autogenerates sitemap at build time (filters out `/404` and `/case-studies`)
- Self-hosted webfonts (Inter, DM Mono, DM Sans, Plus Jakarta Sans) in `public/fonts/`
- Netlify hosting + GitHub Actions deploy (`npm ci && npm run build && netlify deploy --dir=dist`)
- `NODE_VERSION="24"` pinned in `netlify.toml` (matches local)
- GA4 + Microsoft Clarity analytics
- IndexNow auto-ping on every prod deploy
- Curl-based weekly link-check workflow

## Live site
- Production: https://homegrowngrowth.co
- GitHub: https://github.com/homegrowngrowthco/homegrown-growth-co
- Default branch: `main`
- Netlify Site ID: `35530ce7-21f4-4734-92ae-12758607e79e`

## Key Files & Folders
- `src/pages/*.astro` — 24 routes, 1:1 to URLs (file maps directly to `/slug`). 12 are thin data-only `ServicePage` wrappers. (`for-saas.html` was unified onto `.astro` in Session 6.)
- `src/layouts/BaseLayout.astro` — full `<head>` (meta, fonts, gtag-then-analytics, canonical, OG/Twitter, optional JSON-LD via `JsonLd` component); body with skip-link, `<Nav />`, `<slot />`, `<Footer />`, `<NetlifyFormStubs />`, bundled `nav.ts`. Props: `title`, `description`, `canonical`, `ogType?`, `ogImage?`, `noindex?`, `schema?`, `bareNav?`, `bareFooter?`.
- `src/components/` — `Nav.astro`, `Footer.astro`, `JsonLd.astro` (with `</script>` XSS-escape), `PageHero.astro`, `SmsOptInForm.astro`, `NetlifyFormStubs.astro` (hidden duplicate form so Netlify Forms detects sms-opt-in regardless of attribute stripping), `ServicePage.astro` (shared template for the 12 service detail pages — schema built from same data as visible content so it can't drift; since Session 18 the FAQ schema text is derived from the visible `htmlA` string, no separate schema field).
- `src/styles/global.css` — single shared stylesheet (was `styles.css` pre-migration). Imported once in `BaseLayout.astro`; Vite bundles, hashes, and emits to `/_astro/*.css`.
- `src/scripts/nav.ts` — sticky nav, mobile menu, services dropdown, scroll fade-up animations, Calendly init. TypeScript strict.
- `public/` — served at site root as-is: `analytics.js`, `fonts/`, favicons, `og-image.png`, `robots.txt`, IndexNow verification file.
- `_baseline/lighthouse-2026-05-14/*.json` — pre-migration Lighthouse reports (10 JSONs) kept as the performance budget reference. Astro doesn't process this folder (only `src/`).
- `_assets/` — source brand assets (PNG logos, pricing.jpg) — kept in repo but not deployed (outside `src/` and not in `public/`).
- `netlify.toml` — security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy, cache rules), `NODE_VERSION="24"`, `/resources` 301 → `/`, trailing 404 fallback. No per-page rewrites (Astro's flat `dist/<slug>.html` maps natively).
- `astro.config.mjs` — `site`, `output: 'static'`, `trailingSlash: 'never'`, `build.format: 'file'`, sitemap integration with the `/404` + `/case-studies` filter.
- `tsconfig.json` — extends `astro/tsconfigs/strict`; excludes `dist`, `node_modules`, `_baseline`, `_assets`.
- `.github/workflows/deploy.yml` — `npm ci` + `npm run build` + Netlify deploy + IndexNow ping (URL list inside)
- `.github/workflows/link-check.yml` — weekly curl-based link check (~11s)
- `.claude/settings.json` (committed) — shared project allowlist for safe-default commands (git, npm, gh, netlify, curl, lighthouse). Anyone with this repo gets the same Claude Code shortcuts.
- `.claude/settings.local.json` (gitignored) — per-machine overrides (more sensitive entries: `git reset`, `gh secret`, `netlify token`, etc.).
- `.claude/commands/` — slash commands (`/preview`, `/build-check`, `/add-page`, `/audit-seo`).
- `README.md` — deploy flow + when-you-add-a-new-page checklist (authoritative)
- `SITE_STATUS.md` — running checklist of completed/remaining work (authoritative)

## External Dependencies
- Netlify (hosting)
- GA4 Measurement ID `G-4QR1JQK9QL` (public)
- Microsoft Clarity ID `wgqsqcvysb` (public)
- IndexNow protocol (Bing/Yandex/etc; verification file `9ca65fb52b8ccbac961ff671bbbfa5cd.txt` in repo)
- Calendly (booking embed on `roi-call.html`)
- Twilio (referenced in `privacy-policy.html` for A2P SMS — implementation lives outside this repo)

## Environment Variables
None for build. Deploy uses GitHub Actions secrets:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

## Deployment
Push to `main` → GitHub Actions runs `npm ci && npm run build && netlify deploy --dir=dist --prod` then pings IndexNow with the URL list. End-to-end ~1 minute (the build step adds ~30s vs. the prior raw-HTML deploy).

**When adding a new page**, use the `/add-page <slug>` slash command — it scaffolds `src/pages/<slug>.astro` from the BaseLayout template and appends the URL to the IndexNow list in `deploy.yml` in one shot. The sitemap is autogenerated by `@astrojs/sitemap` and the nav/footer are shared components, so no longer-list-of-files-to-update like the pre-Astro era.

If you skip the slash command, the manual checklist is:
- Create `src/pages/<slug>.astro` (use any existing simple page as a template).
- Append the URL to the IndexNow `urlList` in `.github/workflows/deploy.yml`.
- (Optional) Update `link-check.yml` if you want CI to verify the new route.
- (Optional) Update `SITE_STATUS.md` page inventory.

No need to update sitemap.xml (autogenerated), netlify.toml (no per-page rewrite needed), or nav/footer links across all pages (the Nav and Footer components handle it once).

## Data Sources
Hand-authored content. No data files.

## Open Questions / TODO
Open tasks live in [`TODO.md`](TODO.md) — the single source of truth, ranked and synced to Notion. Architecture, decisions, completed inventory, and what's live are in [`SITE_STATUS.md`](SITE_STATUS.md). Do not maintain a separate open-task list here (the per-session "Open follow-ups" notes below are dated history, not the live list).

Long-term tech debt now resolved (2026-05-16):

- ✅ **Astro 5 migration** — shared BaseLayout + Nav + Footer + ServicePage components eliminate the per-page duplication.
- ✅ **`/for-saas` design-system unification** — port to BaseLayout + standard Nav/Footer + global.css; page-specific section classes (.proof-strip, .pain-card, .saas-service-card, .stat-card, .fit-cols) added to global.css as the truly page-unique layouts.
- ✅ **Unused fonts dropped** — 8 woff2 files for Plus Jakarta Sans + DM Sans removed when /for-saas was unified onto Inter + DM Mono.
- ✅ **Inline `style="..."` cleanup** — 93 → 25 (73% reduction). Utility classes in global.css cover the repeated patterns (.link-teal, .legal-prose, .legal-h2, .legal-list, .title--on-dark, .mb-{8,12,16,20,32,36,40}, .inline-cta). The remaining 25 are one-off positioning tweaks in for-saas/roi-call/sms-opt-in, not duplicated patterns.
- ✅ **CSP tightened where it actually mattered** — Microsoft Clarity was silently broken in prod since the CSP went up (bootstrap from `clarity.ms` loaded fine, but the actual SDK from `scripts.clarity.ms` was blocked by script-src). Fix: added `scripts.clarity.ms` to script-src + connect-src + added `c.clarity.ms` + `c.bing.com` to connect-src for the SDK's POSTs and Bing cookie sync. Also added `frame-ancestors 'none'` (CSP equivalent of the existing X-Frame-Options: DENY) and `upgrade-insecure-requests` directive.

Deliberately kept as-is, with rationale:

- **`'unsafe-inline'` in `script-src` and `style-src`** — removing requires per-build SHA-256 hashing of all inline JSON-LD blocks + Astro's bundled module scripts, with a custom build step to inject hashes into the netlify.toml CSP header on every deploy. ~2-4 hour focused task that doesn't unblock a specific user-facing security threat (static marketing site, no user-generated content, no auth surface). Astro 5's `experimental.csp` doesn't help — SSR-only, ships CSP via meta tag not header, won't work with our `output: 'static'` setup. Revisit when there's a specific compliance/audit driver.
- **Branch protection on `main`** — explicitly skipped while solo. Friction cost is real, security benefit is near-zero on a static marketing site with no secrets in the repo. Revisit if a collaborator joins.

## Recovery Notes
This project survived the **2026-05-04** complete machine wipe.

**Preserved:**
- Full git history on GitHub. Last commit: 2026-04-27 ("Add /privacy-policy and /terms pages for Twilio A2P registration").
- Live production site at homegrowngrowth.co (untouched).
- GitHub Actions secrets (Netlify token + site ID — stored in GitHub, never local).
- Rich `README.md` and `SITE_STATUS.md`.

**Lost:**
- Local `.claude/settings.local.json` overrides.
- Local Claude Code session history.

**Followup needed:**
- If deploying from this machine, verify `git push` works to remote.
- Rotate `NETLIFY_AUTH_TOKEN` in GitHub Actions secrets per post-malware rotation (see `claude_projects/ROTATION-LIST.md`).
- Verify GA4 + Clarity firing on live site.

## Session Log
### Session 1 — 2026-05-05
- Recovered from machine wipe; CLAUDE.md created.
- `.gitignore` expanded with the standard block (env, node_modules, dist, .next, .vercel, .claude/settings.local.json, .claude/file-history/) on top of the existing OS/editor/log entries.

### Session 2 — 2026-05-14
- Shipped `/sms-opt-in` page for Twilio TFV / A2P registration. New `sms-opt-in.html` carries a Netlify Forms-backed consent form (name + email + U.S. tel) with an unchecked-by-default TCPA disclosure (brand name, message types, frequency, STOP/HELP, message + data rates), honeypot anti-spam, and inline AJAX submit → success state. "What to expect" panel restates Privacy Policy §7 verbatim.
- Added anchor IDs for deep-linking: `id="sms-terms"` on `privacy-policy.html` §7 and `id="sms"` on `terms.html` §8. Updated `sitemap.xml`, `netlify.toml` (added clean-URL redirect + `form-action 'self'` directive to the existing CSP), `.github/workflows/deploy.yml` (IndexNow URL list), `.github/workflows/link-check.yml` (curl smoke list), `SITE_STATUS.md`.
- Added `<a href="sms-opt-in.html">SMS Updates</a>` to the Company column of the footer across all 13 standard-footer pages plus `for-saas.html`'s custom footer.
- Two commits on `main`: `4d23848` (recovery files — CLAUDE.md + .gitignore from Session 1) and `3529b81` (SMS opt-in feature, 21 files / 496 insertions). Both pushed; GitHub Actions auto-deploy went green in 1m10s; `curl -I https://homegrowngrowth.co/sms-opt-in` returns 200. **First post-recovery `git push` from this machine succeeded with no reauth needed.**
- One manual followup before Twilio submission: Netlify dashboard → site → Forms → `sms-opt-in` → Settings & usage → Add notification → email → `ian@homegrowngrowth.co`. Netlify Forms auto-detected the `data-netlify="true"` form on first deploy, so no other config is required.
- Revert path for the feature: `git revert 3529b81 && git push origin main`.

### Session 3 — 2026-05-14
- **Filesystem reorg (Phase A of the Astro migration plan).** Promoted the repo's local checkout from `claude_projects/homegrown-growthco/2026.04.20/hgc_v8/` up to `claude_projects/homegrown-growthco/` — eliminated the vestigial dated + version wrapper folders. Moved `restaurant-outreach/` out from under the marketing site and into its own sibling at `claude_projects/restaurant-outreach/`. GitHub repo root was already mapped to the website contents (the wrappers were local-only), so the live site was unaffected — verified by deploy `f087f80` going green in 1m30s with both `/` and `/sms-opt-in` returning 200 post-move.
- **Pre-flight commits before the move**: `482cf60` (this CLAUDE.md's Session 2 entry that had been authored but not committed during the prior `/log-status` pass) and `4b9e7c6` (10 Lighthouse JSONs at `_baseline/lighthouse-2026-05-14/` — the floor for the Astro migration's performance budget). Post-move commit: `f087f80` (drop stale `2026.04.20/hgc_v8/` path comment from README).
- **`.claude/` audit**: collapsed the 68-entry umbrella `settings.local.json` (accumulated across all projects under the old `homegrown-growthco/` root) down to 41 general-purpose entries scoped to this repo (`git *`, `gh *`, `netlify *`, `npm *`, `npx lighthouse *`, `curl -s *`, `curl -sI *`, `nslookup *`, `where *`). Dropped: 6 long Python JSON-parsing one-liners from past Netlify investigation work, ~10 one-off file ops (`rm -rf "HTML Files/"`, `mv HGC_logo_*compressed.png ...`), and specific-URL curl entries (consolidated). The new `.claude/settings.local.json` is gitignored per the existing rule; Phase C will further split into a committed `.claude/settings.json` (shared) + local-only overrides.
- 4 orphan brand-asset images that had been sitting at the umbrella folder level (`HGC_logo_1200x630.png`, two transparent variants, `pricing.jpg`) were folded into `_assets/` inside the new repo — untracked working-set files for now; decide later whether to commit.
- **Robocopy snapshot** of pre-reorg state at `C:\Users\Ian\_backup_hgc_v8-pre-reorg-2026-05-14\` (253 MB, outside OneDrive so it doesn't queue for upload). Delete after the 24-hour soak confirms no OneDrive `-2 ($filename)` conflict duplicates appear.
- **Lesson surfaced**: PowerShell `Move-Item` on an OneDrive-tracked git repo leaves orphan source files (reparse-point handles persist even with sync paused). Fix is to clear `IsReadOnly` on each file then run `Remove-Item -Recurse -Force` separately. Future moves of this class may benefit from robocopy + manual delete rather than `Move-Item`. Captured in `claude_projects/SESSION_FILE_OPS_LOG.md` op 101.
- **Plan file** with the full Phase A→D scope (filesystem reorg → Astro 5 migration → Claude Code optimization → security/compliance polish) lives at `~/.claude/plans/homegrown-growthco-2026-04-20-hgc-v8-cl-elegant-corbato.md`. v3 of that plan addressed two rounds of code-review feedback.
- **Pending**: 24-hour soak before Phase B (Astro 5 migration on a feature branch with branch-preview verification and `--no-ff` merge). Manual steps still open from Session 2: Netlify Forms notification setup + Twilio TFV/A2P submission.
- Revert path for Phase A: filesystem snapshot at the backup path above; git history is unaffected because git tracks via `.git/` location regardless of parent path.

### Session 4 — 2026-05-15
- **Fix CI: replace archived `netlify/actions/cli@master`** with `actions/setup-node@v4` + `npm install -g netlify-cli@22` + a plain `run: netlify deploy --dir=. ${{ ... --prod ... }}` step. The `netlify/actions` repo was archived earlier this year and the `master` ref deleted, so the previous step had been a latent breakage — the next push to `main` would have failed with "Unable to resolve action `netlify/actions/cli@master`, repository or version not found" (severity-8 VS Code Problems entry). Same env vars (`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`), same args, same `--prod` conditional on main pushes. Pinned to `netlify-cli@22` (current stable major) for predictability vs `@latest`. Deploy job runs ~1m now vs the prior ~30s, the difference being the global `netlify-cli` install per run.
- Commit `905b3b1` pushed to `main`. Verified live: `gh run list` shows deploy run `25916169568` returned `conclusion: success` at 11:47:53Z. `curl -sI https://homegrowngrowth.co/` returns 200. IndexNow ping step downstream is unchanged and fired as part of the same deploy job.
- Two unrelated VS Code Problems entries triaged at the same time (in sibling repos, not here): TheAutomationsGuide's `tsconfig.json` "baseUrl deprecated" warning got `ignoreDeprecations: "6.0"` added; TheAutomationsGuide's `qa-content-pr.yml` `SLACK_WEBHOOK_URL` "Context access might be invalid" lint is a known VS Code-extension false-positive (the secret IS configured and used), left as-is.
- Revert path for this session: `git revert 905b3b1 && git push origin main`. If reverted, the next push would re-break with the original archived-action error — would need to swap to a different replacement (e.g. `nwtgck/actions-netlify@v3`) before pushing again.

### Session 5 — 2026-05-16
**Phases B + C + D of the reorganization plan, all shipped today.** Site is now on Astro 5; Claude Code workflows formalized; basic security/compliance docs in place. Live-site behavior is byte-for-byte unchanged from the prior vanilla-HTML version (same content, same design system, same URLs).

**Phase B — Astro 5 migration** (merge commit `17980b5`):
- 8 commits on a feature branch (`astro-migration`), `--no-ff` merge to main. Branch-preview verified before merge (Netlify deploy `6a088938a10c9bcba7e89661`): all 17 routes 200, Netlify Forms detection succeeded (verified by AJAX POST returning Netlify's "Thank you!" page), JSON-LD inline, bundled CSS at `/_astro/*.css`, analytics order preserved, sitemap autogenerated.
- Architecture: 16 `.astro` pages under `src/pages/` + 1 static `.html` (for-saas, kept its embedded design system). Single `BaseLayout.astro` renders head/nav/footer/analytics for every page. Shared `ServicePage.astro` drives the 6 service detail pages from data props. `JsonLd.astro` uses the `</script>` XSS-escape pattern preemptively. `NetlifyFormStubs.astro` renders a hidden duplicate form on every page so Netlify Forms parser detects sms-opt-in regardless of attribute stripping.
- Infra: `NODE_VERSION="24"` pinned in netlify.toml (matches local); `deploy.yml` runs `npm ci && npm run build && netlify deploy --dir=dist`; `netlify.toml` dropped all 14 per-page `.html` rewrites (Astro's flat `dist/<slug>.html` maps natively); hand-maintained `sitemap.xml` deleted (autogenerated by `@astrojs/sitemap` with `/404` + `/case-studies` filter).
- **Trailing-slash 301 footgun caught and fixed** during branch preview: `build.format: 'directory'` (Astro default) produces `dist/<slug>/index.html` which Netlify redirects from `/<slug>` to `/<slug>/`. Flipped to `build.format: 'file'` (commit `9a87eae`), which produces `dist/<slug>.html` served at `/<slug>` directly — preserves the prod URL shape (no trailing slash) and avoids 301-chain SEO penalties.
- **`data-netlify` stripped from rendered HTML by Netlify processing — this is expected**, not a regression. Netlify strips that attribute after registering the form server-side; it's the signal the form was detected.
- Bundle stats: `_astro/*.css` chunk shared across all `.astro` pages (35KB hashed); inline `<script type="module">` for bundled nav.ts (under the size threshold for separate emission).
- Revert path: Netlify dashboard → previous prod deploy → "Publish deploy" (instant), THEN `git revert -m 1 17980b5` + revert `netlify.toml` build config in the same commit to keep repo state in sync with rolled-back deploy.

**Phase C — Claude Code optimization**:
- `.claude/settings.json` committed at the repo root with the audited shared allowlist (git/npm/gh/netlify/curl/lighthouse — safe-default commands any contributor would want). `.claude/settings.local.json` slimmed to per-machine-only entries (`git reset`, `gh secret`, `netlify token`, etc.) and stays gitignored.
- `.claude/commands/` slash commands authored: `/preview` (npm run dev in background), `/build-check` (npm run build + npm run preview + curl smoke), `/add-page <slug>` (scaffold src/pages/<slug>.astro from template + append URL to deploy.yml IndexNow list), `/audit-seo <url>` (re-run Lighthouse against the URL and diff against `_baseline/lighthouse-2026-05-14/*.json`).
- CLAUDE.md (this file) updated for the new architecture: Tech Stack, Key Files & Folders, Deployment, Open Questions / TODO sections all rewritten. The "when you add a new page" checklist now points at `/add-page`.

**Phase D — Security / compliance polish**:
- `SECURITY.md` added — single-paragraph vulnerability reporting policy.
- `LICENSE` added — proprietary, all rights reserved (clarifies status for anyone who finds the repo).
- Branch protection on `main` explicitly skipped while solo (friction cost vs. near-zero security benefit on a static marketing site with no secrets in the repo). Decision documented above.
- `.gitignore` audit pass: confirms `node_modules/`, `dist/`, `.astro/`, `.env*`, `.netlify/`, `.DS_Store`, `Thumbs.db`, `.claude/settings.local.json`, `.claude/file-history/` all gitignored; `_baseline/` intentionally NOT gitignored (kept tracked for the performance budget reference).

**Manual steps still open** (independent of this session's code work):
- Twilio TFV / A2P submission with `https://homegrowngrowth.co/sms-opt-in` — pending user. (Netlify Forms email notification is live ✅.)
- Google Business Profile setup, Clutch profile, testimonials — pre-existing items, see SITE_STATUS.md.

### Session 6 — 2026-05-16 (later same day)
**Tech-debt cleanup: closed out the 4 deferred items from the reorganization plan.** Single squashable feature commit `b59b2b4` on the `tech-debt-cleanup` branch, verified on Netlify branch preview (`6a088f87...`), merged via `--no-ff` to main as `38df23f`, prod deploy verified green. All 17 prod URLs still 200.

- **`/for-saas` unified onto the shared design system.** Replaced the 1137-line static `for-saas.html` (with its own embedded fonts/colors/nav/footer) with `for-saas.astro` using BaseLayout + standard Nav + standard Footer + global.css. SaaS-specific content preserved verbatim (hero, proof strip, 6 pain points, 6 service cards, 4-step process, 4 stats, fit cols, 6-FAQ, CTA). Added a small set of for-saas-specific section classes to global.css (.proof-strip, .pain-card, .saas-service-card, .stat-card, .fit-cols + .fit-col + .fit-list) since those layouts are truly page-unique.
- **Unused fonts dropped.** 5 Plus Jakarta Sans weights + 3 DM Sans variants (8 woff2 files, ~80 KB) deleted from `public/fonts/`; `fonts.css` trimmed to Inter + DM Mono only. These were only referenced by the embedded /for-saas design system.
- **Inline-style refactor.** 93 → 25 `style="..."` attributes across .astro pages (73% reduction via bulk PowerShell replace). New utility classes in global.css (.link-teal, .legal-prose, .legal-h2, .legal-list + child li, .title--on-dark, .title--on-dark-spaced, .eyebrow--block, .mb-{8,12,16,20,32,36,40}, .inline-cta + .inline-cta__body) cover the repeated patterns. The remaining 25 are bespoke positioning tweaks in for-saas/roi-call/sms-opt-in, not duplicated patterns. **Caught and fixed a bulk-replace bug mid-session**: the script created `class="A" class="B"` duplicates instead of merging — second `class=` attribute is silently ignored by browsers, so styles wouldn't apply. Fixed by a follow-up regex pass merging into `class="A B"` across all .astro pages.
- **CSP fix + hardening.** **MEANINGFUL FIX**: Lighthouse audit revealed Microsoft Clarity has been silently broken in prod since the CSP was set up — the bootstrap from `clarity.ms` loaded but the actual SDK from `scripts.clarity.ms` was blocked by script-src, so session capture was silently failing with a CSP violation showing up in the `errors-in-console` and `inspector-issues` Lighthouse audits. Fix: added `scripts.clarity.ms` to script-src, plus `scripts.clarity.ms` + `c.clarity.ms` + `c.bing.com` to connect-src for the SDK's POSTs and Bing cookie sync. **HARDENING**: added `frame-ancestors 'none'` (CSP equivalent of the existing X-Frame-Options: DENY header) and `upgrade-insecure-requests` (auto-upgrade any http:// references — defensive, no current references). **Deliberately kept**: `'unsafe-inline'` in script-src and style-src — removing requires per-build SHA-256 hashing of inline JSON-LD + module scripts with a custom build step to inject into the netlify.toml CSP header. ~2-4 hours of focused work; doesn't unblock a real user-facing threat on a static marketing site with no UGC or auth surface. Astro 5's `experimental.csp` doesn't help (SSR-only, meta-tag delivery, won't work with our static output). Decision documented as the next step when there's a specific compliance driver.
- **Lighthouse Best Practices expected to rise** from 0.73 → ~0.95 once the CSP fix lands and the `errors-in-console` + `inspector-issues` audits stop failing on the blocked Clarity SDK. The remaining deduction is the `third-party-cookies` audit (weight 5) — that's Clarity using cookies at all, not fixable without removing Clarity.
- Revert path: Netlify dashboard → previous prod deploy → "Publish deploy" (instant), THEN `git revert -m 1 38df23f` on main.

### Session 7 — 2026-05-22
**robots.txt sitemap reference fix (+ stale netlify.toml comment cleanup).** Single commit `330d064`, GH Actions deploy `26292386877` green in 52s.

- **Bug found while diagnosing an unrelated http:// indexing question.** User opened GSC URL Inspection on `https://homegrowngrowth.co/`. Page is indexed ✅, Google-selected canonical matched the user-declared canonical ✅, fetch successful ✅ — but Discovery → Sitemaps line showed "Temporary processing error". `curl -sI https://homegrowngrowth.co/sitemap.xml` returned 404. Cause: Session 5's Astro 5 migration deleted the hand-maintained `sitemap.xml` when `@astrojs/sitemap` took over autogenerating `sitemap-index.xml` + `sitemap-0.xml`, but `public/robots.txt` was never updated. The dead URL had been silently 404ing in GSC for 6 days; pages were still being indexed via other discovery paths so the error didn't surface at the page-indexing level.
- **Fix:** 1-line edit in `public/robots.txt` changing `Sitemap: https://homegrowngrowth.co/sitemap.xml` → `Sitemap: https://homegrowngrowth.co/sitemap-index.xml`. Bundled with a stale comment cleanup in `netlify.toml:44-49` that still described pre-migration `build.format: 'directory'` behavior (Session 5 flipped to `'file'` to avoid trailing-slash 301s — comment wasn't updated). Commit message embedded the revert path.
- **Manual GSC follow-up (user action, post-deploy):** In Search Console → Sitemaps, removed the old `sitemap.xml` entry and submitted `https://homegrowngrowth.co/sitemap-index.xml`. Processed cleanly. The "Temporary processing error" badge in URL Inspection will self-clear on the next crawl.
- **Side advisory on http:// indexing** (no code change): Netlify already returns 301 from http://apex + http://www + https://www to https://apex (verified via `curl -sIL`), HSTS with `preload` is set in [netlify.toml:14](netlify.toml#L14), and CSP `upgrade-insecure-requests` is on. Quick sanity check: `site:homegrowngrowth.co -inurl:https` in Google — if 0 results, http://-version isn't indexed and there's nothing to remove. If non-zero, user can add `http://homegrowngrowth.co` as a separate URL-prefix property in GSC and use Removals tool (temporary 6-month hide while the 301s do their permanent consolidation). User added the URL-prefix property; auto-verified via DNS (Domain property already covered it).
- **Memory saved** at `~/.claude/projects/.../memory/feedback_robots_sitemap_after_migration.md` — when migrating from a hand-maintained sitemap.xml to a framework-autogenerated one, update `robots.txt` AND the GSC submitted sitemap in the same change; otherwise GSC discovery error is silent for weeks.
- **Heads-up from deploy log** (no immediate action): GitHub flagged `actions/checkout@v4` and `actions/setup-node@v4` as Node 20-based, deprecated 2026-06-02. Will auto-flip to Node 24 on that date. Worth pinning to the next major when GitHub publishes them, but no rush.
- Revert path: `git revert 330d064 && git push origin main`. Would re-introduce the GSC error and require re-submitting the old `sitemap.xml` (which still 404s, so don't actually revert).

### Session 8 — 2026-05-25 / 2026-05-26
**Fractional Growth Operations umbrella pivot + Phase B Local hub + 6 visual rounds.** 8 commits on feature branch `umbrella-pivot-phase-a`, [PR #3](https://github.com/homegrowngrowthco/homegrown-growth-co/pull/3) OPEN. **Not merged to `main` yet** — preview-only pending user copy/visual review. All work below is on the branch.

**Phase A — Umbrella pivot from "Fractional RevOps" → "Fractional Growth Operations"** (`f411375`):
- Brand name unchanged; positioning broadens to cover RevOps + GTM Strategy + Demand Gen + Website SEO/GEO + Workflows & Automation as a capability umbrella across 3 pillars (Strategy & Operations | Systems & Data | Growth & Acquisition). Solo positioning preserved.
- 3 new service detail pages: [`/gtm-strategy`](src/pages/gtm-strategy.astro), [`/demand-generation`](src/pages/demand-generation.astro), [`/website-seo-geo`](src/pages/website-seo-geo.astro) — all wrap `ServicePage.astro`, zero new component code.
- Display rename: Process Automation → "Workflows & Automation". Slug `/process-automation` preserved for SEO equity (display-only change in titles, nav, footer, related-services labels).
- `/services` overview rebuilt with pillar headers + the 9 service rows; `mainEntity.ItemList` schema lists all 9 services with provider context.
- `/pricing` rebuilt from 3 retainer tiers + price table to **4 engagement-model packages** (Retainer / Project-Based / Outcome-Based / Assessment). Visible `$` amounts removed; precise number moves to discovery call. Old `.pricing-card`/`.pricing-table` CSS now dead (kept for now).
- Schema: `OfferCatalog` 6 → 9 services; `Person.jobTitle` = "Founder & Fractional Growth Operations Consultant"; `knowsAbout` adds Demand Generation + SEO + GEO + GTM Strategy.
- 6 existing service detail pages' pricing-FAQ rewritten — no more retainer-tier `$` amounts; engagement-model framing throughout.
- **Nav**: services dropdown restructured into pillared 3-column mega-menu (desktop) + pillar groupings (mobile drawer). New `.nav__dropdown--mega`, `.nav__dropdown-col`, `.nav__dropdown-pillar`, `.nav__mobile-pillar` classes in `global.css`.
- **Footer**: services column expanded 6 → 9 entries; new "Industries" subhead added later (Phase B) with `/for-saas` + `/for-local-businesses` above Company.

**Visual rounds 2-5** (`b9898dd`, `003c1f6`, `f70e87a`, `1bd3c47`):
- **Humanize sweep**: 119 em/en dash occurrences across 23 files swept (titles use pipe `|`, body uses periods/commas/colons/parens, number ranges use hyphen). Voice rule from feedback memory honored.
- Homepage rewritten ROI-led: pretag "Fractional Growth Operations", H1 "Senior growth ops, fractional cost.", pain-led subhead ("Your pipeline forecast is a gut call. Manual work owns the week. ..."), stat strip with 4 icons, How-It-Works 4-step dark section, FAQ trimmed 6 → 4. Sweep removed "$2-10M businesses" framing from hero + meta description + ProfessionalService schema + FAQ Q1 per user pushback against revenue targeting.
- Capabilities section condensed: pillar group headers dropped, flat 3×3 grid of compact cards with pillar surfaced as small tag chip.
- PageHero padding loosened; tag becomes teal pill with dot.
- ServicePage restructured: hero condensed, "Good fit if" lifted out of right sidebar into horizontal strip directly below hero, "What's Included" promoted to full-width 2-col card grid with teal check-circles + numbered (01-04) cards.
- FAQ converted to 2-col bordered card grid across all `.faq-stack` usages.
- Outcomes bar-chart visualization added (CSS-only horizontal bars), later dropped in Round 7 in favor of expanded stat grid.
- Platform logo strip added to homepage ("Built on the stack you already use"). Iterations: text wordmarks → simpleicons monochrome SVGs → full-color brand SVGs (HubSpot, Zapier, Stripe, Notion via simpleicons CC0 + brand-color requests; Salesforce, Slack via Wikipedia Commons; n8n in brand pink `#EA4B71` via simpleicons). Clay finished as text-only placeholder pending user-supplied SVG.

**Phase B — `/for-local-businesses` vertical hub** (`0f90269`):
- New 273-line page at [`src/pages/for-local-businesses.astro`](src/pages/for-local-businesses.astro), cloned from `/for-saas` template, adapted for local + multi-location service businesses (restaurants, healthcare practices, home services, multi-location franchises).
- H1: "Get found. Get booked. Get repeat business."
- 6 pain cards adapted to local funnel leakage (local pack invisible, leads going cold, sporadic reviews, booking chaos, unattributed ad spend, multi-location inconsistency).
- 6 service cards reweighted: Local SEO & GEO, Demand Gen, Workflows & Automation, Reporting & Analytics, CRM Implementation, **Multi-Location Operations Audit** (hub-unique).
- 4-step process (same as `/for-saas`, copy refreshed); stats reframed: Top 3 local pack rank in 90 days, 3-5x reviews/mo, 8-15% inbound conversion, $30K+ ad waste eliminated.
- 6 FAQs rewritten for local-business buyer; Fit cols rewritten.
- **Footer restructure**: new "Industries" subhead with `/for-saas` + `/for-local-businesses` links above existing Company column. Both vertical hubs now surfaced sitewide.
- `.github/workflows/deploy.yml` IndexNow URL list + `.github/workflows/link-check.yml` smoke list updated.

**Round 7 — 2-col hero with image + 6-stat 3×2 grid + accordion FAQ + real photography** (`8438a3a`):
- Homepage + every PageHero usage + ServicePage hero now **2-column** with hero image on the right (resolves user feedback that single-column hero had massive empty right whitespace). Hero top padding tightened 72 → 48px.
- **Stat strip** rebuilt to 6 items in 3×2 grid with `$` values: $150K+ saved vs full-time VP, $30K+ ad waste eliminated, $50K+ tech stack savings, 10+ hrs reclaimed weekly, 2-4x forecast accuracy, 30-90 days to ROI. Outcomes bar-chart section from Round 4 dropped (this grid does both jobs in less vertical space).
- All FAQs converted to native `<details>`/`<summary>` accordion (click-to-expand, rotating chevron). Homepage, pricing, all 9 service detail pages, `/for-saas`, `/for-local-businesses`.
- [`PageHero.astro`](src/components/PageHero.astro) gains `heroImage` + `heroImageAlt` props; passing either activates 2-col split.
- [`ServicePage.astro`](src/components/ServicePage.astro) hero now 2-col with default `/images/hero-strategy.jpg`; per-service `heroImage` prop available for overrides.
- 4 Unsplash photos downloaded to [`public/images/`](public/images/) (Unsplash License — free commercial use, no attribution required): `hero-analytics.jpg` (homepage), `hero-strategy.jpg` (default + `/services` + `/pricing`), `hero-saas.jpg` (`/for-saas`), `hero-local.jpg` (`/for-local-businesses`).
- Clay logo wired in ([`public/logos/clay.png`](public/logos/clay.png), user-supplied PNG copied from `68dd418739aadd6263219522_clay-logo.png` at repo root, source gitignored). All 8 platforms now render proper logos.

**Round 8 — trigger commit** (`08af0f7`): empty commit to force GH Actions re-trigger after a transient queue stall on commit `8438a3a`.

**Status at session close:**
- 8 commits on `umbrella-pivot-phase-a`; PR #3 OPEN.
- Build clean throughout (21 pages, ~2s).
- Netlify deploy preview live at `https://deploy-preview-3--zesty-cranachan-42c3b7.netlify.app/` (or per-commit URL from PR checks).
- All work is **preview-only, NOT merged to main**. User to review preview, iterate on copy/visual feedback, then merge via `--no-ff` once approved.
- Revert before merge: simply close PR + delete branch. After merge: `git revert -m 1 <merge-sha> && git push origin main` or instant rollback via Netlify dashboard → previous prod deploy → "Publish deploy".

**Open follow-ups (deferred):**
- **Phase C: `/for-saas` content refresh** — still references the pre-pivot service set; needs GTM Strategy / Demand Gen / SEO mentions added.
- **Per-service hero images** — all 9 service detail pages share `/images/hero-strategy.jpg`; per-service Unsplash sources or custom imagery TBD.
- **Real case studies** to replace `/case-studies` placeholder.
- **`/about` headshot** to replace photo-coming-soon placeholder.
- Distribution items unchanged from prior sessions: GBP, Clutch, testimonials.

**Manual followup unchanged**: Twilio TFV / A2P submission with https://homegrowngrowth.co/sms-opt-in (Netlify Forms email is live).

### Session 9 — 2026-05-26 (continuation)
**Session 8 preview branch reviewed, polished across 6 commits, then merged to main as `ba56414` via `--no-ff`.** Production deploy verified green. Mobile QA via Playwright caught + fixed a subgrid bug surfacing only at small viewports. Branch closed.

**Sub-session A — preview URL fix + per-service heroes + 2-col What's Included** (commit `88525bf`):
- User reported preview link wasn't working. Diagnosis: CLAUDE.md Session 8 recorded the wrong URL pattern (`deploy-preview-3--zesty-cranachan-42c3b7.netlify.app` — only exists when Netlify's GitHub App is installed; this site deploys via GHA CLI which produces deploy-ID URLs `<deploy-id>--zesty-cranachan-42c3b7.netlify.app`). Pushed empty re-trigger commit `776cb12` to rebuild a fresh preview after the previous 3 commits' webhooks had silently dropped. Memory saved at `~/.claude/.../reference_homegrown_growthco_preview_url_pattern.md` so future sessions don't propagate the wrong pattern.
- **`ServicePage.astro` "What's Included" → 2-col layout**: hook text + "The approach" eyebrow on the left (sticky on long pages), included card stack on the right. Collapses to single column below 880px. Reverses Session 6's full-width promotion at user request.
- **9 distinct service detail hero images** sourced from Unsplash CDN (used WebFetch to extract canonical `images.unsplash.com/photo-<UUID>` URLs since direct `/photos/<slug>/download` redirects return 404 HTML; agent's first sourcing pass returned 4 mismatches — re-sourced 3 of those via WebFetch on Unsplash search pages, reassigned Speedcurve dashboard photo from `tech-stack-audit` → `reporting-analytics` after visual QA). Final mapping:
  - `/gtm-strategy` — woman at whiteboard with sticky notes
  - `/fractional-revops` — multi-monitor Mac desk setup
  - `/tech-stack-audit` — grid of SaaS tool icons (cPanel-style)
  - `/crm-implementation` — team of 3 around monitors
  - `/reporting-analytics` — Speedcurve performance dashboard
  - `/process-automation` — hands on MacBook in workflow rule editor
  - `/demand-generation` — team brainstorm at chalkboard
  - `/website-seo-geo` — laptop with AI search bar ("What can I help with?")
  - `/sales-comp-enablement` — presenter with "SALES VALUE" dashboard
- **Homepage hero photo → inline SVG**: 8-node mesh with central teal hub + dashed orbital connection lines; replaced `hero-analytics.jpg` dashboard photo (user disliked "it kind of stinks, clearly AI"). Audited via `msedge --headless --screenshot` before commit.

**Sub-session B — brand positioning + hero copy + visual overhaul** (commit `a7b64a1`):
- **Drop "Fractional Growth Operations" tagline across site** (keep "Fractional RevOps" as a service product name). New brand category: "Senior Growth Operations". New tagline: "Growth operations, owned end-to-end." Sweep covers Footer descriptor, index meta + schema description + jobTitle, hero pretag + H1 + subhead, about jobTitle + "Why Fractional" eyebrow + prose, for-saas + for-local-businesses descriptions + subtitles, pricing + services + terms + privacy descriptions.
- **Homepage hero copy rewritten as brand strategist** for a senior practice attracting new clients. New H1: "Growth operations, owned end-to-end." New subhead: "Most growing companies don't lose to bigger competitors. They lose to half-true CRMs, gut-feel forecasts, and manual work that owns the week. Get one senior partner to own the operational layer behind your revenue, and prove it pays for itself in 90 days."
- **Hero SVG redesign** (user reported the 8-node mesh "kind of stinks, clearly AI"): replaced with a 4-step process diagram ("Diagnose → Build → Scale → Compound") + step numbers (01-04) above each circle + bold labels + 1-line descriptions below + the 4th node filled teal as the visual destination + dashed connecting line + title at top "How an engagement compounds." (later changed in Session 9 sub-session C to "How an engagement drives growth."). Audited via Edge headless screenshot before commit.
- **Pricing card alignment fix**: CSS Grid subgrid (`grid-template-rows: subgrid`) so tag / header / Best-for / Included / How-it-starts / CTA align across all 4 engagement-model cards. Added transparent border to `.btn--primary` and `.btn--white` so all three button variants (`--primary` / `--outline` / `--white`) have identical height.
- **Stat strip restructured**: vertical cards (icon-on-top, separate row) → compact horizontal boxes (icon-left, value+label stacked on right) inside surface-bordered cards. Cuts homepage vertical bloat ~40%.
- **Tech stack 9th option "Your stack"** added so prospects whose tools aren't in the 8-logo strip don't bounce. Custom inline SVG (3 tool tiles + "+" badge) at [`public/logos/custom-stack.svg`](public/logos/custom-stack.svg).
- **"Growth engine" sweep**: replaced across services/pricing/ROI-call/about/case-studies in favor of "where revenue is leaking / what's possible if it's rebuilt" — user feedback that small non-SaaS businesses don't understand the "growth engine" metaphor.
- **ROI Call page H1 + subhead reworked**: new H1 "Find out where revenue is leaking, and the upside if it's rebuilt." New subhead drops "growth engine" + adds "thirty structured minutes" framing.

**Sub-session C — polish round** (commit `fb01804`):
- **Pricing "Book a Call" button vertical centering fix**: dropped `padding-top: 0` from `.package-card__cta`. The override was making the button asymmetric (top 0px, bottom 14px), top-skewing the text.
- **Homepage hero SVG title** "How an engagement compounds." → "How an engagement drives growth." Subtitle "Four phases. One senior partner, end to end." → "Four phases. One goal: grow the business." (drop "senior partner" framing per user request).
- **Removed "Avg. ROI in 30-90 days" badge** from hero SVG (no surrounding content backed up the number; user found it confusing).
- **`$150K+ saved` stat replaced with `$1M+` pipeline added** in year one from a rebuilt motion. Defensive framing → aspirational framing showing what's possible.
- **FAQ heading** "Common ones." → "Common questions from new clients." Widened FAQ + bottom CTA containers from `container--narrow` → `container` to match the "How It Works" section width.
- **Homepage CTA body rewritten**: "Thirty minutes to map current process and discuss potential ideas and improvements. No pitch, no proposal on the call. You leave with concrete next steps to grow your business, regardless of fit."

**Sub-session D — defensive mobile CSS** (commit `a44a019`):
- Added `min-width: 0` to `.hero__content` + `.hero__visual` + `.page-hero__content` + `.page-hero__visual`, and switched their parent grids to `grid-template-columns: minmax(0, Xfr) minmax(0, Yfr)`. Grid items default to `min-width: auto` which can't shrink below the intrinsic content size; the homepage SVG (`viewBox="0 0 500 400"` with no explicit width attr) has a 500px intrinsic content size that could force the single-column mobile grid wider than viewport. Defensive even if not currently triggering. Also added explicit `width="100%" height="100%" preserveAspectRatio="xMidYMid meet"` to the homepage hero SVG.

**Sub-session E — mobile/tablet QA via Playwright + subgrid bug surface + fix** (commit `2a46a19`):
- Edge headless `--window-size` ignores the requested viewport and renders at ~476px regardless; switched to **Playwright** (installed via npm install playwright; ~250MB Chromium bundle) for accurate 390 (mobile) + 768 (tablet) screenshots. Captured 16 screenshots across 8 priority pages (home, services, pricing, roi-call, fractional-revops, for-saas, for-local-businesses, about).
- **Caught: pricing cards rendered blank at <=1100px**. Root cause: `.packages-grid` declares 6 explicit `grid-template-rows` to drive subgrid alignment across the 4 cards in desktop 4-col layout. At <=1100px the breakpoint switches columns to 2 (or 1 at <=600px) but keeps the 6-row template; cards 2-4 land in implicit rows where subgrid doesn't apply, so they render as zero-height. Fix: at <=1100px, drop `grid-template-rows` on `.packages-grid` and switch `.package-card` back to `display: flex; flex-direction: column; grid-row: auto`. Subgrid stays on for the 4-col desktop layout where it provides the alignment benefit.
- All 7 other pages QA'd: hero renders cleanly, accordion FAQs work, stat strips collapse correctly, service detail page 2-col What's Included collapses to single column below 880px as designed.

**Sub-session F — PR #3 merge to main** (merge commit `ba56414`):
- `gh pr merge 3 --merge` ($mode: `--no-ff` equivalent, matching this repo's convention from Session 5 + 6 merges). Pre-flight: PR mergeable=`MERGEABLE`, state=`OPEN`, deploy check=`SUCCESS`.
- Production GH Actions deploy `26466548113` returned `conclusion: success`. Smoke-tested `curl -sI` against `/`, `/pricing`, `/roi-call`, `/for-local-businesses`, `/gtm-strategy` — all 200.
- Branch closed (Netlify auto-cleans the preview deploys).

**Status at session close:**
- **Production live**: https://homegrowngrowth.co/ — Fractional Growth Operations umbrella pivot + Phase B Local hub + brand polish + mobile QA fixes all shipped.
- 6 commits on `umbrella-pivot-phase-a` post-Session-8 (`776cb12` re-trigger, `88525bf` heroes+SVG+2-col, `a7b64a1` brand+UI, `fb01804` polish, `a44a019` defensive mobile, `2a46a19` subgrid fix), `--no-ff` merge `ba56414` on main.
- 21 pages still build in ~2s.
- Memories saved this session: `reference_homegrown_growthco_preview_url_pattern.md` (deploy-ID URL pattern, not deploy-preview-PR# — Netlify GH App isn't installed for this site).

**Open follow-ups carried forward (unchanged from Session 8 close except where checked):**
- ~~Per-service hero images for the 9 service detail pages~~ ✅ Done this session.
- ~~Phase C `/for-saas` content refresh~~ ⏸️ Still references pre-pivot service set; needs GTM Strategy / Demand Gen / SEO mentions added. Deferred.
- Real case studies to replace `/case-studies` placeholder. Deferred.
- `/about` headshot to replace photo-coming-soon placeholder. Deferred.
- Distribution items: GBP, Clutch, testimonials. Deferred (user actions).
- Twilio TFV / A2P submission with https://homegrowngrowth.co/sms-opt-in. Manual, unchanged.

**Revert path** (in order of impact): instant Netlify rollback → previous prod deploy via dashboard. Then `git revert -m 1 ba56414 && git push origin main` to keep git history in sync with the rolled-back deploy.

### Session 10 — 2026-05-27
**Phase C: `/for-saas` content refresh + GBP marked live.** Single commit on `main`, deploy verified green. Closes the umbrella pivot punch list — the SaaS vertical hub now reflects the same 9-capability framing as `/services` and `/for-local-businesses`.

- **Service cards expanded 6 → 9** in [`src/pages/for-saas.astro`](src/pages/for-saas.astro), reordered by pillar to mirror `/services`:
  - **Strategy & Ops:** GTM Strategy (new), Fractional RevOps (renamed from "Embedded Growth Ops"), Tech Stack Audit (renamed from "GTM Tech Stack Audit").
  - **Systems & Data:** CRM Implementation & Cleanup, Reporting & Analytics (renamed from "Pipeline Analytics & Forecasting"), Workflows & Automation (renamed from "Automation & Workflow Design").
  - **Growth & Acquisition:** Demand Generation (new), Website SEO & GEO (new), Sales Comp & Enablement.
  - Card body + bullets for the 3 new entries pulled from the canonical service definitions in [`src/pages/services.astro`](src/pages/services.astro) so the SaaS hub can't drift from the services overview.
- **Pain points reweighted (still 6).** Swapped out "Comp plan nobody fully understands" + the prior "Manual work" framing for new entries that cover GTM motion ("GTM motion isn't repeatable yet") and demand+SEO ("Acquisition stalled and AI search is invisible"). 6 pains now span Reporting / GTM Strategy / CRM / Workflows / Demand Gen+SEO / Fractional RevOps.
- **New FAQ added (6 → 7):** "Do I need the whole umbrella, or just one piece?" answers the highest-frequency shopper question after the pivot (i.e. "is this an all-or-nothing engagement?"). Existing FAQs lightly refreshed to drop the narrow "RevOps" framing for the broader "growth ops" umbrella.
- **Stats trimmed of pre-umbrella language.** "Hours/week" → concrete "10+ hrs / week reclaimed once automation and routing are live"; "RevOps experience" → "Senior growth ops experience"; "full-time RevOps hire" → "full-time senior growth ops hire".
- **Hero subtitle + meta description rewritten** to enumerate the umbrella: "GTM strategy, RevOps, demand gen, SEO and GEO, and the systems behind them. Owned end-to-end so your founder isn't."
- **Pain section heading** "Your ops are holding your growth back." → "Where SaaS growth typically leaks." (ties to the brand "leaking / rebuilt" framing established in Session 9).
- **CTA H2** "Ready to stop doing ops work yourself?" → "Ready to own growth operations end-to-end?" (mirrors the brand line "Growth operations, owned end-to-end.").
- **Grid layout pre-flighted via local preview** — `.saas-services-grid` is `repeat(3, 1fr)` desktop / `repeat(2, 1fr)` tablet / 1fr mobile. 9 cards = 3 clean desktop rows, 4 tablet rows + 1 orphan card on the last row (acceptable; same grid renders fine with the 6-card `/for-local-businesses`). Validated via curl-against-`npm run preview`: 9 cards rendered in expected pillar order, all new copy strings present.
- **GBP marked live in SITE_STATUS.md** — user reports Google Business Profile is published at https://share.google/pjlSd3uuV2CDQqxLD. Moved from "Distribution & marketing — your action" → new "Distribution presences (external)" subsection under Completed. Updated "Highest-Impact Next Action" from GBP → Clutch profile.
- Build clean: 21 pages in 2.10s. No layout/structural changes, content-only.
- Revert path: `git revert <Session-10-commit-sha> && git push origin main`. If `/for-saas` copy needs to be tuned after Ian's review, copy edits are isolated to the frontmatter `saasServices` / `painPoints` / `faqs` / `stats` arrays — small, surgical follow-up commits are fine.

**Open follow-ups carried forward:**
- Real case studies to replace `/case-studies` placeholder. Deferred.
- `/about` headshot to replace photo-coming-soon placeholder. Deferred (no headshot yet per user 2026-05-27).
- Distribution items now: Clutch profile, G2 / HubSpot Solutions Directory, Calendly intake questions, testimonials (single biggest conversion gap).
- Twilio TFV / A2P submission with https://homegrowngrowth.co/sms-opt-in. Manual, unchanged.

### Session 11 — 2026-06-02
**Footer email JS-obfuscation + git-push-post-recovery verification.** Single commit `590afce` on main; GH Actions deploy green; verified live.
- **Footer email obfuscated (`src/components/Footer.astro`).** Both footer `mailto:ian@homegrowngrowth.co` links (the Company-column "Contact" link + the display email in the footer bar) now carry the address in `data-eu`/`data-ed` attributes and are assembled into a real `mailto:` at runtime by a small inlined module script, so bots scraping the static HTML never see a plain address. The visible link keeps a human-readable `ian [at] homegrowngrowth [dot] co` no-JS fallback that JS upgrades to the clean address. Built clean (21 pages); `dist/` confirmed to have no plaintext footer mailto. The in-body `mailto:` on `/privacy-policy`, `/terms`, `/sms-opt-in` is left readable on purpose (legal/contact prose, out of scope for "footer mailto").
- **git push verified** post-recovery via `git push --dry-run origin HEAD` → reached origin, authenticated, "Everything up-to-date" (closes the Recovery-Notes "verify git push works" follow-up).
- **Revert path:** `git revert 590afce && git push origin main` (Footer.astro + SITE_STATUS.md). Obfuscation is purely additive; reverting restores the plain mailto links.

### Session 12 — 2026-06-08
**Twilio TFV consent unbundling + sending-number display + About-page broadening.** CODE-COMPLETE, build clean (21 pages). Plan at `~/.claude/plans/homegrown-growthco-claude-md-i-keep-fai-woolly-origami.md`.
- **TFV blocker fixed (the reason resubmissions kept failing).** A reviewer's feedback said the consent form was "very close" but the SMS consent checkbox still **bundled the Privacy Policy + Terms acknowledgment into the consent statement** — TFV requires the SMS consent to stand alone. In [`src/components/SmsOptInForm.astro`](src/components/SmsOptInForm.astro) the trailing "By opting in I acknowledge the SMS section of the Privacy Policy and the Terms & Conditions." (plus its two inline links) was removed from the consent `<span>`; the consent now ends at "...HELP for help." and matches the reviewer's approved wording verbatim. The Privacy Policy + Terms links were re-surfaced in a **separate** `<p class="form-consent__legal">` directly below the `</label>` (new muted style in `global.css`, pulled up tight under the consent box). Anchors `#sms-terms` / `#sms` unchanged. NetlifyFormStubs + AJAX script untouched. Verified in `dist/`: `acknowledge` count = 0, consent span closes before the standalone legal `<p>`.
- **Sending number surfaced for business-identity verification** (reviewer's 2nd point — earlier rejection cited identity couldn't be independently verified). Added **+1 (866) 369-4940** (TFV number `+18663694940`) to [`src/pages/sms-opt-in.astro`](src/pages/sms-opt-in.astro) "What to expect" panel (new **Sender** line) and [`src/pages/privacy-policy.astro`](src/pages/privacy-policy.astro) §7. Site already uses "Homegrown Growth Co." consistently sitewide.
- **About page broadened + visibility-audit CTA** ([`src/pages/about.astro`](src/pages/about.astro)) to align with the **growth-engine** multi-vertical direction (local + multi-location service businesses: home services, medical & wellness, auto, restaurants). Audience framing widened ("founders, owners, executives, and GTM leaders"); added a plain-voice paragraph describing the digital-presence/visibility work; softened the SaaS-only "$10M ARR" benchmark → "overkill for most growing businesses"; added an inline "Get a free visibility audit →" CTA → `/roi-call`; `knowsAbout` schema gained Local SEO / Google Business Profile Optimization / Lead Generation / Multi-Location Operations; meta description broadened. **CTA routes to `/roi-call`, not audit.homegrowngrowth.co** — the audit root is a private-per-lead-report placeholder ("reports delivered via private link"), not a self-serve tool; a public self-serve audit page would be a separate growth-engine build (logged in plan backlog).
- **Note:** an em-dash sweep was discussed but descoped — the user clarified those dashes were on a different site (TAG); homegrown-growthco source is already dash-clean. One trivial leftover: homepage hero SVG renders "— HOW WE WORK" ([`index.astro:150`](src/pages/index.astro#L150)); left as-is.
- **User action (unblocked):** resubmit Twilio TFV for +18663694940; confirm the TFV business-name field exactly = "Homegrown Growth Co." Reviewer cautioned approval isn't guaranteed (team re-checks).
- **Revert path:** `git revert <sha> && git push origin main` (SmsOptInForm.astro, sms-opt-in.astro, privacy-policy.astro, about.astro, global.css + the two status docs).

### Session 13 — 2026-06-09
**Design-system rebrand: aligned fonts, colors, and logo to the finalized HGC Design System kit.** Work is on branch `design-system-rebrand` (preview-only, **NOT merged**). Source kit fetched from an Anthropic design URL as `HGC Design System FINAL - 20260605-handoff.tar.gz` and extracted to `c:\tmp\hgc_design_kit\` — its `colors_and_type.css` + `README.md` are the new visual source of truth. The kit's copy/positioning already matched the live site, so this was a **visual** pass only. Plan at `~/.claude/plans/homegrown-growthco-claude-md-please-rea-mutable-barto.md`.

- **Fonts → Geist.** Swapped Inter (400-800) + DM Mono → **Geist Sans (400/500/600/700) + Geist Mono (400/500)**, self-hosted. Copied 6 woff2 into `public/fonts/`, rewrote `public/fonts/fonts.css`, updated `BaseLayout.astro` preloads (Geist-Regular + Geist-Bold), `git rm`'d the 6 Inter/DM Mono woff2. `--font-display/-body` → `'Geist', ...`; `--font-mono` → `'Geist Mono', ...`. (Used the real woff2 via `@font-face url()`, **not** the kit's 384KB base64 `embedded-fonts.css` — that's a print/PDF optimization.) Geist tops out at 700, so all `font-weight:800` clamped to 700 sitewide (incl. logo + `.fw-800` utility value + 404).
- **Colors → kit palette.** Revalued the existing `--color-*` semantic names in `global.css :root` (kept the names so 4,000 lines downstream stayed working) and **added the full kit primitive scales** (`--teal-50..900`, `--slate-50..900`, `--tan-50..600`, `--paper`, `--cream`, `--color-accent: var(--tan-300)`). Teal `#49A69C`→`#4AADA8`; dark `#4A4F59`→slate-700 `#3D4755`; bg `#F8F9FA`→warm paper `#FAFAF8`; body text `#1A1D23`→slate-700; muted→slate-500; border→slate-100. Global sweep of ~40 hardcoded old-teal tints `rgba(73,166,156,*)`→`rgba(74,173,168,*)`. Form-field neutral grays → slate tokens.
- **Logo.** Restyled the existing CSS text-wordmark (did **not** swap in the kit's logo SVGs — they use live `<text font-family="Geist">` so they'd render in a fallback font as `<img>`; per [[reference_applying_claude_design_kits]]). `.logo-mark .hg` → slate-700, weight 800→700, Geist; `.c` stays teal.
- **Homepage hero → text-first single column** ([`index.astro`](src/pages/index.astro)): removed the `hero__inner--split` 2-col layout + the inline SVG process-mesh visual (this also retired the "— HOW WE WORK" SVG leftover noted in Session 12), wrapped "owned" in a teal `.hero__headline-accent`. Dropped the `.hero::before` radial glow (kit: flat surfaces, no gradient blobs). Removed now-dead `.hero__inner--split/__visual/__mesh` CSS.
- **Dark sections → teal** (Ian's choice; kit says "teal-forward, avoid gray blocks"). `.stats-bar`, `.dark-section` (the "Four steps. No theatre." block), and `.section--dark` recolored from slate `--color-dark` → **teal-800** `#1F4F4C`; in-section teal accent labels (`.process-card__num`, `.scenario-card__num`) bumped to `--teal-200` and `.stat-value` to white for contrast on teal. **Footer stays slate** (conventional; kit's own footer is slate); `.cta-section` already teal.
- **Inner-page photo heroes KEPT** (Ian's hybrid choice). The 9 service pages + `/services`/`/pricing`/`/for-saas`/`/for-local-businesses` keep their `PageHero`/`ServicePage` photo heroes; just softened `.page-hero__visual-overlay` from a teal gradient wash → a flat 1px hairline frame (kit dislikes gradient overlays), and restrained the heavy drop-shadow to `--shadow-md`.
- **Radii** aligned to kit: cards `--radius-md` 12→10, `--radius-lg` 20→14, added `--radius-pill`. Shadows revalued to the kit's restrained tokens; added `--shadow-focus` + motion tokens (`--ease-out`, `--dur-*`).
- **QA:** `npm run build` clean (21 pages, 2.75s); no `Inter`/`dm-mono` refs remain in `dist`; Geist confirmed rendering. Chrome-headless screenshots (Playwright wasn't installed post-reinstall; used `chrome --headless=new`) at desktop 1280 + mobile 390 across home/crm-implementation/pricing/about/for-local-businesses — all read on-brand: text-first hero, teal "Four steps" block, color stack logos intact, photo heroes with clean frames.
- **Decisions locked with Ian (AskUserQuestion):** (1) hybrid hero — text-first homepage, keep restyled photo heroes on inner pages; (2) keep full-color brand stack logos, not the kit's mono-text wordmarks; (3) recolor dark slate blocks to teal/cream.
- **Deferred / optional follow-ups:** favicon + `og-image.png` refresh from the kit logo PNGs (not done — `og-image.png` predates the rebrand); pain-card icons on `/for-saas` + `/for-local-businesses` are multi-color (kit prefers slate/teal mono icons) — left as-is, out of the locked fonts/colors/logo scope.
- **Next:** push `design-system-rebrand` → Netlify deploy-preview (deploy-ID URL pattern per [[reference_homegrown_growthco_preview_url_pattern]]) → Ian reviews → `--no-ff` merge. **Revert before merge:** close PR + delete branch.

### Session 14 — 2026-06-09 (executive homepage rebuild, same PR #4 branch)
On reviewing the rebrand preview, Ian asked for a seasoned-executive reassessment and rebuild. Plan (rewritten) at `~/.claude/plans/homegrown-growthco-claude-md-please-rea-mutable-barto.md` includes a full gaps audit (credibility/proof is the #1 gap, then split positioning, thin conversion, shallow vertical depth, under-demonstrated SEO/GEO, brand remnants). **Diagnosis of his "still broken" complaints:** the favicon/og set + `custom-stack.svg` were never rebranded (still old `#4A4F59`/`#49A69C`), and he was viewing **production** (rebrand is preview-only). Implemented Phases 0-2 on the same branch:
- **Phase 0 — brand remnants + flagged fixes.** Recolored `public/favicon.svg` (slate→`#3D4755`, teal→`#4AADA8`) and `public/logos/custom-stack.svg`; **regenerated** `favicon-16/32`, `apple-touch-icon`, and a new on-brand `og-image.png` (1200×630, Geist, rendered via `chrome --headless=new` from HTML templates — note: Windows file URLs must be `file:///C:/...`, not Git-Bash `/c/...`). Removed the teal "Senior Growth Operations" hero pill (the "weird green button banner") and swept the phrase from index title/meta/schema + about/for-saas/for-local/pricing/services/terms (kept the Footer "Growth operations, owned end-to-end." brand line).
- **Phase 1 — homepage repositioned to a broad growth umbrella.** New hero "Get found. Win customers. Keep them coming back." (teal accent on the middle clause) + plain-language subhead (Google/AI search, demand gen, CRM, automation) + a HubSpot-RevOps-Certified trust line. **Moved the platform logo wall up into the hero** as the visual anchor Ian wanted (`.hero__logos`). Regrouped the 9 services into 3 outcome pillars **More Customers / More Revenue / More Time Back** (locked with Ian after 3 rounds of naming options) under "Three outcomes. Nine ways to get there." Added a **"Who I help" vertical router** (Local & multi-location incl. restaurants → `/for-local-businesses`; B2B & SaaS → `/for-saas`). Stat strip got a "representative outcomes" caveat. Schema broadened (jobTitle → "Founder & Fractional Growth Partner"; knowsAbout gained Local SEO/GBP/Lead Gen; hasCredential added the HubSpot cert).
- **Phase 2 (doable-now parts).** Headshot wired in: Ian dropped `headshot_crop.jpg` in repo root → copied to `public/images/ian-headshot.jpg`, used on a new homepage **operator strip** ("You work with me, not a junior team.") + `/about` (replaced the "photo coming soon" monogram). Surfaced the **HubSpot Revenue Operations Certified** badge. Added an interim **free-audit lead-magnet form** (name/email/website) as section `#free-audit` (hero secondary CTA "Get a free audit"); registered it in `NetlifyFormStubs.astro` so Netlify detects it (Ian must add a form-notification email in the Netlify dashboard, same as sms-opt-in). Fixed an `:invalid` red-border-on-load bug by adding input placeholders.
- New CSS components in `global.css`: `.hero__logos*`, `.hero__trust*`, `.pillars/.pillar*`, `.verticals/.vertical-card*`, `.operator*`, `.audit*`, `.stat-strip__caveat`, `.about-bio__photo--real`. Build clean (21 pages, 2.2s); Chrome-headless QA (home desktop+mobile, about) all on-brand; new `og-image` verified.
- **Exec recommendations given (not yet built):** pursue certs that ship a directory backlink (HubSpot Solutions Partner first, then Google Ads/GA4, Semrush/Ahrefs SEO, Zapier/Clay expert listings); a public **self-serve audit tool** is a separate `growth-engine` build (the interim form ships here now). Testimonials/case study still pending from Ian.
- **Decisions locked this session (AskUserQuestion):** broad growth umbrella; logo wall as hero visual; remove the teal pill; pillar names More Customers/Revenue/Time Back; ship both an audit form (now) + self-serve tool (later).
- **Still on PR #4, preview-only, NOT merged.** Revert before merge: close PR.

**Round 2 (same day, same PR #4):** Ian reviewed the preview and (a) was still seeing old branding because he was on **production** (proven via curl: prod = old favicon `#49A69C` + Inter + "Senior Growth Operations"×2; preview = new) — not a cache bug, just unmerged; (b) flagged the empty right side of the hero; (c) re-curated the pillar sub-tiles.
- **Hero is now 2-column** (`.hero__inner--split`): copy left, a **proof/credentials card** right (`.hero__proof` — HubSpot RevOps Certified + 3 Geist-Mono outcome stats), which fills the previously-empty right side. The logo wall moved to a thin strip below the hero; the standalone 6-stat `stat-strip` section was removed (de-duped by the card).
- **Pillar sub-tiles re-curated** (Ian delegated the curation): **More Customers** = SEO/GEO, Demand Gen, **Conversion & Landing Pages (new)** (replaced GTM Strategy); **More Revenue** = CRM, **Retention & Expansion (new)** (replaced Sales Comp), Reporting; **More Time Back** = Workflows, **Data Enrichment & Hygiene (new)** (replaced Tech Stack Audit), Fractional RevOps.
- **3 new service pages** created via `ServicePage.astro` (`/conversion-landing-pages`, `/retention-expansion`, `/data-enrichment-hygiene`). De-featured services (GTM, Sales Comp, Tech Stack Audit) stay live.
- **`/services` realigned** from the old Strategy/Systems/Growth taxonomy to the **same outcome pillars** (More Customers / More Revenue / More Time Back), now **12 services** (4 per pillar); schema ItemList + Nav mega-menu (desktop + mobile) + Footer services list + homepage `OfferCatalog` all updated to the 12.
- **Cross-functional / change-management** folded into narrative (homepage operator strip + `/about`), not a sellable tile, per the exec read.
- **Deferred (token scope):** the 3 new URLs were NOT added to `deploy.yml` IndexNow + `link-check.yml` (editing `.github/workflows/*` needs `workflow` scope and would block the push). The autogenerated sitemap already covers discovery; add the URLs to those two workflow files in the GitHub UI when convenient. Build clean (24 pages); Chrome-headless QA (home desktop+mobile, new service page) all on-brand.

**Round 3 (same day, same PR #4) — density + polish:**
- **Hero metrics card → metrics-only.** Dropped the credential/"clout" line (Ian found it weird in the hero); the card now shows all **6** original homepage metrics in a tight 2×3 Geist-Mono grid (`$1M+` pipeline, `$30K+` ad waste, `$50K+` stack saved, `10+ hrs`, `2-4x`, `30-90`) under a "By the numbers" eyebrow. Cert still lives on the operator strip + `/about`.
- **Global density tighten** (Ian: too much whitespace): `--section-py` 80→46, `--section-py-sm` 52→32, `.section--compact` 64→36, the two `64px 0` leading paddings →36, `.hero` 56/72→44/20, and **`.tools-strip` 56/64→14/30** so the hero↔logo-strip gap dropped from ~128px to ~34px.
- **Services IA = "Pillars + Specialized & more"** (Ian's choice over an "Other Services" bucket, after I gut-checked the IA). Nav mega-menu + mobile drawer trimmed to the top 3 per pillar (dropped GTM Strategy, Sales Comp, Tech Stack Audit from the dropdown); the all-link relabeled **"See all services, including specialized →"** → `/services` (which still lists all 12 grouped under the pillars). The 3 de-featured pages stay live; Footer still lists all 12.
- **HGC LinkedIn icon added to the nav top-right** (`.nav__social`, desktop + a mobile "LinkedIn" link) → `linkedin.com/company/homegrown-growth-co`.
- **TAG cross-link added** (Footer "Writing" link + `/about` one-liner) → `theautomationsguide.com`. **SEO note for Ian:** the real ranking lever is the *reverse* link (TAG→HGC in the author bio / relevant posts); HGC→TAG is mostly credibility + GEO/E-E-A-T entity signal. Build clean (24 pages); QA desktop+mobile on-brand.

**Session 14 close — MERGED TO PRODUCTION (2026-06-09).** PR #4 (`design-system-rebrand`) merged to `main` via `--no-ff` as merge commit **`b8b5887`** (`gh pr merge 4 --merge --delete-branch`; pre-flight mergeable=MERGEABLE, status=CLEAN, deploy check pass). Production GH Actions deploy `27229763290` succeeded; branch deleted; local `main` synced. **Live-verified on homegrowngrowth.co:** favicon `#3D4755`/`#4AADA8`, fonts = Geist, "Senior Growth Operations" = 0, og-image + `/images/ian-headshot.jpg` 200, all routes 200 incl. the 3 new service pages + `/services`/`/about`/`/for-local-businesses`/`/pricing`. All of Sessions 13-14 (rebrand + broad-umbrella homepage + proof-card hero + re-curated pillars + 3 new services + realigned /services + density/nav/LinkedIn/TAG polish) is now live. **Revert path:** instant Netlify rollback to the prior prod deploy, then `git revert -m 1 b8b5887 && git push origin main`.
- **Open follow-ups (carried into next session):** (1) **testimonials / a real case study** — single biggest remaining conversion gap; (2) add the 3 new service URLs to `deploy.yml` IndexNow + `link-check.yml` in the GitHub UI (token lacks `workflow` scope; sitemap already covers discovery); (3) set up the **reverse TAG → HGC backlink** (author bio / relevant posts) — the real ranking lever; (4) pursue backlink-bearing certs (HubSpot Solutions Partner first, then Google Ads/GA4, Semrush/Ahrefs, Zapier/Clay expert listings); (5) add a Netlify form-notification email for the new `free-audit` form (same one-time step as `sms-opt-in`); (6) `/case-studies` placeholder still live; vertical depth (a real restaurant page + expansion verticals) is the next-biggest opportunity; (7) Twilio TFV resubmit for `+18663694940` (carried from Session 12).

### Session 15 — 2026-06-09 (workflow-file follow-up merged + GSC index-status tooling)
Short follow-up session after the Sessions 13-14 production merge. Closed the deferred workflow-file item and built reusable Google Search Console index-status tooling to answer "which of my pages are actually indexed?"

- **Workflow-file edits merged** (commit `c5c8590`, deploy `27231381910` green). Added the 3 new service URLs (`/conversion-landing-pages`, `/retention-expansion`, `/data-enrichment-hygiene`) to `deploy.yml`'s IndexNow ping list. In `link-check.yml`, added the same 3 URLs **and fixed 3 stale URLs that had been failing the weekly job since the Astro migration** — `sitemap.xml`→`sitemap-index.xml` (404 since Session 7's robots fix), and removed `styles.css` + `script.js` (404 since Session 5 bundled them into `/_astro/*`). All 3 curl-verified as live 404s before changing. Push needed `workflow` scope (token lacked it per [[reference_gh_token_no_workflow_scope]]) → Ian ran `gh auth refresh -h github.com -s workflow`, then I pushed. **Clarified for Ian: IndexNow only pings Bing/Yandex and link-check is CI-only — neither affects Google indexing**, so they were never the cause of slow GSC indexing.
- **GSC index-status tooling** — `scripts/gsc-index-status.py` (+ `scripts/README.md`) calls the Search Console **URL Inspection API** over every sitemap URL and prints verdict / coverage-state / last-crawl, grouped + summarized. **Auth is OAuth user creds, NOT a service-account key**: the GCP org enforces `iam.disableServiceAccountKeyCreation` (Secure-by-Default) so SA-key download is blocked; an OAuth "Desktop app" client is the secure alternative. Creds live OUTSIDE the repo at `~/.gsc/{client_secret.json,token.json}` (also `.gitignore`-guarded as `client_secret*.json`/`token.json`); venv at `C:\Users\Ian\.venvs\gsc`. Property auto-detected as `sc-domain:homegrowngrowth.co`. Wrapped as the **`/gsc-status` slash command** ([.claude/commands/gsc-status.md](.claude/commands/gsc-status.md)) for one-call reuse. Memory: [[reference_gsc_index_status_checker]].
- **First pull: 18/22 indexed and healthy.** The 4 pages GSC's *Pages report* still listed as "Crawled – currently not indexed" (`/website-seo-geo`, `/gtm-strategy`, `/demand-generation`, `/for-local-businesses`) are **actually indexed** per URL Inspection — proving the **Pages report lags the live index by days**, which is the whole explanation for Ian's "nothing's indexing" frustration. The only 4 not in Google show "URL is unknown to Google" = never crawled: the 3 brand-new service pages (created hours earlier in Session 14 Round 2) + `/sms-opt-in` (low-link Twilio-compliance page). No site-side defect anywhere — all 22 independently verified 200 / self-canonical / no-noindex. Optional follow-up: Request Indexing for the 3 new pages to speed first crawl (sitemap covers passive discovery).
- **Revert path:** the workflow merge (`c5c8590`) is already live — don't revert it (it would re-break link-check). The Session-15 tooling (scripts + `/gsc-status` command + docs) is additive with **no deploy impact** (outside the Astro build); revert with `git revert <sha>` if ever needed.

### Session 16 — 2026-06-10 / 2026-06-11
**To-do reprioritization (focus = distribution + backlinks) + paste-ready directory pack + status-doc staleness fix. Docs-only; no `src/` change, so the deploy is byte-identical.** Ian asked for a refreshed/reprioritized to-do list. Read the full CLAUDE.md (Sessions 1-15) + `SITE_STATUS.md`; chosen focus via AskUserQuestion = **distribution + backlinks**; proof material (testimonials/case study) **not ready**, stays parked.

- **Key finding — the "reverse TAG → HGC backlink" (flagged Session 14 as the #1 ranking lever still to do) is ALREADY LIVE.** Verified in the TheAutomationsGuide repo: sitewide footer "Published by HGC" link ([../theautomationsguide/src/layouts/BaseLayout.astro:261](../theautomationsguide/src/layouts/BaseLayout.astro#L261)), per-post author-bio links in `AuthorNote.astro` ("Founder, Homegrown Growth Co" + "See HGC services", `rel="noopener noreferrer"` = dofollow), 3 contextual links on TAG `about.astro`, and author/publisher schema `sameAs` in `BaseLayout.astro` + `BlogPostLayout.astro`. Nothing to build; the follow-up is done. (The real remaining SEO nicety would be more *in-body contextual* HGC links in relevant TAG posts; only the adcreativeai post has one today. Low priority.)
- **`SITE_STATUS.md` staleness fixed:** removed two "Remaining" items that already shipped — **/about headshot** (done Session 14) and **footer email obfuscation** (done Session 11); marked the reverse TAG backlink DONE under "Distribution presences"; refreshed the Site Map + "6 services" schema/page notes to the current **12-service / 3-pillar** reality (+ `/for-local-businesses`, `for-saas.astro`, and the 6 newer service pages); corrected the stale pricing note (old 3-tier $3K/$5.5K/$10K table → 4 engagement-model packages, no public `$`); updated "Highest-Impact Next Action" → **HubSpot Solutions Directory**.
- **Created [`DIRECTORY_PROFILES.md`](DIRECTORY_PROFILES.md)** — a paste-ready pack so the remaining distribution tasks are copy-paste: master facts, tagline, short (~150/~300) + long (~600) descriptions (no em/en dashes per [[feedback_no_em_dashes]]), the 12 services grouped More Customers / More Revenue / More Time Back, per-directory category suggestions (HubSpot Solutions Directory, Clutch, G2), and the 3 Calendly intake questions.
- **Ian's remaining to-do (all his action, forms):** (1) **HubSpot Solutions Directory** [highest value: relevant backlink + Solutions Partner on-ramp], (2) **G2**, (3) add the **3 Calendly intake questions**, (4) **Netlify form-notification email** for the `free-audit` form (one-time, like sms-opt-in). Parked until material exists: **testimonials** (biggest conversion gap) + **one real case study** for `/case-studies`.
- **Reconciled against `TODO.md` (Ian confirmed 2026-06-11):** my first-pass list (built off the then-stale `SITE_STATUS.md`) wrongly carried **Clutch** and **Twilio TFV resubmit** as open. Per Ian's primary list they are **done**: Clutch approved/published 2026-06-09 (live backlink); Twilio TFV resubmitted 2026-06-09 for +18663694940, approval pending (no action until Twilio responds). `SITE_STATUS.md` + `TODO.md` corrected to match; `DIRECTORY_PROFILES.md` already had paste copy for all of these.
- **Commit/deploy note:** docs-only (CLAUDE.md + SITE_STATUS.md + DIRECTORY_PROFILES.md), all repo-root markdown outside the Astro `src/` build, so the push triggers a normal prod deploy that produces byte-identical site output. **Revert path:** `git revert <sha> && git push origin main` (docs only).
- **Single-source-of-truth cleanup (root cause of the Clutch/Twilio drift):** the same open-task status was being hand-maintained in `TODO.md` (the only doc `todo-sync` reads) AND in `SITE_STATUS.md`'s "Remaining" tables AND in this file's "Open Questions / TODO", so they drifted. Fix: **`TODO.md` is now the single source of truth**; `SITE_STATUS.md`'s "Remaining"/"Highest-Impact Next Action" and this file's "Open Questions / TODO" are now **pointers** to it (no enumerated open tasks). Enforced by a new non-fatal drift-lint in `todo-sync/sync-todos.mjs` (warns on open-task status outside `TODO.md`; proven to fire then clean), the rule written into `todo-sync/CONVENTION.md`, a Step 2b in the `/log-status` command, and memory [[feedback_single_source_of_truth_for_tasks]]. HGC is the reference template; TAG/copperline/alita/growth-engine are the roll-out backlog.

### Session 17 — 2026-06-12 (MoltSets website integration — built then scrapped)
**Investigated MoltSets for a "third-party data enrichment compliance" task; built a cookie-consent banner + consent-gated pixel + privacy-policy disclosures, Playwright-verified them, then scrapped the whole branch after confirming the task's premise was false. Net change to `main`: one `TODO.md` line. Nothing shipped, nothing deployed.**

- **Premise was false.** The task prompt described MoltSets as "GetEmails/Retention.com, a visitor-identification pixel" with a `https://cdn.retention.com/PLACEHOLDER_SITE_ID.js` tag. I built to that spec on branch `cookie-consent-moltsets`: NEW `CookieBanner.astro` (first-visit consent, Accept / Manage→Decline, `hgc_cookie_consent` cookie + `hgc:consent-changed` event, scoped dark-slate styling), NEW `MoltSetsPixel.astro` (consent-gated, GPC-aware loader), refactored `analytics.js` to gate GA4 + Clarity behind consent (+ inject the gtag library), dropped the unconditional gtag tag from `BaseLayout.astro`, added `cdn.retention.com` / `*.retention.com` to the `netlify.toml` CSP, and rewrote privacy-policy §4/§5/§8 to disclose MoltSets as an on-site visitor-ID service + reconcile the CCPA "sale/share" language with an opt-out path. Built clean (24 pages) and Playwright-verified the full consent flow (no tools pre-consent; all three load on Accept; none on Decline; persists across reloads; mobile flex-basis bug caught + fixed).
- **Then verified what MoltSets actually is** (Ian pushed back on the pixel premise). Per [developer.moltsets.com](https://developer.moltsets.com/api-reference/search/search-for-people): MoltSets is a **server-side B2B people-search / enrichment API** (Bearer `ms_…` key, `/search-for-people`) with **no pixel, no JS tag, no site ID, no website embed**. The whole website approach was wrong-premise, and the privacy-policy text I wrote was factually false (disclosing on-site cookie matching that never happens).
- **Scrapped wholesale.** Branch `cookie-consent-moltsets` (commits `6c12091` + `246344a`) **deleted**; working tree returned to the live state byte-for-byte. Nothing was pushed, so prod was never touched.
- **Real follow-up tracked.** MoltSets is an outreach-stack tool, not a website change: wire the `ms_…` API key (Ian has keys for growth-engine + homegrown-growthco) + a Claude Connector client id/secret into the lead-gen pipeline (n8n credential → Attio / Instantly), a FUTURE SESSION. Logged as one `TODO.md` item (commit `e5c4d52`, unpushed); secrets never in this repo. Mind CAN-SPAM on sourced-contact outreach.
- **Lesson** → memory [[feedback_verify_third_party_product_before_integrating]]: WebFetch an unfamiliar product's docs to confirm what it is before building, don't trust the prompt's characterization (especially a name-dropped vendor alias).
- **No revert needed** (nothing shipped). This CLAUDE.md entry is committed **locally only (no push)** to avoid a no-op prod deploy per Ian's call; it rides along with the next real change.

### Session 18 — 2026-06-12 (full site audit + fix wave 1, paused mid-Phase-2)
**Phase 1: evidence-grounded audit of the LIVE site** (real Chromium via Playwright at 1280 + 375, 4-agent static fan-out, Lighthouse vs the 2026-05-14 baseline with clean re-runs, copy review). Deliverable **`AUDIT.md`** (repo root, untracked by design): **2 critical / 10 medium / 12 low**, every finding with evidence in `_audit-evidence/2026-06-12/` (55 screenshots, 20 Lighthouse JSONs, link-graph + JSON-LD reports, dead-CSS checklist, measured image re-encodes). Coverage matrix included (what passed, not just what failed).

- **C-1 (critical): CSP silently blocks analytics sitewide.** 4x `y.clarity.ms/collect` + 2x `www.google.com/g/collect` violations on every page load; Clarity session capture degraded/broken (SDK loads, uploads die), GA4 primary endpoint unaffected. Same bug class as the Session-6 `scripts.clarity.ms` fix (Clarity moved endpoints again). Side effect: Lighthouse Best Practices pinned at 0.73 since Session 6; the predicted ~0.95 never happened and nothing caught it.
- **C-2 (critical): mobile perf below the 0.79 budget on every measured page** (0.65-0.73, LCP 6.2-8.1s vs baseline ~5.4s; desktop fine 0.96-1.00). Causes: no `/_astro/*` or `.jpg` cache rules (65KB blocking CSS + 2.18MB heroes at `max-age=0`), heroes ~2.5x display resolution, 2 of 4 above-fold fonts preloaded, clay.png 137KB in a 36px box, headshot 315KB at 320px.
- Notable mediums: free-audit form dead-ends on Netlify's generic thank-you page (accepted but off-brand, no next step); /services links to ZERO of its 12 detail pages (predates rebrand, ItemList schema claims the urls); service-FAQ answer #4 schema != visible on all 12 pages (`schemaA`/`htmlA` divergence); **white-on-teal `.btn` fails WCAG at 2.68:1 sitewide** (brand-token call, Ian's); 3 headings with duplicate `class` attrs (margins silently never applied; Session-6 bulk-replace bug class); ~760 lines dead CSS (17%); legal anchors hidden under sticky nav (the exact links Twilio reviewers follow); copy bookkeeping (5 names for the same call, 9-vs-12 catalog counts, /roi-call still RevOps-only language).
- Forms tested live ONCE each, TEST-marked (Ian to delete in Netlify > Forms); sms-opt-in AJAX success works, SMS entry used a 555 number.

**Phase 2 wave 1 shipped on branch `audit-fixes-2026-06-12`** (commit `cd8c91f`, 30 files, build green 24 pages; + this docs commit; **NOT merged, nothing pushed to main, no deploy**):
- C-1 fix: `connect-src` now `https://*.clarity.ms` + `https://www.google.com` (replaces the 3 enumerated clarity hosts).
- Cache rules: `/_astro/*` immutable, `/images/*` `max-age=604800, stale-while-revalidate`, stale `/styles.css` + `/script.js` blocks deleted, `/fonts/*` narrowed to `*.woff2` (so the unhashed `fonts.css` revalidates).
- Images re-encoded in place (System.Drawing q75): 12 heroes cover-cropped to 972x778 (2,127KB → 904KB; worst file 451KB → 140KB), `ian-headshot.jpg` 314KB → 49KB (640w), `clay.png` 137KB → 7KB (135x72). Hero `<img>` in `ServicePage.astro` + `PageHero.astro` gains `fetchpriority="high" decoding="async" width="972" height="778"`.
- Font preloads: + `Geist-Medium` + `Geist-SemiBold` sitewide, + `GeistMono-Medium` on `/` only (`Astro.url.pathname` conditional in BaseLayout).
- M-3 fix: FAQPage `acceptedAnswer.text` now derived from `htmlA` (tags stripped) in `ServicePage.astro`; `schemaA` field deleted from the interface + all 12 wrappers (48 lines); the 12 FAQ pricing links swapped from inline style to `.link-teal`. ServicePage's own 3 inline styles swapped to existing utilities (`mb-48`, `mb-40`, `title--on-dark-spaced`).

**Paused here per Ian (mid-Phase-2).** Remaining branch work + his decision items are in `TODO.md` (top 2 entries); `AUDIT.md` "Suggested Phase 2 grouping" is the spec. Not yet done: M-1 free-audit success state, M-2 services row links, M-7 duplicate class attrs, M-8 dead-CSS deletion (re-verify against the checklist before deleting; note M-7's fix makes `mb-20/36/40` USED), M-9 scroll-margin, L-1/2/5/6/8/10/11, Playwright re-QA, PR + preview verification (CSP/cache headers only testable on a Netlify deploy). Meta title/desc trims (L-3) drafted but withheld as copy. **Revert path:** branch unmerged, so close/delete it; per-commit `git revert cd8c91f`. Resume: `git checkout audit-fixes-2026-06-12`, read AUDIT.md + TODO.md top item. → **Resumed and completed in Session 19.**

### Session 19 — 2026-06-12 (audit fix wave 2 + PR #5 + preview verification)
**Finished the Claude-side audit-fix scope on `audit-fixes-2026-06-12`** (wave-2 commit `c7ba031`, 13 files, +216/−976), opened **[PR #5](https://github.com/homegrowngrowthco/homegrown-growth-co/pull/5)**, and verified everything that needed real Netlify headers on the branch deploy preview. **NOT merged — Ian reviews PR #5, merge deploys to prod.**

Wave-2 fixes (AUDIT.md ids):
- **M-1**: free-audit form AJAX-submits to a branded inline success card ("Got it. Your audit is on the way." + Book-a-call CTA), mirroring the SMS form pattern; error fallback included. Verified with a REAL submit on the Netlify preview (created a 3rd TEST entry, flagged in TODO.md).
- **M-2 + L-5**: /services rows link to all 12 detail pages (linked `h3` + per-row "Full details: <name> →" using `.link-teal`); the `schema` const moved below `pillars` and the ItemList is now built from `allServices` (name/hook/href), so schema names, descriptions, AND urls are single-sourced from the rendered array. Added `href` field per service (note `sales-comp` id → `/sales-comp-enablement` slug).
- **M-7**: 3 duplicate `class` attrs merged (about why-heading mb-20, pricing included-heading mb-36 + faq-heading mb-40); recovered margins eyeballed in QA, look intentional.
- **M-8**: 149 dead rules deleted from `global.css` (−889 lines incl. emptied @media + 4 orphan section banners). Method: one-off `c:\tmp\dead-css-prune.mjs` re-verified each audit-listed class against the CURRENT source before deleting (only `mb-48` had been revived, by wave 1 — kept; line numbers in the sweep file were stale after earlier edits so deletion was selector-matched, not line-matched). Also swapped 12 repeated inline styles in for-saas/for-local onto existing utilities (`mb-48` ×8, `mb-40` ×2, `title--on-dark` ×2, `title--on-dark-spaced` ×2); the 6 remaining inline styles on those pages are bespoke positioning, left per prior convention. CSS bundle 65,054 → 52,315 bytes raw.
- **M-9**: `[id] { scroll-margin-top: calc(var(--nav-h) + 16px); }` — `/privacy-policy#sms-terms` now lands the heading at +96px (was −24px behind the nav). Twilio-reviewer-facing fix.
- **L-1**: `nav.ts` syncs `aria-expanded` on dropdown mouseenter/mouseleave (hover path was stuck at false).
- **L-2**: nav logo `aria-label` now "HGC Homegrown Growth Co. home" (includes visible text; also fixed roi-call's bare-nav copy).
- **L-6**: ProfessionalService `sameAs` += GBP share link (`share.google/pjlSd3uuV2CDQqxLD`, resolves to the knowledge panel, kgmid `/g/11nhw9rtqm`), Clutch (`clutch.co/profile/homegrown-growth-co`, URL from Ian), and `theautomationsguide.com`; added `logo` → `apple-touch-icon.png` (180×180, on-brand). About-page Person `sameAs` += TAG. Org `telephone` deliberately NOT added (the 866 number is the SMS sender, Ian's call whether it's the business phone).
- **L-8**: astro 5.18.1 → 5.18.2, @astrojs/sitemap 3.7.2 → 3.7.3 (patch bumps; the 1 moderate advisory only clears with astro 6, separate task).
- **L-10**: `AUDIT.md` + `_audit-evidence/` gitignored. **L-11**: nav LinkedIn URLs standardized to slashless (matches footer/schema).

QA + verification:
- Local: build clean (24 pages, 3.46s); Playwright (MCP) at 1280×900 + 375×812 across /, /services, /pricing, /about, /for-saas, /for-local-businesses, /crm-implementation, /privacy-policy#sms-terms: zero overflow, zero broken images, zero console errors, hub-page utility swaps compute to identical values, M-3 wave-1 schema/visible FAQ parity re-confirmed. (Note: local `astro preview` took port 4322; 4321 was a TAG dev server.)
- **Netlify branch preview** (`6a2c63b21463d6c298b3239a--zesty-cranachan-42c3b7.netlify.app`, deploy run `27439362000` green): **C-1 confirmed fixed** — `y.clarity.ms/collect` POSTs now flow and console has ZERO errors (prod throws 6 CSP violations/page today); cache headers live (`/_astro/*.css` immutable, `/images/*.jpg` `max-age=604800,swr`, `fonts.css` revalidates while `*.woff2` immutable); free-audit live submit shows the branded success card.
- PowerShell gotcha: `git commit -m @'…'@` mangles embedded double quotes when passing to git.exe (PS 5.1 native-arg quoting) — keep commit messages quote-free.

**Still open (Ian)**: review/merge PR #5; decisions M-4 (teal contrast), M-10 (copy), L-3 (meta trims, drafts ready); delete 3 TEST form entries; post-merge `/audit-seo` re-baseline (TODO.md is the source of truth). GHA deprecation note: actions/checkout@v4 + setup-node@v4 flip to Node 24 on 2026-06-16 (annotation on every run; no action needed yet).
**Revert path:** PR unmerged — close it; or `git revert c7ba031 cd8c91f` on the branch. Post-merge: instant Netlify rollback, then revert the merge commit.
