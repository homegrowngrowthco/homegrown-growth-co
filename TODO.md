# homegrown-growthco to-dos

Tracked by todo-sync (see ../todo-sync/CONVENTION.md). Open tasks below, most important first. Detail lives in SITE_STATUS.md and CLAUDE.md.

## TODO

- [ ] Finish the audit-fix branch `audit-fixes-2026-06-12` @high — remaining from [AUDIT.md](AUDIT.md): M-1 free-audit AJAX success state, M-2 /services row links + single-source ItemList, M-7 duplicate class attrs, M-8 dead CSS (~760 lines, re-verify before deleting) + remaining inline-style swaps, M-9 scroll-margin-top, L-1/L-2/L-5/L-6/L-8/L-10/L-11; then Playwright re-QA per page, PR, preview verification (CSP console clean, cache headers, forms)
- [ ] Decide the Phase-2 judgment calls @high — IAN: M-4 teal contrast (move buttons/text-teal to teal-700?), M-10 copy fixes (CTA naming, catalog counts, /roi-call language), L-3 meta title/description trims (Claude has proposals ready)
- [ ] Create HubSpot Solutions Directory profile @high — highest-value distribution lever: relevant backlink + Solutions Partner on-ramp; paste-ready copy in [DIRECTORY_PROFILES.md](DIRECTORY_PROFILES.md)
- [ ] Add 1 to 3 testimonials (biggest conversion gap) @high [SITE_STATUS.md](SITE_STATUS.md)
- [ ] Delete the 2 TEST form submissions from the 2026-06-12 audit @med — IAN, 2 min: Netlify dashboard > Forms > free-audit + sms-opt-in, both named "TEST - Claude site audit (safe to delete)"
- [ ] Re-run /audit-seo + re-baseline Lighthouse after the audit-fix branch merges @med — mobile perf was 0.65-0.73 vs 0.79 budget pre-fix; expect recovery from image/cache/font fixes, update _baseline/ if green
- [ ] Create G2 services profile @med [DIRECTORY_PROFILES.md](DIRECTORY_PROFILES.md)
- [ ] Add 2 to 3 qualifying questions to Calendly ROI-call intake @med — wording in [DIRECTORY_PROFILES.md](DIRECTORY_PROFILES.md); set in the Calendly UI on [roi-call.astro](src/pages/roi-call.astro)'s event
- [ ] Add a Netlify form-notification email for the free-audit form @med — one-time, same step as sms-opt-in; form registered in [NetlifyFormStubs.astro](src/components/NetlifyFormStubs.astro); audit M-1 fixes the visitor-facing side, this fixes the owner-facing side
- [ ] Publish one real case study to replace /case-studies placeholder @med [case-studies.astro](src/pages/case-studies.astro)
- [ ] Integrate the MoltSets people-search/enrichment API into the outreach stack @med — FUTURE SESSION, NOT a website change. MoltSets is a server-side B2B contact-search API (Bearer `ms_…` key, `/search-for-people` at developer.moltsets.com), not a pixel. Have API keys (growth-engine + homegrown-growthco) + a Claude Connector client id/secret in hand. Wire as an n8n credential / env var feeding Attio + Instantly (likely belongs in growth-engine/lead-finder); optionally add the MoltSets Claude Connector as a remote MCP in ~/.claude.json or the claude.ai Connectors UI. Secrets NEVER in this repo. Mind CAN-SPAM on sourced-contact outreach
- [ ] Request Indexing for the 3 new service pages in GSC (/conversion-landing-pages, /retention-expansion, /data-enrichment-hygiene) @low — optional crawl speed-up; sitemap covers passive discovery
- [ ] Build a fresh Resources/blog page when content is ready @low [SITE_STATUS.md](SITE_STATUS.md)
- [x] Full site audit (Phase 1) + fix wave 1 @high — DONE 2026-06-12: AUDIT.md (2 critical / 10 medium / 12 low, all evidence-backed) + wave-1 fixes committed on `audit-fixes-2026-06-12` (`cd8c91f`: analytics CSP, cache rules, -1.7MB images, FAQ schema sync)
- [x] Create Clutch directory profile @high [SITE_STATUS.md](SITE_STATUS.md) — DONE: approved/published 2026-06-09 (live backlink), confirmed by Ian 2026-06-11
- [x] Submit Twilio TFV/A2P registration with /sms-opt-in @high [sms-opt-in.astro](src/pages/sms-opt-in.astro) — resubmitted 2026-06-09 for +18663694940 (consent unbundled per reviewer); approval pending, no action until Twilio responds
- [x] Verify the reverse TAG to HGC backlink @med — DONE: already live (theautomationsguide footer "Published by HGC" + per-post author bio dofollow links + schema sameAs); confirmed Session 16
- [x] Create /gsc-status slash command to pull index status anytime @med — DONE 2026-06-09; [.claude/commands/gsc-status.md](.claude/commands/gsc-status.md) wraps scripts/gsc-index-status.py
- [x] Set up GSC API access via OAuth Desktop client (SA keys blocked by org policy) — DONE 2026-06-09; [scripts/gsc-index-status.py](scripts/gsc-index-status.py) live, creds+token in ~/.gsc, venv at C:\Users\Ian\.venvs\gsc. First pull: 18/22 indexed, 3 new service pages + sms-opt-in unknown to Google
- [x] Merge prepped workflow-file edits @med — pushed c5c8590, deploy 27231381910 green (3 new service URLs to IndexNow + fixed link-check.yml 404s) [deploy.yml](.github/workflows/deploy.yml)
- [x] Verify GSC indexability of all 22 sitemap URLs @med — all 200/self-canonical/no-noindex; the 3 GSC buckets are benign (see Session 15)
- [x] Add /about headshot to replace placeholder @med [about.astro](src/pages/about.astro) — shipped Session 14, /images/ian-headshot.jpg live
- [x] Rotate NETLIFY_AUTH_TOKEN in GitHub Actions secrets (post-wipe) @med [CLAUDE.md](CLAUDE.md)
- [x] Verify git push works from this machine post-recovery @low [CLAUDE.md](CLAUDE.md)
- [x] Verify GA4 and Clarity firing on live site @low [analytics.js](public/analytics.js)
- [x] Add JS email obfuscation on footer mailto if spam grows @low [Footer.astro](src/components/Footer.astro)
