# Security Policy

## Reporting a vulnerability

If you discover a security issue in this site or repository, please report it privately by emailing **ian@homegrowngrowth.co**. Do not open a public GitHub issue, file a public PR, or post details on social media — those channels expose users in the window before a fix ships.

A confirmation reply usually comes within a few business days. Updates and an estimated fix timeline follow once the report is triaged.

## Scope

This policy covers:

- The `homegrowngrowth.co` static marketing site (this repository)
- The GitHub Actions workflows in `.github/workflows/`
- The Netlify deploy pipeline configured by `netlify.toml`

Out of scope (please report directly to the relevant vendor):

- Calendly, Google (GA4), Microsoft (Clarity), Twilio, Netlify platform issues — these are upstream services we use, not code we control.

## What counts

Reports we want to hear about: anything that could be used to phish visitors, exfiltrate user-submitted data (the SMS opt-in form on `/sms-opt-in`), tamper with the deploy pipeline, or impersonate the brand. Misconfigurations in security headers (CSP, HSTS, etc.) are in scope; please include the specific header and the recommended change.

Reports we generally do not act on: missing rate limits on a static site with no auth, social-engineering scenarios that require physical access to the maintainer's machine, and findings whose only "fix" is replacing a third-party dependency we don't control.

## Thanks

Responsible disclosure is appreciated and will be credited (with permission) in commit messages or release notes when a fix lands.
