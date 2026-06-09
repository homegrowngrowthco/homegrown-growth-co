# homegrown-growthco to-dos

Tracked by todo-sync (see ../todo-sync/CONVENTION.md). Open tasks below, most important first. Detail lives in SITE_STATUS.md and CLAUDE.md.

## TODO

- [x] Create Clutch directory profile @high [SITE_STATUS.md](SITE_STATUS.md) — submitted 2026-06-09, under review
- [ ] Add 1 to 3 testimonials (biggest conversion gap) @high [SITE_STATUS.md](SITE_STATUS.md)
- [ ] Merge prepped workflow-file edits @med — needs `gh auth refresh -s workflow` then push; adds 3 new service URLs to IndexNow + fixes link-check.yml 404s (sitemap.xml/styles.css/script.js dead since Astro migration) [deploy.yml](.github/workflows/deploy.yml)
- [x] Submit Twilio TFV/A2P registration with /sms-opt-in @high [sms-opt-in.astro](src/pages/sms-opt-in.astro) — resubmitted 2026-06-09 for +18663694940 (consent unbundled per reviewer); approval pending
- [ ] Create G2 and HubSpot Solutions Directory profiles @med [SITE_STATUS.md](SITE_STATUS.md)
- [ ] Add 2 to 3 qualifying questions to Calendly ROI-call intake @med [roi-call.astro](src/pages/roi-call.astro)
- [x] Add /about headshot to replace placeholder @med [about.astro](src/pages/about.astro) — shipped Session 14, /images/ian-headshot.jpg live
- [ ] Publish one real case study to replace /case-studies placeholder @med [case-studies.astro](src/pages/case-studies.astro)
- [ ] Build a fresh Resources/blog page when content is ready @low [SITE_STATUS.md](SITE_STATUS.md)
- [x] Rotate NETLIFY_AUTH_TOKEN in GitHub Actions secrets (post-wipe) @med [CLAUDE.md](CLAUDE.md)
- [x] Verify git push works from this machine post-recovery @low [CLAUDE.md](CLAUDE.md)
- [x] Verify GA4 and Clarity firing on live site @low [analytics.js](public/analytics.js)
- [x] Add JS email obfuscation on footer mailto if spam grows @low [Footer.astro](src/components/Footer.astro)
