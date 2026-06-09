# scripts/

## gsc-index-status.py

Pulls the live Google index status for every sitemap URL via the Search Console
URL Inspection API and prints a table (verdict + coverage state + last crawl).
Solves "I can't see all my URLs/statuses at once" in the GSC UI.

### Why OAuth, not a service-account key
The Google Cloud org enforces `iam.disableServiceAccountKeyCreation`, so SA keys
can't be downloaded. OAuth *user* credentials are Google's recommended, more
secure alternative: you authenticate as yourself (the GSC property owner) and no
long-lived key file exists. The only downloaded file is an OAuth **client**
config (a "Desktop app" client), which the policy permits.

### One-time setup
1. **Google Cloud Console** -> reuse the project where you enabled the
   **Google Search Console API**.
2. **APIs & Services -> OAuth consent screen**: if not configured, set it up
   (User type: Internal if you have Google Workspace for homegrowngrowth.co,
   otherwise External + add your own Google account as a Test user). Scope:
   `.../auth/webmasters.readonly`.
3. **APIs & Services -> Credentials -> Create Credentials -> OAuth client ID**
   -> Application type: **Desktop app** -> Create -> **Download JSON**.
4. Save that file as `~/.gsc/client_secret.json`  (Windows: `C:\Users\Ian\.gsc\client_secret.json`).
   This folder is OUTSIDE the repo and OneDrive on purpose; never commit it.
5. Make sure your GSC property lists your Google account as a user
   (Search Console -> Settings -> Users and permissions).

### Run
```
# venv lives outside OneDrive per project convention
py -m venv C:\Users\Ian\.venvs\gsc
C:\Users\Ian\.venvs\gsc\Scripts\python -m pip install ^
  google-api-python-client google-auth-httplib2 google-auth-oauthlib
C:\Users\Ian\.venvs\gsc\Scripts\python scripts\gsc-index-status.py
```
First run opens a browser for consent and caches `~/.gsc/token.json`.
Re-run any time to refresh the table.

### Notes
- If the OAuth consent screen is in **Testing** status (External), the cached
  refresh token expires after ~7 days; the script just re-prompts the browser
  next run. Fine for ad-hoc checks. To avoid it: set the app to **Internal**
  (Workspace) or **Publish** the app.
- The script auto-detects whether the property is a Domain
  (`sc-domain:homegrowngrowth.co`) or URL-prefix (`https://homegrowngrowth.co/`)
  property.
- URL Inspection API quota: 2,000 inspections/day, 600/min. 22 URLs is trivial.
