(() => {
  const grid = document.querySelector('.tech-ingredients .tech-chip-grid');
  if (!grid) return;

  const svg = (body) => `<svg class="tech-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
  const icons = {
    'Peptides': svg('<circle cx="6" cy="12" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.5 10.5 10.5 7.5M13.5 7.5l3 3M16.5 13.5l-3 3M10.5 16.5l-3-3"/>'),
    'Ceramides': svg('<path d="M5 7h14v3H5zM5 11h14v3H5zM5 15h14v3H5z"/>'),
    'Niacinamide': svg('<path d="M12 3c3 4 5 7 5 9.5a5 5 0 0 1-10 0C7 10 9 7 12 3Z"/><path d="m17.5 4 .6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z"/>'),
    'Retinoids': svg('<path d="M7 7a7 7 0 0 1 10-1l2 2M19 4v4h-4M17 17a7 7 0 0 1-10 1l-2-2M5 20v-4h4"/>'),
    'Fermented Actives': svg('<path d="M9 3h6M10 3v5l-4 8a3 3 0 0 0 3 4h6a3 3 0 0 0 3-4l-4-8V3M8 13h8"/><circle cx="10" cy="16" r=".8"/><circle cx="14" cy="17" r=".8"/>'),
    'Amino Acid Systems': svg('<path d="m12 4 6 3.5v7L12 18l-6-3.5v-7L12 4Z"/><circle cx="12" cy="11" r="2"/><path d="M12 13v4M8 8.5l2 1.3M16 8.5l-2 1.3"/>'),
    'Antioxidants': svg('<path d="m10 3 1.3 3.7L15 8l-3.7 1.3L10 13l-1.3-3.7L5 8l3.7-1.3L10 3ZM17 12l.9 2.1L20 15l-2.1.9L17 18l-.9-2.1L14 15l2.1-.9L17 12Z"/>'),
    'Betaine / NMF Complexes': svg('<path d="M5 8h14M7 12h10M9 16h6"/><path d="M12 3c1.8 2.2 2.8 3.8 2.8 5a2.8 2.8 0 1 1-5.6 0c0-1.2 1-2.8 2.8-5Z"/>'),
    'UV Filters': svg('<circle cx="7" cy="7" r="2.5"/><path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2M3 3l1.4 1.4M9.6 9.6 11 11M15 9l4 1.8v3.5c0 2.6-1.6 4.6-4 5.7-2.4-1.1-4-3.1-4-5.7v-3.5L15 9Z"/>'),
    'Soothing Complexes': svg('<path d="M19 4C11 5 7 9 7 16c6 0 10-4 12-12Z"/><path d="M5 20c3-6 6-9 11-12"/>'),
    'Hyaluronic Acid': svg('<path d="M12 3c4 4.8 6 8 6 10.5a6 6 0 1 1-12 0C6 11 8 7.8 12 3Z"/><path d="M9.5 14c.6 1.2 1.4 1.8 2.5 1.8"/>'),
    'Botanical Extracts': svg('<path d="M19 4C10 5 6 9 6 16c7 0 11-4 13-12Z"/><path d="M5 20c3-6 7-10 12-13"/>')
  };

  const data = {
    'Peptides': {intro:'Peptide systems are used for firmness, elasticity, visible anti-aging support, and premium treatment positioning.',applications:'Anti-aging serums · Firming creams · Eye care · Intensive ampoules',notes:'Dosage, pH, carrier system, active interaction, preservation, and long-term stability.',benefits:'Firmness support · Elasticity care · Premium treatment concepts'},
    'Ceramides': {intro:'Ceramide systems support skin-barrier integrity and moisture retention in dry, sensitive, or compromised-skin formulas.',applications:'Barrier creams · Recovery serums · Daily moisturizers · Sensitive-skin care',notes:'Ceramide/lipid balance, lamellar structure, emulsion stability, sensory weight, and compatibility.',benefits:'Barrier support · Moisture retention · Skin comfort'},
    'Niacinamide': {intro:'A versatile active used for tone, sebum balance, barrier support, and overall skin clarity.',applications:'Brightening serums · Pore care · Lotions · Acne-care systems',notes:'Concentration, pH, combination with acids/actives, irritation potential, and claim direction.',benefits:'Tone care · Sebum balance · Barrier support'},
    'Retinoids': {intro:'Retinoid-based systems support skin-renewal and advanced age-management concepts focused on texture and visible fine lines.',applications:'Night serums · Wrinkle creams · Resurfacing care · Premium anti-aging',notes:'Stability, irritation management, dosage, oxidation control, supporting soothing systems, and packaging.',benefits:'Renewal support · Texture refinement · Fine-line care'},
    'Fermented Actives': {intro:'Fermented ingredients are used for hydration, conditioning, vitality, and Korean-skincare storytelling.',applications:'Essences · Glow serums · Hydration systems · Sensitive-skin formulas',notes:'Odor/color control, active level, preservation, compatibility, and consistency across batches.',benefits:'Conditioning · Hydration · Premium K-beauty positioning'},
    'Amino Acid Systems': {intro:'Amino-acid-based systems support mild cleansing, hydration, and skin/scalp conditioning.',applications:'Gentle cleansers · Scalp care · Body wash · Hydration products',notes:'pH, surfactant balance, foam profile, viscosity, salt response, and after-feel.',benefits:'Mild cleansing · Moisture balance · Daily-use comfort'},
    'Antioxidants': {intro:'Antioxidant systems help support protection from environmental stress while contributing to vitality and preventive skincare positioning.',applications:'Daily serums · Brightening care · City-defense products · Anti-aging',notes:'Oxidation stability, color influence, active synergy, packaging compatibility, and storage.',benefits:'Environmental defense · Tone support · Preventive care'},
    'Betaine / NMF Complexes': {intro:'Betaine and NMF-inspired systems are used to support moisture retention and comfortable skin conditioning.',applications:'Hydration toners · Moisturizers · Barrier creams · Masks',notes:'Humectant balance, tackiness, viscosity, emulsion compatibility, and climate use.',benefits:'Deep hydration · Skin comfort · Moisture retention'},
    'UV Filters': {intro:'UV filter systems support broad-spectrum sun-care development with attention to wearability, stability, and market requirements.',applications:'Daily sunscreen · Fluid SPF · Gel SPF · Hybrid sun care',notes:'Photostability, dispersion, regulatory market, SPF testing strategy, skin feel, and packaging.',benefits:'UV protection support · Daily wear · Multi-texture formats'},
    'Soothing Complexes': {intro:'Soothing complexes are designed for stressed, reactive, or compromised skin and pair naturally with barrier-focused care.',applications:'Calming serums · Recovery creams · After-sun · Sensitive-skin masks',notes:'Low-irritation architecture, barrier-active synergy, fragrance strategy, preservation, and sensory softness.',benefits:'Comfort support · Sensitive-skin care · Barrier synergy'},
    'Hyaluronic Acid': {intro:'Multi-molecular hyaluronic acid systems support immediate hydration, plumping feel, and layered moisture delivery.',applications:'Hydration serums · Gels · Lotions · Masks · Intensive moisture care',notes:'Molecular-weight selection, viscosity, humectant balance, tackiness, and texture target.',benefits:'Immediate hydration · Plumping feel · Moisture layering'},
    'Botanical Extracts': {intro:'Botanical extracts are selected for conditioning, soothing, brightening, antioxidant function, or brand-storytelling value.',applications:'Natural skincare · Calming lines · Brightening formulas · Wellness concepts',notes:'Origin, color, odor, active level, preservation compatibility, and formulation stability.',benefits:'Botanical positioning · Functional variety · Premium storytelling'}
  };

  const panel = document.createElement('section');
  panel.className = 'tech-ingredient-detail';
  panel.setAttribute('aria-live', 'polite');
  grid.insertAdjacentElement('afterend', panel);

  const chips = [...grid.querySelectorAll('.tech-chip')];
  chips.forEach((chip) => {
    const key = chip.textContent.replace(/\s+/g,' ').trim();
    chip.dataset.ingredient = key;
    chip.innerHTML = `<span class="tech-chip-icon">${icons[key]}</span><span class="tech-chip-label">${key}</span>`;
  });
  const keyOf = (el) => el.dataset.ingredient || el.textContent.replace(/\s+/g,' ').trim();

  const miniIcons = {
    applications: svg('<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>'),
    notes: svg('<path d="M6 3h9l3 3v15H6zM14 3v5h5M9 12h6M9 16h4"/>'),
    benefits: svg('<path d="m5 12 4 4L19 6"/>')
  };

  const render = (key) => {
    const d = data[key];
    if (!d) return;
    chips.forEach((chip) => {
      const active = keyOf(chip) === key;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    panel.innerHTML = `
      <div class="tech-ingredient-detail-head">
        <span class="tech-detail-icon">${icons[key]}</span>
        <div><span class="tech-detail-kicker">FUNCTIONAL PROFILE</span><h3>${key}</h3><p>${d.intro}</p></div>
      </div>
      <div class="tech-ingredient-detail-grid">
        <div><span class="tech-mini-icon">${miniIcons.applications}</span><span>APPLICATIONS</span><p>${d.applications}</p></div>
        <div><span class="tech-mini-icon">${miniIcons.notes}</span><span>FORMULATION NOTES</span><p>${d.notes}</p></div>
        <div><span class="tech-mini-icon">${miniIcons.benefits}</span><span>KEY BENEFITS</span><p>${d.benefits}</p></div>
      </div>`;
  };

  chips.forEach((chip) => {
    chip.setAttribute('role','button');
    chip.setAttribute('tabindex','0');
    chip.setAttribute('aria-pressed','false');
    const activate = () => render(keyOf(chip));
    chip.addEventListener('click', activate);
    chip.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  render('Peptides');
})();