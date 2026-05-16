# Homegrown Growth Co. — Website

## Purpose
Static marketing site for Homegrown Growth Co., Ian's fractional RevOps consulting practice. Heavy SEO/structured-data focus — every page has JSON-LD (Service / FAQPage / BreadcrumbList / Person / Organization). See `SITE_STATUS.md` for the running punch list.

## Tech Stack
- Static HTML5 + vanilla CSS + vanilla JS (no framework, no build step)
- Self-hosted webfonts (Inter, DM Mono, DM Sans, Plus Jakarta Sans)
- Netlify hosting + GitHub Actions deploy
- GA4 + Microsoft Clarity analytics
- IndexNow auto-ping on every prod deploy
- Curl-based weekly link-check workflow

## Live site
- Production: https://homegrowngrowth.co
- GitHub: https://github.com/homegrowngrowthco/homegrown-growth-co
- Default branch: `main`
- Netlify Site ID: `35530ce7-21f4-4734-92ae-12758607e79e`

## Key Files & Folders
- `*.html` — every page is its own static file (14 pages live + indexed; `case-studies.html` is noindex placeholder)
- `styles.css` — single shared stylesheet (~46KB)
- `script.js` — UI logic (nav, dropdown, mobile menu, scroll, Calendly)
- `analytics.js` — GA4 + Clarity bootstrap, defer-loaded (replaced inline scripts on every page)
- `netlify.toml` — security headers, cache rules, clean-URL redirects (`/about` → `/about.html`), `/resources` 301 → `/`
- `fonts/` — self-hosted woff2 files
- `.github/workflows/deploy.yml` — Netlify deploy + IndexNow ping (URL list inside)
- `.github/workflows/link-check.yml` — weekly curl-based link check (~11s)
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
Push to `main` → GitHub Actions runs `netlify deploy --prod` then pings IndexNow with the URL list. ~30s end-to-end.

**When adding a new page**, update: `sitemap.xml`, `netlify.toml` (clean-URL redirect), `.github/workflows/deploy.yml` (IndexNow URL list), `.github/workflows/link-check.yml`, `SITE_STATUS.md`, nav + footer links across all pages.

## Data Sources
Hand-authored content. No data files.

## Open Questions / TODO
See `SITE_STATUS.md`. Major remaining: Google Business Profile, Clutch profile, testimonials, headshot for `/about`, real case study to replace placeholder.

Long-term tech debt: unify `for-saas.html` into the shared design system (currently has its own embedded CSS); consider Eleventy/Astro/Hugo to template the duplicated nav/footer across 14 pages.

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
