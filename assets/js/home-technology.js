(() => {
  const grid = document.querySelector('.home-technology .tech-grid');
  if (!grid) return;

  const data = {
    'Barrier Repair Technology': { intro:'Barrier-focused formulation systems built around ceramides, skin-compatible lipids, humectants, and moisture-retention architecture.', applications:'Barrier serums · Recovery creams · Sensitive-skin care · Daily moisturizers', benefits:'Supports skin comfort, moisture retention, resilience, and long-term barrier care.', checks:'Ceramide/lipid ratio, emulsion structure, active compatibility, sensory weight, and stability.' },
    'Multi-Layer Hydration & NMF Technologies': { intro:'Layered hydration systems combining multiple humectants with NMF-inspired components for immediate and sustained moisture.', applications:'Toners · Essences · Hydration serums · Gel creams · Masks', benefits:'Improves moisture feel across multiple skin layers while maintaining refined, non-heavy textures.', checks:'Humectant balance, tackiness, viscosity, molecular-weight combination, and climate positioning.' },
    'Hydrogel & Delivery Technology': { intro:'Hydrogel-based delivery systems designed for close skin contact, cooling sensoriality, and controlled transfer of active ingredients.', applications:'Hydrogel masks · Eye patches · Spot treatments · Intensive treatment formats', benefits:'Combines high-adhesion treatment performance with premium sensorial experience.', checks:'Gel strength, adhesion, syneresis, active compatibility, drying profile, and packaging barrier.' },
    'Encapsulation, Liposome & Niosome Technologies': { intro:'Delivery approaches that help protect sensitive actives and improve dispersion, controlled release, and formulation compatibility.', applications:'Premium serums · Anti-aging care · Brightening systems · Sensitive active formulas', benefits:'Supports stability and controlled delivery of difficult or sensitive functional ingredients.', checks:'Carrier compatibility, particle stability, processing conditions, pH, oxidation, and storage behavior.' },
    'Emulsion & Microemulsion Engineering': { intro:'Precision emulsion engineering used to control texture, stability, spreadability, and active distribution across complex formulas.', applications:'Creams · Lotions · Emulsions · Sunscreens · Treatment moisturizers', benefits:'Enables refined textures and consistent performance from lab sample through scale-up.', checks:'Oil/water balance, emulsifier system, shear, temperature sequence, viscosity, and scale-up behavior.' },
    'Peptide & Growth Factor Technologies': { intro:'Advanced peptide-centered systems developed for elasticity, firmness, recovery, and premium age-management positioning.', applications:'Anti-aging serums · Firming creams · Eye care · Intensive ampoules', benefits:'Supports differentiated high-performance treatment concepts and premium efficacy storytelling.', checks:'Dosage, pH, carrier system, interaction with other actives, preservation, and long-term stability.' },
    'Sensitive Skin & Derma-Care Formulation Systems': { intro:'Low-irritation formulation architecture focused on barrier support, soothing, simplified ingredient logic, and high tolerability.', applications:'Sensitive-skin serums · Calming creams · Recovery care · Minimalist skincare', benefits:'Reduces unnecessary formulation stress while prioritizing comfort and barrier compatibility.', checks:'Irritant load, fragrance strategy, preservation, pH, surfactant selection, and claim suitability.' },
    'Fermented Biome Actives': { intro:'Fermented and biome-inspired ingredients integrated for hydration, conditioning, vitality, and skin-comfort concepts.', applications:'Essences · Glow serums · Hydration care · Premium Korean skincare', benefits:'Adds functional conditioning benefits with strong Korean skincare positioning potential.', checks:'Odor/color, preservative compatibility, active level, stability, and storytelling consistency.' },
    'Amino Acid Systems': { intro:'Amino-acid-based systems used for mild cleansing, hydration, and skin/scalp conditioning.', applications:'Gentle cleansers · Scalp care · Body wash · Hydration products', benefits:'Supports mildness, moisture balance, and daily-use comfort across skin and hair categories.', checks:'pH, surfactant balance, foam profile, viscosity, salt response, and sensory after-feel.' },
    'Multi-Molecular Humectant Systems': { intro:'Multi-size humectant strategies designed to create both immediate hydration feel and longer-lasting moisture perception.', applications:'Hydration serums · Toners · Gel creams · Masks · Barrier care', benefits:'Creates layered hydration while allowing texture to remain lightweight and elegant.', checks:'Molecular-weight mix, tack, viscosity, compatibility, climate use, and packaging.' },
    'UV Defence Technology': { intro:'Sun-care formulation support balancing UV filter systems with dispersion, stability, skin feel, and daily-wear performance.', applications:'Daily sunscreens · Fluid SPF · Gel sunscreen · Hybrid UV care', benefits:'Connects protection goals with comfortable texture and commercially wearable formats.', checks:'Filter system, dispersion, photostability, regulatory market, SPF testing path, and packaging.' },
    'Korean Formulation Principles': { intro:'Korean skincare principles translated into layered hydration, lightweight efficacy, barrier-conscious care, and refined sensorial performance.', applications:'Toner-to-cream routines · Essences · Serums · Multi-step care · Global K-beauty concepts', benefits:'Combines technical product performance with contemporary Korean skincare experience and positioning.', checks:'Layerability, absorption, after-feel, active balance, routine compatibility, and target-market preference.' }
  };

  const panel = document.createElement('section');
  panel.className = 'home-tech-detail';
  panel.setAttribute('aria-live', 'polite');
  grid.insertAdjacentElement('afterend', panel);

  const triggers = [...grid.querySelectorAll('.tech-trigger')];
  const normalize = (el) => el.textContent.replace(/\s+/g, ' ').trim();

  const render = (key) => {
    const d = data[key];
    if (!d) return;
    triggers.forEach((trigger) => {
      const active = normalize(trigger) === key;
      trigger.classList.toggle('is-active', active);
      trigger.setAttribute('aria-pressed', String(active));
    });
    panel.innerHTML = `
      <div class="home-tech-detail-head"><span>TECHNOLOGY PROFILE</span><h3>${key}</h3><p>${d.intro}</p></div>
      <div class="home-tech-detail-grid">
        <div><span>APPLICATIONS</span><p>${d.applications}</p></div>
        <div><span>KEY VALUE</span><p>${d.benefits}</p></div>
        <div><span>DEVELOPMENT CHECKS</span><p>${d.checks}</p></div>
      </div>`;
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-pressed', 'false');
    trigger.addEventListener('click', () => render(normalize(trigger)));
  });

  render('Barrier Repair Technology');
})();
