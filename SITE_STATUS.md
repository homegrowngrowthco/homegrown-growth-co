# Homegrown Growth Co. — Site Status
_Last updated: 2026-04-24_

---

## What's Live

**Domain:** https://homegrowngrowth.co
**Hosting:** Netlify (auto-deploys from GitHub on every push to `main`)
**Repo:** https://github.com/homegrowngrowthco/homegrown-growth-co

---

## Completed

### Infrastructure & Deployment
- [x] GitHub repo + Netlify connected via GitHub Actions (auto-deploy on push to `main`)
- [x] Custom domain live (`homegrowngrowth.co`) with Netlify SSL
- [x] `netlify.toml` — security headers (CSP, HSTS, X-Frame-Options), immutable caching for static assets, clean URL redirects for all pages
- [x] `404.html` — proper branded 404 page; Netlify returns real 404 status (not 200 to homepage)
- [x] IndexNow auto-ping — every prod deploy notifies Bing, Google, and other IndexNow members automatically

### SEO & GEO
- [x] Canonical URLs on all pages
- [x] Open Graph + Twitter Card meta on all pages (og-image referenced but file TBD — see remaining)
- [x] JSON-LD structured data:
  - Homepage: `ProfessionalService` schema with `hasOfferCatalog`, `founder`, E-E-A-T signals
  - Services: `ItemList` of all 6 services
  - Each service page: `Service` + `BreadcrumbList`
  - About: `Person` + `BreadcrumbList`
  - ROI Call: `BreadcrumbList`
  - for-saas: `FAQPage` + `WebPage` + `BreadcrumbList`
- [x] `sitemap.xml` — 11 indexed URLs, submitted to Google Search Console and Bing
- [x] `robots.txt` — allows all, disallows `/resources`, points to sitemap
- [x] Self-hosted fonts (Inter, DM Mono, DM Sans, Plus Jakarta Sans) — eliminates Google Fonts third-party DNS dependency; preload hints on critical weights

### Navigation
- [x] Services dropdown (desktop) — hover + keyboard accessible, with invisible hover bridge so menu doesn't collapse mid-cursor
- [x] Services accordion (mobile) — expandable sub-menu
- [x] Active nav state highlights current page and "Services" when on any service sub-page

### Pages
- [x] `index.html` — Homepage
- [x] `services.html` — Full services overview with section anchors
- [x] `about.html` — Bio with LinkedIn button, Person schema
- [x] `roi-call.html` — Calendly booking embed
- [x] `case-studies.html` — Placeholder (noindex until content is ready)
- [x] `for-saas.html` — SaaS-specific landing page with FAQ schema
- [x] `fractional-revops.html` — Standalone service page
- [x] `crm-implementation.html` — Standalone service page
- [x] `process-automation.html` — Standalone service page
- [x] `reporting-analytics.html` — Standalone service page
- [x] `tech-stack-audit.html` — Standalone service page
- [x] `sales-comp-enablement.html` — Standalone service page

Each standalone service page includes: breadcrumb nav, intro + bullet list + "good fit if" sidebar, FAQ (3 Q&As), related services grid, CTA section, full SEO metadata, Service + BreadcrumbList JSON-LD.

### Search Console & Indexing
- [x] Google Search Console — ownership verified, sitemap submitted
- [x] Bing Webmaster Tools — sitemap submitted
- [x] 11 URLs manually submitted to Bing for fast indexing

---

## Remaining

### I Can Handle These (no input needed from you)
| # | Task | Notes |
|---|------|-------|
| 1 | **Microsoft Clarity** — heatmaps + session recording | Need your Clarity tracking ID first |
| 2 | **og-image.png** — OG image for link previews on LinkedIn/Slack | Need you to provide or approve a design; I can generate the HTML/meta once the file exists |

### Needs You — Content
| # | Task | Impact |
|---|------|--------|
| 1 | **Testimonials** — 2–3 client quotes on homepage | Biggest conversion gap; even anonymized quotes help |
| 2 | **Photo on About page** — no headshot currently | Trust signal; important for a services business |
| 3 | **Case studies** — content documented and ready to write | Pages exist at `/case-studies`; just need the stories |
| 4 | **Pricing / engagement framing** — add a "how it works" or pricing range section | Helps qualify inbound before the call |
| 5 | **Blog or Resources content** — `/resources` redirects to homepage right now | Long-term SEO play; not urgent |

### Needs You — Marketing & Distribution
| # | Task | Notes |
|---|------|-------|
| 1 | **Re-submit sitemap to Google Search Console** | 6 new service pages were added — go to Search Console → Sitemaps → resubmit `https://homegrowngrowth.co/sitemap.xml` |
| 2 | **Google Business Profile** | Free local/map listing; helps with "RevOps consultant [city]" searches |
| 3 | **Directory listings** | Clutch, G2, HubSpot Solutions Directory — good for backlinks + referral traffic |
| 4 | **LinkedIn content** | Posting from your personal profile linking back to service pages will drive both traffic and domain authority |

---

## Current Site Map

```
homegrowngrowth.co/                     ← Homepage
homegrowngrowth.co/services             ← Services overview
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
```

---

## Highest-Impact Next Action

**Add 2–3 testimonials to the homepage.** Everything else is infrastructure. Social proof is the one thing that most directly affects whether a visitor books a call.
