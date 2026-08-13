(() => {
  'use strict';

  const basePath = window.JNCOS_BASE_PATH || '';

  const ensureStyle = (marker, href) => {
    if (document.querySelector(`link[${marker}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${basePath}${href}`;
    link.setAttribute(marker, '');
    document.head.appendChild(link);
  };

  ensureStyle('data-legacy-site-polish', '/assets/css/legacy-site-polish.css?v=20260813-1655');
  ensureStyle('data-approved-images', '/assets/css/approved-images.css?v=20260813-1655');
  ensureStyle('data-layout-consistency', '/assets/css/layout-consistency.css?v=20260813-1735');

  const enhanceProductCapabilities = () => {
    const descriptions = [
      ['Skincare Systems', 'Serums, creams, essences and barrier-care formats.'],
      ['Sun Care Solutions', 'Daily UV fluids, hybrid sunscreens and functional SPF care.'],
      ['Hair & Scalp Care', 'Shampoo, treatment, conditioner and scalp-focused systems.'],
      ['Body Care Products', 'Cleansers, lotions, creams and targeted body treatments.'],
      ['Treatment Masks', 'Hydrogel, bio-cellulose, sleeping and eye-patch formats.'],
      ['Specialty Formulations', 'Customized textures, delivery systems and market-specific concepts.']
    ];

    document.querySelectorAll('.product-capability-item').forEach((item, index) => {
      if (item.dataset.enhanced === 'true') return;
      const data = descriptions[index];
      if (!data) return;
      item.innerHTML = `<strong>${data[0]}</strong><small>${data[1]}</small>`;
      item.dataset.enhanced = 'true';
    });
  };

  const apply = () => {
    enhanceProductCapabilities();
    const main = document.querySelector('main');
    if (main) main.dataset.jnVisualFixed = 'source-images-20260813';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
