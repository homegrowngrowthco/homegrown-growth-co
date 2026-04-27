# Homegrown Growth Co. — Site Status
_Last updated: 2026-04-27_

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
- [x] CI link-checker (`link-check.yml`) — lychee runs on every push and weekly on schedule
- [x] `analytics.js` — consolidated GA4 + Microsoft Clarity bootstrap (loaded with `defer`); replaced inline scripts site-wide

### SEO & GEO
- [x] Canonical URLs on all pages
- [x] Open Graph + Twitter Card meta on all pages, including `og-image.png` (1200×630)
- [x] JSON-LD structured data:
  - Homepage: `ProfessionalService` + `FAQPage`
  - Services: `WebPage` + `ItemList` of all 6 services
  - Each service page: `Service` + `BreadcrumbList` + `FAQPage` (4 questions including "How much does this cost?" linking to /pricing)
  - About: `Person` (with `memberOf` Salute to Soldiers Foundation) + `BreadcrumbList`
  - Pricing: `WebPage` + `BreadcrumbList` + `FAQPage`
  - ROI Call: `BreadcrumbList`
  - For-saas: `FAQPage` + `WebPage` + `BreadcrumbList`
- [x] `sitemap.xml` — indexed URLs incl. `/pricing`, submitted to Google Search Console and Bing
- [x] `robots.txt` — allows all, points to sitemap
- [x] Self-hosted fonts (Inter, DM Mono, DM Sans, Plus Jakarta Sans)

### Navigation & Pages
- [x] Services dropdown (desktop) — hover + keyboard accessible
- [x] Services accordion (mobile)
- [x] Pricing link in main nav, mobile nav, and footer Company column on every page
- [x] Skip-to-content link site-wide (a11y)
- [x] Active nav state highlights current page
- [x] `roi-call.html` — minimal "Back to home" footer link

### Pages
- [x] `index.html` — Homepage
- [x] `services.html` — Services overview with section anchors
- [x] `pricing.html` — Three-tier retainer pricing ($3K/$5.5K/$10K monthly), full breakdown table, FAQ
- [x] `about.html` — Bio with LinkedIn, Salute to Soldiers Foundation Treasurer role, Person schema
- [x] `roi-call.html` — Calendly booking embed
- [x] `case-studies.html` — Placeholder (noindex until content is ready)
- [x] `for-saas.html` — SaaS-specific landing page with FAQ schema
- [x] 6 standalone service pages (each: breadcrumb, intro + bullets + "good fit if" sidebar, FAQ with 4 questions, related services, CTA, full schema)
- [x] `404.html` — branded, GA-tracked

### Search Console & Indexing
- [x] Google Search Console — ownership verified, sitemap submitted
- [x] Bing Webmaster Tools — sitemap submitted

### Retired
- [x] `/resources` page deleted; 301 redirect to `/` in `netlify.toml`

---

## Remaining

### I Can Handle These (no input needed from you)
| # | Task | Notes |
|---|------|-------|
| — | All previous items in this section are now complete. | |

### Needs You — Content
| # | Task | Impact |
|---|------|--------|
| 1 | **Testimonials** — 2–3 client quotes on homepage | **Biggest conversion gap.** Even anonymized quotes ("VP of Sales, Series A SaaS") help. |
| 2 | **Photo on About page** — no headshot currently | Trust signal for solo consultants. |
| 3 | **Case studies** — at least one real story | Pages exist at `/case-studies`; just need the content. Until then, `case-studies` stays in nav as a "coming soon" placeholder, which is honest but creates friction. Consider hiding from nav until first one lands. |
| 4 | **Blog or Resources content** — `/resources` is retired but a future content hub would help long-term SEO. Not urgent. |

### Needs You — Marketing & Distribution
| # | Task | Notes |
|---|------|-------|
| 1 | **Re-submit sitemap to Google Search Console** | New `/pricing` URL added — go to Search Console → Sitemaps → resubmit `https://homegrowngrowth.co/sitemap.xml` |
| 2 | **Google Business Profile** | Free local/map listing; helps with "RevOps consultant Massachusetts/Boston" searches |
| 3 | **Directory listings** | Clutch, G2, HubSpot Solutions Directory — backlinks + referral traffic |
| 4 | **LinkedIn content** | Posting from your personal profile linking to service pages drives both traffic and domain authority |
| 5 | **Tracking pixels — defer until paid-ads timeline is closer** | LinkedIn Insight Tag is the right one for this audience but needs steady traffic + a paid-campaign plan to be useful |

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

**Add a testimonial and a headshot.** Everything technical is in good shape now. The remaining gap is social proof — that's what most directly turns visitors into booked calls.
