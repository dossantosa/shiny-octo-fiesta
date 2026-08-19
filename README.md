# Trail Strong v1.1

GitHub Pages build configured specifically for:

https://dossantosa.github.io/shiny-octo-fiesta/

## Deploy

Upload the **contents of this folder to the repository root**, replacing the existing files.

Expected repository root:
- `index.html`
- `app.js`
- `styles.css`
- `manifest.webmanifest`
- `sw.js`
- `.nojekyll`
- `icons/`

GitHub Pages should deploy from:
- Branch: `main`
- Folder: `/ (root)`

## Important after updating

Because the old version registered a service worker, Chrome may temporarily retain cached v1 files.

After GitHub Pages finishes deploying:
1. Remove the old Trail Strong home-screen shortcut.
2. In Chrome on Android, open `https://dossantosa.github.io/shiny-octo-fiesta/`.
3. Reload the page.
4. If Chrome still only offers **Create shortcut**, clear site data for `dossantosa.github.io`, then reopen the site.
5. Use Chrome's **Install and create shortcut** menu again.

## Privacy

Workout entries are stored in browser `localStorage`. They are not written back to GitHub.
Do not add credentials, tokens, health records, addresses, or other sensitive data to this public repository.
