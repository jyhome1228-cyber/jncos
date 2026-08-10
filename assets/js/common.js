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

  const isAdmin = /\/admin\/?$/i.test(window.location.pathname);
  const isHome = document.querySelector('.home-main') !== null;
  if (!isAdmin) {
    document.body.classList.add('public-page');
    document.body.classList.toggle('home-page', isHome);
  }

  const ensureCss = (marker, path) => {
    if (document.querySelector(`link[${marker}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = withBase(path);
    link.setAttribute(marker, '');
    document.head.appendChild(link);
  };

  const ensureSharedAssets = () => {
    ensureCss('data-content-css', '/assets/css/content.css');
    ensureCss('data-site-system-css', '/assets/css/site-system.css');

    if (!document.querySelector('script[data-page-images]')) {
      const script = document.createElement('script');
      script.src = withBase('/assets/js/page-images.js');
      script.setAttribute('data-page-images', '');
      document.body.appendChild(script);
    }
  };

  const logoPath = withBase('/assets/logo/jncos-logo.svg');

  const renderHeader = () => {
    if (isAdmin) return;
    const header = document.querySelector('.site-header');
    if (!header) return;
    header.className = 'site-header';
    header.innerHTML = `
      <div class="site-container header-inner">
        <a class="brand" href="${withBase('/')}" aria-label="JN COS TECH home">
          <img class="site-logo-img" src="${logoPath}" alt="JN COS TECH Pvt. Ltd.">
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>
          <span></span><span></span><span class="sr-only">Open menu</span>
        </button>
        <nav class="site-nav" id="site-nav" aria-label="Primary navigation" data-nav>
          <a href="${withBase('/About/')}">About</a>
          <a href="${withBase('/Products/')}">Products &amp; Services</a>
          <a href="${withBase('/OEMODM/')}">OEM / ODM</a>
          <a href="${withBase('/Technology/')}">Technology &amp; R&amp;D</a>
          <a href="${withBase('/Manufacturing/')}">Manufacturing</a>
          <a href="${withBase('/Partnership/')}">Partnership</a>
          <a href="${withBase('/Contact/')}">Contact</a>
          <a class="nav-cta" href="${withBase('/Inquiry/')}">Inquiry</a>
        </nav>
      </div>`;
  };

  const footerMarkup = () => `
    <footer class="global-footer">
      <div class="site-container">
        <div class="global-footer-top">
          <div>
            <a class="global-footer-brand" href="${withBase('/')}" aria-label="JN COS TECH home"><img class="global-footer-logo" src="${logoPath}" alt="JN COS TECH Pvt. Ltd. — Add Science to Beauty"></a>
            <p class="global-footer-intro">Science-driven cosmetic development, Korean skincare formulation expertise, bio-active technology and scalable OEM / ODM manufacturing for global beauty brands.</p>
          </div>
          <div>
            <span class="global-footer-label">Company</span>
            <div class="global-footer-links">
              <a href="${withBase('/About/')}">About</a>
              <a href="${withBase('/Products/')}">Products &amp; Services</a>
              <a href="${withBase('/Partnership/')}">Partnership</a>
              <a href="${withBase('/Contact/')}">Contact</a>
            </div>
          </div>
          <div>
            <span class="global-footer-label">Capabilities</span>
            <div class="global-footer-links">
              <a href="${withBase('/OEMODM/')}">OEM / ODM</a>
              <a href="${withBase('/Technology/')}">Technology &amp; R&amp;D</a>
              <a href="${withBase('/Manufacturing/')}">Manufacturing</a>
              <a href="${withBase('/Inquiry/')}">Project Inquiry</a>
            </div>
          </div>
          <div class="global-footer-contact">
            <span class="global-footer-label">Get in Touch</span>
            <p><a href="mailto:info@jncostech.com">info@jncostech.com</a><br><a href="tel:+918320615108">+91 83206-15108</a><br><a href="tel:+919512128862">+91 95121-28862</a></p>
            <p><strong>Office</strong><br>704, Venus Benecia, S G Highway, Bodakdev, Ahmedabad, Gujarat, India 387-015</p>
            <p><strong>Factory</strong><br>5, Modern Industrial &amp; Logistics Park, Vasna-Bujarg, Kheda, Gujarat, India 387-550</p>
          </div>
        </div>
        <div class="global-footer-bottom">
          <span>© <span data-year></span> JN COS TECH Pvt. Ltd. All rights reserved.</span>
          <div class="global-footer-legal">
            <a href="${withBase('/Privacy/')}">Privacy Policy</a>
            <a href="${withBase('/Terms/')}">Terms of Use</a>
            <a href="${withBase('/Cookies/')}">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>`;

  const renderFooter = () => {
    if (isAdmin) return;
    const oldFooter = document.querySelector('footer');
    if (oldFooter) oldFooter.outerHTML = footerMarkup();
    else document.body.insertAdjacentHTML('beforeend', footerMarkup());
  };

  ensureSharedAssets();
  renderHeader();
  renderFooter();

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
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeMenu(); });
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
