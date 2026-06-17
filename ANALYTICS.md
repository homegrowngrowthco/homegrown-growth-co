# Analytics — Homegrown Growth Co.

How GA4 + Microsoft Clarity are wired, and how to build the dashboards.

## Stack
- **GA4** property `G-4QR1JQK9QL` (public id).
- **Microsoft Clarity** project `wgqsqcvysb`.
- Both load lazily via [`public/analytics.js`](public/analytics.js) — on first interaction OR after idle (3s fallback), to protect mobile LCP. **Tradeoff:** a visitor who bounces in <~3s without interacting is not counted.
- Hosts allowlisted in the `netlify.toml` CSP.

## Tracked conversion events (added Session 26, 2026-06-17)
Before this, only the automatic `page_view` fired. Each conversion now sends a **GA4 event** and a **Clarity custom event** (best-effort, guarded — no error if the lib hasn't loaded).

| Conversion | GA4 event | GA4 params | Clarity event | Fires from |
|---|---|---|---|---|
| Free-audit form submit (homepage) | `generate_lead` | `form_name: 'free-audit'` | `free_audit_submit` | [src/pages/index.astro](src/pages/index.astro) submit success |
| SMS opt-in form submit | `sms_opt_in` | `method: 'web_form'` | `sms_opt_in` | [src/components/SmsOptInForm.astro](src/components/SmsOptInForm.astro) submit success |
| ROI-call booking (Calendly) | `book_roi_call` | `method: 'calendly'` | `book_roi_call` | [src/scripts/nav.ts](src/scripts/nav.ts) — `message` listener for `calendly.event_scheduled` on /roi-call |

`book_roi_call` is the highest-value conversion (an actual booked call). Events appear in GA4 Realtime within seconds of a real submit/booking; in the standard reports within ~24h.

## GA4 dashboard setup (console — ~10 min, one-time)
1. **Mark the events as Key Events.** Admin → Data display → **Events**. After each event has fired at least once it shows here — toggle **Mark as key event** for `generate_lead`, `sms_opt_in`, `book_roi_call`. (To pre-create before first fire: Admin → **Key events** → *New key event* → type the exact event name.)
2. **See conversions over time.** Reports → **Engagement → Conversions** (lists key events with counts + trend). Or **Reports → Library → Create report → Detail report**, dimension = *Event name*, metric = *Key events* / *Event count*.
3. **Custom Exploration (best for a focused view).** Explore → **Free form**. Rows = *Event name*; Values = *Event count*; add a filter `Event name` *exactly matches* one of the three. Add *Landing page* as a secondary dimension to see which pages convert.
4. **(Optional) Looker Studio dashboard.** lookerstudio.google.com → Create → Data source → **Google Analytics** → this property. Add scorecards for each key event + a time series of key events. Share to stakeholders read-only.

## Clarity dashboard setup (console — ~5 min)
- The main **Dashboard** (sessions, scroll depth, rage/dead clicks, heatmaps, recordings) is automatic — nothing to configure.
- **Filter recordings to converters.** Recordings → Filters → **Custom events** → pick `book_roi_call` / `sms_opt_in` / `free_audit_submit` to watch only sessions that converted (and the ones just before, to see what worked).
- **Funnel.** Use the **Funnels** feature: step 1 = page `/roi-call`, step 2 = custom event `book_roi_call`, to see drop-off into the booking.
- **Segments.** Save a custom-event filter as a segment for repeat use.

## Verify it's working
- GA4: Admin → **DebugView** (or Reports → Realtime) while submitting a test form / booking on the live site.
- Clarity: Custom events show under the event filters within a few minutes of firing.
- Code presence (no console access needed): `curl -s https://homegrowngrowth.co/ | grep generate_lead`, `.../sms-opt-in | grep sms_opt_in`, `.../roi-call | grep book_roi_call`.
