# Trail Strong

A lightweight mobile-first Progressive Web App for a strength, mobility, and trail-rebuild program.

## Included
- Today screen based on the phone's day of week
- Gym, Home, and Walk/Trail views
- Exercise checkboxes
- Weight, actual reps/time, and notes logging
- Current-week progress meter
- Reset-week control that keeps weights and notes
- Coaching cues
- Offline caching after first successful load
- Installable PWA configuration

## Install on Android
A PWA needs to be served from a secure web origin (HTTPS) for the full install/offline experience.

### Easiest option: GitHub Pages
1. Create a new GitHub repository.
2. Upload everything inside this folder to the repository root.
3. In GitHub: Settings > Pages.
4. Choose "Deploy from a branch", then select `main` and `/root`.
5. Open the resulting HTTPS site in Chrome on your Android phone.
6. Use the app's **Install** button if shown, or Chrome menu > **Add to Home screen / Install app**.

### Other static hosts
Netlify, Cloudflare Pages, or any HTTPS static web host will also work.

## Data & privacy
Workout data is stored locally in your browser using localStorage. It is not uploaded to GitHub or to any external service by this app.
Clearing browser/site data will clear workout history, so treat this Version 1 as a local tracker rather than a cloud-backed training log.

## Public repository safety
This project is intended to be safe to publish in a public GitHub repository. Do not add passwords, API keys, access tokens, personal contact information, medical documents, or other sensitive data to the code or repository history. If cloud sync or third-party APIs are added later, use proper secret storage and a backend rather than embedding credentials in client-side JavaScript.

## Editing the plan
The schedule is stored near the top of `app.js` as the `PLAN` object. The rest of the app renders automatically from it.
