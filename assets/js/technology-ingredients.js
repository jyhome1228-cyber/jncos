(() => {
  const grid = document.querySelector('.tech-ingredients .tech-chip-grid');
  if (!grid) return;

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
  const keyOf = (el) => el.textContent.replace(/\s+/g,' ').trim();

  const render = (key) => {
    const d = data[key];
    if (!d) return;
    chips.forEach((chip) => {
      const active = keyOf(chip) === key;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    panel.innerHTML = `
      <div class="tech-ingredient-detail-head"><span>FUNCTIONAL PROFILE</span><h3>${key}</h3><p>${d.intro}</p></div>
      <div class="tech-ingredient-detail-grid">
        <div><span>APPLICATIONS</span><p>${d.applications}</p></div>
        <div><span>FORMULATION NOTES</span><p>${d.notes}</p></div>
        <div><span>KEY BENEFITS</span><p>${d.benefits}</p></div>
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