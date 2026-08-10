(() => {
  const style = document.createElement('style');
  style.textContent = `
    .oem-scope-card{cursor:pointer;position:relative;outline:0}
    .oem-scope-card::after{content:'VIEW PROCESS';position:absolute;right:28px;bottom:24px;color:#9a745d;font-size:9px;font-weight:760;letter-spacing:.12em}
    .oem-scope-card.is-active{background:#2f1b13!important;border-color:#2f1b13!important;color:#fff;transform:translateY(-4px)}
    .oem-scope-card.is-active h3,.oem-scope-card.is-active p,.oem-scope-card.is-active li{color:#fff!important}
    .oem-scope-card.is-active .oem-checklist li::before,.oem-scope-card.is-active::after{color:#d8bca9!important}
    .oem-scope-detail{margin-top:18px;border:1px solid #d8c8bc;background:#fff}
    .oem-scope-detail-head{display:grid;grid-template-columns:.72fr 1.28fr;border-bottom:1px solid #d8c8bc}
    .oem-scope-detail-title{padding:30px;background:#f2ece6;border-right:1px solid #d8c8bc}
    .oem-scope-detail-title>span{display:block;margin-bottom:10px;color:#9a745d;font-size:9px;font-weight:760;letter-spacing:.15em}
    .oem-scope-detail-title h3{margin:0 0 12px;font-size:24px!important}
    .oem-scope-detail-title p{margin:0;color:#75665f;font-size:12.5px;line-height:1.8}
    .oem-scope-detail-fit{padding:30px}
    .oem-scope-detail-fit>span,.oem-scope-process>span,.oem-scope-meta>div>span{display:block;margin-bottom:10px;color:#9a745d;font-size:8.5px;font-weight:760;letter-spacing:.13em}
    .oem-scope-detail-fit p{margin:0;color:#65574f;font-size:12.5px;line-height:1.8}
    .oem-scope-process{padding:28px 30px;border-bottom:1px solid #d8c8bc}
    .oem-scope-process-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:0;border-top:1px solid #e2d7cf;border-left:1px solid #e2d7cf}
    .oem-scope-step{min-height:116px;padding:18px 16px;border-right:1px solid #e2d7cf;border-bottom:1px solid #e2d7cf}
    .oem-scope-step b{display:block;margin-bottom:16px;color:#c2b3aa;font-size:16px}
    .oem-scope-step strong{display:block;font-size:11.5px;line-height:1.45;color:#352018}
    .oem-scope-meta{display:grid;grid-template-columns:1fr 1fr}
    .oem-scope-meta>div{padding:26px 30px}
    .oem-scope-meta>div:first-child{border-right:1px solid #d8c8bc}
    .oem-scope-meta p{margin:0;color:#65574f;font-size:12px;line-height:1.8}
    @media(max-width:980px){.oem-scope-detail-head{grid-template-columns:1fr}.oem-scope-detail-title{border-right:0;border-bottom:1px solid #d8c8bc}.oem-scope-process-grid{grid-template-columns:repeat(3,1fr)}}
    @media(max-width:720px){.oem-scope-card::after{position:static;display:block;margin-top:20px}.oem-scope-process-grid{grid-template-columns:1fr 1fr}.oem-scope-meta{grid-template-columns:1fr}.oem-scope-meta>div:first-child{border-right:0;border-bottom:1px solid #d8c8bc}.oem-scope-detail-title,.oem-scope-detail-fit,.oem-scope-process,.oem-scope-meta>div{padding:22px}}
  `;
  document.head.appendChild(style);

  const scopeGrid = document.querySelector('.oem-scope-grid');
  if (scopeGrid) {
    const scopeData = {
      'OEM Manufacturing': {
        eyebrow: 'MANUFACTURING-LED MODEL',
        intro: 'Best for brands that already have a formula, specification, benchmark, or a clearly defined product requirement and need a reliable manufacturing partner.',
        fit: 'Existing formula or benchmark · Clear target market · Packaging direction known or partly defined · Production and quality execution is the priority.',
        steps: ['Technical Review','Formula / Spec Check','Pilot & Compatibility','Packaging Setup','Production & QC','Filling / Release'],
        prepare: 'Formula or benchmark, product specification, target market, expected quantity, packaging information, artwork status, required claims and target launch date.',
        deliver: 'Manufacturability review, pilot/sample confirmation, production plan, batch manufacturing, QC records, filling/packing coordination and finished goods release.'
      },
      'ODM Development': {
        eyebrow: 'DEVELOPMENT-LED MODEL',
        intro: 'Best for brands that need a new product developed from concept, benchmark, target benefits, texture direction, ingredients, claims, or commercial positioning.',
        fit: 'New product concept · Need formulation expertise · Need sample rounds and optimization · Packaging and production can be coordinated together.',
        steps: ['Project Brief','Benchmark & Concept','Formula Development','Sample Optimization','Packaging & Validation','Scale-up & Release'],
        prepare: 'Brand positioning, target consumer, benchmark products, desired benefits, preferred ingredients or exclusions, target price, intended market and launch timing.',
        deliver: 'Custom formulation direction, development samples, optimization rounds, technical recommendations, packaging coordination, validation support, scale-up and finished production.'
      }
    };

    const scopeCards = [...scopeGrid.querySelectorAll('.oem-scope-card')];
    const scopePanel = document.createElement('section');
    scopePanel.className = 'oem-scope-detail';
    scopePanel.setAttribute('aria-live', 'polite');
    scopeGrid.insertAdjacentElement('afterend', scopePanel);

    const renderScope = (name) => {
      const d = scopeData[name];
      if (!d) return;
      scopeCards.forEach((card) => {
        const active = card.querySelector('h3')?.textContent.trim() === name;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      scopePanel.innerHTML = `
        <div class="oem-scope-detail-head">
          <div class="oem-scope-detail-title"><span>${d.eyebrow}</span><h3>${name}</h3><p>${d.intro}</p></div>
          <div class="oem-scope-detail-fit"><span>BEST FIT FOR</span><p>${d.fit}</p></div>
        </div>
        <div class="oem-scope-process"><span>PROJECT PROCESS</span><div class="oem-scope-process-grid">${d.steps.map((step,i)=>`<div class="oem-scope-step"><b>${String(i+1).padStart(2,'0')}</b><strong>${step}</strong></div>`).join('')}</div></div>
        <div class="oem-scope-meta"><div><span>WHAT THE BRAND PREPARES</span><p>${d.prepare}</p></div><div><span>WHAT JN COS TECH DELIVERS</span><p>${d.deliver}</p></div></div>`;
    };

    scopeCards.forEach((card) => {
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-selected','false');
      const activate = () => renderScope(card.querySelector('h3')?.textContent.trim());
      card.addEventListener('click', activate);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
      });
    });

    renderScope('OEM Manufacturing');
  }

  const grid = document.querySelector('.oem-pack-grid');
  if (!grid) return;

  const data = {
    'Bottle': { eyebrow:'PRIMARY CONTAINER', intro:'Versatile rigid packaging used across daily skincare and personal-care categories.', products:['Toner','Essence','Lotion','Body Wash','Shampoo','Cleansing Water'], options:'PET, PE, glass and selected specialty bottles with screw caps, disc tops or pump closures.', checks:'Formula viscosity, closure compatibility, dispensing flow, decoration area and transport durability.' },
    'Tube': { eyebrow:'PRIMARY CONTAINER', intro:'Efficient squeeze packaging for controlled dispensing and travel-friendly product formats.', products:['Cleanser','Cream','Sunscreen','Gel','Hair Treatment','Body Cream'], options:'PE, laminated and selected mono-material tubes with flip-top, screw or nozzle closures.', checks:'Viscosity, fill temperature, seal performance, orifice size, barrier requirement and artwork method.' },
    'Jar': { eyebrow:'PRIMARY CONTAINER', intro:'Premium wide-mouth packaging suited to rich textures and treatment-oriented formulations.', products:['Face Cream','Sleeping Mask','Balm','Body Butter','Scrub','Treatment Cream'], options:'PP, PET, acrylic-look and glass jars with inner caps, liners and premium finishing options.', checks:'Product exposure, scoop hygiene, liner compatibility, torque, leakage risk and weight during export.' },
    'Pouch': { eyebrow:'FLEXIBLE PACKAGING', intro:'Lightweight flexible packaging for single-use, refill and treatment applications.', products:['Sheet Mask','Hydrogel Mask','Refill Pack','Sample Sachet','Travel Pack','Single-Dose Treatment'], options:'Multi-layer film structures, zipper pouches and custom printed sachets according to barrier needs.', checks:'Film compatibility, seal strength, oxygen/moisture barrier, fill volume and opening experience.' },
    'Label': { eyebrow:'DECORATION & INFORMATION', intro:'Pressure-sensitive labeling for product identity, compliance information and variable production data.', products:['Bottle','Jar','Tube','Pouch','Sample','Outer Carton'], options:'Paper, PP, PET, transparent, matte, textured and specialty adhesive label stocks.', checks:'Surface energy, curvature, moisture exposure, print durability, legal copy and batch-code area.' },
    'Carton': { eyebrow:'SECONDARY PACKAGING', intro:'Folding carton systems that protect the product while carrying brand and regulatory information.', products:['Serum','Cream','Ampoule','Sunscreen','Mask Set','Premium Skincare'], options:'SBS, coated boards, specialty papers, inserts, spot finishing and sustainable material selections.', checks:'Product dimensions, board strength, inserts, print finish, barcode readability and shipping protection.' },
    'Sleeve': { eyebrow:'DECORATIVE PACKAGING', intro:'Full-body decoration or tamper-evident finishing for containers requiring strong visual coverage.', products:['Bottle','Jar','Pump Bottle','Promotional Set','Travel Product'], options:'Shrink sleeves, neck bands and tamper-evident sleeves with printed or clear film.', checks:'Container geometry, shrink ratio, seam placement, heat sensitivity and barcode distortion.' },
    'Secondary Packaging': { eyebrow:'SET & PRESENTATION', intro:'Outer packaging systems that combine, protect and present multiple products as one commercial unit.', products:['Gift Set','Trial Kit','Routine Set','Influencer Kit','Launch Set','Retail Bundle'], options:'Rigid boxes, folding sets, trays, sleeves, inserts and paper-based presentation structures.', checks:'SKU arrangement, protection, unboxing sequence, shipping efficiency, retail display and cost target.' },
    'Export Packaging': { eyebrow:'LOGISTICS SUPPORT', intro:'Transport-ready outer packaging designed to reduce damage during domestic and international shipment.', products:['Finished Goods','Bulk Cartons','Retail Sets','Glass Packaging','Pump Products'], options:'Master cartons, dividers, inner cartons, stretch protection and pallet-ready packing formats.', checks:'Carton strength, orientation, drop risk, palletization, humidity, long-distance transit and labeling.' },
    'Airless Pump': { eyebrow:'FUNCTIONAL DISPENSING', intro:'Controlled dispensing systems that reduce product exposure to air and support premium skincare positioning.', products:['Serum','Emulsion','Lotion','Cream','Eye Treatment','Sensitive-Skin Formula'], options:'Piston and pouch-type airless systems in multiple fill volumes and actuator designs.', checks:'Formula viscosity, priming, evacuation rate, actuator dose, compatibility and residual product level.' },
    'Dropper': { eyebrow:'PRECISION DISPENSING', intro:'High-control dispensing suited to concentrated and treatment-led skincare products.', products:['Serum','Ampoule','Facial Oil','Booster','Concentrate'], options:'Glass or compatible rigid bottles with pipette, push-button or controlled-dose dropper assemblies.', checks:'Formula viscosity, solvent compatibility, pipette material, dosage control, leakage and bulb durability.' },
    'Spray': { eyebrow:'MIST & SPRAY SYSTEM', intro:'Fine or directional spray packaging for fluid cosmetic, body and scalp applications.', products:['Facial Mist','Toner Mist','Scalp Spray','Body Mist','Hair Treatment','Setting-Type Cosmetic'], options:'Fine-mist, treatment spray and selected continuous-spray components depending on formula.', checks:'Particle size, spray pattern, clogging risk, solvent compatibility, pump output and cap security.' }
  };

  const panel = document.createElement('section');
  panel.className = 'oem-pack-detail';
  panel.setAttribute('aria-live', 'polite');
  grid.insertAdjacentElement('afterend', panel);
  const items = [...grid.querySelectorAll('.oem-pack-item')];

  const render = (name) => {
    const d = data[name]; if (!d) return;
    items.forEach((item) => { const active = item.textContent.trim() === name; item.classList.toggle('is-active', active); item.setAttribute('aria-selected', active ? 'true' : 'false'); });
    panel.innerHTML = `<div class="oem-pack-detail-head"><span>${d.eyebrow}</span><h3>${name}</h3><p>${d.intro}</p></div><div class="oem-pack-detail-grid"><div><span>SUITABLE COSMETIC PRODUCTS</span><p>${d.products.join(' · ')}</p></div><div><span>TYPICAL OPTIONS</span><p>${d.options}</p></div><div><span>DEVELOPMENT CHECKS</span><p>${d.checks}</p></div></div>`;
  };

  items.forEach((item) => {
    item.setAttribute('role','button'); item.setAttribute('tabindex','0'); item.setAttribute('aria-selected','false');
    const activate = () => render(item.textContent.trim());
    item.addEventListener('click', activate);
    item.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } });
  });

  render(items[0]?.textContent.trim() || 'Bottle');
})();
