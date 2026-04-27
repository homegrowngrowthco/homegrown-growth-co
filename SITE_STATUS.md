# Homegrown Growth Co. — Site Status
_Last updated: 2026-04-27 (end of day)_

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
- [x] `netlify.toml` — security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy), immutable caching for static assets, clean URL redirects, `/resources` 301 → `/`
- [x] `404.html` — branded, real 404 status, GA-tracked
- [x] **IndexNow auto-ping** on every prod deploy. URL list includes all 12 indexed pages: `/`, `/services`, `/pricing`, `/about`, `/roi-call`, `/for-saas`, `/case-studies`, and 6 service pages
- [x] **CI link-checker** (`.github/workflows/link-check.yml`) — curl-based, runs weekly + on-demand against the live site. Verifies all 13 canonical URLs return 200 and `/resources` still 301s. Runs in ~11s.
- [x] **`analytics.js`** — consolidated GA4 + Microsoft Clarity bootstrap, loaded with `defer`. Replaces the inline scripts that were on every page.

### SEO & GEO
- [x] Canonical URLs on all pages
- [x] Open Graph + Twitter Card meta on all pages, including `og-image.png` (1200×630, deployed)
- [x] JSON-LD structured data:
  - Homepage: `ProfessionalService` + `FAQPage` (6 Q&As)
  - Services: `WebPage` + `ItemList` of 6 services
  - Each service page: `Service` + `BreadcrumbList` + `FAQPage` (4 Q&As — 4th is "How much does this cost?" with internal link to /pricing)
  - About: `Person` (with `memberOf` Salute to Soldiers Foundation) + `BreadcrumbList`
  - Pricing: `WebPage` + `BreadcrumbList` + `FAQPage` (6 Q&As)
  - ROI Call: `BreadcrumbList`
  - For-saas: `FAQPage` + `WebPage` + `BreadcrumbList`
- [x] `sitemap.xml` — all indexed URLs incl. `/pricing`, `lastmod` 2026-04-27
- [x] `robots.txt` — allows all, points to sitemap
- [x] Self-hosted fonts (Inter, DM Mono, DM Sans, Plus Jakarta Sans)

### Navigation, A11y & Pages
- [x] Services dropdown (desktop) — hover + keyboard accessible
- [x] Services accordion (mobile)
- [x] Pricing link in main nav, mobile nav, and footer Company column on every page (incl. `for-saas.html`'s separate nav)
- [x] **Skip-to-content link** site-wide (visually hidden until focused)
- [x] `aria-label` on `for-saas.html` custom nav
- [x] `target="_blank"` links all have `rel="noopener"`
- [x] Active nav state highlights current page
- [x] `roi-call.html` — minimal "Back to home" footer link (no full footer by design)

### Pages
- [x] `index.html` — Homepage with FAQPage schema
- [x] `services.html` — Overview with section anchors
- [x] `pricing.html` — Three-tier retainer pricing ($3K / $5.5K / $10K monthly), full breakdown table, 6-question FAQ
- [x] `about.html` — Bio with LinkedIn, Salute to Soldiers Foundation Treasurer role, Person schema with `memberOf`
- [x] `roi-call.html` — Calendly booking embed, Back to home link
- [x] `case-studies.html` — Placeholder (noindex until content is ready); footer LinkedIn link present
- [x] `for-saas.html` — SaaS-specific landing page with FAQ schema; uses its own embedded design system (see Known Caveats)
- [x] 6 standalone service pages (each: breadcrumb, intro + bullets + "good fit if" sidebar, 4-question FAQ, related services, CTA, full schema)
- [x] `404.html` — branded, GA-tracked

### Search Console & Indexing
- [x] Google Search Console — ownership verified
- [x] Bing Webmaster Tools — ownership verified
- [x] **Sitemap resubmitted to Google Search Console** (2026-04-27, after `/pricing` was added)
- [x] **URL Inspection / Request Indexing** done in GSC for `/pricing` and `/about` (the two pages with substantive new content)

### Retired
- [x] `/resources` page deleted; 301 redirect to `/` in `netlify.toml`; `Disallow: /resources` removed from `robots.txt`

### Repo Hygiene
- [x] `README.md` at repo root with deploy flow + structure
- [x] Local cleanup: deleted `HTML Files/`, `DEPLOY_TODAY.md`, `FINAL_PACKAGE_SUMMARY.md`, `HOSTING_COST_COMPARISON.md`, orphaned `package-lock.json`
- [x] Dead code removed: `notify-form` handler in `script.js`, `.email-capture*` rules in `styles.css`

---

## Remaining

### Distribution & marketing — your action, mostly forms
| Priority | Task | Effort | Notes |
|----------|------|--------|-------|
| HIGH | **Google Business Profile** | ~15 min | Free local SEO; helps with "RevOps consultant Massachusetts/Boston" queries. Claim at business.google.com. |
| HIGH | **Clutch profile** | ~30 min | Top B2B services directory. Backlink + referral traffic. |
| MED | **G2 / HubSpot Solutions Directory** | ~30 min each | Same logic. HubSpot's directory is especially relevant given the HubSpot work you do. |
| MED | **Calendly intake questions** | ~10 min | Add 2–3 qualifying questions (current ARR, current CRM, biggest ops pain) to the ROI call event in the Calendly UI. Filters tire-kickers. |

### Content — defer (separate batch)
| Task | Why it matters |
|------|----------------|
| **Testimonials** (1–3, even anonymized) | **Biggest remaining conversion gap.** |
| **Headshot for /about** | Trust signal for solo consultants. |
| **One real case study** | Replaces placeholder cards on `/case-studies`. |
| **Blog/Resources content** | Long-term SEO play. `/resources` is currently retired (301 → `/`); when you publish, build a fresh page. |

### Tech debt — defer until it actually hurts
| Task | Effort | Notes |
|------|--------|-------|
| `for-saas.html` design unification | 2–4 hrs | Currently has its own embedded design system. Site-wide changes don't propagate there automatically. |
| Move to a build system (Eleventy / Astro / Hugo) | ~1 day | Replaces 14× duplicated nav/footer with a template. Worth doing if the site keeps changing. |
| Inline `style="..."` → CSS classes | 1–2 hrs | ~93 inline styles across pages. Pure code-quality. |
| Drop unused fonts (Plus Jakarta Sans, DM Sans) | 5 min | Blocked by `for-saas.html` unification — they're only used there. |

### When the time comes
| Task | Trigger |
|------|---------|
| LinkedIn Insight Tag | After ~3 months of steady traffic + paid-campaign plan within ~2 months. |
| Meta Pixel | Probably never — B2C-leaning, low value for fractional RevOps. |
| `Article` / `BlogPosting` schema | When `/resources` is revived with real content. |

### Minor polish (low priority)
- **Email obfuscation** on `mailto:ian@homegrowngrowth.co` — currently scrapable from every page footer. Mitigate via JS that writes the address on hover/click. Marginal benefit unless spam volume grows.

---

## Known Caveats

- **`for-saas.html` is detached from `styles.css`.** It has its own inline design system (different fonts, colors, classes). Site-wide nav and design changes need to be applied there separately. Long-term: unify into the shared design system.
- **CSP retains `'unsafe-inline'` in `script-src`.** Every page has inline JSON-LD schema blocks; tightening would require a SHA-256 hash per block in CSP (brittle — every schema edit invalidates the hash). Acceptable trade-off for a static site with no user-generated content.

---

## Site Map

```
homegrowngrowth.co/                     ← Homepage
homegrowngrowth.co/services             ← Services overview
homegrowngrowth.co/pricing              ← Pricing tiers
homegrowngrowth.co/fractional-revops    ← Service page
homegrowngrowth.co/crm-implementation   ← Service page
homegrowngrowth.co/process-automation   ← Service page
homegrowngrowth.co/reporting-analytics  ← Service page
homegrowngrowth.co/tech-stack-audit     ← Service page
homegrowngrowth.co/sales-comp-enablement ← Service page
homegrowngrowth.co/for-saas             ← SaaS landing page
homegrowngrowth.co/about                ← About
homegrowngrowth.co/roi-call             ← Book a call (Calendly)
homegrowngrowth.co/case-studies         ← Placeholder (noindex)
homegrowngrowth.co/404                  ← Custom 404
homegrowngrowth.co/resources            ← 301 → /
```

---

## Highest-Impact Next Action

**Google Business Profile** (15 minutes). Single biggest distribution lever still available without writing content.
