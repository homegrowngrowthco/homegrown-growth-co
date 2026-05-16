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

Long-term tech debt now resolved by the 2026-05-16 Astro 5 migration: the per-page nav/footer/`<head>` duplication is gone (shared via BaseLayout + Nav + Footer components). The previously-flagged "consider Eleventy/Astro/Hugo to template the duplicated nav/footer across 14 pages" is done. Still on the deferred list:

- **`/for-saas` design-system unification** — kept its embedded CSS for now (ported as a static `.html` in `src/pages/`). When the visual identity decisions for `/for-saas` are next revisited, swap it to a `.astro` page using BaseLayout + the global design system.
- **CSP tightening — remove `'unsafe-inline'` from `script-src`** — the May-2026-and-later approach (Astro 5+) is nonce-based CSP via integration plugins that stamp a per-build nonce on inline scripts (JSON-LD blocks, the bundled nav script tag). NOT SHA-256-hashing every JSON-LD block as we'd considered pre-migration — that path is brittle (every schema edit invalidates the hash). Out of scope for the migration; next step when CSP hardening becomes a priority.
- **Inline `style="..."` → CSS classes** — ~93 inline styles across pages, unchanged through the migration. Pure code quality.
- **Branch protection on `main`** — explicitly skipped while solo (friction cost is real, security benefit is near-zero on a static marketing site with no secrets in the repo). Revisit if a collaborator joins.

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
