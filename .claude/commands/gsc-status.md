---
description: Pull live Google index status for every homegrowngrowth.co URL via the Search Console URL Inspection API
---

Run the GSC index-status checker and report the results to the user.

1. Run via the Bash tool:
   `C:\Users\Ian\.venvs\gsc\Scripts\python.exe scripts/gsc-index-status.py`
   (The venv and OAuth credentials live OUTSIDE the repo — see [scripts/README.md](../../scripts/README.md). Auth is OAuth user creds, not a service-account key, because the GCP org blocks `iam.disableServiceAccountKeyCreation`.)

2. If it fails because the venv or deps are missing, recreate them per scripts/README.md:
   `py -m venv C:\Users\Ian\.venvs\gsc` then
   `C:\Users\Ian\.venvs\gsc\Scripts\python.exe -m pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib`

3. If auth fails or the cached token expired, the script reopens a browser for consent — tell the user to complete it, then it caches a fresh `~/.gsc/token.json`.

4. Present the table grouped by coverage state. Explicitly call out anything NOT "Submitted and indexed":
   - **"URL is unknown to Google"** = never crawled (normal for brand-new pages; offer Request Indexing in GSC URL Inspection to speed it up).
   - **"Crawled - currently not indexed"** = crawled but not yet chosen; usually a crawl-budget/authority wait, not a defect — verify the page is 200 / self-canonical / no-noindex before worrying.

5. Remind the user that GSC's **Pages report lags the live index by days** — this API call is the source of truth, so trust it over the report.
