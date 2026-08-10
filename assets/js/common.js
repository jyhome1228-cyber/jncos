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

  const normalizePath = (pathname = window.location.pathname) => {
    let path = pathname || '/';
    if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || '/';
    path = path.replace(/index\.html$/i, '');
    if (!path.startsWith('/')) path = `/${path}`;
    if (path !== '/' && !path.endsWith('/')) path += '/';
    return path;
  };

  const path = normalizePath();
  const isAdmin = /\/admin\/?$/i.test(path);
  const isHome = document.querySelector('.home-main') !== null;
  if (!isAdmin) {
    document.body.classList.add('public-page');
    document.body.classList.toggle('home-page', isHome);
  }

  const SITE_URL = 'https://jncostech.com';
  const DEFAULT_IMAGE = 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/9c00c42704695.jpg';
  const seoMap = {
    '/': {
      title: 'JN COS TECH | Cosmetic OEM ODM Manufacturer in India',
      description: 'JN COS TECH provides cosmetic OEM/ODM manufacturing, Korean skincare formulation, bio-active R&D, packaging coordination and scalable production from Gujarat, India.',
      keywords: 'cosmetic OEM India, cosmetic ODM India, Korean skincare manufacturer, private label cosmetics India, cosmetic manufacturer Gujarat, third party cosmetic manufacturer India, skincare OEM ODM, Korean cosmetic formulation, bio-active skincare',
      image: DEFAULT_IMAGE
    },
    '/About/': {
      title: 'About JN COS TECH | Cosmetic Manufacturing Partner in India',
      description: 'Learn about JN COS TECH, an India-based cosmetic development and manufacturing company combining Korean skincare expertise, formulation science, quality systems and global OEM/ODM collaboration.',
      keywords: 'JN COS TECH, cosmetic manufacturer India, Korean skincare technology India, cosmetic development company Gujarat, cosmetic R&D India, OEM ODM company Ahmedabad',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/4ec6a98aa3f21.jpg'
    },
    '/Products/': {
      title: 'Cosmetic Products & Services | JN COS TECH OEM ODM',
      description: 'Explore JN COS TECH OEM/ODM capabilities across serums, creams, cleansers, sunscreen, masks, hair care, scalp care, body care and specialty cosmetic formulations.',
      keywords: 'serum manufacturer India, cream manufacturer India, sunscreen OEM India, skincare OEM products, hair care OEM India, body care manufacturer India, cosmetic mask manufacturer, private label skincare products',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/8df4c931a8b92.jpg'
    },
    '/OEMODM/': {
      title: 'Cosmetic OEM ODM Manufacturer India | JN COS TECH',
      description: 'JN COS TECH offers cosmetic OEM and ODM manufacturing, custom formulation, private label development, packaging coordination, pilot batches, quality control and scalable production in India.',
      keywords: 'cosmetic OEM manufacturer India, cosmetic ODM manufacturer India, private label cosmetics India, third party cosmetic manufacturer, custom skincare formulation India, OEM skincare Gujarat, ODM cosmetics Ahmedabad',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/c772a2c8c81d0.jpg'
    },
    '/Technology/': {
      title: 'Cosmetic R&D & Formulation Technology | JN COS TECH',
      description: 'Explore JN COS TECH cosmetic R&D platforms including barrier repair, peptides, ceramides, hydrogel delivery, encapsulation, liposome, niosome, emulsion engineering and functional ingredients.',
      keywords: 'cosmetic R&D India, skincare formulation technology, peptide skincare formulation, ceramide technology, hydrogel cosmetics, liposome niosome cosmetics, cosmetic emulsion engineering, functional cosmetic ingredients',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/645ad0367d91e.jpg'
    },
    '/Manufacturing/': {
      title: 'Cosmetic Manufacturing Facility India | JN COS TECH',
      description: 'Discover JN COS TECH cosmetic manufacturing infrastructure, mixing, emulsification, homogenization, filling, labeling, sealing, quality control and production support in Gujarat, India.',
      keywords: 'cosmetic manufacturing facility India, cosmetic factory Gujarat, skincare manufacturing India, cosmetic production Ahmedabad, cosmetic filling packaging India, cosmetic quality control, contract cosmetic manufacturing',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/b3f84f24cd6cc.jpg'
    },
    '/Partnership/': {
      title: 'Global Cosmetic Manufacturing Partnership | JN COS TECH',
      description: 'Partner with JN COS TECH for global cosmetic OEM/ODM development, white label manufacturing, custom OEM, packaging collaboration, technical communication and international market support.',
      keywords: 'global cosmetic manufacturing partner, cosmetic export manufacturer India, white label cosmetics India, international OEM ODM partner, cosmetic distribution support, beauty brand manufacturing partner',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/4ec6a98aa3f21.jpg'
    },
    '/Contact/': {
      title: 'Contact JN COS TECH | Cosmetic OEM ODM Ahmedabad India',
      description: 'Contact JN COS TECH in Ahmedabad and Kheda, Gujarat for cosmetic OEM/ODM manufacturing, formulation development, R&D, packaging, quality and global partnership inquiries.',
      keywords: 'JN COS TECH contact, cosmetic manufacturer Ahmedabad, cosmetic OEM Gujarat, cosmetic ODM Ahmedabad, skincare manufacturer Kheda, cosmetic factory contact India',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/0867ff1868205.jpg'
    },
    '/Inquiry/': {
      title: 'Cosmetic OEM ODM Project Inquiry | JN COS TECH',
      description: 'Submit a detailed cosmetic OEM/ODM project brief covering product category, formulation, ingredients, packaging, target market, production quantity and launch timeline.',
      keywords: 'cosmetic OEM inquiry, cosmetic ODM quote India, private label cosmetic inquiry, skincare manufacturing quotation, custom formulation project, cosmetic production inquiry India',
      image: 'https://cdn.imweb.me/upload/S2023030963558ef55ba8e/c772a2c8c81d0.jpg'
    },
    '/Privacy/': {
      title: 'Privacy Policy | JN COS TECH',
      description: 'Privacy policy for JN COS TECH website visitors, project inquiries and business communications.',
      keywords: 'JN COS TECH privacy policy',
      image: DEFAULT_IMAGE
    },
    '/Terms/': {
      title: 'Terms of Use | JN COS TECH',
      description: 'Terms of use governing the JN COS TECH website and business information provided through this site.',
      keywords: 'JN COS TECH terms of use',
      image: DEFAULT_IMAGE
    },
    '/Cookies/': {
      title: 'Cookie Policy | JN COS TECH',
      description: 'Cookie policy for the JN COS TECH website and related analytics or essential browser technologies.',
      keywords: 'JN COS TECH cookie policy',
      image: DEFAULT_IMAGE
    }
  };

  const ensureMeta = (selector, attrs) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      document.head.appendChild(el);
    }
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  };

  const ensureLink = (rel, href, extra = {}) => {
    let el = document.head.querySelector(`link[rel="${rel}"]${extra.hreflang ? `[hreflang="${extra.hreflang}"]` : ''}`);
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
    Object.entries(extra).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  };

  const applySeo = () => {
    if (isAdmin) return;
    const seo = seoMap[path] || seoMap['/'];
    const canonicalUrl = `${SITE_URL}${path === '/' ? '/' : path}`;
    document.title = seo.title;
    document.documentElement.lang = 'en-IN';

    ensureMeta('meta[name="description"]', { name: 'description', content: seo.description });
    ensureMeta('meta[name="keywords"]', { name: 'keywords', content: seo.keywords });
    ensureMeta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' });
    ensureMeta('meta[name="author"]', { name: 'author', content: 'JN COS TECH Pvt. Ltd.' });
    ensureMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'IN-GJ' });
    ensureMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Ahmedabad, Gujarat, India' });
    ensureMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#2f1b13' });

    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'JN COS TECH' });
    ensureMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' });
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: seo.image });
    ensureMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${seo.title} — JN COS TECH` });

    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.image });

    ensureLink('canonical', canonicalUrl);
    ensureLink('alternate', canonicalUrl, { hreflang: 'en-IN' });
    ensureLink('alternate', canonicalUrl, { hreflang: 'x-default' });

    const oldStructured = document.head.querySelector('script[data-jncos-structured-data]');
    oldStructured?.remove();
    const crumbs = path === '/' ? [] : [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: seo.title.split('|')[0].trim(), item: canonicalUrl }
    ];
    const graph = [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'JN COS TECH Pvt. Ltd.',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/assets/logo/jncos-logo.svg`,
        email: 'info@jncostech.com',
        telephone: ['+91 83206-15108', '+91 95121-28862'],
        areaServed: ['India', 'East Asia', 'Middle East', 'Southeast Asia', 'Europe', 'North America'],
        knowsAbout: ['Cosmetic OEM', 'Cosmetic ODM', 'Korean skincare formulation', 'Bio-active skincare', 'Cosmetic R&D', 'Private label cosmetics'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '704, Venus Benecia, S G Highway, Bodakdev',
          addressLocality: 'Ahmedabad',
          addressRegion: 'Gujarat',
          postalCode: '387-015',
          addressCountry: 'IN'
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'JN COS TECH',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-IN'
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        primaryImageOfPage: { '@type': 'ImageObject', url: seo.image },
        inLanguage: 'en-IN'
      }
    ];
    if (crumbs.length) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs });
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-jncos-structured-data', '');
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    document.head.appendChild(script);
  };

  const ensureCss = (marker, assetPath) => {
    if (document.querySelector(`link[${marker}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = withBase(assetPath);
    link.setAttribute(marker, '');
    document.head.appendChild(link);
  };

  const ensureSharedAssets = () => {
    ensureCss('data-content-css', '/assets/css/content.css');
    ensureCss('data-site-system-css', '/assets/css/site-system.css');
    ensureCss('data-layout-unify-css', '/assets/css/layout-unify.css');
    ensureCss('data-final-polish-css', '/assets/css/final-polish.css');

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
          <a href="${withBase('/Contact/')}">Contact us</a>
          <div class="language-switcher" data-language-switcher>
            <button class="language-switcher-trigger" type="button" aria-expanded="false" aria-controls="language-menu" data-language-trigger>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.4 4 5.5 4 9s-1.4 6.6-4 9M12 3c-2.6 2.4-4 5.5-4 9s1.4 6.6 4 9"/></svg>
              <span>EN</span>
            </button>
            <div class="language-switcher-menu" id="language-menu" data-language-menu hidden>
              <button type="button" data-language="en"><strong>English</strong><span>Original</span></button>
              <button type="button" data-language="hi"><strong>हिन्दी</strong><span>India · Google Translate</span></button>
            </div>
          </div>
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
              <a href="${withBase('/Contact/')}">Contact us</a>
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

  applySeo();
  ensureSharedAssets();
  renderHeader();
  renderFooter();

  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const languageRoot = document.querySelector('[data-language-switcher]');
  const languageTrigger = document.querySelector('[data-language-trigger]');
  const languageMenu = document.querySelector('[data-language-menu]');

  const closeLanguage = () => {
    if (!languageTrigger || !languageMenu) return;
    languageTrigger.setAttribute('aria-expanded', 'false');
    languageMenu.hidden = true;
  };

  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    closeLanguage();
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

  if (languageTrigger && languageMenu) {
    languageTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = languageTrigger.getAttribute('aria-expanded') === 'true';
      languageTrigger.setAttribute('aria-expanded', String(!open));
      languageMenu.hidden = open;
    });
    languageMenu.addEventListener('click', (event) => {
      const button = event.target.closest('[data-language]');
      if (!button) return;
      const lang = button.dataset.language;
      const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
      if (lang === 'en') {
        window.location.href = isGithubProjectPage ? withBase(path) : canonical;
      } else if (lang === 'hi') {
        const sourceUrl = isGithubProjectPage ? window.location.href : canonical;
        window.location.href = `https://translate.google.com/translate?sl=en&tl=hi&u=${encodeURIComponent(sourceUrl)}`;
      }
    });
    document.addEventListener('click', (event) => {
      if (languageRoot && !languageRoot.contains(event.target)) closeLanguage();
    });
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
