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
- `src/pages/*.astro` — 16 routes, 1:1 to URLs (file maps directly to `/slug`). Plus `src/pages/for-saas.html` (static page that kept its embedded design system; served as-is by Astro).
- `src/layouts/BaseLayout.astro` — full `<head>` (meta, fonts, gtag-then-analytics, canonical, OG/Twitter, optional JSON-LD via `JsonLd` component); body with skip-link, `<Nav />`, `<slot />`, `<Footer />`, `<NetlifyFormStubs />`, bundled `nav.ts`. Props: `title`, `description`, `canonical`, `ogType?`, `ogImage?`, `noindex?`, `schema?`, `bareNav?`, `bareFooter?`.
- `src/components/` — `Nav.astro`, `Footer.astro`, `JsonLd.astro` (with `</script>` XSS-escape), `PageHero.astro`, `SmsOptInForm.astro`, `NetlifyFormStubs.astro` (hidden duplicate form so Netlify Forms detects sms-opt-in regardless of attribute stripping), `ServicePage.astro` (shared template for the 6 service detail pages — schema built from same data as visible content so they can't drift).
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
See `SITE_STATUS.md`. Major remaining: Google Business Profile, Clutch profile, testimonials, headshot for `/about`, real case study to replace placeholder.

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
