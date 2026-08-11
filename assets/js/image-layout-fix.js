(() => {
  'use strict';

  const basePath = window.JNCOS_BASE_PATH || '';
  const normalizePath = (pathname) => {
    let clean = pathname || '/';
    if (basePath && clean.startsWith(basePath)) clean = clean.slice(basePath.length) || '/';
    clean = clean.replace(/index\.html$/i, '');
    if (!clean.startsWith('/')) clean = `/${clean}`;
    return clean === '/' || clean.endsWith('/') ? clean : `${clean}/`;
  };

  const path = normalizePath(window.location.pathname);
  const main = document.querySelector('main');
  if (!main) return;

  const supported = new Set(['/About/', '/Products/', '/Manufacturing/', '/OEMODM/', '/Technology/']);
  if (!supported.has(path)) return;

  const CDN = 'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/';
  const IMG = {
    i01: [`${CDN}99121536287eb.jpg`, 'Cosmetic laboratory formulation detail'],
    i02: [`${CDN}fd30585007c1c.jpg`, 'JN COS TECH raw material and production storage'],
    i03: [`${CDN}653fd120d0915.jpg`, 'Cosmetic vacuum mixing and emulsification equipment'],
    i04: [`${CDN}d5f0dd70fc93b.jpg`, 'Cosmetic production control equipment'],
    i05: [`${CDN}0403b526ac279.jpg`, 'JN COS TECH manufacturing process equipment'],
    i06: [`${CDN}05581142872df.jpg`, 'Cosmetic bottle filling and production line'],
    i07: [`${CDN}61b174e5225d7.jpg`, 'JN COS TECH manufacturing facility interior'],
    i08: [`${CDN}1e46378966de6.jpg`, 'JN COS TECH production team and safety standards'],
    i09: [`${CDN}8fc174e30f58d.jpg`, 'JN COS TECH corporate identity application'],
    i10: [`${CDN}bb85277738e1f.jpg`, 'JN COS TECH brand identity hero image'],
    i11: [`${CDN}cb2416a031930.jpg`, 'JN COS TECH brand material detail'],
    i12: [`${CDN}be2baef009810.jpg`, 'JN COS TECH embossed identity detail'],
    i13: [`${CDN}8e157201c8d2b.jpg`, 'JN COS TECH premium brand application'],
    i14: [`${CDN}1a5b6412d53da.jpg`, 'Cosmetic skincare product still life'],
    i15: [`${CDN}f8a25aa3235e0.jpg`, 'Cosmetic packaging and skincare product range'],
    i16: [`${CDN}aa57a4c9a2de4.jpg`, 'Skincare formulation bottle packaging'],
    i17: [`${CDN}e01aacb1e3873.jpg`, 'Skincare product bottle and label detail'],
    i18: [`${CDN}27881a15784d9.jpg`, 'Cosmetic secondary packaging box'],
    i19: [`${CDN}44ac3075eef4f.jpg`, 'Cosmetic carton and label packaging'],
    i20: [`${CDN}80508253fdc1a.jpg`, 'JN COS TECH hang tag and packaging detail'],
    i21: [`${CDN}c2b119f52bcd7.jpg`, 'JN COS TECH printed packaging card'],
    i22: [`${CDN}9661210ccf9c5.jpg`, 'JN COS TECH pouch and secondary packaging'],
    i23: [`${CDN}4448d729ca352.jpg`, 'Skincare product family and cosmetic packaging'],
    i24: [`${CDN}9837335aec34f.jpg`, 'Cosmetic research laboratory and formulation samples'],
    i25: [`${CDN}67b7b2ed5283b.jpg`, 'Cosmetic laboratory filling and formulation research']
  };

  const STYLE_ID = 'jn-visual-system-style-v3';
  const ensureStyle = () => {
    document.getElementById('jn-editorial-image-style')?.remove();
    document.getElementById('jn-visual-system-style')?.remove();
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      body.public-page main .jn-visual-block{width:100%;max-width:1120px;margin:32px auto 0}
      body.public-page main .jn-visual-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;width:100%;align-items:stretch}
      body.public-page main .jn-visual-grid.has-2{grid-template-columns:repeat(2,minmax(0,1fr));max-width:760px}
      body.public-page main .jn-visual-grid.has-1{grid-template-columns:1fr;max-width:960px}
      body.public-page main .jn-visual-card{position:relative;display:block;width:100%;margin:0!important;padding:0!important;background:#f3f0ec!important;border:0!important;box-shadow:none!important}
      body.public-page main .jn-visual-card img{display:block;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;object-fit:cover!important;object-position:center center!important;transform:none!important}
      body.public-page main .jn-visual-grid.is-single .jn-visual-card{aspect-ratio:16/9!important}
      body.public-page main .jn-visual-grid.is-single img{aspect-ratio:auto!important}
      body.public-page main .jn-visual-block + .jn-visual-block{margin-top:20px}
      .technology-page .tech-philosophy-grid.jn-editorial-text-only{grid-template-columns:minmax(0,760px)!important;justify-content:start!important}
      .technology-page .tech-optimization-inner.jn-editorial-text-only{max-width:820px}
      @media(max-width:1024px){
        body.public-page main .jn-visual-grid,body.public-page main .jn-visual-grid.has-2{grid-template-columns:repeat(2,minmax(0,1fr));max-width:none;gap:16px}
        body.public-page main .jn-visual-grid.has-1{grid-template-columns:1fr}
      }
      @media(max-width:640px){
        body.public-page main .jn-visual-block{margin-top:22px}
        body.public-page main .jn-visual-grid,body.public-page main .jn-visual-grid.has-2,body.public-page main .jn-visual-grid.has-1{grid-template-columns:1fr;gap:12px;max-width:none}
        body.public-page main .jn-visual-grid.is-single .jn-visual-card{aspect-ratio:4/3!important}
      }
    `;
    document.head.appendChild(style);
  };

  const lockCardRatio = (figure, image, single = false) => {
    const ratio = single ? '16 / 9' : '4 / 3';
    figure.style.setProperty('width', '100%', 'important');
    figure.style.setProperty('height', 'auto', 'important');
    figure.style.setProperty('min-height', '0', 'important');
    figure.style.setProperty('max-height', 'none', 'important');
    figure.style.setProperty('aspect-ratio', ratio, 'important');
    figure.style.setProperty('overflow', 'hidden', 'important');

    image.style.setProperty('display', 'block', 'important');
    image.style.setProperty('width', '100%', 'important');
    image.style.setProperty('max-width', 'none', 'important');
    image.style.setProperty('height', '100%', 'important');
    image.style.setProperty('min-height', '0', 'important');
    image.style.setProperty('max-height', 'none', 'important');
    image.style.setProperty('aspect-ratio', 'auto', 'important');
    image.style.setProperty('object-fit', 'cover', 'important');
    image.style.setProperty('object-position', 'center center', 'important');
    image.style.setProperty('margin', '0', 'important');
    image.style.setProperty('transform', 'none', 'important');
  };

  const syncGrid = (grid) => {
    const count = grid.querySelectorAll('.jn-visual-card').length;
    grid.classList.toggle('has-1', count <= 1);
    grid.classList.toggle('has-2', count === 2);
    if (!count) grid.closest('.jn-visual-block')?.remove();
  };

  const createGrid = (keys, { single = false } = {}) => {
    const validKeys = keys.filter((key) => IMG[key]);
    if (!validKeys.length) return null;

    const block = document.createElement('div');
    block.className = 'jn-visual-block';
    block.dataset.jnVisualSystem = 'v3';

    const grid = document.createElement('div');
    grid.className = `jn-visual-grid${single ? ' is-single' : ''}`;
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'JN COS TECH visual gallery');

    validKeys.forEach((key) => {
      const [src, alt] = IMG[key];
      const figure = document.createElement('figure');
      figure.className = 'jn-visual-card';

      const image = document.createElement('img');
      image.src = src;
      image.alt = alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      lockCardRatio(figure, image, single);

      image.addEventListener('error', () => {
        figure.remove();
        syncGrid(grid);
      }, { once:true });

      figure.appendChild(image);
      grid.appendChild(figure);
    });

    block.appendChild(grid);
    syncGrid(grid);
    return block;
  };

  const insertAfter = (selector, keys, options = {}) => {
    const target = document.querySelector(selector);
    if (!target) return null;
    const block = createGrid(keys, options);
    if (!block) return null;
    target.insertAdjacentElement('afterend', block);
    return block;
  };

  const cleanupLegacy = () => {
    document.querySelectorAll('.jn-editorial-grid, .jn-visual-block').forEach((el) => el.remove());
    document.querySelectorAll('.mfg-wide-image, .mfg-collage, .product-wide-visual, .product-visual-strip, .oem-wide-image, .oem-pack-image, .about-story-visual').forEach((el) => el.remove());
    if (path === '/Technology/') document.querySelectorAll('.tech-philosophy figure, .tech-optimization figure').forEach((el) => el.remove());
  };

  const apply = () => {
    if (main.dataset.jnVisualFixed === 'v3') return;
    ensureStyle();
    cleanupLegacy();

    if (path === '/About/') {
      // Keep one restrained brand/logo image only; no repeated logo gallery.
      insertAfter('.about-narrow > p:last-of-type', ['i10'], { single:true });
    }

    if (path === '/Manufacturing/') {
      // Two clean three-up rows. No forced third row, no repeated imagery.
      insertAfter('.mfg-two', ['i01','i02','i03']);
      insertAfter('.mfg-equipment-grid', ['i04','i05','i06']);
    }

    if (path === '/Products/') {
      insertAfter('.product-capability-grid', ['i14','i15','i23']);
      // Avoid the weak/near-empty packaging frame that previously created a grey-looking card.
      insertAfter('.product-section.alt .product-grid', ['i16','i17','i24']);
    }

    if (path === '/OEMODM/') {
      insertAfter('.oem-process-grid', ['i18','i19','i20']);
      insertAfter('.oem-pack-grid', ['i21','i22','i09']);
    }

    if (path === '/Technology/') {
      document.querySelector('.tech-philosophy-grid')?.classList.add('jn-editorial-text-only');
      document.querySelector('.tech-optimization-inner')?.classList.add('jn-editorial-text-only');
      insertAfter('.tech-optimization-inner', ['i24','i25','i01']);
    }

    main.dataset.jnVisualFixed = 'v3';
  };

  let attempts = 0;
  const waitForLegacyLayout = () => {
    attempts += 1;
    const legacyReady = main.dataset.editorialImagesReady === 'true' || document.querySelector('.jn-editorial-grid');
    if (legacyReady || attempts >= 50) {
      apply();
      return;
    }
    window.setTimeout(waitForLegacyLayout, 40);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForLegacyLayout, { once:true });
  } else {
    waitForLegacyLayout();
  }
})();
