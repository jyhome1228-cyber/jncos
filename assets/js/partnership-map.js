(() => {
  const root = document.querySelector('[data-partnership-map]');
  if (!root) return;

  const regions = {
    india: { title: 'India', eyebrow: 'SOUTH ASIA', copy: 'Manufacturing and product-development support for one of Asia’s fastest-growing beauty and personal-care markets.', detail: 'OEM / ODM manufacturing, formulation development, packaging coordination and scalable launch support.' },
    eastasia: { title: 'East Asia', eyebrow: 'EAST ASIA', copy: 'Collaboration for Japan, Taiwan, and surrounding markets where refined textures, quality, and technical differentiation matter.', detail: 'Best suited to premium skincare, advanced textures, high-specification development and quality-sensitive launches.' },
    middleeast: { title: 'Middle East', eyebrow: 'MIDDLE EAST', copy: 'Export-oriented skincare and cosmetic solutions developed for premium positioning, climate needs, and regional market requirements.', detail: 'Support can include target-market discussion, packaging coordination and market-specific documentation review.' },
    southeastasia: { title: 'Southeast Asia', eyebrow: 'SOUTHEAST ASIA', copy: 'Flexible development for Thailand, Vietnam, Malaysia, Indonesia, Singapore, and other fast-moving regional beauty markets.', detail: 'Suitable for lightweight textures, humid-climate product concepts and agile regional brand launches.' },
    europe: { title: 'Europe', eyebrow: 'EUROPE', copy: 'Partnership support for premium skincare categories with internationally aligned documentation, quality, and product positioning.', detail: 'Development conversations can include EU-oriented claims, ingredient direction and documentation coordination.' },
    northamerica: { title: 'North America', eyebrow: 'NORTH AMERICA', copy: 'Korean-inspired formulation and OEM / ODM collaboration for brands seeking differentiated performance and scalable execution.', detail: 'Strong fit for independent brands, premium skincare lines, private-label programs and long-term product roadmaps.' },
    d2c: { title: 'Emerging Global D2C Markets', eyebrow: 'GLOBAL D2C', copy: 'Agile development and manufacturing support for digitally native brands entering new international commerce channels.', detail: 'Flexible project scope for fast-moving founders, cross-border e-commerce brands and multi-market product launches.' }
  };

  const title = root.querySelector('[data-region-title]');
  const eyebrow = root.querySelector('[data-region-eyebrow]');
  const copy = root.querySelector('[data-region-copy]');
  const detail = root.querySelector('[data-region-detail]');
  const targets = [...root.querySelectorAll('[data-region]')];
  const buttons = [...root.querySelectorAll('[data-region-button]')];

  const activate = (key) => {
    const item = regions[key];
    if (!item) return;
    if (title) title.textContent = item.title;
    if (eyebrow) eyebrow.textContent = item.eyebrow;
    if (copy) copy.textContent = item.copy;
    if (detail) detail.textContent = item.detail;
    targets.forEach((el) => el.classList.toggle('is-active', el.dataset.region === key));
    buttons.forEach((el) => {
      const active = el.dataset.regionButton === key;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-pressed', String(active));
    });
  };

  targets.forEach((el) => {
    const go = () => activate(el.dataset.region);
    el.addEventListener('click', go);
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); }
    });
  });
  buttons.forEach((el) => el.addEventListener('click', () => activate(el.dataset.regionButton)));
  activate('india');
})();
