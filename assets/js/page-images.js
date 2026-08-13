(() => {
  'use strict';

  const basePath = window.JNCOS_BASE_PATH || '';

  const loadScript = (src, key) => new Promise((resolve) => {
    if (key && window[key]) return resolve();
    const marker = key || src;
    const existing = document.querySelector(`script[data-runtime="${marker}"]`);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src.startsWith('http') ? src : `${basePath}${src}`;
    script.async = true;
    script.setAttribute('data-runtime', marker);
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });

  const setupMeasurement = async () => {
    await loadScript('/assets/js/firebase-config.js', 'JNCOS_FIREBASE_CONFIG');
    const measurementId = window.JNCOS_GA4_MEASUREMENT_ID || 'G-9JRLB4KEVK';
    if (!window.dataLayer) window.dataLayer = [];
    if (!window.gtag) window.gtag = function () { window.dataLayer.push(arguments); };
    if (!document.querySelector('script[data-jncos-ga4]')) {
      const ga = document.createElement('script');
      ga.async = true;
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      ga.setAttribute('data-jncos-ga4', '');
      document.head.appendChild(ga);
      window.gtag('js', new Date());
      window.gtag('config', measurementId, { page_path: location.pathname + location.search });
    }
    await loadScript('/assets/js/visitor-store.js', 'JNCOSVisitorStore');
    window.JNCOSVisitorStore?.trackPageView?.();
  };

  if (!document.querySelector('link[data-image-preserve-css]')) {
    const imageCss = document.createElement('link');
    imageCss.rel = 'stylesheet';
    imageCss.href = `${basePath}/assets/css/image-preserve.css?v=20260813-1655`;
    imageCss.setAttribute('data-image-preserve-css', '');
    document.head.appendChild(imageCss);
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

    const root = document.createElement('div');
    root.className = 'nav-capabilities';
    root.setAttribute('data-capabilities', '');
    root.innerHTML = `<button class="nav-capabilities-trigger" type="button" aria-expanded="false" data-capabilities-trigger><span>Capabilities</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button><div class="nav-capabilities-menu" data-capabilities-menu><div class="nav-capabilities-eyebrow">WHAT WE DO</div></div>`;
    nav.insertBefore(root, products);

    const menu = root.querySelector('[data-capabilities-menu]');
    const descriptions = new Map([
      [products, 'Explore skincare, sun care, hair, body and treatment categories.'],
      [oem, 'From project brief and formulation to packaging and scalable manufacturing.'],
      [technology, 'Research platforms, functional ingredients and formulation technologies.']
    ]);

    [products, oem, technology].forEach((link) => {
      link.classList.add('nav-capability-link');
      const label = link.textContent.trim();
      link.innerHTML = `<span>${label}</span><small>${descriptions.get(link)}</small><b aria-hidden="true">↗</b>`;
      menu.appendChild(link);
    });

    const trigger = root.querySelector('[data-capabilities-trigger]');
    let closeTimer = null;
    const cancelClose = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };
    const setOpen = (open) => {
      cancelClose();
      root.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };
    const scheduleClose = () => {
      cancelClose();
      closeTimer = setTimeout(() => setOpen(false), 520);
    };

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!root.classList.contains('is-open'));
    });
    root.addEventListener('mouseenter', () => { if (innerWidth > 1024) setOpen(true); });
    root.addEventListener('mouseleave', () => { if (innerWidth > 1024) scheduleClose(); });
    menu.addEventListener('mouseenter', cancelClose);
    menu.addEventListener('mouseleave', () => { if (innerWidth > 1024) scheduleClose(); });
    root.addEventListener('focusin', () => { if (innerWidth > 1024) setOpen(true); });
    root.addEventListener('focusout', (event) => {
      if (innerWidth > 1024 && !root.contains(event.relatedTarget)) scheduleClose();
    });
    menu.addEventListener('click', () => setOpen(false));
    document.addEventListener('click', (event) => { if (!root.contains(event.target)) setOpen(false); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => setOpen(false));
  };

  const setupHomeTechTriggers = () => {
    const grid = document.querySelector('.home-technology .tech-grid');
    if (!grid) return;
    grid.querySelectorAll('.tech-trigger, a').forEach((el) => {
      if (el.tagName === 'A') el.removeAttribute('href');
      el.classList.add('tech-trigger');
      el.setAttribute('type', 'button');
      el.setAttribute('aria-label', `Show details for ${el.textContent.replace(/\s+/g, ' ').trim()}`);
    });
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
      engine.setAttribute('aria-hidden', 'true');
      document.body.appendChild(engine);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement || engine.dataset.ready === 'true') return;
      new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'ko', autoDisplay: false }, 'google_translate_element');
      engine.dataset.ready = 'true';
    };

    if (!document.querySelector('script[data-google-translate]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.setAttribute('data-google-translate', '');
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
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      if (attempt < 24) return setTimeout(() => translateToKorean(attempt + 1), 180);
      location.href = `https://translate.google.com/translate?sl=en&tl=ko&u=${encodeURIComponent(location.href)}`;
    };

    languageMenu.addEventListener('click', (event) => {
      const button = event.target.closest('[data-language]');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
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
    const pathname = location.pathname.replace(basePath, '').replace(/index\.html$/i, '');
    if (!/^\/Inquiry\/?$/i.test(pathname)) return;
    const main = document.querySelector('main.inquiry-page');
    if (!main) return;
    const removeLegacy = (root = main) => root.querySelectorAll?.('form').forEach((form) => {
      if (!form.matches('[data-inquiry-form]')) form.remove();
    });
    removeLegacy();
    const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node instanceof Element) removeLegacy(node);
    })));
    observer.observe(main, { childList: true, subtree: true });
  };

  setupMeasurement();
  setupCapabilitiesNav();
  setupHomeTechTriggers();
  setupLanguageSwitcher();
  cleanupInquiryForms();
  fixInternalLinks();

  if (basePath) {
    const linkObserver = new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node instanceof Element) fixInternalLinks(node);
    })));
    linkObserver.observe(document.body, { childList: true, subtree: true });
  }
})();
