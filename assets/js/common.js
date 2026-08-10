(() => {
  const isGithubProjectPage = window.location.hostname.endsWith('github.io');
  const basePath = isGithubProjectPage ? '/jncos' : '';
  window.JNCOS_BASE_PATH = basePath;

  const withBase = (path) => {
    if (!path.startsWith('/')) return path;
    if (!basePath) return path;
    if (path === basePath || path.startsWith(`${basePath}/`)) return path;
    return `${basePath}${path}`;
  };

  const normalizeExistingLinks = () => {
    if (!basePath) return;
    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      const href = link.getAttribute('href');
      if (href) link.setAttribute('href', withBase(href));
    });
  };

  const ensureSharedAssets = () => {
    if (!document.querySelector('link[data-content-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = withBase('/assets/css/content.css');
      link.setAttribute('data-content-css', '');
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[data-page-images]')) {
      const script = document.createElement('script');
      script.src = withBase('/assets/js/page-images.js');
      script.setAttribute('data-page-images', '');
      document.body.appendChild(script);
    }
  };

  const enhanceNavigation = () => {
    document.querySelectorAll('[data-nav], .site-nav').forEach((nav) => {
      const links = [...nav.querySelectorAll('a')];
      const hasProducts = links.some((a) => a.getAttribute('href')?.includes('/Products/'));
      const hasContact = links.some((a) => a.getAttribute('href')?.includes('/Contact/'));

      if (!hasProducts) {
        const productLink = document.createElement('a');
        productLink.href = withBase('/Products/');
        productLink.textContent = 'Products & Services';
        const oemLink = links.find((a) => a.getAttribute('href')?.includes('OEMODM'));
        if (oemLink) oemLink.insertAdjacentElement('beforebegin', productLink);
        else nav.prepend(productLink);
      }

      if (!hasContact) {
        const contactLink = document.createElement('a');
        contactLink.href = withBase('/Contact/');
        contactLink.textContent = 'Contact';
        const inquiryLink = [...nav.querySelectorAll('a')].find((a) => a.getAttribute('href')?.includes('Inquiry'));
        if (inquiryLink) inquiryLink.insertAdjacentElement('beforebegin', contactLink);
        else nav.appendChild(contactLink);
      }
    });
  };

  normalizeExistingLinks();
  enhanceNavigation();
  ensureSharedAssets();

  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
