# JNCOS TECH Website

GitHub Pages rebuild of **jncostech.com**.

## Current structure

- `/` — Home
- `/About/` — About
- `/OEMODM/` — OEM / ODM
- `/Technology/` — Technology & R&D
- `/Manufacturing/` — Manufacturing
- `/Partnership/` — Partnership
- `/Inquiry/` — Project Inquiry

## Shared assets

- `assets/css/common.css` — global layout, typography, responsive navigation and shared components
- `assets/js/common.js` — responsive navigation and shared utilities

## SEO / deployment

- `robots.txt`
- `sitemap.xml`
- `CNAME` → `jncostech.com`
- `.nojekyll`
- `404.html`

## Migration plan

1. Rebuild Home from the existing Imweb content.
2. Migrate About and company information.
3. Rebuild OEM / ODM content and project process.
4. Rebuild Technology & R&D and Manufacturing.
5. Rebuild Partnership and Inquiry.
6. Connect final inquiry submission flow.
7. Add final images, favicon, Open Graph image, GA4 and Search Console verification.
8. QA desktop/mobile and migrate DNS from Imweb to GitHub Pages.

> DNS should remain on the current Imweb site until the GitHub version is ready for launch.
