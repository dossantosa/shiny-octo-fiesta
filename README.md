# Trail Strong v1.2 — PWA Diagnostics

This build is configured for:

https://dossantosa.github.io/shiny-octo-fiesta/

## What changed
- Simplified the web manifest to Chrome's core installability fields.
- Added an on-device **PWA Diagnostics** panel under **More**.
- The panel checks:
  - HTTPS / secure context
  - Manifest loading and parsing
  - start URL and scope
  - 192×192 and 512×512 icon declarations
  - actual icon dimensions
  - service-worker registration, scope, activation and page control
  - whether Chrome fired `beforeinstallprompt`
  - current display mode
- Added **Copy diagnostics**.
- Added **Reset PWA cache & service worker** without deleting workout localStorage.
- Bumped the service-worker cache to v1.2.

## Deploy
Replace the repository-root files with the contents of this package, commit, and wait for GitHub Pages to finish deploying.

Then on Android:
1. Open Trail Strong in Chrome.
2. Go to **More → PWA Diagnostics**.
3. Tap **Run diagnostics**.
4. Tap **Copy diagnostics**.
5. Paste the output into ChatGPT.

Do not clear your browser storage unless specifically needed. The in-app reset button preserves workout logs.
