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

  const normalizePath = (path) => {
    const basePath = window.JNCOS_BASE_PATH || '';
    let clean = path || '/';
    if (basePath && clean.startsWith(basePath)) clean = clean.slice(basePath.length) || '/';
    if (clean === '/index.html') return '/';
    clean = clean.replace(/index\.html$/i, '');
    return clean.endsWith('/') ? clean : `${clean}/`;
  };

  const path = normalizePath(window.location.pathname);
  const images = IMAGE_MAP[path];
  const main = document.querySelector('main');
  if (!main || !images || main.matches('[data-page-visuals]') || main.querySelector('[data-page-visuals]')) return;

  const section = document.createElement('section');
  section.className = 'visual-stack';
  section.setAttribute('data-page-visuals', '');
  section.setAttribute('aria-label', 'Page visuals');
  const inner = document.createElement('div');
  inner.className = 'visual-stack-inner';
  const list = document.createElement('div');
  list.className = 'visual-stack-list';

  images.forEach(([src, alt], index) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = src; img.alt = alt; img.decoding = 'async';
    img.loading = path === '/' && index === 0 ? 'eager' : 'lazy';
    figure.appendChild(img); list.appendChild(figure);
  });

  inner.appendChild(list); section.appendChild(inner); main.appendChild(section);
})();
