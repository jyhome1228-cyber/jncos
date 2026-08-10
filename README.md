# JNCOS TECH Website

GitHub Pages rebuild of **jncostech.com**.

## Current structure

- `/` — Home
- `/About/` — About
- `/Products/` — Products & Services
- `/OEMODM/` — OEM / ODM
- `/Technology/` — Technology & R&D
- `/Manufacturing/` — Manufacturing
- `/Partnership/` — Partnership
- `/Contact/` — Contact
- `/Inquiry/` — Detailed Project Inquiry
- `/admin/` — Inquiry Admin

## Shared assets

- `assets/css/common.css` — global layout, typography, responsive navigation and shared components
- `assets/css/content.css` — shared page visual/image layout
- `assets/css/inquiry.css` — inquiry form UI
- `assets/css/admin.css` — admin UI
- `assets/js/common.js` — responsive navigation, Products/Contact navigation injection and shared utilities
- `assets/js/page-images.js` — page-specific Imweb CDN image mapping
- `assets/js/inquiry-store.js` — development inquiry storage layer
- `assets/js/inquiry.js` — inquiry builder behavior
- `assets/js/admin.js` — admin dashboard behavior and export controls

## Image source map

Current Imweb CDN assets are registered in `assets/js/page-images.js`.

- Home: 1 image
- About: 2 images
- Products & Services: 3 images
- OEM / ODM: 2 images
- Technology & R&D: 2 images
- Manufacturing: 7 images
- Contact: 3 images

Images are currently displayed without destructive cropping so the source content can be reviewed safely during migration. Hero crops and editorial layouts can be refined after GitHub Pages visual QA.

## SEO / deployment

- `robots.txt`
- `sitemap.xml`
- `.nojekyll`
- `404.html`

The production `CNAME` should only be added when the GitHub version is ready to replace the live Imweb site.

## Remaining launch work

1. Rebuild full Home content and visual hierarchy.
2. Complete About, Products & Services, OEM / ODM, Technology & R&D and Manufacturing copy/layout.
3. Complete Partnership and Contact details/layout.
4. Connect Inquiry to Firebase/Firestore for shared production storage.
5. Protect production Admin data with administrator authentication.
6. Add final favicon, Open Graph image, GA4 and Search Console verification.
7. QA desktop/mobile and migrate DNS from Imweb to GitHub Pages.
