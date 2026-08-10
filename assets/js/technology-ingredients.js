(() => {
  const grid = document.querySelector('.tech-ingredients .tech-chip-grid');
  if (!grid) return;

  const icons = {
    'Peptides':'<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="12" cy="17" r="2"/><path d="m7.7 10.9 2.6-2.8m3.4 0 2.6 2.8m0 2.2-2.6 2.8m-3.4 0-2.6-2.8"/></svg>',
    'Ceramides':'<svg viewBox="0 0 24 24"><path d="M5 8h14v9H5zM8 5h8v3M8 17v2h8v-2"/><path d="M8 11h8M8 14h8"/></svg>',
    'Niacinamide':'<svg viewBox="0 0 24 24"><path d="M12 3c3.5 4.2 5.2 7.2 5.2 9.3A5.2 5.2 0 1 1 6.8 12.3C6.8 10.2 8.5 7.2 12 3Z"/><path d="m16.8 4 .6 1.5L19 6l-1.6.5-.6 1.5-.6-1.5L14.6 6l1.6-.5.6-1.5Z"/></svg>',
    'Retinoids':'<svg viewBox="0 0 24 24"><path d="M6 7a7 7 0 0 1 11.5-1.5L20 8"/><path d="M20 4v4h-4M18 17A7 7 0 0 1 6.5 18.5L4 16"/><path d="M4 20v-4h4"/></svg>',
    'Fermented Actives':'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v5l-4 8a3 3 0 0 0 2.7 4h6.6A3 3 0 0 0 18 16l-4-8V3"/><circle cx="10" cy="14" r="1"/><circle cx="14.5" cy="16" r="1"/><path d="M8 12h8"/></svg>',
    'Amino Acid Systems':'<svg viewBox="0 0 24 24"><path d="m12 3 7 4v8l-7 4-7-4V7l7-4Z"/><circle cx="12" cy="11" r="2"/><path d="M12 13v4M8 8l2 2M16 8l-2 2"/></svg>',
    'Antioxidants':'<svg viewBox="0 0 24 24"><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z"/></svg>',
    'Betaine / NMF Complexes':'<svg viewBox="0 0 24 24"><path d="M5 8h14M7 12h10M9 16h6"/><path d="M12 3c2 2.5 3 4.3 3 5.5a3 3 0 0 1-6 0C9 7.3 10 5.5 12 3Z"/></svg>',
    'UV Filters':'<svg viewBox="0 0 24 24"><circle cx="7" cy="7" r="2.5"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3 3l1.4 1.4M9.6 9.6 11 11"/><path d="m15 8 5 2v4c0 3-2 5.2-5 6-3-.8-5-3-5-6v-4l5-2Z"/></svg>',
    'Soothing Complexes':'<svg viewBox="0 0 24 24"><path d="M18 4c-7 1-11 5-11 11 5 0 9-4 11-11Z"/><path d="M6 20c2-5 5-8 10-11M4 16c-1-2-1-4 0-6"/></svg>',
    'Hyaluronic Acid':'<svg viewBox="0 0 24 24"><path d="M12 3c4 4.7 6 8 6 10.5a6 6 0 1 1-12 0C6 11 8 7.7 12 3Z"/><path d="M9 14c.6 1.3 1.6 2 3 2"/></svg>',
    'Botanical Extracts':'<svg viewBox="0 0 24 24"><path d="M19 4C10 5 6 9 6 16c7 0 11-4 13-12Z"/><path d="M5 20c3-6 6-9 11-12"/></svg>'
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
    chip.innerHTML = `<span class="tech-chip-icon">${icons[key] || icons['Peptides']}</span><span class="tech-chip-label">${key}</span>`;
  });
  const keyOf = (el) => el.dataset.ingredient || el.textContent.replace(/\s+/g,' ').trim();

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
        <span class="tech-detail-icon">${icons[key] || icons['Peptides']}</span>
        <div><span class="tech-detail-kicker">FUNCTIONAL PROFILE</span><h3>${key}</h3><p>${d.intro}</p></div>
      </div>
      <div class="tech-ingredient-detail-grid">
        <div><span class="tech-mini-icon"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg></span><span>APPLICATIONS</span><p>${d.applications}</p></div>
        <div><span class="tech-mini-icon"><svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v5h5M9 12h6M9 16h4"/></svg></span><span>FORMULATION NOTES</span><p>${d.notes}</p></div>
        <div><span class="tech-mini-icon"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></span><span>KEY BENEFITS</span><p>${d.benefits}</p></div>
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