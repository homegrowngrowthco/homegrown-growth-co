# homegrown-growthco to-dos

Tracked by todo-sync (see ../todo-sync/CONVENTION.md). Open tasks below, most important first. Detail lives in SITE_STATUS.md and CLAUDE.md.

## TODO

- [ ] Create HubSpot Solutions Directory profile @high — highest-value distribution lever: relevant backlink + Solutions Partner on-ramp; paste-ready copy in [DIRECTORY_PROFILES.md](DIRECTORY_PROFILES.md)
- [ ] Add 1 to 3 testimonials (biggest conversion gap) @high [SITE_STATUS.md](SITE_STATUS.md)
- [ ] Create G2 services profile @med [DIRECTORY_PROFILES.md](DIRECTORY_PROFILES.md)
- [ ] Add 2 to 3 qualifying questions to Calendly ROI-call intake @med — wording in [DIRECTORY_PROFILES.md](DIRECTORY_PROFILES.md); set in the Calendly UI on [roi-call.astro](src/pages/roi-call.astro)'s event
- [ ] Add a Netlify form-notification email for the free-audit form @med — one-time, same step as sms-opt-in; form registered in [NetlifyFormStubs.astro](src/components/NetlifyFormStubs.astro)
- [ ] Publish one real case study to replace /case-studies placeholder @med [case-studies.astro](src/pages/case-studies.astro)
- [ ] Request Indexing for the 3 new service pages in GSC (/conversion-landing-pages, /retention-expansion, /data-enrichment-hygiene) @low — optional crawl speed-up; sitemap covers passive discovery
- [ ] Build a fresh Resources/blog page when content is ready @low [SITE_STATUS.md](SITE_STATUS.md)
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
