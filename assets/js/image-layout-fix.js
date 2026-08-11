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

  const path = normalizePath(location.pathname);
  const main = document.querySelector('main');
  if (!main) return;

  /* Load the final visual-polish layer after all page styles. */
  if (!document.querySelector('link[data-legacy-site-polish]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${basePath}/assets/css/legacy-site-polish.css?v=20260812-0106`;
    link.setAttribute('data-legacy-site-polish','');
    document.head.appendChild(link);
  }

  const NEW = 'https://cdn.imweb.me/upload/S20260219b829e728b3f2e/';
  const OLD = 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/';

  const IMG = {
    brandHero:[`${NEW}bb85277738e1f.jpg`,'JN COS TECH brand identity'],
    productBottle:[`${NEW}aa57a4c9a2de4.jpg`,'Skincare formulation bottle packaging'],
    productBottle2:[`${NEW}e01aacb1e3873.jpg`,'Skincare product bottle and label detail'],
    productFamily:[`${NEW}4448d729ca352.jpg`,'Skincare product family and cosmetic packaging'],
    packageBox:[`${NEW}27881a15784d9.jpg`,'Cosmetic secondary packaging box'],
    packageLabel:[`${NEW}44ac3075eef4f.jpg`,'Cosmetic carton and label packaging'],
    packageTag:[`${NEW}80508253fdc1a.jpg`,'JN COS TECH hang tag and packaging detail'],
    packageCard:[`${NEW}c2b119f52bcd7.jpg`,'JN COS TECH printed packaging card'],
    packagePouch:[`${NEW}9661210ccf9c5.jpg`,'JN COS TECH pouch and secondary packaging'],
    techLab:[`${NEW}9837335aec34f.jpg`,'Cosmetic research laboratory and formulation samples'],
    techFill:[`${NEW}67b7b2ed5283b.jpg`,'Cosmetic laboratory filling and formulation research'],

    productWide:[`${OLD}6080c78501663.jpg`,'JN COS TECH cosmetic product development'],
    productWide2:[`${OLD}a3cce7bdc446a.jpg`,'JN COS TECH formulation samples'],

    mfgWide:[`${OLD}93aa69a27d052.jpg`,'Cosmetic production testing and process setup'],
    mfg1:[`${OLD}4601859efd746.jpg`,'Cosmetic manufacturing equipment'],
    mfg2:[`${OLD}271ff2c6e399e.jpg`,'Cosmetic stability and quality testing'],
    mfg3:[`${OLD}9f66cd28df907.jpg`,'Cosmetic production line'],
    mfg4:[`${OLD}6bd2f78858152.jpg`,'Cosmetic laboratory production work'],
    mfg5:[`${OLD}8987f5909172f.jpg`,'Cosmetic filling facility'],
    mfg6:[`${NEW}61b174e5225d7.jpg`,'JN COS TECH manufacturing facility interior']
  };

  const cleanup = () => {
    document.querySelectorAll('.jn-editorial-grid,.jn-visual-block').forEach((el)=>el.remove());
    document.querySelectorAll('.mfg-wide-image,.mfg-collage,.product-wide-visual,.product-visual-strip,.oem-wide-image,.oem-pack-image,.about-story-visual').forEach((el)=>el.remove());
  };

  const makeGrid = (keys, mode='grid', extraClass='') => {
    const valid = keys.filter((key)=>IMG[key]);
    if (!valid.length) return null;
    const block = document.createElement('div');
    block.className = 'jn-visual-block';
    block.dataset.jnVisualSystem = 'legacy-20260812';

    const grid = document.createElement('div');
    grid.className = `jn-visual-grid ${mode === 'wide' ? 'is-wide' : ''} ${mode === 'brand' ? 'is-wide is-brand' : ''} ${extraClass}`.trim();

    valid.forEach((key)=>{
      const [src,alt] = IMG[key];
      const figure = document.createElement('figure');
      figure.className = 'jn-visual-card';
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error',()=>{
        figure.remove();
        if (!grid.children.length) block.remove();
      },{once:true});
      figure.appendChild(img);
      grid.appendChild(figure);
    });

    block.appendChild(grid);
    return block;
  };

  const insertAfter = (target, keys, mode='grid', extraClass='') => {
    if (!target) return null;
    const block = makeGrid(keys,mode,extraClass);
    if (!block) return null;
    target.insertAdjacentElement('afterend',block);
    return block;
  };

  const sectionByTitle = (title) => [...document.querySelectorAll('section')].find((section)=>{
    const heading = section.querySelector('h2');
    return heading?.textContent?.trim() === title;
  });

  const enhanceProductCapabilities = () => {
    if (path !== '/Products/') return;
    const descriptions = [
      ['Skincare Systems','Serums, creams, essences and barrier-care formats.'],
      ['Sun Care Solutions','Daily UV fluids, hybrid sunscreens and functional SPF care.'],
      ['Hair & Scalp Care','Shampoo, treatment, conditioner and scalp-focused systems.'],
      ['Body Care Products','Cleansers, lotions, creams and targeted body treatments.'],
      ['Treatment Masks','Hydrogel, bio-cellulose, sleeping and eye-patch formats.'],
      ['Specialty Formulations','Customized textures, delivery systems and market-specific concepts.']
    ];
    document.querySelectorAll('.product-capability-item').forEach((item,index)=>{
      if (item.dataset.enhanced === 'true') return;
      const data = descriptions[index];
      if (!data) return;
      item.innerHTML = `<strong>${data[0]}</strong><small>${data[1]}</small>`;
      item.dataset.enhanced = 'true';
    });
  };

  const apply = () => {
    cleanup();
    enhanceProductCapabilities();

    if (path === '/About/') {
      const story = document.querySelector('.about-narrow > p:last-of-type');
      insertAfter(story,['brandHero'],'brand');
    }

    if (path === '/Products/') {
      const capability = document.querySelector('.product-capability-grid');
      insertAfter(capability,['productWide'],'wide','is-product');

      const barrier = sectionByTitle('Barrier Recovery Moisturizers');
      const barrierGrid = barrier?.querySelector('.product-grid');
      insertAfter(barrierGrid,['productWide2'],'wide','is-product');
    }

    if (path === '/Manufacturing/') {
      const intro = document.querySelector('.mfg-two');
      insertAfter(intro,['mfgWide'],'wide','is-mfg');

      const equipment = document.querySelector('.mfg-equipment-grid');
      insertAfter(equipment,['mfg1','mfg2','mfg3','mfg4','mfg5','mfg6'],'grid','is-mfg');
    }

    if (path === '/OEMODM/') {
      const process = document.querySelector('.oem-process-grid');
      insertAfter(process,['packageBox','packageLabel','packageTag'],'grid');

      const packaging = document.querySelector('.oem-pack-grid');
      insertAfter(packaging,['packageCard','packagePouch','productBottle'],'grid');
    }

    if (path === '/Technology/') {
      // Keep the page's own R&D images. Only remove legacy injected galleries.
      document.querySelector('.tech-philosophy-grid')?.classList.remove('jn-editorial-text-only');
      document.querySelector('.tech-optimization-inner')?.classList.remove('jn-editorial-text-only');
    }

    main.dataset.jnVisualFixed = 'legacy-20260812';
  };

  let tries = 0;
  const wait = () => {
    tries += 1;
    if (main.dataset.editorialImagesReady === 'true' || document.querySelector('.jn-editorial-grid') || tries > 45) {
      apply();
      return;
    }
    setTimeout(wait,40);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',wait,{once:true});
  else wait();
})();