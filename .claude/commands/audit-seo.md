---
description: Re-run Lighthouse against a given URL (desktop + mobile) and diff against the pre-migration baseline
argument-hint: <url> (full URL, e.g. https://homegrowngrowth.co/pricing)
---

Re-run Lighthouse on `$ARGUMENTS` and compare against the pre-migration baseline at `_baseline/lighthouse-2026-05-14/`.

## Steps

1. **Parse the URL** to get a filename-safe slug (e.g., `https://homegrowngrowth.co/pricing` → `pricing`).
2. **Verify** the matching baseline pair exists at `_baseline/lighthouse-2026-05-14/{slug}-desktop.json` and `{slug}-mobile.json`. If not, tell me which baselines DO exist and stop — we don't want to compare a fresh page against a missing baseline.
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

| Metric | Threshold |
|---|---|
| Performance (desktop) | ≥ baseline JSON value |
| Performance (mobile) | ≥ 0.79 |
| Accessibility | ≥ 0.96 |
| Best Practices | ≥ 0.73 (pre-existing finding — CSP unsafe-inline; tracked but not blocking) |
| SEO | 1.00 |

Anything below threshold gets called out explicitly. Don't bury regressions in prose.
