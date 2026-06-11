# Homegrown Growth Co. — Site Status
_Last updated: 2026-06-11 — **Session 16: to-do reprioritization (focus = distribution + backlinks) + paste-ready `DIRECTORY_PROFILES.md` + this doc's staleness fix.** Key finding: the **reverse TAG → HGC backlink (Session-14's "real ranking lever" follow-up) is ALREADY LIVE** (sitewide footer "Published by HGC" + per-post author-bio dofollow links + TAG /about + schema sameAs), so it is done. Removed two "Remaining" items that already shipped (**/about headshot** done S14, **footer email obfuscation** done S11); refreshed the Site Map + "6 services" notes to current reality (**12 services / 3 pillars**, + `/for-local-businesses` + the 6 newer service pages) and the pricing note (3-tier $ table → 4 engagement models). Distribution list re-prioritized, next action → **HubSpot Solutions Directory** (paste-ready copy in `DIRECTORY_PROFILES.md`). Proof (testimonials/case study) parked, no material yet. Prior — **Session 15: deferred workflow-file follow-up merged + GSC index-status tooling built** (`/gsc-status` command wrapping `scripts/gsc-index-status.py`, OAuth not SA-key). First pull: **18/22 indexed**; the 4 pages GSC's Pages report still flags as "pending/not indexed" are actually indexed per the URL Inspection API — the Pages report just lags the live index by days (the answer to the "nothing's indexing" worry). The only genuinely-uncrawled URLs are the 3 hours-old new service pages + `/sms-opt-in`. Prior — Sessions 13-14 **MERGED TO PRODUCTION + LIVE-VERIFIED.** The full design-system rebrand + executive homepage rebuild (R1-R3) shipped to `main` via `--no-ff` merge `b8b5887` (PR #4); prod deploy `27229763290` green; live-verified on homegrowngrowth.co (new favicon `#3D4755`/`#4AADA8`, Geist fonts, 0 "Senior Growth Operations", all routes 200 incl. the 3 new service pages, og-image + headshot serving). **Open follow-ups:** testimonials/case study (biggest gap); ~~add 3 new service URLs to deploy.yml IndexNow + link-check.yml~~ **DONE Session 15** (merged `c5c8590`, deploy `27231381910` green; also fixed 3 stale link-check 404s that had been red since the Astro migration); reverse TAG→HGC backlink; backlink-bearing certs (HubSpot Solutions Partner first); Netlify form-notification for `free-audit`; Twilio TFV resubmit. Detail below. Prior — Session 14 Round 3 (was preview-only on PR #4): **Density + polish.** Hero metrics card reformatted to **metrics-only** (6 punchy stats in a 2×3 grid, dropped the credential line). **Global spacing tightened** (--section-py 80→46, section--compact 64→36, hero/tools-strip paddings cut so the hero↔logo gap went ~128px→~34px). Services dropdown trimmed to top-3-per-pillar + "See all services, including specialized →" link (GTM/Sales Comp/Tech Stack de-featured from the menu, pages still live); /services keeps all 12. **HGC LinkedIn icon added to nav**; **TAG cross-link** added (footer "Writing" + /about line) → theautomationsguide.com. SEO note: set up the reverse TAG→HGC backlink (the real ranking lever). Build clean (24 pages). Prior — Round 2 (same PR #4, preview-only, NOT merged): **Hero is now 2-column with a proof/credentials card on the right** (fills the empty space Ian flagged); logo strip moved below the hero; standalone stat-strip removed. **Pillar sub-tiles re-curated:** added Conversion & Landing Pages (More Customers), Retention & Expansion (More Revenue), Data Enrichment & Hygiene (More Time Back); de-featured GTM Strategy, Sales Comp, Tech Stack Audit (still live services). **3 new service pages** created; **/services realigned to the outcome pillars at 12 services**; Nav mega-menu + Footer + schema updated. Confirmed via curl that Ian's "still old branding" was because he was viewing **production** (unmerged), not a cache bug. Deferred: add the 3 new URLs to deploy.yml IndexNow + link-check.yml (needs workflow-scope; sitemap already covers discovery). Build clean (24 pages). Prior — Session 14: **Executive homepage rebuild (same PR #4 branch, preview-only, NOT merged).** Fixed the brand remnants Ian spotted: recolored `favicon.svg` + `custom-stack.svg` and regenerated `favicon-16/32`, `apple-touch-icon`, and a new on-brand `og-image.png`. Removed the teal "Senior Growth Operations" hero pill and swept the phrase sitewide (kept the "Growth operations, owned end-to-end." footer line). **Repositioned the homepage to a broad growth umbrella:** new hero "Get found. Win customers. Keep them coming back." + plain-language subhead + HubSpot-RevOps-Certified trust line; **logo wall moved up into the hero** as the visual; 9 services regrouped into 3 outcome pillars **More Customers / More Revenue / More Time Back**; added a **"Who I help" vertical router** (local/restaurants + B2B/SaaS); stat-strip caveat. Added a homepage **operator strip with Ian's headshot** + the HubSpot cert badge, put the headshot on `/about`, and shipped an interim **free-audit form** (`#free-audit`, registered in NetlifyFormStubs). Build clean (21 pages). **User actions:** add a Netlify form-notification email for `free-audit` (like sms-opt-in); pursue backlink-bearing certs (HubSpot Solutions Partner first); provide testimonials/case study. **Self-serve audit tool = separate growth-engine build.** Prior:_
_Session 13: **Design-system rebrand — aligned fonts/colors/logo to the HGC Design System kit** (CODE-COMPLETE on branch `design-system-rebrand`, preview-only, NOT merged). Fonts swapped **Inter + DM Mono → Geist Sans + Geist Mono** (6 self-hosted woff2 in `public/fonts/`, `fonts.css` rewritten, BaseLayout preloads updated, old Inter/DM Mono files removed). Color tokens revalued to the kit palette in `global.css :root` (teal `#49A69C`→`#4AADA8`, dark→slate-700 `#3D4755`, bg→warm paper `#FAFAF8`, body text→slate-700, added full teal/slate/tan scales + cream + tan accent), plus a global old-teal `rgba(73,166,156)`→`rgba(74,173,168)` tint sweep and `font-weight:800`→700 clamp (Geist tops at 700). Logo wordmark restyled (HG → slate-700, weight 700, Geist). **Homepage hero converted to single-column text-first** (removed the 2-col split + inline SVG mesh; "owned" now teal). Dark **slate** content blocks (`.stats-bar`, `.dark-section` "Four steps", `.section--dark`) recolored to **teal-800** per the kit's teal-forward rule (footer stays slate). Inner-page photo heroes **kept** (hybrid decision) with the teal gradient overlay flattened to a hairline frame. Radii aligned (cards 12→10, lg 20→14). Build clean (21 pages, 2.75s); Chrome-headless QA across home/service/pricing/about/for-local at desktop+mobile all read on-brand. **Decisions locked with Ian:** hybrid hero (text-first home, keep photo inner heroes); keep full-color stack logos (not mono text); recolor dark sections to teal. **Next: push branch → Netlify deploy-preview → Ian reviews → `--no-ff` merge.** Revert before merge: close PR. Source kit: `HGC Design System FINAL - 20260605-handoff.tar.gz`. Prior:_
_Session 12: **Twilio TFV consent unbundled + sending number surfaced + About broadened** (CODE-COMPLETE, PENDING DEPLOY). Per a TFV reviewer's feedback, the SMS consent checkbox in `SmsOptInForm.astro` no longer bundles the Privacy Policy / Terms acknowledgment into the consent statement — consent now stands alone (ends at "...HELP for help."), and the Privacy Policy + Terms links moved to a separate `<p class="form-consent__legal">` directly below. Sending number **+1 (866) 369-4940** now shown on `/sms-opt-in` ("What to expect" → Sender) and `/privacy-policy` §7 to reinforce business identity. `/about` broadened to welcome local + multi-location service businesses alongside growth companies (added a visibility-audit paragraph + "Get a free visibility audit →" CTA → `/roi-call`; softened the "$10M ARR" line; `knowsAbout` schema gained Local SEO / GBP Optimization / Lead Generation / Multi-Location Operations). Built clean (21 pages). **User action: resubmit Twilio TFV for +18663694940** (reviewer cautioned it is not a guaranteed approval; confirm the TFV business-name field exactly equals "Homegrown Growth Co."). Revert once committed: `git revert <sha>`. Prior:_
_Session 11: **git push verified working** post-recovery (`git push --dry-run` reached origin + authenticated, "Everything up-to-date" — closes the recovery follow-up). **Footer email obfuscation added** in `src/components/Footer.astro` (CODE-COMPLETE, PENDING DEPLOY): the two footer `mailto:ian@homegrowngrowth.co` links now carry the address in `data-eu`/`data-ed` attributes and are assembled to a real `mailto:` at runtime by a small inlined module script, so harvesters scraping the static HTML never see a plain address; the visible link keeps a human-readable `ian [at] homegrowngrowth [dot] co` no-JS fallback. Built clean (21 pages); no plaintext footer mailto in `dist/`. NOTE: in-body mailto links on `/privacy-policy`, `/terms`, `/sms-opt-in` are intentionally left readable (legal/contact prose, out of scope for "footer mailto"). Revert once committed: `git revert <sha>` (single-file change). Prior:_
_Session 10 shipped **Phase C: `/for-saas` content refresh** to align the SaaS vertical hub with the 9-service umbrella from Sessions 8-9. Service cards expanded 6 → 9 (added GTM Strategy, Demand Generation, Website SEO & GEO; renamed Pipeline Analytics → Reporting & Analytics, Automation & Workflow Design → Workflows & Automation, GTM Tech Stack Audit → Tech Stack Audit). Pain points reweighted to surface GTM motion + AI-search-invisibility hooks. New FAQ "Do I need the whole umbrella, or just one piece?" answers the most common post-pivot shopper question. CTA H2 aligned to brand line ("own growth operations end-to-end"). **Google Business Profile is live** (link below) — knocked the highest-impact distribution item off the list._

---

## What's Live

**Domain:** https://homegrowngrowth.co
**Hosting:** Netlify (auto-deploys from GitHub on every push to `main`)
**Repo:** https://github.com/homegrowngrowthco/homegrown-growth-co
**Default branch:** `main`

---

## Completed

### Infrastructure & Deployment
- [x] GitHub repo + Netlify connected via GitHub Actions (auto-deploy on push to `main`)
- [x] Custom domain live (`homegrowngrowth.co`) with Netlify SSL
- [x] **Astro 5 + TypeScript** build (2026-05-16): `npm ci && npm run build && netlify deploy --dir=dist --prod` in GitHub Actions. `NODE_VERSION="24"` pinned in `netlify.toml`. Build produces flat `dist/<slug>.html` (`build.format: 'file'`) so Netlify serves clean URLs natively without trailing-slash 301s.
- [x] `netlify.toml` — security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy, `form-action 'self'`), immutable caching for static assets, `/resources` 301 → `/`, trailing 404 fallback. **Per-page `.html` rewrites all removed** post-Astro (no longer needed; Astro's flat output maps natively).
- [x] `src/pages/404.astro` — branded, real 404 status, GA-tracked
- [x] **IndexNow auto-ping** on every prod deploy. URL list covers every indexed page (homepage, services overview, 6 service pages, /for-saas, /about, /pricing, /roi-call, /privacy-policy, /terms, /sms-opt-in)
- [x] **CI link-checker** (`.github/workflows/link-check.yml`) — curl-based, runs weekly + on-demand against the live site. Verifies all canonical URLs return 200 and `/resources` still 301s. Runs in ~11s.
- [x] **`public/analytics.js`** — consolidated GA4 + Microsoft Clarity bootstrap, loaded with `defer`. BaseLayout includes it in the verified gtag-then-analytics.js order.
- [x] **Sitemap autogenerated** by `@astrojs/sitemap` at build time (`dist/sitemap-index.xml` + `dist/sitemap-0.xml`). Filter excludes `/404` and `/case-studies`.
- [x] **`.claude/settings.json`** committed at repo root with the audited shared allowlist (git/npm/gh/netlify/curl/lighthouse). `.claude/settings.local.json` gitignored, holds per-machine entries only. `.claude/commands/` has `/preview`, `/build-check`, `/add-page`, `/audit-seo`.
- [x] **`SECURITY.md`** + **`LICENSE`** at repo root.

### SEO & GEO
- [x] Canonical URLs on all pages
- [x] Open Graph + Twitter Card meta on all pages, including `og-image.png` (1200×630, deployed)
- [x] JSON-LD structured data:
  - Homepage: `ProfessionalService` + `FAQPage` (6 Q&As)
  - Services: `WebPage` + `ItemList` of 12 services (3 outcome pillars: More Customers / More Revenue / More Time Back)
  - Each service page: `Service` + `BreadcrumbList` + `FAQPage` (4 Q&As — 4th is "How much does this cost?" with internal link to /pricing)
  - About: `Person` (with `memberOf` Salute to Soldiers Foundation) + `BreadcrumbList`
  - Pricing: `WebPage` + `BreadcrumbList` + `FAQPage` (6 Q&As)
  - ROI Call: `BreadcrumbList`
  - For-saas: `FAQPage` + `WebPage` + `BreadcrumbList`
- [x] `sitemap-index.xml` + `sitemap-0.xml` — autogenerated by `@astrojs/sitemap`; excludes `/404` and `/case-studies`. (Hand-maintained `sitemap.xml` deleted 2026-05-16 with the Astro migration.)
- [x] `robots.txt` — allows all, points to sitemap
- [x] Self-hosted fonts (Inter, DM Mono, DM Sans, Plus Jakarta Sans) under `public/fonts/`

### Navigation, A11y & Pages
- [x] Services dropdown (desktop) — hover + keyboard accessible
- [x] Services accordion (mobile)
- [x] Pricing link in main nav, mobile nav, and footer Company column on every page (incl. `for-saas.html`'s separate nav)
- [x] **Skip-to-content link** site-wide (visually hidden until focused)
- [x] `aria-label` on `for-saas.html` custom nav
- [x] `target="_blank"` links all have `rel="noopener"`
- [x] Active nav state highlights current page
- [x] `roi-call.html` — minimal "Back to home" footer link (no full footer by design)

### Pages (all under `src/pages/` post-2026-05-16 Astro migration)
- [x] `index.astro` — Homepage with `ProfessionalService` + `FAQPage` (6 Q&As) `@graph` schema
- [x] `services.astro` — Overview, 12 service rows grouped into 3 outcome pillars (More Customers / More Revenue / More Time Back) with anchor IDs (`#fractional-revops`, etc.), data-driven; `WebPage` schema with `ItemList` of 12 Service entities. (Was 6; expanded across the Session 8-14 umbrella pivot + outcome-pillar realignment.)
- [x] `pricing.astro` — 4 engagement-model packages (Retainer / Project-Based / Outcome-Based / Assessment); visible `$` amounts removed (precise number moves to the discovery call); FAQ accordion; `WebPage` + `BreadcrumbList` + `FAQPage` schema (FAQ array shared between visible content and schema). (Was the old 3-tier $3K/$5.5K/$10K retainer table; pivoted Session 8.)
- [x] `about.astro` — Bio with LinkedIn, Salute to Soldiers Foundation Treasurer role, `Person` schema with `memberOf`; uses `ogType="profile"` on BaseLayout
- [x] `roi-call.astro` — Calendly inline-widget embed (loaded inline via `is:inline`); uses `bareNav` + `bareFooter` BaseLayout props for the minimal logo-only header + back-to-home footer
- [x] `case-studies.astro` — Placeholder, noindex (uses BaseLayout's `noindex` prop)
- [x] `for-saas.astro` — SaaS vertical hub on the shared design system (BaseLayout + Nav + Footer + global.css; unified from the old static `.html` in Session 6). 9 service cards by pillar, pain points, FAQ accordion. Refreshed to the umbrella framing in Session 10.
- [x] `for-local-businesses.astro` — Local + multi-location vertical hub (restaurants, healthcare, home services, franchises). H1 "Get found. Get booked. Get repeat business." Surfaced sitewide via the footer "Industries" group.
- [x] `ServicePage.astro` component drives all 12 service detail pages from a data-only wrapper each (`fractional-revops.astro`, `crm-implementation.astro`, `gtm-strategy.astro`, `demand-generation.astro`, `website-seo-geo.astro`, `conversion-landing-pages.astro`, `retention-expansion.astro`, `data-enrichment-hygiene.astro`, etc.). Each renders breadcrumb + intro + "What's included" bullets + "Good fit if" strip + FAQ accordion + related services + CTA, with a per-service photo hero. `@graph` schema (Service + BreadcrumbList + FAQPage) built from the same data props as the visible content, so it can't drift.
- [x] `404.astro` — branded, real 404 status, GA-tracked. Uses `bareFooter` (no global footer on error pages). Page-specific `.not-found*` CSS scoped via `<style is:global>`.
- [x] `privacy-policy.astro` — Privacy Policy with Twilio A2P–compliant SMS consent section (no third-party sharing of mobile info, STOP/HELP opt-out, message frequency/data rates disclosure). Linked in footer Company column site-wide. Section 7 has `id="sms-terms"` anchor for deep-linking from the opt-in page.
- [x] `terms.astro` — Terms & Conditions covering site use, services, payment, IP, confidentiality, liability, governing law (Massachusetts), SMS terms reference. Linked in footer Company column site-wide. Section 8 has `id="sms"` anchor.
- [x] `sms-opt-in.astro` — Dedicated SMS opt-in page for Twilio TFV / A2P registration review. Uses the `SmsOptInForm` component for the visible form. **Netlify Forms detection confirmed working post-migration** via the `NetlifyFormStubs` component (hidden duplicate form on every page via BaseLayout, so detection works regardless of which attributes Astro preserves on the visible form). Email notification to ian@homegrowngrowth.co is live ✅. **Consent unbundled per TFV reviewer (Session 12):** the consent checkbox text is self-contained (no Privacy Policy / Terms acknowledgment inside it); those links sit in a separate paragraph below. Sending number +1 (866) 369-4940 shown in the "What to expect" panel + Privacy Policy §7.

### Shared infrastructure (new with Astro migration)
- [x] **`BaseLayout.astro`** — single source of truth for `<head>` (meta, fonts, gtag-then-analytics, canonical, OG/Twitter, optional JSON-LD via JsonLd component), `<body>` (skip-link, Nav, slot, Footer, NetlifyFormStubs, bundled nav.ts). Props: `title`, `description`, `canonical`, `ogType?`, `ogImage?`, `noindex?`, `schema?`, `bareNav?`, `bareFooter?`. Global meta/script changes are now ONE FILE edit.
- [x] **`Nav.astro`** — global top nav. Reads `Astro.url.pathname` server-side to set the `active` class. Mobile menu + services dropdown markup included.
- [x] **`Footer.astro`** — full Company column with SMS Updates / Privacy / Terms.
- [x] **`JsonLd.astro`** — emits `<script type="application/ld+json">` with the `</script>` XSS-escape applied preemptively (closes a future surface if testimonial/case-study schema fields ever come from user-derived content).
- [x] **`PageHero.astro`** — encapsulates the `.page-hero` pattern (tag, headline, subtitle, optional `headlineMaxWidth`).
- [x] **`SmsOptInForm.astro`** — visible form + inline AJAX submit script.
- [x] **`NetlifyFormStubs.astro`** — hidden duplicate form on every page via BaseLayout. Removes the form-detection footgun entirely.
- [x] **`src/scripts/nav.ts`** — TypeScript-strict port of the prior `script.js`. Sticky nav, mobile menu, services dropdown (keyboard nav), mobile services accordion, scroll fade-up animations, Calendly init.
- [x] **`src/styles/global.css`** — byte-for-byte copy of the prior `styles.css`. Imported once in BaseLayout, Vite bundles and emits to `/_astro/*.css` (shared, cache-busted via hash).

### Search Console & Indexing
- [x] Google Search Console — ownership verified
- [x] Bing Webmaster Tools — ownership verified
- [x] **Sitemap resubmitted to Google Search Console** (2026-04-27, after `/pricing` was added)
- [x] **URL Inspection / Request Indexing** done in GSC for `/pricing` and `/about` (the two pages with substantive new content)

### Distribution presences (external)
- [x] **Google Business Profile — live** (2026-05-27). [Public profile link](https://share.google/pjlSd3uuV2CDQqxLD). Knocks out the highest-impact local SEO distribution item; helps with "RevOps consultant Massachusetts" / "growth ops consultant near me" queries.
- [x] **Clutch profile — live** (approved/published 2026-06-09, confirmed 2026-06-11). Top B2B services directory: backlink + referral traffic.
- [x] **Reverse TAG → HGC backlink — live** (verified Session 16). The Automations Guide links to HGC sitewide (footer "Published by HGC" on every page) and per blog post (author-bio "Founder, Homegrown Growth Co" + "See HGC services", dofollow), plus contextual links on TAG's `/about` and author/publisher schema `sameAs`. This was the Session-14 "real ranking lever" follow-up; it is done.

### Retired
- [x] `/resources` page deleted; 301 redirect to `/` in `netlify.toml`; `Disallow: /resources` removed from `robots.txt`

### Repo Hygiene
- [x] `README.md` at repo root with deploy flow + structure
- [x] Local cleanup: deleted `HTML Files/`, `DEPLOY_TODAY.md`, `FINAL_PACKAGE_SUMMARY.md`, `HOSTING_COST_COMPARISON.md`, orphaned `package-lock.json`
- [x] Dead code removed: `notify-form` handler in `script.js`, `.email-capture*` rules in `styles.css`

---

## Remaining

### Distribution & marketing — your action, mostly forms
Paste-ready copy for every directory below is in [`DIRECTORY_PROFILES.md`](DIRECTORY_PROFILES.md).

| Priority | Task | Effort | Notes |
|----------|------|--------|-------|
| HIGH | **HubSpot Solutions Directory** | ~30 min | Highest value: relevant backlink + on-ramp to the Solutions Partner program, directly tied to your HubSpot work. Lead with the HubSpot RevOps cert. |
| MED | **G2 listing** | ~30 min | Top B2B services directory. Backlink + referral traffic. |
| MED | **Calendly intake questions** | ~10 min | Add 2-3 qualifying questions (current CRM, biggest ops pain, rough company size) to the ROI call event in the Calendly UI. Filters tire-kickers. Exact wording in `DIRECTORY_PROFILES.md`. |
| MED | **Netlify form-notification email for `free-audit`** | ~2 min | One-time, same step done for `sms-opt-in`: Netlify dashboard → site → Forms → `free-audit` → add an email notification to ian@homegrowngrowth.co. The form (Session 14 `#free-audit`) is already registered in `NetlifyFormStubs.astro`. |

_Awaiting external review, no action: **Twilio TFV** resubmitted 2026-06-09 for +18663694940 (consent unbundled per reviewer), approval pending. **Clutch** done (see Distribution presences below)._

### Content — defer (separate batch)
| Task | Why it matters |
|------|----------------|
| **Testimonials** (1-3, even anonymized) | **Biggest remaining conversion gap.** |
| **One real case study** | Replaces placeholder cards on `/case-studies`. |
| **Blog/Resources content** | Long-term SEO play. `/resources` is currently retired (301 → `/`); when you publish, build a fresh page. |

### Tech debt — all resolved or explicitly declined (2026-05-16)
| Task | Status | Notes |
|------|--------|-------|
| ~~Move to a build system (Eleventy / Astro / Hugo)~~ | ✅ Done | Migrated to Astro 5 in the morning Phase B session. Shared BaseLayout + Nav + Footer + ServicePage components; global changes are now one-file edits. |
| ~~`/for-saas` design unification~~ | ✅ Done | Replaced static .html (embedded design system) with `.astro` using BaseLayout + standard Nav/Footer + global.css. Page-specific section classes (.proof-strip, .pain-card, .saas-service-card, .stat-card, .fit-cols) added to global.css. SaaS content preserved verbatim. |
| ~~Inline `style="..."` → CSS classes~~ | ✅ Done | 93 → 25 (73% reduction) via utility classes in global.css (.link-teal, .legal-prose, .legal-h2, .legal-list, .title--on-dark, .mb-X, .inline-cta). Remaining 25 are bespoke one-offs, not repeated patterns. |
| ~~Drop unused fonts (Plus Jakarta Sans, DM Sans)~~ | ✅ Done | 8 woff2 files deleted (~80 KB). `fonts.css` trimmed to Inter + DM Mono only. |
| **CSP fix — `scripts.clarity.ms` blocked, Clarity broken in prod** | ✅ Fixed | Lighthouse audit caught it: Clarity bootstrap loaded from `clarity.ms` (allowed) but the SDK from `scripts.clarity.ms` was blocked by script-src. Session capture was silently failing. Fix in this session. |
| **CSP hardening — `frame-ancestors 'none'` + `upgrade-insecure-requests`** | ✅ Done | Added both directives; defensive and free. |
| CSP: remove `'unsafe-inline'` from `script-src` | ⏸️ Explicitly declined | Requires per-build SHA-256 hashing of inline JSON-LD + Astro bundled scripts with a custom build step injecting hashes into the netlify.toml CSP header. ~2-4 hours of work; doesn't unblock a real user-facing threat on a static marketing site (no UGC, no auth surface). Astro 5's `experimental.csp` doesn't help (SSR-only, meta-tag delivery, won't work with our static output). Revisit when there's a specific compliance/audit driver. |
| Branch protection on `main` | ⏸️ Explicitly declined | Skipped while solo. Friction cost is real, security benefit is near-zero on a static marketing site with no secrets in the repo. Revisit if a collaborator joins. |

### When the time comes
| Task | Trigger |
|------|---------|
| LinkedIn Insight Tag | After ~3 months of steady traffic + paid-campaign plan within ~2 months. |
| Meta Pixel | Probably never — B2C-leaning, low value for fractional RevOps. |
| `Article` / `BlogPosting` schema | When `/resources` is revived with real content. |

### Minor polish (low priority)
- ~~**Email obfuscation** on footer `mailto:`~~ ✅ Done Session 11 (`Footer.astro` assembles the address at runtime from `data-eu`/`data-ed`; `[at]` no-JS fallback). No open minor-polish items.

---

## Known Caveats

- **CSP retains `'unsafe-inline'` in `script-src` and `style-src`.** Required for inline JSON-LD blocks emitted by `JsonLd.astro` (`set:html={JSON.stringify(...)}`), Astro's bundled inline `<script type="module">` tags, and the ~25 remaining inline `style="..."` attributes. Tightening path (when prioritized): per-build SHA-256 hash extraction injected into the CSP header via a custom build step. ~2-4 hours of work; on a static marketing site with no UGC or auth surface, the security benefit is near-zero. Decision documented in `CLAUDE.md`.
- **Microsoft Clarity uses third-party cookies.** Lighthouse `third-party-cookies` audit (weight 5) flags 8 cookies from `clarity.ms` / `c.clarity.ms` / `c.bing.com`. Unfixable without removing Clarity. Acceptable trade-off for session-replay analytics.
- **Branch protection on `main`: deliberately skipped while solo.** The friction cost of forcing every change through a PR for a single-developer marketing site outweighs the near-zero security benefit (no secrets in the repo). Revisit when a collaborator joins. Documented in `CLAUDE.md`.
- **Lighthouse Best Practices baseline was 0.73.** Captured in `_baseline/lighthouse-2026-05-14/`. The main deductions came from `errors-in-console` + `inspector-issues` (the blocked-Clarity-SDK CSP violation, FIXED in this session) and `third-party-cookies` (Clarity, unfixable). Post-fix re-run should land at ~0.95. Run `/audit-seo https://homegrowngrowth.co/` to measure.

---

## Site Map

```
homegrowngrowth.co/                       ← Homepage
homegrowngrowth.co/services               ← Services overview (12 services, 3 pillars)
homegrowngrowth.co/pricing                ← Pricing (4 engagement models)

  More Customers
homegrowngrowth.co/website-seo-geo        ← Service page
homegrowngrowth.co/demand-generation      ← Service page
homegrowngrowth.co/conversion-landing-pages ← Service page
homegrowngrowth.co/gtm-strategy           ← Service page
  More Revenue
homegrowngrowth.co/crm-implementation     ← Service page
homegrowngrowth.co/reporting-analytics    ← Service page
homegrowngrowth.co/retention-expansion    ← Service page
homegrowngrowth.co/sales-comp-enablement  ← Service page
  More Time Back
homegrowngrowth.co/process-automation     ← Service page (Workflows & Automation)
homegrowngrowth.co/data-enrichment-hygiene ← Service page
homegrowngrowth.co/fractional-revops      ← Service page
homegrowngrowth.co/tech-stack-audit       ← Service page

  Vertical hubs
homegrowngrowth.co/for-saas               ← B2B & SaaS hub
homegrowngrowth.co/for-local-businesses   ← Local & multi-location hub

  Other
homegrowngrowth.co/about                  ← About
homegrowngrowth.co/roi-call               ← Book a call (Calendly)
homegrowngrowth.co/case-studies           ← Placeholder (noindex)
homegrowngrowth.co/privacy-policy         ← Privacy Policy (incl. SMS / A2P)
homegrowngrowth.co/terms                  ← Terms & Conditions
homegrowngrowth.co/sms-opt-in             ← SMS opt-in form (Twilio TFV / A2P)
homegrowngrowth.co/404                    ← Custom 404
homegrowngrowth.co/resources              ← 301 → /
```
_Note: GTM Strategy, Sales Comp & Enablement, and Tech Stack Audit are de-featured from the nav dropdown (top-3-per-pillar) but stay live and are listed on `/services` + the footer._

---

## Highest-Impact Next Action

**HubSpot Solutions Directory** (~30 min). Highest-value distribution lever left: a relevant backlink plus the on-ramp to the HubSpot Solutions Partner program, directly tied to the HubSpot work HGC does. Then **G2** + the **Calendly intake questions**. (Clutch is already live; Twilio TFV is resubmitted and awaiting Twilio's review.) Paste-ready copy for all directory listings is in [`DIRECTORY_PROFILES.md`](DIRECTORY_PROFILES.md). The single biggest *conversion* gap remains a real testimonial or two (parked until source material exists).
