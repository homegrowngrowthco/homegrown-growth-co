---
description: Re-run Lighthouse against a given URL (desktop + mobile) and diff against the current baseline
argument-hint: <url> (full URL, e.g. https://homegrowngrowth.co/pricing)
---

Re-run Lighthouse on `$ARGUMENTS` and compare against the current baseline at `_baseline/lighthouse-2026-06-14/` (the post-rebrand, analytics-deferred snapshot). This is the only baseline in the repo (the obsolete pre-Astro 2026-05-14 set was deleted 2026-07-18; it survives in git history if ever needed).

## Steps

1. **Parse the URL** to get a filename-safe slug (e.g., `https://homegrowngrowth.co/pricing` → `pricing`).
2. **Verify** the matching baseline pair exists at `_baseline/lighthouse-2026-06-14/{slug}-desktop.json` and `{slug}-mobile.json`. If not, tell me which baselines DO exist and stop — we don't want to compare a fresh page against a missing baseline.
3. **Run Lighthouse fresh** (use the same CLI invocation as the pre-flight, for apples-to-apples):
   ```
   npx lighthouse {URL} --preset=desktop --output=json --output-path=/tmp/lh-{slug}-desktop.json --quiet --chrome-flags="--headless --no-sandbox"
   npx lighthouse {URL} --output=json --output-path=/tmp/lh-{slug}-mobile.json --quiet --chrome-flags="--headless --no-sandbox"
   ```
4. **Compute deltas** for each report (use `node -pe` or a small JS one-liner):
   - Performance score (was vs now)
   - Accessibility score
   - Best Practices score
   - SEO score
   - First Contentful Paint (mobile)
   - Total Blocking Time (mobile)
5. **Present as a 2-column table**: Metric | Baseline | Now | Delta.
6. **Flag regressions** (any score that dropped, especially mobile Performance < 0.79 which was the home baseline floor).
7. **Also run Google's Rich Results test pointer** — print the URL `https://search.google.com/test/rich-results?url={URL}` so I can open it manually. JSON-LD validation is not scriptable without auth.

## Performance budget reminder

Thresholds reflect the 2026-06-14 baseline (post-rebrand, after deferring gtag + Clarity off the critical path). Mobile perf used to floor at 0.79 against the pre-rebrand site; it now sits at 0.83–0.97.

| Metric | Threshold |
|---|---|
| Performance (desktop) | ≥ baseline JSON value (1.00 on every page today) |
| Performance (mobile) | ≥ baseline JSON value minus ~0.03 noise; hard floor 0.80. Per-page baselines: home 0.94, pricing 0.92, services 0.92, sms-opt-in 0.97, fractional-revops 0.83 (heaviest hero) |
| Accessibility | ≥ 0.99 (1.00 today, after the teal-contrast fix) |
| Best Practices | 0.77 (capped by Clarity third-party cookies + CSP `unsafe-inline`; tracked, not blocking) |
| SEO | 1.00 |

Anything below threshold gets called out explicitly. Don't bury regressions in prose. Note: Netlify deploy-preview URLs return `X-Robots-Tag: noindex`, which tanks the Lighthouse SEO audit (~0.66–0.69) — that's a preview artifact, not a regression. Audit production for a true SEO score.
