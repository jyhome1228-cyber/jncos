(() => {
  const IMAGE_MAP = {
    '/': [['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/9c00c42704695.jpg','JNCOS TECH home visual']],
    '/About/': [['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/4ec6a98aa3f21.jpg','JNCOS TECH about visual 01'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/8b03d791bd6d8.jpg','JNCOS TECH about visual 02']],
    '/Products/': [['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/8df4c931a8b92.jpg','JNCOS TECH products and services visual 01'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/6080c78501663.jpg','JNCOS TECH products and services visual 02'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/a3cce7bdc446a.jpg','JNCOS TECH products and services visual 03']],
    '/Manufacturing/': [['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/b3f84f24cd6cc.jpg','JNCOS TECH manufacturing visual 01'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/93aa69a27d052.jpg','JNCOS TECH manufacturing visual 02'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/4601859efd746.jpg','JNCOS TECH manufacturing visual 03'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/271ff2c6e399e.jpg','JNCOS TECH manufacturing visual 04'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/9f66cd28df907.jpg','JNCOS TECH manufacturing visual 05'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/6bd2f78858152.jpg','JNCOS TECH manufacturing visual 06'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/8987f5909172f.jpg','JNCOS TECH manufacturing visual 07']],
    '/OEMODM/': [['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/c772a2c8c81d0.jpg','JNCOS TECH OEM ODM visual 01'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/595c3d044bba9.jpg','JNCOS TECH OEM ODM visual 02']],
    '/Technology/': [['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/645ad0367d91e.jpg','JNCOS TECH technology and R&D visual 01'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/33f5d0e3fb168.jpg','JNCOS TECH technology and R&D visual 02']],
    '/Contact/': [['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/0867ff1868205.jpg','JNCOS TECH contact visual 01'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/1ecde89c324d3.jpg','JNCOS TECH contact visual 02'],['https://cdn.imweb.me/upload/S2023030963558ef55ba8e/a6c9d4959838e.jpg','JNCOS TECH contact visual 03']]
  };

  const basePath = window.JNCOS_BASE_PATH || '';
  const normalizePath = (pathname) => {
    let clean = pathname || '/';
    if (basePath && clean.startsWith(basePath)) clean = clean.slice(basePath.length) || '/';
    if (clean === '/index.html') return '/';
    clean = clean.replace(/index\.html$/i, '');
    if (!clean.startsWith('/')) clean = `/${clean}`;
    return clean === '/' || clean.endsWith('/') ? clean : `${clean}/`;
  };
  const path = normalizePath(window.location.pathname);

  const loadScript = (src, key) => new Promise((resolve) => {
    if (key && window[key]) return resolve();
    const marker = key || src;
    const existing = document.querySelector(`script[data-runtime="${marker}"]`);
    if (existing) { existing.addEventListener('load', resolve, { once:true }); return; }
    const script = document.createElement('script'); script.src = src.startsWith('http') ? src : `${basePath}${src}`; script.async = true; script.setAttribute('data-runtime', marker); script.onload = resolve; script.onerror = resolve; document.head.appendChild(script);
  });

  const setupMeasurement = async () => {
    await loadScript('/assets/js/firebase-config.js', 'JNCOS_FIREBASE_CONFIG');
    const measurementId = window.JNCOS_GA4_MEASUREMENT_ID || 'G-9JRLB4KEVK';
    if (!window.dataLayer) window.dataLayer = [];
    if (!window.gtag) window.gtag = function(){ window.dataLayer.push(arguments); };
    if (!document.querySelector('script[data-jncos-ga4]')) {
      const ga = document.createElement('script'); ga.async = true; ga.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`; ga.setAttribute('data-jncos-ga4',''); document.head.appendChild(ga);
      window.gtag('js', new Date()); window.gtag('config', measurementId, { page_path: location.pathname + location.search });
    }
    await loadScript('/assets/js/visitor-store.js', 'JNCOSVisitorStore');
    window.JNCOSVisitorStore?.trackPageView?.();
  };
  setupMeasurement();

  if (!document.querySelector('link[data-image-preserve-css]')) {
    const imageCss = document.createElement('link'); imageCss.rel = 'stylesheet'; imageCss.href = `${basePath}/assets/css/image-preserve.css`; imageCss.setAttribute('data-image-preserve-css', ''); document.head.appendChild(imageCss);
  }

  const fixInternalLinks = (root = document) => {
    if (!basePath) return;
    root.querySelectorAll?.('a[href^="/"]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('//') || href === basePath || href.startsWith(`${basePath}/`)) return;
      link.setAttribute('href', `${basePath}${href}`);
    });
  };

  const setupCapabilitiesNav = () => {
    const nav = document.querySelector('[data-nav]');
    if (!nav || nav.querySelector('[data-capabilities]')) return;
    const links = [...nav.querySelectorAll(':scope > a')];
    const products = links.find((a) => a.textContent.trim() === 'Products & Services');
    const oem = links.find((a) => a.textContent.trim() === 'OEM / ODM');
    const technology = links.find((a) => a.textContent.trim() === 'Technology & R&D');
    if (!products || !oem || !technology) return;
    const root = document.createElement('div'); root.className = 'nav-capabilities'; root.setAttribute('data-capabilities', '');
    root.innerHTML = `<button class="nav-capabilities-trigger" type="button" aria-expanded="false" data-capabilities-trigger><span>Capabilities</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button><div class="nav-capabilities-menu" data-capabilities-menu><div class="nav-capabilities-eyebrow">WHAT WE DO</div></div>`;
    nav.insertBefore(root, products);
    const menu = root.querySelector('[data-capabilities-menu]');
    const descriptions = new Map([[products,'Explore skincare, sun care, hair, body and treatment categories.'],[oem,'From project brief and formulation to packaging and scalable manufacturing.'],[technology,'Research platforms, functional ingredients and formulation technologies.']]);
    [products,oem,technology].forEach((link) => { link.classList.add('nav-capability-link'); const label = link.textContent.trim(); link.innerHTML = `<span>${label}</span><small>${descriptions.get(link)}</small><b aria-hidden="true">↗</b>`; menu.appendChild(link); });
    const trigger = root.querySelector('[data-capabilities-trigger]');
    let closeTimer = null;
    const cancelClose = () => { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } };
    const setOpen = (open) => { cancelClose(); root.classList.toggle('is-open',open); trigger.setAttribute('aria-expanded',String(open)); };
    const scheduleClose = () => { cancelClose(); closeTimer = setTimeout(() => setOpen(false), 520); };
    trigger.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); setOpen(!root.classList.contains('is-open')); });
    root.addEventListener('mouseenter', () => { if (innerWidth > 1024) setOpen(true); });
    root.addEventListener('mouseleave', () => { if (innerWidth > 1024) scheduleClose(); });
    menu.addEventListener('mouseenter', cancelClose); menu.addEventListener('mouseleave', () => { if (innerWidth > 1024) scheduleClose(); });
    root.addEventListener('focusin', () => { if (innerWidth > 1024) setOpen(true); });
    root.addEventListener('focusout', (e) => { if (innerWidth > 1024 && !root.contains(e.relatedTarget)) scheduleClose(); });
    menu.addEventListener('click', () => setOpen(false)); document.addEventListener('click', (e) => { if (!root.contains(e.target)) setOpen(false); }); document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); }); window.addEventListener('resize', () => setOpen(false));
  };

  const setupHomeTechTriggers = () => {
    const grid = document.querySelector('.home-technology .tech-grid'); if (!grid) return;
    grid.querySelectorAll('.tech-trigger, a').forEach((el) => { if (el.tagName === 'A') el.removeAttribute('href'); el.classList.add('tech-trigger'); el.setAttribute('type','button'); el.setAttribute('aria-label',`Show details for ${el.textContent.replace(/\s+/g,' ').trim()}`); });
  };

  const setupLanguageSwitcher = () => {
    const nav = document.querySelector('[data-nav]');
    const languageRoot = document.querySelector('[data-language-switcher]');
    const languageMenu = document.querySelector('[data-language-menu]');
    const inquiry = nav?.querySelector('.nav-cta');
    if (!nav || !languageRoot || !languageMenu || !inquiry) return;

    if (inquiry.nextElementSibling !== languageRoot) inquiry.insertAdjacentElement('afterend', languageRoot);

    const triggerText = languageRoot.querySelector('[data-language-trigger] span');
    if (triggerText) triggerText.textContent = 'EN';

    languageMenu.innerHTML = `
      <button type="button" data-language="en"><strong>English</strong><span>Original</span></button>
      <button type="button" data-language="ko"><strong>한국어</strong><span>Google Translate</span></button>`;

    let engine = document.getElementById('google_translate_element');
    if (!engine) {
      engine = document.createElement('div');
      engine.id = 'google_translate_element';
      engine.className = 'google-translate-engine';
      engine.setAttribute('aria-hidden','true');
      document.body.appendChild(engine);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement || engine.dataset.ready === 'true') return;
      new window.google.translate.TranslateElement({ pageLanguage:'en', includedLanguages:'ko', autoDisplay:false }, 'google_translate_element');
      engine.dataset.ready = 'true';
    };

    if (!document.querySelector('script[data-google-translate]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.setAttribute('data-google-translate','');
      document.body.appendChild(script);
    }

    const setCookie = (value) => {
      const expires = value ? '' : ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = `googtrans=${value}${expires};path=/;SameSite=Lax`;
    };

    const translateToKorean = (attempt = 0) => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = 'ko';
        combo.dispatchEvent(new Event('change', { bubbles:true }));
        return;
      }
      if (attempt < 24) return setTimeout(() => translateToKorean(attempt + 1), 180);
      location.href = `https://translate.google.com/translate?sl=en&tl=ko&u=${encodeURIComponent(location.href)}`;
    };

    languageMenu.addEventListener('click', (e) => {
      const button = e.target.closest('[data-language]');
      if (!button) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (button.dataset.language === 'ko') {
        setCookie('/en/ko');
        translateToKorean();
      } else {
        setCookie('');
        location.reload();
      }
      languageMenu.hidden = true;
    }, true);
  };

  const cleanupInquiryForms = () => {
    if (path !== '/Inquiry/') return; const main=document.querySelector('main.inquiry-page'); if(!main)return;
    const removeLegacy=(root=main)=>root.querySelectorAll?.('form').forEach((form)=>{if(!form.matches('[data-inquiry-form]'))form.remove();}); removeLegacy();
    const observer=new MutationObserver((mutations)=>mutations.forEach((mutation)=>mutation.addedNodes.forEach((node)=>{if(node instanceof Element)removeLegacy(node);}))); observer.observe(main,{childList:true,subtree:true});
  };

  setupCapabilitiesNav(); setupHomeTechTriggers(); setupLanguageSwitcher(); cleanupInquiryForms(); fixInternalLinks();
  const linkObserver=new MutationObserver((mutations)=>mutations.forEach((mutation)=>mutation.addedNodes.forEach((node)=>{if(node instanceof Element)fixInternalLinks(node);}))); if(basePath)linkObserver.observe(document.body,{childList:true,subtree:true});

  const images=IMAGE_MAP[path]; const main=document.querySelector('main');
  if (!main || !images || main.matches('[data-page-visuals]') || main.querySelector('[data-page-visuals]')) return;
  const section=document.createElement('section'); section.className='visual-stack'; section.setAttribute('data-page-visuals',''); section.setAttribute('aria-label','Page visuals');
  const inner=document.createElement('div'); inner.className='visual-stack-inner'; const list=document.createElement('div'); list.className='visual-stack-list';
  images.forEach(([src,alt],index)=>{ const figure=document.createElement('figure'); const img=document.createElement('img'); img.src=src; img.alt=alt; img.decoding='async'; img.loading=path==='/'&&index===0?'eager':'lazy'; figure.appendChild(img); list.appendChild(figure); });
  inner.appendChild(list); section.appendChild(inner); main.appendChild(section);
})();

(() => {
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
  if (!main || main.dataset.editorialImagesReady === 'true') return;

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
    i10: [`${CDN}bb85277738e1f.jpg`, 'JN COS TECH brand identity detail'],
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

  const styleId = 'jn-editorial-image-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .public-page main .jn-editorial-grid{display:grid;gap:18px;width:100%;max-width:1040px;margin:34px auto 0;align-items:stretch}
      .public-page main .jn-editorial-grid[data-cols="2"]{grid-template-columns:repeat(2,minmax(0,1fr))}
      .public-page main .jn-editorial-grid[data-cols="3"]{grid-template-columns:repeat(3,minmax(0,1fr));max-width:1120px}
      .public-page main .jn-editorial-grid figure{margin:0!important;padding:0!important;width:100%;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:1/1!important;overflow:hidden!important;background:#f4f2ef!important}
      .public-page main .jn-editorial-grid img{display:block!important;width:100%!important;max-width:none!important;height:100%!important;min-height:0!important;max-height:none!important;aspect-ratio:1/1!important;object-fit:cover!important;object-position:center!important;margin:0!important;transform:none!important}
      .public-page main .jn-editorial-grid + .jn-editorial-grid{margin-top:18px}
      .technology-page .tech-philosophy-grid.jn-editorial-text-only{grid-template-columns:minmax(0,760px)!important;justify-content:start!important}
      .technology-page .tech-optimization-inner.jn-editorial-text-only{max-width:820px}
      @media(max-width:760px){
        .public-page main .jn-editorial-grid,.public-page main .jn-editorial-grid[data-cols="2"],.public-page main .jn-editorial-grid[data-cols="3"]{grid-template-columns:1fr;gap:12px;max-width:none;margin-top:24px}
        .public-page main .jn-editorial-grid figure,.public-page main .jn-editorial-grid img{aspect-ratio:4/3!important}
      }
    `;
    document.head.appendChild(style);
  }

  const makeGrid = (keys, cols = 2) => {
    const grid = document.createElement('div');
    grid.className = 'jn-editorial-grid';
    grid.dataset.cols = String(cols);
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'JN COS TECH visual gallery');
    keys.forEach((key) => {
      const [src, alt] = IMG[key];
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = src;
      image.alt = alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      figure.appendChild(image);
      grid.appendChild(figure);
    });
    return grid;
  };

  const insertAfter = (selector, keys, cols = 2) => {
    const target = document.querySelector(selector);
    if (!target || !keys.every((key) => IMG[key])) return;
    target.insertAdjacentElement('afterend', makeGrid(keys, cols));
  };

  const removeAll = (selector) => document.querySelectorAll(selector).forEach((el) => el.remove());

  if (path === '/Manufacturing/') {
    removeAll('.mfg-wide-image, .mfg-collage');
    insertAfter('.mfg-two', ['i01','i02'], 2);
    insertAfter('.mfg-equipment-grid', ['i03','i04'], 2);
    insertAfter('.mfg-support-grid', ['i05','i06'], 2);
    insertAfter('.mfg-qc-grid', ['i07','i08'], 2);
  }

  if (path === '/About/') {
    removeAll('.about-story-visual');
    insertAfter('.about-narrow > p:last-of-type', ['i09','i10'], 2);
    insertAfter('.about-values-grid', ['i11','i12','i13'], 3);
  }

  if (path === '/Products/') {
    removeAll('.product-wide-visual, .product-visual-strip');
    insertAfter('.product-capability-grid', ['i14','i15','i23'], 3);
    insertAfter('.product-section.alt .product-grid', ['i16','i17'], 2);
  }

  if (path === '/OEMODM/') {
    removeAll('.oem-wide-image, .oem-pack-image');
    insertAfter('.oem-process-grid', ['i18','i19'], 2);
    insertAfter('.oem-pack-grid', ['i20','i21','i22'], 3);
  }

  if (path === '/Technology/') {
    removeAll('.tech-philosophy figure, .tech-optimization figure');
    document.querySelector('.tech-philosophy-grid')?.classList.add('jn-editorial-text-only');
    document.querySelector('.tech-optimization-inner')?.classList.add('jn-editorial-text-only');
    insertAfter('.tech-optimization-inner', ['i24','i25'], 2);
  }

  main.dataset.editorialImagesReady = 'true';
})();
