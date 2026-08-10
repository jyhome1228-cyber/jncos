(() => {
  const ensureSharedAssets = () => {
    if (!document.querySelector('link[data-content-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/css/content.css';
      link.setAttribute('data-content-css', '');
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[data-page-images]')) {
      const script = document.createElement('script');
      script.src = '/assets/js/page-images.js';
      script.defer = true;
      script.setAttribute('data-page-images', '');
      document.body.appendChild(script);
    }
  };

  const enhanceNavigation = () => {
    document.querySelectorAll('[data-nav], .site-nav').forEach((nav) => {
      if (!nav.querySelector('a[href="/Products/"]') && !nav.querySelector('a[href="../Products/"]')) {
        const productLink = document.createElement('a');
        productLink.href = '/Products/';
        productLink.textContent = 'Products & Services';
        const oemLink = [...nav.querySelectorAll('a')].find((a) => a.getAttribute('href')?.includes('OEMODM'));
        if (oemLink) oemLink.insertAdjacentElement('beforebegin', productLink);
        else nav.prepend(productLink);
      }

      if (!nav.querySelector('a[href="/Contact/"]') && !nav.querySelector('a[href="../Contact/"]')) {
        const contactLink = document.createElement('a');
        contactLink.href = '/Contact/';
        contactLink.textContent = 'Contact';
        const inquiryLink = [...nav.querySelectorAll('a')].find((a) => a.getAttribute('href')?.includes('Inquiry'));
        if (inquiryLink) inquiryLink.insertAdjacentElement('beforebegin', contactLink);
        else nav.appendChild(contactLink);
      }
    });
  };

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
