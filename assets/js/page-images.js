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

  const normalizePath = (pathname) => {
    const basePath = window.JNCOS_BASE_PATH || '';
    let clean = pathname || '/';
    if (basePath && clean.startsWith(basePath)) clean = clean.slice(basePath.length) || '/';
    if (clean === '/index.html') return '/';
    clean = clean.replace(/index\.html$/i, '');
    if (!clean.startsWith('/')) clean = `/${clean}`;
    return clean === '/' || clean.endsWith('/') ? clean : `${clean}/`;
  };

  const path = normalizePath(window.location.pathname);

  const setupLanguageSwitcher = () => {
    const nav = document.querySelector('[data-nav]');
    const languageRoot = document.querySelector('[data-language-switcher]');
    const languageMenu = document.querySelector('[data-language-menu]');
    const inquiry = nav?.querySelector('.nav-cta');
    if (!nav || !languageRoot || !languageMenu || !inquiry) return;

    /* Mobile and desktop order: ... Contact us → Inquiry → Language */
    if (inquiry.nextElementSibling !== languageRoot) inquiry.insertAdjacentElement('afterend', languageRoot);

    let engine = document.getElementById('google_translate_element');
    if (!engine) {
      engine = document.createElement('div');
      engine.id = 'google_translate_element';
      engine.className = 'google-translate-engine';
      engine.setAttribute('aria-hidden', 'true');
      document.body.appendChild(engine);
    }

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (!window.google?.translate?.TranslateElement) return;
        if (engine.dataset.ready === 'true') return;
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'hi',
          autoDisplay: false
        }, 'google_translate_element');
        engine.dataset.ready = 'true';
      };
    }

    if (!document.querySelector('script[data-google-translate]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.setAttribute('data-google-translate', '');
      document.body.appendChild(script);
    }

    const setGoogtransCookie = (value) => {
      const expires = value ? '' : ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = `googtrans=${value}${expires};path=/;SameSite=Lax`;
      const host = window.location.hostname;
      if (host && !host.includes('localhost')) document.cookie = `googtrans=${value}${expires};path=/;domain=.${host};SameSite=Lax`;
    };

    const translateToHindi = (attempt = 0) => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = 'hi';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        document.documentElement.setAttribute('data-translated-language', 'hi');
        return;
      }
      if (attempt < 24) {
        window.setTimeout(() => translateToHindi(attempt + 1), 180);
        return;
      }
      const sourceUrl = window.location.href;
      window.location.href = `https://translate.google.com/translate?sl=en&tl=hi&u=${encodeURIComponent(sourceUrl)}`;
    };

    const restoreEnglish = () => {
      setGoogtransCookie('');
      const clean = new URL(window.location.href);
      clean.hash = '';
      window.location.href = clean.toString();
    };

    languageMenu.addEventListener('click', (event) => {
      const button = event.target.closest('[data-language]');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const lang = button.dataset.language;
      if (lang === 'hi') {
        setGoogtransCookie('/en/hi');
        translateToHindi();
      } else {
        restoreEnglish();
      }
      const trigger = document.querySelector('[data-language-trigger]');
      if (trigger) trigger.querySelector('span').textContent = lang === 'hi' ? 'HI' : 'EN';
      languageMenu.hidden = true;
      trigger?.setAttribute('aria-expanded', 'false');
    }, true);
  };

  const cleanupInquiryForms = () => {
    if (path !== '/Inquiry/') return;
    const main = document.querySelector('main.inquiry-page');
    if (!main) return;

    const removeLegacyForms = (root = main) => {
      root.querySelectorAll?.('form').forEach((form) => {
        if (!form.matches('[data-inquiry-form]')) form.remove();
      });
    };

    removeLegacyForms();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches('form') && !node.matches('[data-inquiry-form]')) node.remove();
          else removeLegacyForms(node);
        });
      });
    });
    observer.observe(main, { childList: true, subtree: true });
  };

  setupLanguageSwitcher();
  cleanupInquiryForms();

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
    img.src = src;
    img.alt = alt;
    img.decoding = 'async';
    img.loading = path === '/' && index === 0 ? 'eager' : 'lazy';
    figure.appendChild(img);
    list.appendChild(figure);
  });

  inner.appendChild(list);
  section.appendChild(inner);
  main.appendChild(section);
})();